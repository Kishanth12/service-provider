import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { Booking } from "@/types";
import { formatDate, formatCurrency } from "@/lib/utils/formatters";
import { Calendar, Clock, User2, BadgeDollarSign } from "lucide-react";

interface BookingCardProps {
  booking: Booking;
  onCancel?: (id: string) => void;
  showActions?: boolean;
}

export function BookingCard({
  booking,
  onCancel,
  showActions = true,
}: BookingCardProps) {
  const canCancel =
    booking.status === "PENDING" || booking.status === "ACCEPTED";

  // ✅ TS-safe access (fixes possibly undefined)
  const serviceTitle =
    booking.providerService?.serviceTemplate?.title ?? "Service";
  const providerName =
    booking.providerService?.provider?.user?.name ?? "Unknown Provider";
  const price = booking.providerService?.price;

  const hasPrice = typeof price === "number";

  return (
    <Card className="group overflow-hidden rounded-2xl border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl dark:border-slate-800/60 dark:bg-slate-950/40">
      <CardHeader className="border-b border-slate-200/60 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900/40 dark:to-slate-950/20 dark:border-slate-800/60">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-lg font-bold text-slate-900 truncate dark:text-white">
              {serviceTitle}
            </CardTitle>

            <div className="mt-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <User2 className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              <span className="truncate">Provider: {providerName}</span>
            </div>
          </div>

          <BookingStatusBadge status={booking.status} />
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <Calendar className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            <span>{formatDate(booking.date)}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <Clock className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            <span>{booking.timeSlot}</span>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200/70 dark:border-slate-800/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <BadgeDollarSign className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                <span className="text-sm">Price</span>
              </div>

              <p className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                {hasPrice ? formatCurrency(price) : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {showActions && canCancel && onCancel && (
          <div className="mt-5">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onCancel(booking.id)}
              className="w-full h-10 rounded-xl shadow-sm transition hover:shadow-md"
            >
              Cancel Booking
            </Button>

            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 text-center">
              You can cancel only when status is Pending or Accepted.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
