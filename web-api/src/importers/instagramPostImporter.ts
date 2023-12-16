import { pool, createTableIfNotExists } from '../database-common';
import { convertTimestamp, fixEncoding } from '../utils';
import { dataPaths } from '../config';
import { DataType } from '../enums';
import * as fs from 'fs';

export async function importInstagramPostData() {
    const data = JSON.parse(fs.readFileSync(dataPaths.instagram + '/content/posts_1.json', 'utf-8'));
    const tableName = DataType.InstagramPost.toLowerCase() + 's';
    await createTableIfNotExists(tableName);

    for (const post of data) {
        // Assuming the media array is not empty, take the first object
        if (post.media && post.media.length > 0) {
            const firstMedia = post.media[0];
            const id = firstMedia.uri;
            const entity_timestamp = convertTimestamp(firstMedia.creation_timestamp * 1000);

            const query = `INSERT INTO ${tableName} (id, entity_timestamp, value) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING;`;
            await pool.query(query, [id, entity_timestamp, post]);
        } else {
            console.log('Post with no media:', post);
        }
    }
}

