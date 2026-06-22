import Link from "next/link";

export default function BackToHome() {
  return (
    <div className="mb-6">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-purple-600 transition">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver al inicio
      </Link>
    </div>
  );
}
