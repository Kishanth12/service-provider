import * as React from "react";
import { Provider } from "@/types";
import { Users, Briefcase, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type ProviderWithServices = Provider & {
  providerServices?: unknown[];
};

interface ProviderStatsProps {
  providers: ProviderWithServices[];
}

type StatCardProps = {
  label: string;
  value: number;
  hint: string;
  icon: React.ReactNode;
  iconBg: string;
  iconText: string;
};

function StatCard({
  label,
  value,
  hint,
  icon,
  iconBg,
  iconText,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-white p-6 shadow-sm",
        "transition hover:shadow-md",
        "border-slate-200/80 dark:border-slate-800/70 dark:bg-slate-950",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            {label}
          </p>

          <p className="mt-2 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
            {value}
          </p>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {hint}
          </p>
        </div>

        <div
          className={cn(
            "h-11 w-11 rounded-xl grid place-items-center ring-1 ring-black/5",
            "dark:ring-white/10",
            iconBg,
            iconText,
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export function ProviderStats({ providers }: ProviderStatsProps) {
  const totalServices = providers.reduce(
    (sum, p) => sum + (p.providerServices?.length || 0),
    0,
  );

  const avgServices =
    providers.length > 0 ? Math.round(totalServices / providers.length) : 0;

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatCard
        label="Total Providers"
        value={providers.length}
        hint="All registered providers"
        icon={<Users className="h-5 w-5" />}
        iconBg="bg-blue-50 dark:bg-blue-500/10"
        iconText="text-blue-700 dark:text-blue-300"
      />

      <StatCard
        label="Active Services"
        value={totalServices}
        hint="Services listed by providers"
        icon={<Briefcase className="h-5 w-5" />}
        iconBg="bg-emerald-50 dark:bg-emerald-500/10"
        iconText="text-emerald-700 dark:text-emerald-300"
      />

      <StatCard
        label="Avg Services / Provider"
        value={avgServices}
        hint="Average services per provider"
        icon={<BarChart3 className="h-5 w-5" />}
        iconBg="bg-violet-50 dark:bg-violet-500/10"
        iconText="text-violet-700 dark:text-violet-300"
      />
    </div>
  );
}
