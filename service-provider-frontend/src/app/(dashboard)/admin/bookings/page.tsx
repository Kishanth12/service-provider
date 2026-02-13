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
import { Search, Filter } from "lucide-react";
import { BookingStatusBadge } from "@/components/user/bookings/BookingStatusBadge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";
import { DataTable } from "@/components/shared/DataTable";

export default function AdminBookingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | BookingStatus>(
    "all"
  );

  const { useAllBookings } = useBooking();
  const { data: bookingsData, isLoading, error, refetch } = useAllBookings();

  const bookings = Array.isArray(bookingsData) ? bookingsData : [];

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.providerService?.provider?.user?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      booking.providerService?.serviceTemplate?.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
          b.status === BookingStatus.IN_PROGRESS
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

  // Table columns
  const columns = [
    {
      header: "Customer",
      accessorKey: "customer",
      cell: (booking: Booking) => (
        <div>
          <p className="font-medium">{booking.user?.name}</p>
          <p className="text-sm text-slate-500">{booking.user?.email}</p>
        </div>
      ),
    },
    {
      header: "Service",
      accessorKey: "service",
      cell: (booking: Booking) => (
        <div>
          <p className="font-medium">
            {booking.providerService?.serviceTemplate?.title}
          </p>
          <p className="text-sm text-slate-500">
            Provider: {booking.providerService?.provider?.user?.name}
          </p>
        </div>
      ),
    },
    {
      header: "Date & Time",
      accessorKey: "date",
      cell: (booking: Booking) => (
        <div>
          <p className="font-medium">
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
        <p className="font-semibold text-green-600">
          ${booking.providerService?.price.toFixed(2)}
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
        <p className="text-sm">
          {new Date(booking.createdAt).toLocaleDateString()}
        </p>
      ),
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
        <h1 className="text-3xl font-bold">All Bookings</h1>
        <p className="text-slate-600 mt-1">
          Monitor and manage all platform bookings
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-lg border border-slate-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">{stat.label}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <div
                className={`w-12 h-12 rounded-lg ${stat.color} opacity-10`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search by customer, provider, or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as "all" | BookingStatus)
            }
          >
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
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

      {/* Bookings Table */}
      <div className="bg-white rounded-lg border border-slate-200">
        <DataTable
          data={filteredBookings}
          columns={columns}
          emptyMessage="No bookings found"
        />
      </div>

      {/* Summary Info */}
      <div className="mt-6 bg-slate-50 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">
              {new Set(bookings.map((b) => b.userId)).size}
            </p>
            <p className="text-sm text-slate-600">Unique Customers</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {new Set(bookings.map((b) => b.providerService?.providerId)).size}
            </p>
            <p className="text-sm text-slate-600">Active Providers</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {bookings.length > 0
                ? (
                    (bookings.filter(
                      (b) => b.status === BookingStatus.COMPLETED
                    ).length /
                      bookings.length) *
                    100
                  ).toFixed(1)
                : 0}
              %
            </p>
            <p className="text-sm text-slate-600">Completion Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}
