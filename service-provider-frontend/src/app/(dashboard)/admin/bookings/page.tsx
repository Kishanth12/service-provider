"use client";

import { useState } from "react";
import { useBooking } from "@/lib/hooks/useBookings";
import { Booking, BookingStatus } from "@/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Calendar,
  Timer,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { BookingStatusBadge } from "@/components/user/bookings/BookingStatusBadge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";
import { DataTable } from "@/components/shared/DataTable";

export default function AdminBookingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | BookingStatus>(
    "all",
  );

  const { useAllBookings } = useBooking();
  const { data: bookingsData, isLoading, error, refetch } = useAllBookings();

  const bookings = Array.isArray(bookingsData) ? bookingsData : [];

  const filteredBookings = bookings.filter((booking) => {
    const q = searchQuery.toLowerCase();

    const matchesSearch =
      booking.user?.name?.toLowerCase().includes(q) ||
      booking.user?.email?.toLowerCase().includes(q) ||
      booking.providerService?.provider?.user?.name
        ?.toLowerCase()
        .includes(q) ||
      booking.providerService?.serviceTemplate?.title
        ?.toLowerCase()
        .includes(q);

    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = [
    {
      label: "Total Bookings",
      value: bookings.length,
      icon: Layers,
      pill: "All",
      ring: "ring-sky-500/15",
      glow: "bg-sky-500/10",
    },
    {
      label: "Pending",
      value: bookings.filter((b) => b.status === BookingStatus.PENDING).length,
      icon: Calendar,
      pill: "Pending",
      ring: "ring-yellow-500/15",
      glow: "bg-yellow-500/10",
    },
    {
      label: "Active",
      value: bookings.filter(
        (b) =>
          b.status === BookingStatus.ACCEPTED ||
          b.status === BookingStatus.IN_PROGRESS,
      ).length,
      icon: Timer,
      pill: "Live",
      ring: "ring-indigo-500/15",
      glow: "bg-indigo-500/10",
    },
    {
      label: "Completed",
      value: bookings.filter((b) => b.status === BookingStatus.COMPLETED)
        .length,
      icon: CheckCircle2,
      pill: "Done",
      ring: "ring-emerald-500/15",
      glow: "bg-emerald-500/10",
    },
  ];

  const columns = [
    {
      header: "Customer",
      accessorKey: "customer",
      cell: (booking: Booking) => (
        <div className="min-w-[180px]">
          <p className="font-semibold text-slate-900">
            {booking.user?.name || "-"}
          </p>
          <p className="text-sm text-slate-500">{booking.user?.email || "-"}</p>
        </div>
      ),
    },
    {
      header: "Service",
      accessorKey: "service",
      cell: (booking: Booking) => (
        <div className="min-w-[220px]">
          <p className="font-semibold text-slate-900">
            {booking.providerService?.serviceTemplate?.title || "-"}
          </p>
          <p className="text-sm text-slate-500">
            Provider: {booking.providerService?.provider?.user?.name || "-"}
          </p>
        </div>
      ),
    },
    {
      header: "Date & Time",
      accessorKey: "date",
      cell: (booking: Booking) => (
        <div className="min-w-[160px]">
          <p className="font-semibold text-slate-900">
            {new Date(booking.date).toLocaleDateString()}
          </p>
          <p className="text-sm text-slate-500">{booking.timeSlot}</p>
        </div>
      ),
    },
    {
      header: "Price",
      accessorKey: "price",
      cell: (booking: Booking) => (
        <p className="font-bold text-emerald-600">
          $
          {typeof booking.providerService?.price === "number"
            ? booking.providerService.price.toFixed(2)
            : "0.00"}
        </p>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (booking: Booking) => (
        <BookingStatusBadge status={booking.status} />
      ),
    },
    {
      header: "Booked On",
      accessorKey: "createdAt",
      cell: (booking: Booking) => (
        <p className="text-sm text-slate-700">
          {new Date(booking.createdAt).toLocaleDateString()}
        </p>
      ),
    },
  ];

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return <ErrorState message="Failed to load bookings" onRetry={refetch} />;

  const uniqueCustomers = new Set(bookings.map((b) => b.userId)).size;
  const activeProviders = new Set(
    bookings.map((b) => b.providerService?.providerId),
  ).size;

  const completionRate =
    bookings.length > 0
      ? (
          (bookings.filter((b) => b.status === BookingStatus.COMPLETED).length /
            bookings.length) *
          100
        ).toFixed(1)
      : "0";

  return (
    <div className="p-6">
      {/* Page background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-sky-300/20 blur-3xl" />
        <div className="absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-fuchsia-300/15 blur-3xl" />
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex h-1 w-28 rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 opacity-80" />
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
          All Bookings
        </h1>
        <p className="text-slate-600 mt-1">
          Monitor and manage all platform bookings
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={[
                "relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm",
                "hover:shadow-md transition-all",
                "ring-1",
                stat.ring,
              ].join(" ")}
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 opacity-50" />
              <div className="p-6 flex items-center justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600">
                    {stat.pill}
                  </div>
                  <p className="mt-3 text-sm text-slate-600">{stat.label}</p>
                  <p className="text-3xl font-extrabold mt-2 text-slate-900">
                    {stat.value}
                  </p>
                </div>

                <div className="relative">
                  <div
                    className={`absolute inset-0 rounded-2xl ${stat.glow} blur-xl`}
                  />
                  <div className="relative h-12 w-12 rounded-2xl bg-slate-900/5 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-slate-900" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-2xl border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm">
        <div className="p-4 md:p-5">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search by customer, provider, or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 rounded-xl bg-white shadow-sm border-slate-200"
              />
            </div>

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as "all" | BookingStatus)
              }
            >
              <SelectTrigger className="w-full md:w-56 h-11 rounded-xl bg-white shadow-sm border-slate-200">
                <Filter className="h-4 w-4 mr-2 text-slate-500" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Status</SelectItem>
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

          {/* small helper line */}
          <div className="mt-4 text-xs text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {filteredBookings.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700">
              {bookings.length}
            </span>{" "}
            bookings
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm overflow-hidden">
        <DataTable
          data={filteredBookings}
          columns={columns}
          emptyMessage="No bookings found"
        />
      </div>

      {/* Summary */}
      <div className="mt-6 rounded-2xl border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm">
        <div className="p-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="rounded-2xl bg-slate-900/5 p-4">
              <p className="text-2xl font-extrabold text-slate-900">
                {uniqueCustomers}
              </p>
              <p className="text-sm text-slate-600">Unique Customers</p>
            </div>

            <div className="rounded-2xl bg-slate-900/5 p-4">
              <p className="text-2xl font-extrabold text-slate-900">
                {activeProviders}
              </p>
              <p className="text-sm text-slate-600">Active Providers</p>
            </div>

            <div className="rounded-2xl bg-slate-900/5 p-4">
              <p className="text-2xl font-extrabold text-slate-900">
                {completionRate}%
              </p>
              <p className="text-sm text-slate-600">Completion Rate</p>
            </div>

            <div className="rounded-2xl bg-slate-900/5 p-4">
              <p className="text-2xl font-extrabold text-slate-900">
                {statusFilter === "all" ? "All" : statusFilter}
              </p>
              <p className="text-sm text-slate-600">Current Filter</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
