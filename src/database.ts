import { Pool } from 'pg';

export const pool = new Pool({
    user: 'scott',
    password: 'tiger',
    database: 'postgres',
    host: 'localhost',
    port: 5432,
});

export async function createTableIfNotExists(tableName: string): Promise<void> {
    const query = `
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id VARCHAR(255) PRIMARY KEY,
      timestamp TIMESTAMP,
      value JSON
    );
  `;
    await pool.query(query);
}

