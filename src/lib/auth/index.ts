import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { db } from "../db";
import { user, session, account, verification } from "../db/schema";

const adminRole = "admin";
const userRole = "user";

export const auth = betterAuth({
  appName: 'payping',
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: user,
      session: session,
      account: account,
      verification: verification,
    },
  }),
  baseURL: process.env.BETTER_AUTH_BASE_URL,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      mapProfileToUser: (profile) => {
        return {
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: userRole,
        };
      },
    },
    discord: {
      clientId: process.env.DISCORD_APPLICATION_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
      permissions: 2048 | 16384, // Send msg and embeded links
      mapProfileToUser: (profile) => {
        return {
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: userRole,
        };
      },
    }
  },
  plugins: [
    admin({
      adminRoles: [adminRole],
      defaultRole: userRole,
    }),
    nextCookies(),
  ],
});