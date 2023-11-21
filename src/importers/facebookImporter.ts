
import { pool, createTableIfNotExists } from '../database';
import { hashData, convertTimestamp } from '../utils';
import { dataPaths } from '../config';
import { DataType } from '../enums';
import * as fs from 'fs';

export async function importFacebookData() {
    const data = JSON.parse(fs.readFileSync(dataPaths.facebook, 'utf-8'));
    const tableName = DataType.Facebook.toLowerCase() + 's';
    await createTableIfNotExists(tableName);

    for (const post of data) {
        const id = hashData(JSON.stringify(post));
        const timestamp = convertTimestamp(post.timestamp * 1000);
        const query = 'INSERT INTO ' + tableName + ' (id, timestamp, value) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING;';
        await pool.query(query, [id, timestamp, post]);
    }
}

