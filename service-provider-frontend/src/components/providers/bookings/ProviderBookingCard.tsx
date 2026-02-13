import { Booking, BookingStatus } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { BookingStatusBadge } from "@/components/user/bookings/BookingStatusBadge";
import { BookingActionsMenu } from "./BookingActionsMenu";
import { Calendar, Clock, DollarSign, User, Mail } from "lucide-react";

interface ProviderBookingCardProps {
  booking: Booking;
  onUpdateStatus: (booking: Booking, status: BookingStatus) => void;
}

export function ProviderBookingCard({
  booking,
  onUpdateStatus,
}: ProviderBookingCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">
              {booking.providerService?.serviceTemplate?.title}
            </h3>
            <p className="text-sm text-slate-600">
              Booking #{booking.id.slice(0, 8)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <BookingStatusBadge status={booking.status} />
            <BookingActionsMenu
              booking={booking}
              onUpdateStatus={onUpdateStatus}
            />
          </div>
        </div>

        <div className="space-y-3 mb-4">
          {/* Customer */}
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-slate-400" />
            <span className="text-slate-600">Customer:</span>
            <span className="font-medium">{booking.user?.name}</span>
          </div>

          {/* Email */}
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-slate-400" />
            <span className="text-slate-600">Email:</span>
            <span className="font-medium">{booking.user?.email}</span>
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

        {/* Booking Info */}
        <div className="pt-4 border-t">
          <p className="text-xs text-slate-500">
            Booked on {new Date(booking.createdAt).toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
