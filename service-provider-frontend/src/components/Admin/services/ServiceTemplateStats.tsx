import { ServiceTemplate } from "@/types";
import { Layers, CheckCircle2, XCircle, Users2 } from "lucide-react";

interface ServiceTemplateStatsProps {
  templates: ServiceTemplate[];
}

export function ServiceTemplateStats({ templates }: ServiceTemplateStatsProps) {
  const activeTemplates = templates.filter((t) => t.isActive).length;
  const inactiveTemplates = templates.length - activeTemplates;
  const totalUsage = templates.reduce(
    (sum, t) => sum + (t._count?.providerServices || 0),
    0,
  );

  const stats = [
    {
      label: "Total Templates",
      value: templates.length,
      icon: Layers,
      iconBg: "bg-blue-50 text-blue-600",
    },
    {
      label: "Active Templates",
      value: activeTemplates,
      icon: CheckCircle2,
      iconBg: "bg-green-50 text-green-600",
    },
    {
      label: "Inactive Templates",
      value: inactiveTemplates,
      icon: XCircle,
      iconBg: "bg-slate-100 text-slate-600",
    },
    {
      label: "Total Usage",
      value: totalUsage,
      icon: Users2,
      iconBg: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => {
        const Icon = s.icon;

        return (
          <div
            key={s.label}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{s.label}</p>
                <p className="mt-3 text-4xl font-semibold text-slate-900">
                  {s.value}
                </p>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.iconBg}`}
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
