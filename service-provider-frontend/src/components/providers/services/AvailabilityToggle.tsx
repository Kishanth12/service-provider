import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

interface AvailabilityToggleProps {
  isAvailable: boolean;
}

export function AvailabilityToggle({ isAvailable }: AvailabilityToggleProps) {
  const config = isAvailable
    ? {
        label: "Available",
        gradient: "from-emerald-500 to-green-600",
        ring: "ring-emerald-200 dark:ring-emerald-900/40",
      }
    : {
        label: "Unavailable",
        gradient: "from-red-500 to-rose-600",
        ring: "ring-red-200 dark:ring-red-900/40",
      };

  return (
    <Badge
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-white",
        "bg-gradient-to-r",
        config.gradient,
        "ring-1",
        config.ring,
        "shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md",
      )}
    >
      {/* Status Dot */}
      <span className="h-2 w-2 rounded-full bg-white/90" />
      {config.label}
    </Badge>
  );
}
