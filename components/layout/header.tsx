"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function Header() {
    return (
        <div className="flex items-center p-4">
            <Button variant="ghost" size="icon" className="md:hidden">
                <Menu />
            </Button>
            <div className="flex w-full justify-end">
                {/* UserButton or similar could go here */}
            </div>
        </div>
    );
}
