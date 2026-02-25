import { Badge } from "@/components/ui/badge";
import { BookingStatus } from "@/types";
import { cn } from "@/lib/utils/cn";

interface BookingStatusBadgeProps {
  status: BookingStatus;
}

const statusConfig = {
  [BookingStatus.PENDING]: {
    label: "Pending",
    gradient: "from-amber-400 to-yellow-500",
    ring: "ring-amber-200 dark:ring-amber-900/40",
    dot: "bg-yellow-50",
  },
  [BookingStatus.ACCEPTED]: {
    label: "Accepted",
    gradient: "from-blue-500 to-indigo-600",
    ring: "ring-blue-200 dark:ring-blue-900/40",
    dot: "bg-blue-50",
  },
  [BookingStatus.IN_PROGRESS]: {
    label: "In Progress",
    gradient: "from-purple-500 to-fuchsia-600",
    ring: "ring-purple-200 dark:ring-purple-900/40",
    dot: "bg-purple-50",
  },
  [BookingStatus.COMPLETED]: {
    label: "Completed",
    gradient: "from-emerald-500 to-green-600",
    ring: "ring-emerald-200 dark:ring-emerald-900/40",
    dot: "bg-emerald-50",
  },
  [BookingStatus.CANCELLED]: {
    label: "Cancelled",
    gradient: "from-red-500 to-rose-600",
    ring: "ring-red-200 dark:ring-red-900/40",
    dot: "bg-red-50",
  },
};

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold text-white",
        "bg-gradient-to-r",
        config.gradient,
        "ring-1",
        config.ring,
        "shadow-sm transition hover:shadow-md",
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", config.dot, "shadow")} />
      {config.label}
    </Badge>
  );
}
