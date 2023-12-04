
# Prompt: design and implement a GraphQL API for EntityDB

Now, I would like to create a simple GraphQL API that will allow me to query for entities across all of my types. The GraphQL schema should include an enum of the types and there should be a query function that allows a caller to specify which types are to be included in the query and it defaults to all types, you can also specify search text that.

The GraphQL API should be well suited for displaying Entities on a Calendar that has Year, Month, Day and Blog views. The query should take one argument, the EntitySeachInput type and it should have fields that allow searching by types, date ranges suitable for a calendar front-end and text.

I want you first to design the GraphQL schema and print it out.

Next create an implementation in Typescript like the rest of the code for this project. The implementation should use the latest version of the Apollo server. 

To design the implementation start with the SQL below which allows us to query for id, type, full_text and link across our four data types, I want you to modify create a new query that uses the same technique to allow me to do a 'like' text search in the full_text or link fields. The GraphQL implementation will call a query like this, but it will have to be parameterized so that the caller can specify which types are to be included and the text to be searched.

    SELECT id, type, full_text, link from (
        SELECT
            id,
            timestamp,
            (value -> 'data' -> 0 ->> 'post')::varchar AS full_text,
            (value -> 'attachments' -> 0 ->> 'external_context')::varchar as link,
            'facebookpost' AS type
            FROM facebookposts
        UNION ALL
        SELECT
            id,
            timestamp,
            (value -> 'media' -> 0 ->> 'title')::varchar AS full_text,
            '' as link,
            'instagrampost' AS type
            FROM instagramposts
        UNION ALL
        SELECT
            id,
            timestamp,
            (value -> 'tweet' ->> 'full_text')::varchar AS full_text,
            (value -> 'tweet' -> 'entities' -> 'urls' -> 0 ->> 'expanded_url')::varchar as link,
            'tweet' AS type
            FROM tweets
        ORDER BY timestamp DESC
    ) as fi;

Please show me the GraphQL API

Then list all new files to be generated and provide complete text of each.