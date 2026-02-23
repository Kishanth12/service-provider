import { Role, User } from "@/types";
import { Users, Briefcase, Shield, BarChart3 } from "lucide-react";

export function UserStats({ users }: { users: User[] }) {
  const totalUsers = users.filter((u) => u.role === Role.USER).length;
  const providers = users.filter((u) => u.role === Role.PROVIDER).length;
  const admins = users.filter((u) => u.role === Role.ADMIN).length;

  const stats = [
    {
      label: "Users",
      value: totalUsers,
      icon: Users,
      iconStyle: "bg-blue-50 text-blue-600",
    },
    {
      label: "Providers",
      value: providers,
      icon: Briefcase,
      iconStyle: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Admins",
      value: admins,
      icon: Shield,
      iconStyle: "bg-purple-50 text-purple-600",
    },
    {
      label: "Total",
      value: users.length,
      icon: BarChart3,
      iconStyle: "bg-slate-100 text-slate-600",
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-3 text-4xl font-semibold text-slate-900">
                  {stat.value}
                </p>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconStyle}`}
              >
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
