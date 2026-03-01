"use client";

import { useState } from "react";
import { useBooking } from "@/lib/hooks/useBookings";
import { Booking, BookingStatus } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import { ProviderBookingCard } from "@/components/providers/bookings/ProviderBookingCard";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { Calendar, Clock, Activity, CheckCircle } from "lucide-react";

export default function ProviderBookingsPage() {
  const [statusFilter, setStatusFilter] = useState<"all" | BookingStatus>(
    "all",
  );

  const { useAllBookings, updateBookingStatus, isUpdatingStatus } =
    useBooking();
  const { data: bookingsData, isLoading, error, refetch } = useAllBookings();

  const bookings = Array.isArray(bookingsData) ? bookingsData : [];

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    if (statusFilter === "all") return true;
    return booking.status === statusFilter;
  });

  // Group bookings
  const pendingBookings = filteredBookings.filter(
    (b) => b.status === BookingStatus.PENDING,
  );

  const activeBookings = filteredBookings.filter(
    (b) =>
      b.status === BookingStatus.ACCEPTED ||
      b.status === BookingStatus.IN_PROGRESS,
  );

  const completedBookings = filteredBookings.filter(
    (b) =>
      b.status === BookingStatus.COMPLETED ||
      b.status === BookingStatus.CANCELLED,
  );

  const handleUpdateStatus = (booking: Booking, status: BookingStatus) => {
    updateBookingStatus(
      { id: booking.id, data: { status } },
      {
        onSuccess: () => {
          refetch();
        },
      },
    );
  };

  // Stats
  const stats = [
    {
      label: "Total Bookings",
      value: bookings.length,
      color: "bg-blue-500",
    },
    {
      label: "Pending",
      value: bookings.filter((b) => b.status === BookingStatus.PENDING).length,
      color: "bg-yellow-500",
    },
    {
      label: "Active",
      value: bookings.filter(
        (b) =>
          b.status === BookingStatus.ACCEPTED ||
          b.status === BookingStatus.IN_PROGRESS,
      ).length,
      color: "bg-purple-500",
    },
    {
      label: "Completed",
      value: bookings.filter((b) => b.status === BookingStatus.COMPLETED)
        .length,
      color: "bg-green-500",
    },
  ];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorState message="Failed to load bookings" onRetry={refetch} />;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Booking Management</h1>
        <p className="text-slate-600 mt-1">
          Manage customer bookings for your services
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Total */}
        <div className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 backdrop-blur-xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sky-500/15 blur-3xl" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Total Bookings
              </p>
              <p className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900">
                {bookings.length}
              </p>
              <p className="text-xs text-slate-500 mt-2">
                All received bookings
              </p>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-lg transition group-hover:scale-105">
              <Calendar className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 backdrop-blur-xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-500/15 blur-3xl" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Pending</p>
              <p className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900">
                {
                  bookings.filter((b) => b.status === BookingStatus.PENDING)
                    .length
                }
              </p>
              <p className="text-xs text-slate-500 mt-2">Awaiting approval</p>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 text-white shadow-lg transition group-hover:scale-105">
              <Clock className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Active */}
        <div className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 backdrop-blur-xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-purple-500/15 blur-3xl" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Active</p>
              <p className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900">
                {
                  bookings.filter(
                    (b) =>
                      b.status === BookingStatus.ACCEPTED ||
                      b.status === BookingStatus.IN_PROGRESS,
                  ).length
                }
              </p>
              <p className="text-xs text-slate-500 mt-2">Currently ongoing</p>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white shadow-lg transition group-hover:scale-105">
              <Activity className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 backdrop-blur-xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/15 blur-3xl" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Completed</p>
              <p className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900">
                {
                  bookings.filter((b) => b.status === BookingStatus.COMPLETED)
                    .length
                }
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Successfully finished
              </p>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg transition group-hover:scale-105">
              <CheckCircle className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <Filter className="h-5 w-5 text-slate-400" />
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as "all" | BookingStatus)
            }
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bookings</SelectItem>
              <SelectItem value={BookingStatus.PENDING}>Pending</SelectItem>
              <SelectItem value={BookingStatus.ACCEPTED}>Accepted</SelectItem>
              <SelectItem value={BookingStatus.IN_PROGRESS}>
                In Progress
              </SelectItem>
              <SelectItem value={BookingStatus.COMPLETED}>Completed</SelectItem>
              <SelectItem value={BookingStatus.CANCELLED}>Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <EmptyState
          title="No bookings found"
          description="You don't have any bookings yet. Customers will see your services and book them."
        />
      ) : (
        <div className="space-y-8">
          {/* Pending Bookings */}
          {pendingBookings.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                Pending Approval ({pendingBookings.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingBookings.map((booking) => (
                  <ProviderBookingCard
                    key={booking.id}
                    booking={booking}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Active Bookings */}
          {activeBookings.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                Active Bookings ({activeBookings.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeBookings.map((booking) => (
                  <ProviderBookingCard
                    key={booking.id}
                    booking={booking}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completed Bookings */}
          {completedBookings.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                Completed & Cancelled ({completedBookings.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedBookings.map((booking) => (
                  <ProviderBookingCard
                    key={booking.id}
                    booking={booking}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
