import { Badge } from "@/components/ui/badge";

interface ServiceStatusBadgeProps {
  isActive: boolean;
}

export function ServiceStatusBadge({ isActive }: ServiceStatusBadgeProps) {
  return (
    <Badge
      className={[
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold",
        "border transition-all duration-200",
        isActive
          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30"
          : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-300 dark:border-slate-500/25",
      ].join(" ")}
    >
      <span
        className={[
          "h-2 w-2 rounded-full",
          isActive ? "bg-emerald-500" : "bg-slate-400",
        ].join(" ")}
      />
      {isActive ? "Active" : "Inactive"}
    </Badge>
  );
}
