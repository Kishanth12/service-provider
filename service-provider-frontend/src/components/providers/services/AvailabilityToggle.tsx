import { Badge } from "@/components/ui/badge";

interface AvailabilityToggleProps {
  isAvailable: boolean;
}

export function AvailabilityToggle({ isAvailable }: AvailabilityToggleProps) {
  return (
    <Badge
      className={
        isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }
    >
      {isAvailable ? "Available" : "Unavailable"}
    </Badge>
  );
}
