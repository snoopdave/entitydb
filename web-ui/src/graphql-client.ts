import {gql, GraphQLClient} from 'graphql-request';

const endpoint = 'http://localhost:4000';

const graphQLClient = new GraphQLClient(endpoint);

export interface Entity {
    id: string;
    type: string;
    fullText: string;
    link: string;
    entityTimestamp: string;
}

export async function fetchEntities(offset?: number, limit?: number, searchTerm?: string, startDate?: string, endDate?: string): Promise<{ searchEntities: Entity[] }> {
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

    const variables = {
        input: {
            offset,
            limit,
            searchText: searchTerm,
            startDate,
            endDate,
        },
    };

    try {
        return await graphQLClient.request(query, variables);
    } catch (error) {
        console.error('Error fetching entities:', error);
        throw error;
    }
}
