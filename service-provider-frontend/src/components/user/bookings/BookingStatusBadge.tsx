import { Badge } from "@/components/ui/badge";
import { BookingStatus } from "@/types";

interface BookingStatusBadgeProps {
  status: BookingStatus;
}

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  const variants = {
    [BookingStatus.PENDING]: "bg-yellow-100 text-yellow-800",
    [BookingStatus.ACCEPTED]: "bg-blue-100 text-blue-800",
    [BookingStatus.IN_PROGRESS]: "bg-purple-100 text-purple-800",
    [BookingStatus.COMPLETED]: "bg-green-100 text-green-800",
    [BookingStatus.CANCELLED]: "bg-red-100 text-red-800",
  };

  const labels = {
    [BookingStatus.PENDING]: "Pending",
    [BookingStatus.ACCEPTED]: "Accepted",
    [BookingStatus.IN_PROGRESS]: "In Progress",
    [BookingStatus.COMPLETED]: "Completed",
    [BookingStatus.CANCELLED]: "Cancelled",
  };

  return <Badge className={variants[status]}>{labels[status]}</Badge>;
}
