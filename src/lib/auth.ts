import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Discord from "next-auth/providers/discord";
import Nodemailer from "next-auth/providers/nodemailer";
import { Pool } from "pg";
import PostgresAdapter from "@auth/pg-adapter";
import { getEmailTemplate } from "@/lib/emails";
import type { Lang } from "@/lib/i18n";

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
          async sendVerificationRequest({ identifier: email, url }) {
            let lang: Lang = "en";
            try {
              const { cookies } = await import("next/headers");
              const cookieStore = await cookies();
              const v = cookieStore.get("qrwing-lang")?.value as Lang;
              if (v) lang = v;
            } catch {}
            const { subject, html } = getEmailTemplate(lang, url);
            const nodemailer = await import("nodemailer");
            const transport = nodemailer.createTransport(process.env.EMAIL_SERVER);
            await transport.sendMail({ to: email, from: process.env.EMAIL_FROM || "noreply@qrwing.vercel.app", subject, html });
          },
        }),
      ]
    : []),
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PostgresAdapter(pool),
  providers: providerList,
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/signin" },
  trustHost: true,
  callbacks: {
    async session({ session, token, user }) {
      if (user?.id) session.user.id = user.id;
      else if (token?.sub) session.user.id = token.sub;
      return session;
    },
  },
});
