import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { graphqlClient, EntitySearchInput } from "../graphql-client.js";
import { formatEntity } from "./resources.js";

/**
 * Register all search-related entity tools
 */
export function registerEntitySearchTools(server: McpServer): void {
  // Tool to search entities with various filters
  server.tool(
    "searchEntities",
    {
      searchText: z.string().optional().describe("Text to search for in the entities"),
      types: z.array(z.string()).optional().describe("Entity types to include (FACEBOOKPOST, INSTAGRAMPOST, TWEET)"),
      startDate: z.string().optional().describe("Start date in ISO format (YYYY-MM-DD)"),
      endDate: z.string().optional().describe("End date in ISO format (YYYY-MM-DD)"),
      limit: z.number().optional().default(10).describe("Maximum number of results to return"),
      offset: z.number().optional().default(0).describe("Number of results to skip")
    },
    async (params) => {
      try {
        const input: EntitySearchInput = {
          searchText: params.searchText,
          types: params.types,
          startDate: params.startDate,
          endDate: params.endDate,
          limit: params.limit,
          offset: params.offset
        };

        const entities = await graphqlClient.searchEntities(input);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(entities.map(formatEntity), null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error searching entities: ${error instanceof Error ? error.message : String(error)}`
            }
          ],
          isError: true
        };
      }
    }
  );

  // Tool to count entities by type
  server.tool(
    "countEntitiesByType",
    {},
    async () => {
      try {
        const types = ["FACEBOOKPOST", "INSTAGRAMPOST", "TWEET"];
        const results = await Promise.all(
          [...types, null].map(async (type) => {
            const searchParams: any = { limit: 100 };
            if (type) {
              searchParams.types = [type];
            }

            const entities = await graphqlClient.searchEntities(searchParams);
            return {
              type: type || "ALL",
              count: entities.length
            };
          })
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(results, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error counting entities by type: ${error instanceof Error ? error.message : String(error)}`
            }
          ],
          isError: true
        };
      }
    }
  );

  // Tool to get recent posts
  server.tool(
    "getRecentPosts",
    {
      count: z.number().optional().default(10).describe("Number of recent posts to retrieve")
    },
    async ({ count }) => {
      try {
        const input: EntitySearchInput = {
          limit: count,
          offset: 0
        };

        const entities = await graphqlClient.searchEntities(input);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(entities.map(formatEntity), null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching recent posts: ${error instanceof Error ? error.message : String(error)}`
            }
          ],
          isError: true
        };
      }
    }
  );
}