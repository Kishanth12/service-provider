"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useUiStore } from "@/stores/uiStore";
import { cn } from "@/lib/utils/cn";

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const { toggleSidebar } = useUiStore();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 dark:bg-slate-950/70 border-b border-slate-200/60 dark:border-slate-800/60 shadow-sm">
      {/* Top gradient accent */}
      <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 opacity-80" />

      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className={cn(
              "lg:hidden rounded-xl transition-all duration-200",
              "hover:bg-slate-200/60 dark:hover:bg-slate-800/60",
            )}
          >
            <Menu className="h-5 w-5 text-slate-700 dark:text-slate-200" />
          </Button>

          {title && (
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h2>
          )}
        </div>

        {/* Right side reserved for future actions (notifications, profile, etc.) */}
        <div />
      </div>
    </header>
  );
}
