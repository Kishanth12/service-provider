"use client";

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
  DollarSign,
  Users,
  AlertCircle,
  Star,
  ClipboardCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { BookingStatus } from "@/types";
import { BookingStatusBadge } from "@/components/user/bookings/BookingStatusBadge";
import { useState, useEffect, useMemo } from "react";
import { reviewApi } from "@/lib/api/endpoints/reviews";
import { cn } from "@/lib/utils/cn";

function StatCard({
  title,
  value,
  icon: Icon,
  accent = "blue",
  subtitle,
}: {
  title: string;
  value: React.ReactNode;
  icon: any;
  accent?: "blue" | "emerald" | "violet" | "orange";
  subtitle?: string;
}) {
  const accents = {
    blue: {
      ring: "ring-blue-200/70",
      bg: "bg-blue-50",
      text: "text-blue-700",
      iconBg: "bg-blue-100",
      top: "from-blue-500",
    },
    emerald: {
      ring: "ring-emerald-200/70",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      iconBg: "bg-emerald-100",
      top: "from-emerald-500",
    },
    violet: {
      ring: "ring-violet-200/70",
      bg: "bg-violet-50",
      text: "text-violet-700",
      iconBg: "bg-violet-100",
      top: "from-violet-500",
    },
    orange: {
      ring: "ring-orange-200/70",
      bg: "bg-orange-50",
      text: "text-orange-700",
      iconBg: "bg-orange-100",
      top: "from-orange-500",
    },
  };

  const a = accents[accent];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm",
        "transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
      )}
    >
      {/* subtle top accent */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-1 bg-gradient-to-r",
          a.top,
          "to-transparent",
        )}
      />

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <div className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
            {value}
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
          )}
        </div>

        <div
          className={cn(
            "h-12 w-12 rounded-2xl ring-1 flex items-center justify-center",
            a.bg,
            a.ring,
          )}
        >
          <Icon className={cn("h-6 w-6", a.text)} />
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <div className="h-px w-24 bg-slate-200 mt-2" />
      </div>
      {action}
    </div>
  );
}

export default function ProviderDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { useAllBookings } = useBooking();
  const { useProviderServices } = useService();

  const [allReviews, setAllReviews] = useState<any[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  const { data: bookingsData, isLoading: bookingsLoading } = useAllBookings();
  const { data: servicesData, isLoading: servicesLoading } =
    useProviderServices();

  const bookings = Array.isArray(bookingsData) ? bookingsData : [];
  const services = Array.isArray(servicesData) ? servicesData : [];

  const pendingBookings = useMemo(
    () => bookings.filter((b) => b.status === BookingStatus.PENDING),
    [bookings],
  );

  const todayBookings = useMemo(() => {
    const today = new Date().toDateString();
    return bookings.filter(
      (b) =>
        new Date(b.date).toDateString() === today &&
        (b.status === BookingStatus.ACCEPTED ||
          b.status === BookingStatus.IN_PROGRESS),
    );
  }, [bookings]);

  const completedBookings = useMemo(
    () => bookings.filter((b) => b.status === BookingStatus.COMPLETED),
    [bookings],
  );

  const totalRevenue = useMemo(() => {
    return completedBookings.reduce(
      (sum, b) => sum + (b.providerService?.price || 0),
      0,
    );
  }, [completedBookings]);

  const activeServices = useMemo(
    () => services.filter((s) => s.isAvailable).length,
    [services],
  );

  const totalCustomers = useMemo(
    () => new Set(bookings.map((b) => b.userId)).size,
    [bookings],
  );

  useEffect(() => {
    const fetchAllReviews = async () => {
      if (services.length === 0) return;

      setIsLoadingReviews(true);
      try {
        const reviewPromises = services.map((service) =>
          reviewApi.getByService(service.id),
        );
        const reviewsArrays = await Promise.all(reviewPromises);
        setAllReviews(reviewsArrays.flat());
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setAllReviews([]);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchAllReviews();
  }, [services]);

  const averageRating = useMemo(() => {
    if (allReviews.length === 0) return 0;
    return allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
  }, [allReviews]);

  const completionRate = useMemo(() => {
    if (bookings.length === 0) return 0;
    return (completedBookings.length / bookings.length) * 100;
  }, [bookings.length, completedBookings.length]);

  if (bookingsLoading || servicesLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Welcome back, {user?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-slate-600 mt-1">
          Here&apos;s your business overview for today
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={
            <span className="text-emerald-600">${totalRevenue.toFixed(2)}</span>
          }
          subtitle="Completed bookings only"
          icon={DollarSign}
          accent="emerald"
        />
        <StatCard
          title="Total Bookings"
          value={bookings.length}
          subtitle="All time"
          icon={Calendar}
          accent="blue"
        />
        <StatCard
          title="Active Services"
          value={activeServices}
          subtitle={`${services.length} total listed`}
          icon={Package}
          accent="violet"
        />
        <StatCard
          title="Completed"
          value={completedBookings.length}
          subtitle={`Rate: ${completionRate.toFixed(0)}%`}
          icon={ClipboardCheck}
          accent="orange"
        />
      </div>

      {/* Pending Alert */}
      {pendingBookings.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-amber-700" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-amber-900">
                {pendingBookings.length} booking
                {pendingBookings.length > 1 ? "s" : ""} pending approval
              </p>
              <p className="text-sm text-amber-800/80">
                Review them to keep your schedule accurate.
              </p>
            </div>
            <Button
              size="sm"
              className="rounded-xl"
              onClick={() => router.push("/provider/bookings")}
            >
              Review
            </Button>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today Schedule */}
        <Card className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <SectionHeader
              title="Today's Schedule"
              action={
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl"
                  onClick={() => router.push("/provider/bookings")}
                >
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              }
            />
          </CardHeader>
          <CardContent>
            {todayBookings.length === 0 ? (
              <div className="text-center py-10 text-slate-500">
                <div className="mx-auto mb-3 h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <Clock className="h-7 w-7 text-slate-400" />
                </div>
                <p className="font-medium text-slate-700">No bookings today</p>
                <p className="text-sm mt-1">Your schedule is clear</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition"
                    onClick={() => router.push("/provider/bookings")}
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-slate-900 truncate">
                        {booking.providerService?.serviceTemplate?.title}
                      </h4>
                      <p className="text-sm text-slate-600 mt-1 truncate">
                        Customer:{" "}
                        <span className="font-medium">
                          {booking.user?.name}
                        </span>
                      </p>
                      <p className="text-sm text-slate-500">
                        Time:{" "}
                        <span className="font-medium">{booking.timeSlot}</span>
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <BookingStatusBadge status={booking.status} />
                      <p className="text-sm font-semibold text-emerald-600 mt-2">
                        ${booking.providerService?.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full justify-start rounded-xl"
              variant="outline"
              onClick={() => router.push("/provider/bookings")}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Manage Bookings
              {pendingBookings.length > 0 && (
                <span className="ml-auto bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {pendingBookings.length}
                </span>
              )}
            </Button>

            <Button
              className="w-full justify-start rounded-xl"
              variant="outline"
              onClick={() => router.push("/provider/services")}
            >
              <Package className="h-4 w-4 mr-2" />
              My Services
            </Button>

            <Button
              className="w-full justify-start rounded-xl"
              variant="outline"
              onClick={() => router.push("/provider/profile")}
            >
              <Users className="h-4 w-4 mr-2" />
              My Profile
            </Button>
          </CardContent>
        </Card>

        {/* Recent bookings */}
        <Card className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <SectionHeader
              title="Recent Bookings"
              action={
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl"
                  onClick={() => router.push("/provider/bookings")}
                >
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              }
            />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bookings.slice(0, 5).map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-slate-900 truncate">
                      {booking.providerService?.serviceTemplate?.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 truncate">
                      {booking.user?.name} •{" "}
                      {new Date(booking.date).toLocaleDateString()}
                    </p>
                  </div>
                  <BookingStatusBadge status={booking.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance */}
        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Completion */}
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Completion Rate</span>
                <span className="font-semibold text-slate-900">
                  {completionRate.toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2 rounded-full"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {completedBookings.length} completed bookings
              </p>
            </div>

            {/* Rating */}
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Avg. Rating</span>
                <span className="font-semibold flex items-center gap-1 text-slate-900">
                  {allReviews.length > 0 ? averageRating.toFixed(1) : "0.0"}
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {isLoadingReviews
                  ? "Loading reviews..."
                  : `Based on ${allReviews.length} reviews`}
              </p>
            </div>

            {/* Customers */}
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Total Customers</span>
                <span className="font-semibold text-slate-900">
                  {totalCustomers}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Unique customers who booked your services
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
