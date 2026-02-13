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
      <EmptyState
        icon={Calendar}
        title="No bookings found"
        description="You don't have any bookings yet"
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {bookings.map((booking) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          onCancel={onCancel}
          showActions={showActions}
        />
      ))}
    </div>
  );
}
