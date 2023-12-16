
import { pool, createTableIfNotExists } from '../database-common';
import {hashData, convertTimestamp, fixEncoding} from '../utils';
import { dataPaths } from '../config';
import { DataType } from '../enums';
import * as fs from 'fs';

export async function importFacebookPostData() {
    const data = JSON.parse(fs.readFileSync(dataPaths.facebook
        + '/your_activity_across_facebook/posts/your_posts__check_ins__photos_and_videos_1.json', 'utf-8'));
    const tableName = DataType.FacebookPost.toLowerCase() + 's';
    await createTableIfNotExists(tableName);

    for (const post of data) {
        const id = hashData(JSON.stringify(post));
        const entity_timestamp = convertTimestamp(post.timestamp * 1000);
        const query = 'INSERT INTO ' + tableName + ' (id, entity_timestamp, value) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING;';
        await pool.query(query, [id, entity_timestamp, post]);
    }
}

