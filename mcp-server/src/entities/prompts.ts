import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { graphqlClient } from "../graphql-client.js";
import { formatEntity } from "./resources.js";

/**
 * Register all entity-related prompts
 */
export function registerEntityPrompts(server: McpServer): void {
  // Prompt for analyzing entities
  server.prompt(
    "analyzeEntities",
    {
      type: z.string().optional().describe("Entity type to analyze"),
      timeframe: z.string().optional().describe("Timeframe to analyze (e.g., 'last week', 'last month')")
    },
    ({ type, timeframe }) => {
      const typePhrase = type ? `for ${type} entities` : "across all entity types";
      const timePhrase = timeframe ? `in the ${timeframe}` : "in the available data";

      return {
        messages: [{
          role: "user",
          content: {
            type: "text",
            text: `Please analyze the social media data ${typePhrase} ${timePhrase}. ` +
                  `Include trends, patterns, and notable metrics. Summarize the key insights.`
          }
        }]
      };
    }
  );

  // Prompt for entity comparison
  server.prompt(
    "compareEntities",
    {
      type1: z.string().describe("First entity type to compare"),
      type2: z.string().describe("Second entity type to compare")
    },
    ({ type1, type2 }) => {
      return {
        messages: [{
          role: "user",
          content: {
            type: "text",
            text: `Compare the ${type1} and ${type2} entities in the database. ` +
                  `Analyze differences in frequency, content length, engagement patterns, and any other notable metrics. ` +
                  `Summarize the key differences and similarities.`
          }
        }]
      };
    }
  );
}