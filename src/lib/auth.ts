import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer";
import GitHub from "next-auth/providers/github";
import Discord from "next-auth/providers/discord";
import { Pool } from "pg";
import PostgresAdapter from "@auth/pg-adapter";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const providerList = [
  Google,
  ...(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET
    ? [GitHub]
    : []),
  ...(process.env.AUTH_DISCORD_ID && process.env.AUTH_DISCORD_SECRET
    ? [Discord]
    : []),
  ...(process.env.EMAIL_SERVER
    ? [
        Nodemailer({
          server: process.env.EMAIL_SERVER,
          from: process.env.EMAIL_FROM || "noreply@qrwing.vercel.app",
        }),
      ]
    : []),
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PostgresAdapter(pool),
  providers: providerList,
  pages: { signIn: "/auth/signin" },
  trustHost: true,
  callbacks: {
    async session({ session, user }) {
      if (user.id) session.user.id = user.id;
      return session;
    },
  },
});
