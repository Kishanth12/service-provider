import { BookingCard } from "./BookingCard";
import { Booking } from "@/types";
import { EmptyState } from "@/components/shared/EmptyState";
import { Calendar } from "lucide-react";

interface BookingListProps {
  bookings: Booking[] | undefined;
  onCancel?: (id: string) => void;
  showActions?: boolean;
}

export function BookingList({
  bookings,
  onCancel,
  showActions,
}: BookingListProps) {
  if (!bookings || bookings.length === 0) {
    return (
      <div className="relative py-12">
        {/* soft glow */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-10 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-sky-300/20 blur-3xl dark:bg-sky-500/10" />
        </div>

        <EmptyState
          icon={Calendar}
          title="No bookings found"
          description="You don't have any bookings yet"
        />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* soft background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-16 -right-16 h-72 w-72 rounded-full bg-purple-300/15 blur-3xl dark:bg-purple-500/10" />
        <div className="absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-emerald-300/15 blur-3xl dark:bg-emerald-500/10" />
      </div>

      {/* Section Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Your Bookings
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage and track your upcoming services
          </p>
        </div>

        <span className="text-sm font-medium text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-slate-900/40 backdrop-blur px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800">
          {bookings.length} total
        </span>
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 transition-all">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="transition-all duration-300 hover:-translate-y-0.5"
          >
            <BookingCard
              booking={booking}
              onCancel={onCancel}
              showActions={showActions}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
