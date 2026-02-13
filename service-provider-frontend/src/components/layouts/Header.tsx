"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useUiStore } from "@/stores/uiStore";

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const { toggleSidebar } = useUiStore();

  return (
    <header className="sticky top-0 z-10 border-b bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          {title && (
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          )}
        </div>
      </div>
    </header>
  );
}
