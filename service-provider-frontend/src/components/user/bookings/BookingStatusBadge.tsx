import { Badge } from "@/components/ui/badge";
import { BookingStatus } from "@/types";
import { cn } from "@/lib/utils/cn";

interface BookingStatusBadgeProps {
  status: BookingStatus;
}

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  const config = {
    [BookingStatus.PENDING]: {
      label: "Pending",
      gradient: "from-yellow-400 to-amber-500",
      ring: "ring-yellow-200 dark:ring-yellow-900/40",
    },
    [BookingStatus.ACCEPTED]: {
      label: "Accepted",
      gradient: "from-blue-500 to-indigo-600",
      ring: "ring-blue-200 dark:ring-blue-900/40",
    },
    [BookingStatus.IN_PROGRESS]: {
      label: "In Progress",
      gradient: "from-purple-500 to-fuchsia-600",
      ring: "ring-purple-200 dark:ring-purple-900/40",
    },
    [BookingStatus.COMPLETED]: {
      label: "Completed",
      gradient: "from-emerald-500 to-green-600",
      ring: "ring-emerald-200 dark:ring-emerald-900/40",
    },
    [BookingStatus.CANCELLED]: {
      label: "Cancelled",
      gradient: "from-red-500 to-rose-600",
      ring: "ring-red-200 dark:ring-red-900/40",
    },
  };

  const current = config[status];

  return (
    <Badge
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-white",
        "bg-gradient-to-r",
        current.gradient,
        "ring-1",
        current.ring,
        "shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md",
      )}
    >
      {/* Status Dot */}
      <span className="h-2 w-2 rounded-full bg-white/90" />
      {current.label}
    </Badge>
  );
}
