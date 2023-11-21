
# EntityDB

This project illustrates a way to import different types of data into Postgres and then query across those data types using Postgres' JSON capabilities.

The project allows you to import your Twitter, Facebook and Instagram tweet text into separate tables of a database and then query across those types.

For example, this query would display all tweets, Facebook and Instagram tweets:

    SELECT id, type, full_text from (
        SELECT 
            id, 
            timestamp, 
            (value -> 'data' -> 0 -> 'post')::varchar AS full_text, 
            'facebook' AS type
        FROM facebooks
    UNION ALL
    SELECT 
            id, 
            timestamp, 
            (value -> 'media' -> 0 -> 'title')::varchar AS full_text, 
            'instagram' AS type
        FROM instagrams
    UNION ALL
    SELECT 
            id, 
            timestamp, 
            (value -> 'tweet' ->> 'full_text')::varchar AS full_text, 
            'twitter' AS type
        FROM twitters
    ORDER BY timestamp DESC
    );

This project was generated almost entirely via ChatGPT 4 with the prompt in PROMPT.md.


