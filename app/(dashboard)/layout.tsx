import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { auth } from "@/auth";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // 🧠 SESSION: Buscamos a sessão no servidor (Server Component).
    // Isso evita "flicker" de carregamento no frontend e é mais seguro.
    const session = await auth();

    return (
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
                <Sidebar user={session?.user} />
            </div>
            <main className="md:pl-72">
                <Header />
                {children}
            </main>
        </div>
    );
}
