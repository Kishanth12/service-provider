"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/useAuth";
import { Role } from "@/types";
import {
  LayoutDashboard,
  Calendar,
  Briefcase,
  User,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { useUiStore } from "@/stores/uiStore";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: Role[];
}

const navItems: NavItem[] = [
  // User routes
  {
    title: "Dashboard",
    href: "/user",
    icon: LayoutDashboard,
    roles: [Role.USER],
  },
  {
    title: "My Bookings",
    href: "/user/bookings",
    icon: Calendar,
    roles: [Role.USER],
  },
  {
    title: "Browse Services",
    href: "/user/services",
    icon: Briefcase,
    roles: [Role.USER],
  },
  { title: "Profile", href: "/user/profile", icon: User, roles: [Role.USER] },

  // Provider routes
  {
    title: "Dashboard",
    href: "/provider",
    icon: LayoutDashboard,
    roles: [Role.PROVIDER],
  },
  {
    title: "Bookings",
    href: "/provider/bookings",
    icon: Calendar,
    roles: [Role.PROVIDER],
  },
  {
    title: "My Services",
    href: "/provider/services",
    icon: Briefcase,
    roles: [Role.PROVIDER],
  },
  {
    title: "Profile",
    href: "/provider/profile",
    icon: User,
    roles: [Role.PROVIDER],
  },

  // Admin routes
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    roles: [Role.ADMIN],
  },
  { title: "Users", href: "/admin/users", icon: Users, roles: [Role.ADMIN] },
  {
    title: "Providers",
    href: "/admin/providers",
    icon: Briefcase,
    roles: [Role.ADMIN],
  },
  {
    title: "Bookings",
    href: "/admin/bookings",
    icon: Calendar,
    roles: [Role.ADMIN],
  },
  {
    title: "Services",
    href: "/admin/services",
    icon: Settings,
    roles: [Role.ADMIN],
  },
  { title: "Profile", href: "/admin/profile", icon: User, roles: [Role.ADMIN] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { sidebarOpen } = useUiStore();

  const filteredNavItems = navItems.filter((item) =>
    user?.role ? item.roles.includes(user.role as Role) : false,
  );

  const getRoleTitle = () => {
    switch (user?.role) {
      case Role.ADMIN:
        return "Admin Panel";
      case Role.PROVIDER:
        return "Provider Dashboard";
      case Role.USER:
        return "My Account";
      default:
        return "Dashboard";
    }
  };

  const initials =
    (user?.name || "User")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "U";

  return (
    <div
      className={cn(
        "relative flex h-full flex-col text-white transition-all duration-300",
        "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950",
        "border-r border-slate-800/60",
        sidebarOpen ? "w-64" : "w-20",
      )}
    >
      {/* subtle side glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative border-b border-slate-800/60 px-4 py-5">
        {/* top accent */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 opacity-80" />

        <div
          className={cn(
            "flex items-center gap-3",
            !sidebarOpen && "justify-center",
          )}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
            <span className="text-sm font-extrabold tracking-tight">
              {sidebarOpen ? "SH" : "SH"}
            </span>
          </div>

          {sidebarOpen && (
            <div className="min-w-0">
              <h1 className="text-lg font-extrabold tracking-tight">
                ServiceHub
              </h1>
              <p className="mt-0.5 text-xs text-slate-300/80">
                {getRoleTitle()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={!sidebarOpen ? item.title : undefined}
              >
                <div
                  className={cn(
                    "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                    "transition-all duration-200",
                    !sidebarOpen && "justify-center",
                    isActive
                      ? "bg-white/10 text-white shadow-sm ring-1 ring-white/10"
                      : "text-slate-300/80 hover:bg-white/10 hover:text-white",
                  )}
                >
                  {/* active indicator bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-gradient-to-b from-sky-400 to-fuchsia-500" />
                  )}

                  <Icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0",
                      isActive ? "text-white" : "text-slate-300/80",
                    )}
                  />

                  {sidebarOpen && (
                    <span className="truncate">{item.title}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Info & Logout */}
      <div className="border-t border-slate-800/60 p-4">
        {sidebarOpen && (
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 text-white font-extrabold">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-xs text-slate-300/80 truncate">
                {user?.email}
              </p>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          className={cn(
            "w-full h-11 rounded-xl justify-start text-slate-300/80",
            "hover:bg-white/10 hover:text-white",
            !sidebarOpen && "justify-center px-2",
          )}
          onClick={logout}
          title={!sidebarOpen ? "Logout" : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {sidebarOpen && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </div>
  );
}
