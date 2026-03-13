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
  const canStart = booking.status === BookingStatus.ACCEPTED;
  const canComplete = booking.status === BookingStatus.IN_PROGRESS;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 rounded-xl p-0 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-52 rounded-xl border border-slate-200/70 bg-white/90 backdrop-blur-xl shadow-xl dark:border-slate-800/60 dark:bg-slate-950/90"
      >
        {canAccept && (
          <DropdownMenuItem
            onClick={() => onUpdateStatus(booking, BookingStatus.ACCEPTED)}
            className="cursor-pointer rounded-lg focus:bg-slate-100 dark:focus:bg-slate-800/60"
          >
            <Check className="h-4 w-4 mr-2 text-emerald-600 dark:text-emerald-400" />
            Accept Booking
          </DropdownMenuItem>
        )}

        {canReject && (
          <DropdownMenuItem
            onClick={() => onUpdateStatus(booking, BookingStatus.CANCELLED)}
            className="cursor-pointer rounded-lg text-red-600 focus:bg-red-50 dark:text-red-400 dark:focus:bg-red-900/20"
          >
            <X className="h-4 w-4 mr-2" />
            Reject Booking
          </DropdownMenuItem>
        )}

        {canStart && (
          <DropdownMenuItem
            onClick={() => onUpdateStatus(booking, BookingStatus.IN_PROGRESS)}
            className="cursor-pointer rounded-lg focus:bg-slate-100 dark:focus:bg-slate-800/60"
          >
            <PlayCircle className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
            Start Service
          </DropdownMenuItem>
        )}

        {canComplete && (
          <DropdownMenuItem
            onClick={() => onUpdateStatus(booking, BookingStatus.COMPLETED)}
            className="cursor-pointer rounded-lg focus:bg-slate-100 dark:focus:bg-slate-800/60"
          >
            <CheckCircle className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
            Mark as Completed
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
