import { Badge } from "@/components/ui/badge";

interface ServiceStatusBadgeProps {
  isActive: boolean;
}

export function ServiceStatusBadge({ isActive }: ServiceStatusBadgeProps) {
  return (
    <Badge
      className={
        isActive ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-800"
      }
    >
      {isActive ? "Active" : "Inactive"}
    </Badge>
  );
}
