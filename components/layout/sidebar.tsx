"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    Package,
    Building2,
    UserCheck,
    LogOut,
    Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/",
        color: "text-sky-500",
    },
    {
        label: "Consultas Avançadas",
        icon: Search,
        href: "/consultas",
        color: "text-blue-500",
    },
    {
        label: "Beneficiários",
        icon: Users,
        href: "/beneficiaries",
        color: "text-violet-500",
    },
    {
        label: "Distribuições (Famílias)",
        icon: Package,
        href: "/distributions/family",
        color: "text-orange-700",
    },
    {
        label: "Distribuições (Instituições)",
        icon: Building2,
        href: "/distributions/institutional",
        color: "text-emerald-500",
    },
    {
        label: "Voluntários",
        icon: UserCheck,
        href: "/volunteers",
        color: "text-purple-500",
    },
];

// 🧠 PROPS: A Sidebar pode receber o usuário logado para exibir seus dados.
// É opcional (?) porque em alguns casos de erro de carregamento pode vir undefined.
interface SidebarProps {
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

import Image from "next/image";

// ... (imports)

export function Sidebar({ user }: SidebarProps) {
    const pathname = usePathname();

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
            <div className="px-3 py-2 flex-1">
                <Link href="/" className="flex items-center pl-3 mb-14">
                    <div className="relative w-8 h-8 mr-4">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            fill
                            className="rounded-full object-cover"
                        />
                    </div>
                    <h1 className="text-xl font-bold">Projeto Além dos Olhos</h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label === "Dashboard" ? "Visão Geral" : route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="px-3 py-2 border-t border-gray-800">
                {user && (
                    <div className="mb-4 px-3 py-2 bg-white/5 rounded-lg">
                        <p className="text-sm font-medium text-white">{user.name || "Usuário"}</p>
                        <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                    </div>
                )}
                <Button onClick={() => signOut()} variant="ghost" className="w-full justify-start text-zinc-400 hover:text-white hover:bg-white/10">
                    <LogOut className="h-5 w-5 mr-3" />
                    Sair
                </Button>
            </div>
        </div>
    );
}
