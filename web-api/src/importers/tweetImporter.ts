import { pool, createTableIfNotExists } from '../database-common';
import { hashData } from '../utils';
import { dataPaths } from '../config';
import { DataType } from '../enums';
import * as fs from 'fs';

export async function importTweetData() {
    const fileContent = fs.readFileSync(dataPaths.twitter + '/data/tweets.js', 'utf-8');

    // Extract the JSON array from the JavaScript file
    const startIndex = fileContent.indexOf('window.YTD.tweets.part0 = ') + 'window.YTD.tweets.part0 = '.length;
    const endIndex = fileContent.lastIndexOf(']') + 1;
    const tweetsArrayString = fileContent.substring(startIndex, endIndex);
    const tweets = JSON.parse(tweetsArrayString);

    const tableName = DataType.Tweet.toLowerCase() + 's';
    await createTableIfNotExists(tableName);

    for (const tweet of tweets) {
        const id = tweet.id;
        const entity_timestamp = new Date(tweet.tweet.created_at); // Directly converting ISO 8601 string to Date.
        const query = `INSERT INTO ${tableName} (id, entity_timestamp, value) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING;`;
        await pool.query(query, [id, entity_timestamp, tweet]);
    }
}
