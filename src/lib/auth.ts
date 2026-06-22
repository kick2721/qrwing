import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer";

const providers = [
  Google,
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
  providers,
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
