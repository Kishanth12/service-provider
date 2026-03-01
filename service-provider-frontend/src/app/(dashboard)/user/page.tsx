"use client";

import { useMemo } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useBooking } from "@/lib/hooks/useBookings";
import { useService } from "@/lib/hooks/useServices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import {
  Calendar,
  Package,
  Clock,
  ChevronRight,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { BookingStatus } from "@/types";
import { BookingStatusBadge } from "@/components/user/bookings/BookingStatusBadge";

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <Card className="border-slate-200">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600">{label}</p>
            <div className="mt-2 text-3xl font-semibold text-slate-900">
              {value}
            </div>
          </div>
          <div className="h-11 w-11 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-700">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function UserDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { useMyBookings } = useBooking();
  const { useAvailableServices } = useService();

  const { data: bookingsData, isLoading: bookingsLoading } = useMyBookings();
  const { data: servicesData, isLoading: servicesLoading } =
    useAvailableServices();

  const bookings = Array.isArray(bookingsData) ? bookingsData : [];
  const services = Array.isArray(servicesData) ? servicesData : [];

  const { upcomingBookings, completedBookings, totalSpent } = useMemo(() => {
    const upcoming = bookings.filter(
      (b) =>
        (b.status === BookingStatus.PENDING ||
          b.status === BookingStatus.ACCEPTED ||
          b.status === BookingStatus.IN_PROGRESS) &&
        new Date(b.date) >= new Date(),
    );

    const completed = bookings.filter(
      (b) => b.status === BookingStatus.COMPLETED,
    );

    const spent = completed.reduce(
      (sum, b) => sum + (b.providerService?.price || 0),
      0,
    );

    return {
      upcomingBookings: upcoming,
      completedBookings: completed,
      totalSpent: spent,
    };
  }, [bookings]);

  const topUpcoming = upcomingBookings.slice(0, 3);
  const topServices = services.slice(0, 3);

  if (bookingsLoading || servicesLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold text-slate-900">
          Welcome back, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-slate-600">
          Track bookings and explore available services.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Bookings"
          value={bookings.length}
          icon={<Calendar className="h-5 w-5" />}
        />
        <StatCard
          label="Upcoming"
          value={upcomingBookings.length}
          icon={<Clock className="h-5 w-5" />}
        />
        <StatCard
          label="Completed"
          value={completedBookings.length}
          icon={<Calendar className="h-5 w-5" />}
        />
        <StatCard
          label="Total Spent"
          value={
            <span className="text-emerald-700">${totalSpent.toFixed(2)}</span>
          }
          icon={<Package className="h-5 w-5" />}
        />
      </div>

      {/* Top Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming */}
        <Card className="lg:col-span-2 border-slate-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Upcoming bookings</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/user/bookings")}
                className="text-slate-700"
              >
                View all <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {topUpcoming.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
                <div className="mx-auto mb-3 h-11 w-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-slate-600" />
                </div>
                <p className="font-medium text-slate-900">
                  No upcoming bookings
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  Browse services and book your first one.
                </p>
                <Button
                  className="mt-4"
                  onClick={() => router.push("/user/services")}
                >
                  Browse services
                </Button>
              </div>
            ) : (
              topUpcoming.map((booking) => (
                <button
                  key={booking.id}
                  onClick={() => router.push("/user/bookings")}
                  className="w-full text-left rounded-xl border border-slate-200 bg-white p-4 hover:bg-slate-50 transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 truncate">
                        {booking.providerService?.serviceTemplate?.title}
                      </p>
                      <p className="text-sm text-slate-600 mt-1">
                        {new Date(booking.date).toLocaleDateString()} •{" "}
                        {booking.timeSlot}
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        Provider:{" "}
                        {booking.providerService?.provider?.user?.name}
                      </p>
                    </div>

                    <div className="shrink-0 text-right space-y-2">
                      <BookingStatusBadge status={booking.status} />
                      <p className="text-sm font-semibold text-emerald-700">
                        ${booking.providerService?.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => router.push("/user/services")}
            >
              <Package className="h-4 w-4 mr-2" />
              Browse services
            </Button>

            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => router.push("/user/bookings")}
            >
              <Calendar className="h-4 w-4 mr-2" />
              My bookings
            </Button>

            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => router.push("/user/profile")}
            >
              <UserRound className="h-4 w-4 mr-2" />
              My profile
            </Button>
          </CardContent>
        </Card>

        {/* Services */}
        <Card className="lg:col-span-3 border-slate-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Available services</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/user/services")}
                className="text-slate-700"
              >
                View all <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {topServices.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-slate-600">
                No services available right now.
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                {topServices.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => router.push(`/user/services/${service.id}`)}
                    className="text-left rounded-xl border border-slate-200 bg-white p-4 hover:bg-slate-50 transition"
                  >
                    <p className="font-semibold text-slate-900">
                      {service.serviceTemplate?.title}
                    </p>

                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                      {service.serviceTemplate?.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-sm text-slate-500">
                        {service.provider?.user?.name}
                      </p>
                      <p className="text-sm font-semibold text-emerald-700">
                        ${service.price.toFixed(2)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
