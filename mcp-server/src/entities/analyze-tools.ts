import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { graphqlClient, EntitySearchInput, Entity } from "../graphql-client.js";

/**
 * Register all analysis-related entity tools
 */
export function registerEntityAnalyzeTools(server: McpServer): void {
  // Tool to analyze posting frequency over time
  server.tool(
    "getPostFrequency",
    {
      interval: z.enum(["day", "week", "month", "year"]).default("month")
        .describe("Time interval to group posts by"),
      startDate: z.string().optional().describe("Start date in ISO format (YYYY-MM-DD)"),
      endDate: z.string().optional().describe("End date in ISO format (YYYY-MM-DD)"),
      type: z.string().optional().describe("Filter by entity type")
    },
    async ({ interval, startDate, endDate, type }) => {
      try {
        const input: EntitySearchInput = {
          startDate,
          endDate,
          types: type ? [type] : undefined
        };

        const entities = await graphqlClient.searchEntities(input);
        const frequency = analyzePostFrequency(entities, interval);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(frequency, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error analyzing post frequency: ${error instanceof Error ? error.message : String(error)}`
            }
          ],
          isError: true
        };
      }
    }
  );

  // Tool to summarize content length statistics
  server.tool(
    "getContentLengthStats",
    {
      type: z.string().optional().describe("Filter by entity type")
    },
    async ({ type }) => {
      try {
        const input: EntitySearchInput = {
          types: type ? [type] : undefined
        };

        const entities = await graphqlClient.searchEntities(input);
        const stats = analyzeContentLength(entities);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(stats, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error analyzing content length: ${error instanceof Error ? error.message : String(error)}`
            }
          ],
          isError: true
        };
      }
    }
  );
}

/**
 * Analyze posting frequency over time
 */
function analyzePostFrequency(entities: Entity[], interval: string): Record<string, number> {
  const frequency: Record<string, number> = {};

  entities.forEach(entity => {
    const date = new Date(entity.entityTimestamp);
    let timeKey: string;

    switch (interval) {
      case 'day':
        timeKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
        break;
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
        timeKey = weekStart.toISOString().split('T')[0];
        break;
      case 'month':
        timeKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        break;
      case 'year':
        timeKey = date.getFullYear().toString();
        break;
      default:
        timeKey = date.toISOString().split('T')[0];
    }

    frequency[timeKey] = (frequency[timeKey] || 0) + 1;
  });

  // Sort by time key
  return Object.fromEntries(
    Object.entries(frequency).sort(([a], [b]) => a.localeCompare(b))
  );
}

/**
 * Analyze content length statistics
 */
function analyzeContentLength(entities: Entity[]): {
  average: number;
  min: number;
  max: number;
  median: number;
  total: number;
} {
  if (entities.length === 0) {
    return { average: 0, min: 0, max: 0, median: 0, total: 0 };
  }

  const lengths = entities
    .filter(entity => entity.fullText)
    .map(entity => entity.fullText.length);

  if (lengths.length === 0) {
    return { average: 0, min: 0, max: 0, median: 0, total: 0 };
  }

  // Sort for median calculation
  lengths.sort((a, b) => a - b);

  const total = lengths.reduce((sum, len) => sum + len, 0);
  const average = total / lengths.length;
  const min = lengths[0];
  const max = lengths[lengths.length - 1];

  // Calculate median
  const middle = Math.floor(lengths.length / 2);
  const median = lengths.length % 2 === 0
    ? (lengths[middle - 1] + lengths[middle]) / 2
    : lengths[middle];

  return {
    average,
    min,
    max,
    median,
    total: lengths.length
  };
}