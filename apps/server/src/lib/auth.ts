import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import * as schema from "../db/schema/auth";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  trustedOrigins: [process.env.CORS_ORIGIN || ""],
  emailAndPassword: {
    enabled: true,
  },

  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      partitioned: true, // New browser standards will mandate this for foreign cookies
    },
    crossSubDomainCookies: {
      enabled: true,
      domains: [process.env.CORS_ORIGIN || ""],
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
});
