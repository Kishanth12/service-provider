import { ServiceTemplate } from "@/types";

interface ServiceTemplateStatsProps {
  templates: ServiceTemplate[];
}

export function ServiceTemplateStats({ templates }: ServiceTemplateStatsProps) {
  const activeTemplates = templates.filter((t) => t.isActive).length;
  const inactiveTemplates = templates.length - activeTemplates;
  const totalUsage = templates.reduce(
    (sum, t) => sum + (t._count?.providerServices || 0),
    0
  );

  const stats = [
    {
      label: "Total Templates",
      value: templates.length,
      color: "bg-blue-500",
    },
    {
      label: "Active Templates",
      value: activeTemplates,
      color: "bg-green-500",
    },
    {
      label: "Inactive Templates",
      value: inactiveTemplates,
      color: "bg-slate-500",
    },
    {
      label: "Total Usage",
      value: totalUsage,
      color: "bg-purple-500",
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
