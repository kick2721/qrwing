import { Suspense } from "react";
import BackToHome from "@/components/BackToHome";
import SignInForm from "./SignInForm";

export default function SignInPage() {
  const available: ("google" | "github" | "discord" | "nodemailer")[] = [];
  if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) available.push("google");
  if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) available.push("github");
  if (process.env.AUTH_DISCORD_ID && process.env.AUTH_DISCORD_SECRET) available.push("discord");
  if (process.env.EMAIL_SERVER) available.push("nodemailer");

  return (
    <Suspense>
      <div className="max-w-sm mx-auto px-4 pt-8">
        <BackToHome />
      </div>
      <SignInForm available={available} />
    </Suspense>
  );
}
