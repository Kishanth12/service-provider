import { Booking, BookingStatus } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookingStatusBadge } from "./BookingStatusBadge";
import {
  Calendar,
  Clock,
  DollarSign,
  User,
  X,
  Star,
  Sparkles,
} from "lucide-react";

interface BookingCardProps {
  booking: Booking;
  onCancel: (booking: Booking) => void;
  onReview?: (booking: Booking) => void;
  isCancelling: boolean;
}

export function BookingCard({
  booking,
  onCancel,
  onReview,
  isCancelling,
}: BookingCardProps) {
  const canCancel =
    booking.status === BookingStatus.PENDING ||
    booking.status === BookingStatus.ACCEPTED;

  const canReview = booking.status === BookingStatus.COMPLETED;

  const title = booking.providerService?.serviceTemplate?.title ?? "Service";
  const description =
    booking.providerService?.serviceTemplate?.description ??
    "No description available.";
  const providerName =
    booking.providerService?.provider?.user?.name ?? "Unknown Provider";

  const price = booking.providerService?.price;
  const priceText = typeof price === "number" ? `$${price.toFixed(2)}` : "N/A";

  return (
    <Card className="group overflow-hidden rounded-2xl border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl dark:border-slate-800/60 dark:bg-slate-950/40">
      {/* top gradient line */}
      <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 opacity-70" />

      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            <h3 className="text-lg font-extrabold tracking-tight text-slate-900 truncate dark:text-white">
              {title}
            </h3>
            <p className="text-sm text-slate-600 mt-1 line-clamp-2 dark:text-slate-300">
              {description}
            </p>
          </div>

          <div className="shrink-0">
            <BookingStatusBadge status={booking.status} />
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3 mb-5">
          <div className="flex items-center gap-2 text-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-900/40 dark:text-slate-300">
              <User className="h-4 w-4" />
            </div>
            <span className="text-slate-600 dark:text-slate-400">Provider</span>
            <span className="ml-auto font-semibold text-slate-900 dark:text-white">
              {providerName}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-900/40 dark:text-slate-300">
              <Calendar className="h-4 w-4" />
            </div>
            <span className="text-slate-600 dark:text-slate-400">Date</span>
            <span className="ml-auto font-semibold text-slate-900 dark:text-white">
              {new Date(booking.date).toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-900/40 dark:text-slate-300">
              <Clock className="h-4 w-4" />
            </div>
            <span className="text-slate-600 dark:text-slate-400">Time</span>
            <span className="ml-auto font-semibold text-slate-900 dark:text-white">
              {booking.timeSlot}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
              <DollarSign className="h-4 w-4" />
            </div>
            <span className="text-slate-600 dark:text-slate-400">Price</span>
            <span className="ml-auto font-extrabold text-emerald-600 dark:text-emerald-400">
              {priceText}
            </span>
          </div>
        </div>

        {/* Actions */}
        {(canCancel || canReview) && (
          <div className="pt-4 border-t border-slate-200/70 space-y-2 dark:border-slate-800/60">
            {canCancel && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onCancel(booking)}
                disabled={isCancelling}
                className="w-full h-10 rounded-xl shadow-sm transition hover:shadow-md"
              >
                <X className="h-4 w-4 mr-2" />
                {isCancelling ? "Cancelling..." : "Cancel Booking"}
              </Button>
            )}

            {canReview && onReview && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReview(booking)}
                className="w-full h-10 rounded-xl border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950/30 dark:hover:bg-slate-900/40"
              >
                <Star className="h-4 w-4 mr-2" />
                Write a Review
              </Button>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200/70 mt-4 dark:border-slate-800/60">
          <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>
              Booked on {new Date(booking.createdAt).toLocaleString()}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/70 px-2 py-0.5 backdrop-blur dark:border-slate-800 dark:bg-slate-950/40">
              <Sparkles className="h-3 w-3" />
              Booking
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
