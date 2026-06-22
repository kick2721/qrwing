import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Discord from "next-auth/providers/discord";
import Nodemailer from "next-auth/providers/nodemailer";

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
  providers: providerList,
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/signin" },
  trustHost: true,
  callbacks: {
    async session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      return session;
    },
  },
});
