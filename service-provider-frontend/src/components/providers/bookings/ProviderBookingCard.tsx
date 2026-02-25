import { Booking, BookingStatus } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { BookingStatusBadge } from "@/components/user/bookings/BookingStatusBadge";
import { BookingActionsMenu } from "./BookingActionsMenu";
import { Calendar, Clock, DollarSign, User, Mail, Hash } from "lucide-react";

interface ProviderBookingCardProps {
  booking: Booking;
  onUpdateStatus: (booking: Booking, status: BookingStatus) => void;
}

export function ProviderBookingCard({
  booking,
  onUpdateStatus,
}: ProviderBookingCardProps) {
  const title = booking.providerService?.serviceTemplate?.title ?? "Service";
  const bookingNo = booking.id?.slice(0, 8) ?? "--------";

  const customerName = booking.user?.name ?? "Unknown Customer";
  const customerEmail = booking.user?.email ?? "No email";

  const price = booking.providerService?.price;
  const priceText = typeof price === "number" ? `$${price.toFixed(2)}` : "N/A";

  const bookedAt = new Date(booking.createdAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const dateText = new Date(booking.date).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card className="group rounded-2xl border border-slate-200/70 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800/60 dark:bg-slate-950">
      <CardContent className="p-5">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h3>

            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-slate-200/70 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-800/60 dark:bg-slate-900/40 dark:text-slate-300">
              <Hash className="h-3.5 w-3.5" />
              Booking #{bookingNo}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <BookingStatusBadge status={booking.status} />
            <BookingActionsMenu
              booking={booking}
              onUpdateStatus={onUpdateStatus}
            />
          </div>
        </div>

        {/* Details grid */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow
            icon={<User className="h-4 w-4" />}
            label="Customer"
            value={customerName}
          />
          <InfoRow
            icon={<Mail className="h-4 w-4" />}
            label="Email"
            value={customerEmail}
          />
          <InfoRow
            icon={<Calendar className="h-4 w-4" />}
            label="Date"
            value={dateText}
          />
          <InfoRow
            icon={<Clock className="h-4 w-4" />}
            label="Time"
            value={booking.timeSlot}
          />

          {/* Price (highlight) */}
          <div className="sm:col-span-2 rounded-xl border border-emerald-200/60 bg-emerald-50/60 p-3 dark:border-emerald-900/40 dark:bg-emerald-950/20">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                <DollarSign className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-emerald-700/80 dark:text-emerald-300/80">
                  Price
                </p>
                <p className="truncate text-base font-semibold text-emerald-700 dark:text-emerald-300">
                  {priceText}
                </p>
              </div>

              <div className="ml-auto text-xs text-emerald-700/70 dark:text-emerald-300/70">
                Confirmed amount
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between border-t border-slate-200/70 pt-4 text-xs text-slate-500 dark:border-slate-800/60 dark:text-slate-400">
          <span>Booked on {bookedAt}</span>
          <span className="opacity-70">ID: {bookingNo}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200/70 bg-white p-3 dark:border-slate-800/60 dark:bg-slate-950">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-900/40 dark:text-slate-300">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}
