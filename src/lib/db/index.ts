import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from './schema';

const DATABASE_URL = process.env.NODE_ENV === 'production' ? process.env.DATABASE_URL! : process.env.DATABASE_URL_DEV!;

const sql = neon(DATABASE_URL);


export const db = drizzle(sql, {schema});