import {ApolloServer, gql} from 'apollo-server';
import {searchEntities} from "./database";
import {readFileSync} from "fs";
import {EntitySearchInput} from "../__generated__/resolvers-types";

const typeDefs = gql(readFileSync('./src/graphql/schema.graphql', 'utf-8'));

export const resolvers = {
    Query: {
        searchEntities: async (_: any, args: { input: EntitySearchInput }) => {
            return await searchEntities(args.input);
        },
    },
};

export interface MyContext {}

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});

