import { pool } from '../database-common';
import {Entity, EntitySearchInput, EntityType} from "../__generated__/resolvers-types";
import {link} from "fs";
import {fixEncoding} from "../utils";

const buildSQLQuery = (input: EntitySearchInput) => {
    const conditions: string[] = [];
    const params: string[] = [];

    if (input.types && input.types.length > 0) {
        const typeConditions = input.types.map(type => {
            switch (type) {
                case 'FACEBOOKPOST':
                    return `(SELECT id, entity_timestamp, (value -> 'data' -> 0 ->> 'post')::varchar AS full_text, (value -> 'attachments' -> 0 ->> 'external_context')::varchar as link, 'facebookpost' AS type FROM facebookposts)`;
                case 'INSTAGRAMPOST':
                    return `(SELECT id, entity_timestamp, (value -> 'media' -> 0 ->> 'title')::varchar AS full_text, '' as link, 'instagrampost' AS type FROM instagramposts)`;
                case 'TWEET':
                    return `(SELECT id, entity_timestamp, (value -> 'tweet' ->> 'full_text')::varchar AS full_text, (value -> 'tweet' -> 'entities' -> 'urls' -> 0 ->> 'expanded_url')::varchar as link, 'tweet' AS type FROM tweets)`;
            }
        });
        conditions.push(`(${typeConditions.join(' UNION ALL ')})`);
    } else {
        conditions.push(`
      (SELECT id, entity_timestamp, (value -> 'data' -> 0 ->> 'post')::varchar AS full_text, (value -> 'attachments' -> 0 ->> 'external_context')::varchar as link, 'facebookpost' AS type FROM facebookposts)
      UNION ALL
      (SELECT id, entity_timestamp, (value -> 'media' -> 0 ->> 'title')::varchar AS full_text, '' as link, 'instagrampost' AS type FROM instagramposts)
      UNION ALL
      (SELECT id, entity_timestamp, (value -> 'tweet' ->> 'full_text')::varchar AS full_text, (value -> 'tweet' -> 'entities' -> 'urls' -> 0 ->> 'expanded_url')::varchar as link, 'tweet' AS type FROM tweets)
    `);
    }

    let paramIndex = 1;
    const whereClauses: string[] = [];
    if (input.searchText) {
        whereClauses.push(`(full_text ILIKE $${paramIndex} OR link ILIKE $${paramIndex})`);
        paramIndex++;
        params.push(`%${input.searchText}%`);
    }

    if (input.startDate && input.endDate) {
        whereClauses.push(`(entity_timestamp BETWEEN $${paramIndex} AND $${paramIndex + 1})`);
        params.push(input.startDate, input.endDate);
        paramIndex += 2;
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : "";

    let limit = " LIMIT 50";
    if (input.limit) {
        limit = ` LIMIT $${paramIndex}`;
        params.push("" + input.limit);
        paramIndex += 1;
    }

    let offset = " OFFSET 0";
    if (input.offset) {
        offset = ` OFFSET $${paramIndex}`;
        params.push("" + input.offset);
        paramIndex += 1;
    }

    const finalQuery = `
        SELECT id, entity_timestamp, type, full_text, link 
        FROM (${conditions.join(' ')}) ${whereClause} 
        ORDER BY entity_timestamp DESC${limit}${offset}`;

    return { finalQuery, params };
};

export const searchEntities = async (input: EntitySearchInput): Promise<Entity[]> => {
    const { finalQuery, params } = buildSQLQuery(input);

    const result = await pool.query(finalQuery, params);
    return result.rows.map(row => ({
        id: row.id,
        type: mapTypeToEnum(row.type),
        fullText: fixEncoding(row.full_text),
        link: row.link,
        entityTimestamp: row.entity_timestamp
    }));
};

function mapTypeToEnum(type: string): EntityType {
    switch (type) {
        case "facebookpost":
            return EntityType.Facebookpost
        case "instagrampost":
            return EntityType.Instagrampost;
        case "tweet":
            return EntityType.Tweet;
        default:
            throw new Error(`Unknown type: ${type}`);
    }
}
