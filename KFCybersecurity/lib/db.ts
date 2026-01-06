import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Create postgres client
const client = postgres(process.env.DATABASE_URL!, { max: 1 });

// Create drizzle instance
export const db = drizzle(client, { schema });
