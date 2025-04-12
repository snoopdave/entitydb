import { Pool } from 'pg';

export const pool = new Pool({
    user: 'scott',
    password: 'tiger',
    database: 'entitydb2025',
    host: 'localhost',
    port: 5432,
});

export async function createTableIfNotExists(tableName: string): Promise<void> {
    const query = `
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id VARCHAR(255) PRIMARY KEY,
      entity_timestamp TIMESTAMP,
      value JSON
    );
  `;
    await pool.query(query);
}

