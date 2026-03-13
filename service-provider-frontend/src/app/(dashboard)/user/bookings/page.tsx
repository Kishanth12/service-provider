"use client";

import { useState, useMemo } from "react";
import { useBooking } from "@/lib/hooks/useBookings";
import { useReview } from "@/lib/hooks/useReviews";
import { Booking, BookingStatus } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Filter,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
} from "lucide-react";

import { BookingCard } from "@/components/user/bookings/BookingCard";
import { ReviewModal } from "@/components/user/reviews/ReviewModal";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";
import { DeleteConfirmModal } from "@/components/shared/DeleteConfirmModal";
import { EmptyState } from "@/components/shared/EmptyState";
import { cn } from "@/lib/utils/cn";

function StatCard({
  label,
  value,
  icon,
  tone = "slate",
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone?: "slate" | "blue" | "emerald" | "purple" | "red";
}) {
  const toneStyles: Record<
    string,
    { bg: string; iconBg: string; iconText: string }
  > = {
    slate: {
      bg: "bg-white",
      iconBg: "bg-slate-100",
      iconText: "text-slate-700",
    },
    blue: {
      bg: "bg-white",
      iconBg: "bg-blue-50",
      iconText: "text-blue-700",
    },
    emerald: {
      bg: "bg-white",
      iconBg: "bg-emerald-50",
      iconText: "text-emerald-700",
    },
    purple: {
      bg: "bg-white",
      iconBg: "bg-purple-50",
      iconText: "text-purple-700",
    },
    red: {
      bg: "bg-white",
      iconBg: "bg-rose-50",
      iconText: "text-rose-700",
    },
  };

  const t = toneStyles[tone];

  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/70 shadow-sm",
        "p-5 transition hover:shadow-md",
        t.bg,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>

        <div
          className={cn(
            "h-10 w-10 rounded-xl flex items-center justify-center",
            t.iconBg,
            t.iconText,
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
          {count}
        </span>
      </div>
    </div>
  );
}

export default function UserBookingsPage() {
  const [statusFilter, setStatusFilter] = useState<"all" | BookingStatus>(
    "all",
  );
  const [cancelBooking, setCancelBooking] = useState<Booking | null>(null);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);

  const {
    useMyBookings,
    cancelBooking: cancelBookingMutation,
    isCancellingBooking,
  } = useBooking();

  const { createReview, isCreatingReview } = useReview();
  const { data: bookingsData, isLoading, error, refetch } = useMyBookings();

  const bookings = Array.isArray(bookingsData) ? bookingsData : [];

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) =>
      statusFilter === "all" ? true : b.status === statusFilter,
    );
  }, [bookings, statusFilter]);

  const now = useMemo(() => new Date(), []);

  const upcomingBookings = useMemo(() => {
    return filteredBookings.filter(
      (b) =>
        (b.status === BookingStatus.PENDING ||
          b.status === BookingStatus.ACCEPTED ||
          b.status === BookingStatus.IN_PROGRESS) &&
        new Date(b.date) >= now,
    );
  }, [filteredBookings, now]);

  const pastBookings = useMemo(() => {
    return filteredBookings.filter(
      (b) =>
        b.status === BookingStatus.COMPLETED ||
        b.status === BookingStatus.CANCELLED ||
        new Date(b.date) < now,
    );
  }, [filteredBookings, now]);

  const handleCancelClick = (booking: Booking) => setCancelBooking(booking);

  const handleCancelConfirm = () => {
    if (!cancelBooking) return;

    cancelBookingMutation(cancelBooking.id, {
      onSuccess: () => {
        setCancelBooking(null);
        refetch();
      },
    });
  };

  const handleReviewClick = (booking: Booking) => setReviewBooking(booking);

  const handleReviewSubmit = (data: { rating: number; comment: string }) => {
    if (!reviewBooking) return;

    createReview(
      {
        bookingId: reviewBooking.id,
        rating: data.rating,
        comment: data.comment,
      },
      {
        onSuccess: () => {
          setReviewBooking(null);
          refetch();
        },
        onError: () => {
          setReviewBooking(null);
        }
      },
    );
  };

  const total = bookings.length;
  const upcomingCount = upcomingBookings.length;
  const completed = bookings.filter(
    (b) => b.status === BookingStatus.COMPLETED,
  ).length;
  const cancelled = bookings.filter(
    (b) => b.status === BookingStatus.CANCELLED,
  ).length;

  if (isLoading) return <LoadingSpinner />;

  if (error)
    return <ErrorState message="Failed to load bookings" onRetry={refetch} />;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                My Bookings
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
                <Sparkles className="h-3.5 w-3.5" />
                Overview
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              View and manage your service bookings
            </p>
          </div>

          {/* Filter inline (desktop) */}
          <div className="mt-2 sm:mt-0">
            <div className="flex items-center gap-2 text-slate-600">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Status</span>
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as "all" | BookingStatus)
              }
            >
              <SelectTrigger className="mt-2 w-full sm:w-56">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bookings</SelectItem>
                <SelectItem value={BookingStatus.PENDING}>Pending</SelectItem>
                <SelectItem value={BookingStatus.ACCEPTED}>Accepted</SelectItem>
                <SelectItem value={BookingStatus.IN_PROGRESS}>
                  In Progress
                </SelectItem>
                <SelectItem value={BookingStatus.COMPLETED}>
                  Completed
                </SelectItem>
                <SelectItem value={BookingStatus.CANCELLED}>
                  Cancelled
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total"
          value={total}
          tone="blue"
          icon={<Calendar className="h-5 w-5" />}
        />
        <StatCard
          label="Upcoming"
          value={upcomingCount}
          tone="emerald"
          icon={<Clock className="h-5 w-5" />}
        />
        <StatCard
          label="Completed"
          value={completed}
          tone="purple"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <StatCard
          label="Cancelled"
          value={cancelled}
          tone="red"
          icon={<XCircle className="h-5 w-5" />}
        />
      </div>

      {/* Content */}
      {filteredBookings.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/70 bg-white p-10 shadow-sm">
          <EmptyState
            title="No bookings found"
            description="You haven't made any bookings yet. Browse services to get started!"
          />
        </div>
      ) : (
        <div className="space-y-8">
          {upcomingBookings.length > 0 && (
            <section className="space-y-4">
              <SectionTitle title="Upcoming" count={upcomingBookings.length} />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {upcomingBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onCancel={handleCancelClick}
                    onReview={handleReviewClick}
                    isCancelling={isCancellingBooking}
                  />
                ))}
              </div>
            </section>
          )}

          {pastBookings.length > 0 && (
            <section className="space-y-4">
              <SectionTitle title="Past" count={pastBookings.length} />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pastBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onCancel={handleCancelClick}
                    onReview={handleReviewClick}
                    isCancelling={isCancellingBooking}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!cancelBooking}
        onClose={() => setCancelBooking(null)}
        onConfirm={handleCancelConfirm}
        isDeleting={isCancellingBooking}
        title="Cancel Booking"
        itemName={cancelBooking?.providerService?.serviceTemplate?.title}
        description="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Cancel Booking"
      />

      {/* Review Modal */}
      {reviewBooking && (
        <ReviewModal
          booking={reviewBooking}
          isOpen={!!reviewBooking}
          onClose={() => setReviewBooking(null)}
          onSubmit={handleReviewSubmit}
          isSubmitting={isCreatingReview}
        />
      )}
    </div>
  );
}
