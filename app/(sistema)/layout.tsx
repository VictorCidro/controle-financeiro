"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SistemaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const linkBase = "px-3 py-2 rounded-lg transition-colors";
  const linkInactive =
    "text-gray-300 hover:text-white hover:bg-[#1a1a2b]";
  const linkActive =
    "bg-[#2a1f4a] text-white";

  return (
    <div className="flex min-h-screen">

      <aside className="w-64 bg-[#12121c] p-6 border-r border-[#1f1f2e]">
        <h2 className="text-2xl font-bold mb-10">Financeiro</h2>

        <nav className="flex flex-col gap-2">
          <Link
            href="/dashboard"
            className={`${linkBase} ${
              pathname === "/dashboard" ? linkActive : linkInactive
            }`}
          >
            Dashboard
          </Link>

          <Link
            href="/lancamentos"
            className={`${linkBase} ${
              pathname === "/lancamentos" ? linkActive : linkInactive
            }`}
          >
            Lançamentos
          </Link>

          <Link
            href="/configuracoes"
            className={`${linkBase} ${
              pathname === "/configuracoes" ? linkActive : linkInactive
            }`}
          >
            Configurações
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-10">
        {children}
      </main>
    </div>
  );
}
