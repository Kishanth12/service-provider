import { Booking, BookingStatus } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { Calendar, Clock, DollarSign, User, X, Star } from "lucide-react";

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

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">
              {booking.providerService?.serviceTemplate?.title}
            </h3>
            <p className="text-sm text-slate-600">
              {booking.providerService?.serviceTemplate?.description}
            </p>
          </div>
          <BookingStatusBadge status={booking.status} />
        </div>

        <div className="space-y-3 mb-4">
          {/* Provider */}
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-slate-400" />
            <span className="text-slate-600">Provider:</span>
            <span className="font-medium">
              {booking.providerService?.provider?.user?.name}
            </span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span className="text-slate-600">Date:</span>
            <span className="font-medium">
              {new Date(booking.date).toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-slate-400" />
            <span className="text-slate-600">Time:</span>
            <span className="font-medium">{booking.timeSlot}</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-slate-400" />
            <span className="text-slate-600">Price:</span>
            <span className="font-semibold text-green-600">
              ${booking.providerService?.price.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Actions */}
        {(canCancel || canReview) && (
          <div className="pt-4 border-t space-y-2">
            {canCancel && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onCancel(booking)}
                disabled={isCancelling}
                className="w-full"
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
                className="w-full"
              >
                <Star className="h-4 w-4 mr-2" />
                Write a Review
              </Button>
            )}
          </div>
        )}

        {/* Booking Info */}
        <div className="pt-4 border-t mt-4">
          <p className="text-xs text-slate-500">
            Booked on {new Date(booking.createdAt).toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
