import { Role, User } from "@/types";

export function UserStats({ users }: { users: User[] }) {
  const stats = [
    {
      label: "Total Users",
      value: users.filter((u) => u.role === Role.USER).length,
      color: "bg-blue-500",
    },
    {
      label: "Providers",
      value: users.filter((u) => u.role === Role.PROVIDER).length,
      color: "bg-green-500",
    },
    {
      label: "Admins",
      value: users.filter((u) => u.role === Role.ADMIN).length,
      color: "bg-purple-500",
    },
    {
      label: "Total",
      value: users.length,
      color: "bg-slate-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-lg border border-slate-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">{stat.label}</p>
              <p className="text-3xl font-bold mt-2">{stat.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg ${stat.color} opacity-10`} />
          </div>
        </div>
      ))}
    </div>
  );
}
