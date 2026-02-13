'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/useAuth';
import { Role } from '@/types';
import {
  LayoutDashboard,
  Calendar,
  Briefcase,
  User,
  Users,
  Settings,
  LogOut,
  Menu,
} from 'lucide-react';
import { useUiStore } from '@/stores/uiStore';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: Role[];
}

const navItems: NavItem[] = [
  // User routes
  {
    title: 'Dashboard',
    href: '/user',
    icon: LayoutDashboard,
    roles: [Role.USER],
  },
  {
    title: 'My Bookings',
    href: '/user/bookings',
    icon: Calendar,
    roles: [Role.USER],
  },
  {
    title: 'Browse Services',
    href: '/user/services',
    icon: Briefcase,
    roles: [Role.USER],
  },
  {
    title: 'Profile',
    href: '/user/profile',
    icon: User,
    roles: [Role.USER],
  },

  // Provider routes
  {
    title: 'Dashboard',
    href: '/provider',
    icon: LayoutDashboard,
    roles: [Role.PROVIDER],
  },
  {
    title: 'Bookings',
    href: '/provider/bookings',
    icon: Calendar,
    roles: [Role.PROVIDER],
  },
  {
    title: 'My Services',
    href: '/provider/services',
    icon: Briefcase,
    roles: [Role.PROVIDER],
  },
  {
    title: 'Profile',
    href: '/provider/profile',
    icon: User,
    roles: [Role.PROVIDER],
  },

  // Admin routes
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    roles: [Role.ADMIN],
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
    roles: [Role.ADMIN],
  },
  {
    title: 'Providers',
    href: '/admin/providers',
    icon: Briefcase,
    roles: [Role.ADMIN],
  },
  {
    title: 'Bookings',
    href: '/admin/bookings',
    icon: Calendar,
    roles: [Role.ADMIN],
  },
  {
    title: 'Services',
    href: '/admin/services',
    icon: Settings,
    roles: [Role.ADMIN],
  },
   {
    title: 'Profile',
    href: '/admin/profile',
    icon: User,
    roles: [Role.ADMIN],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { sidebarOpen } = useUiStore();

  const filteredNavItems = navItems.filter((item) =>
    user?.role ? item.roles.includes(user.role as Role) : false
  );

  const getRoleTitle = () => {
    switch (user?.role) {
      case Role.ADMIN:
        return 'Admin Panel';
      case Role.PROVIDER:
        return 'Provider Dashboard';
      case Role.USER:
        return 'My Account';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div
      className={cn(
        'flex h-full flex-col bg-slate-900 text-white transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      {/* Header */}
      <div className="border-b border-slate-800 p-6">
        <h1 className={cn('text-2xl font-bold', !sidebarOpen && 'text-center')}>
          {sidebarOpen ? 'ServiceHub' : 'SH'}
        </h1>
        {sidebarOpen && <p className="mt-1 text-sm text-slate-400">{getRoleTitle()}</p>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white',
                  !sidebarOpen && 'justify-center'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.title}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="border-t border-slate-800 p-4">
        {sidebarOpen && (
          <div className="mb-3 px-3">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        )}
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start text-slate-400 hover:bg-slate-800 hover:text-white',
            !sidebarOpen && 'justify-center px-2'
          )}
          onClick={logout}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {sidebarOpen && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </div>
  );
}