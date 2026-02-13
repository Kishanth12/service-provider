import { Booking, BookingStatus } from "@/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Check, X, PlayCircle, CheckCircle } from "lucide-react";

interface BookingActionsMenuProps {
  booking: Booking;
  onUpdateStatus: (booking: Booking, status: BookingStatus) => void;
}

export function BookingActionsMenu({
  booking,
  onUpdateStatus,
}: BookingActionsMenuProps) {
  const canAccept = booking.status === BookingStatus.PENDING;
  const canReject = booking.status === BookingStatus.PENDING;
  const canStart =
    booking.status === BookingStatus.ACCEPTED &&
    new Date(booking.date).toDateString() === new Date().toDateString();
  const canComplete = booking.status === BookingStatus.IN_PROGRESS;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {canAccept && (
          <DropdownMenuItem
            onClick={() => onUpdateStatus(booking, BookingStatus.ACCEPTED)}
          >
            <Check className="h-4 w-4 mr-2 text-green-600" />
            Accept Booking
          </DropdownMenuItem>
        )}
        {canReject && (
          <DropdownMenuItem
            onClick={() => onUpdateStatus(booking, BookingStatus.CANCELLED)}
            className="text-red-600"
          >
            <X className="h-4 w-4 mr-2" />
            Reject Booking
          </DropdownMenuItem>
        )}
        {canStart && (
          <DropdownMenuItem
            onClick={() => onUpdateStatus(booking, BookingStatus.IN_PROGRESS)}
          >
            <PlayCircle className="h-4 w-4 mr-2 text-blue-600" />
            Start Service
          </DropdownMenuItem>
        )}
        {canComplete && (
          <DropdownMenuItem
            onClick={() => onUpdateStatus(booking, BookingStatus.COMPLETED)}
          >
            <CheckCircle className="h-4 w-4 mr-2 text-purple-600" />
            Mark as Completed
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
