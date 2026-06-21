import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();
  if (!session?.user) redirect("/");

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <p className="text-gray-500">Bienvenido, <strong>{session.user.name}</strong></p>
        <p className="text-sm text-gray-400 mt-1">{session.user.email}</p>
        <p className="text-xs text-gray-400 mt-4">Aquí podrás gestionar tus QR dinámicos y ver estadísticas. Próximamente.</p>
      </div>
    </div>
  );
}
