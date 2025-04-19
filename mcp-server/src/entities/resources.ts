import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { graphqlClient, Entity } from "../graphql-client.js";

/**
 * Register all entity-related resources
 */
export function registerEntityResources(server: McpServer): void {
  // Generic entity resource with type filtering
  server.resource(
    "Entities",
    new ResourceTemplate("entity://{type}{?id,offset,limit,fullText,entityTimestamp,query}", { list: undefined }),
    async (uri, params) => {
      try {
        // Handle params.type being a string or string array
        const typeValue = Array.isArray(params.type) ? params.type[0] : params.type;
        const entityType = typeValue?.toUpperCase();

        // Parse URL search params
        const urlObj = new URL(uri.toString());
        const offset = urlObj.searchParams.has("offset") ? parseInt(urlObj.searchParams.get("offset")!, 10) : 0;
        const limit = urlObj.searchParams.has("limit") ? parseInt(urlObj.searchParams.get("limit")!, 10) : 10;
        const fullText = urlObj.searchParams.get("fullText") || undefined;
        const id = urlObj.searchParams.get("id") || undefined;
        const entityTimestamp = urlObj.searchParams.get("entityTimestamp") || undefined;
        const query = urlObj.searchParams.get("query") || undefined;

        // Build search input
        const searchInput: any = {
          offset,
          limit,
          searchText: fullText || query,
          startDate: entityTimestamp
        };

        // Add type filter if specified
        if (entityType && entityType !== 'ENTITY') {
          searchInput.types = [entityType];
        }

        // Add ID filter if specified
        if (id) {
          searchInput.id = id;
        }

        const entities = await graphqlClient.searchEntities(searchInput);

        return {
          contents: entities.map(entity => ({
            uri: `entity://${entity.type.toLowerCase()}/${entity.id}`,
            text: JSON.stringify(formatEntity(entity)),
            mimeType: "application/json"
          })),
          _meta: {
            hasMore: entities.length === limit,
            totalCount: entities.length,
            offset,
            limit,
            supportedParams: ["type", "id", "offset", "limit", "fullText", "entityTimestamp", "query"]
          }
        };
      } catch (error) {
        console.error("Error in entity resource:", error);
        throw error;
      }
    }
  );
}

/**
 * Format an Entity from the GraphQL API to match the resource schema
 */
export function formatEntity(entity: Entity): Record<string, unknown> {
  return {
    id: entity.id,
    type: entity.type,
    fullText: entity.fullText || "",
    link: entity.link || "",
    entityTimestamp: entity.entityTimestamp || ""
  };
}