import { GraphQLClient, gql } from 'graphql-request';

// Interface representing an entity from the GraphQL API
export interface Entity {
  id: string;
  type: string;
  fullText: string;
  link: string;
  entityTimestamp: string;
}

// Interface for search input parameters
export interface EntitySearchInput {
  id?: string;
  types?: string[];
  startDate?: string;
  endDate?: string;
  searchText?: string;
  offset?: number;
  limit?: number;
}

// GraphQL client for the EntityDB API
export class EntityDbGraphQLClient {
  private client: GraphQLClient;

  constructor(endpoint = 'http://localhost:4000/graphql') {
    this.client = new GraphQLClient(endpoint);
  }

  /**
   * Search for entities using the provided criteria
   */
  async searchEntities(input: EntitySearchInput): Promise<Entity[]> {
    const query = gql`
      query SearchEntities($input: EntitySearchInput) {
        searchEntities(input: $input) {
          id
          type
          fullText
          link
          entityTimestamp
        }
      }
    `;

    const variables = { input };

    try {
      const data = await this.client.request<{ searchEntities: Entity[] }>(query, variables);
      return data.searchEntities;
    } catch (error) {
      console.error('Error fetching entities:', error);
      throw error;
    }
  }

  /**
   * Count entities by type
   */
  async countEntitiesByType(): Promise<{ type: string; count: number }[]> {
    const query = gql`
      query {
        searchEntities(input: {}) {
          type
        }
      }
    `;

    try {
      const data = await this.client.request<{ searchEntities: { type: string }[] }>(query);

      // Count occurrences of each type
      const typeCounts = data.searchEntities.reduce<Record<string, number>>((acc, entity) => {
        acc[entity.type] = (acc[entity.type] || 0) + 1;
        return acc;
      }, {});

      // Convert to array of { type, count } objects
      return Object.entries(typeCounts).map(([type, count]) => ({ type, count }));
    } catch (error) {
      console.error('Error counting entities by type:', error);
      throw error;
    }
  }
}

// Create a singleton instance for use throughout the application
export const graphqlClient = new EntityDbGraphQLClient();
