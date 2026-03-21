import type {Config} from 'drizzle-kit'

export default {
    schema: './src/lib/db/schema.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.NODE_ENV === 'production' ? process.env.DATABASE_URL_MIGRATION! : process.env.DATABASE_URL_MIGRATION_DEV!,
    }
} satisfies Config;