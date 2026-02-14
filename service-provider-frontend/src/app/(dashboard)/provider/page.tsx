// ============================================
// FILE: app/provider/dashboard/page.tsx
// ============================================

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
  TrendingUp,
  Clock,
  ChevronRight,
  DollarSign,
  Users,
  AlertCircle,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { BookingStatus } from "@/types";
import { BookingStatusBadge } from "@/components/user/bookings/BookingStatusBadge";
import { useState, useEffect } from "react";
import { reviewApi } from "@/lib/api/endpoints/reviews";

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

  const pendingBookings = bookings.filter(
    (b) => b.status === BookingStatus.PENDING,
  );

  const todayBookings = bookings.filter(
    (b) =>
      new Date(b.date).toDateString() === new Date().toDateString() &&
      (b.status === BookingStatus.ACCEPTED ||
        b.status === BookingStatus.IN_PROGRESS),
  );

  const completedBookings = bookings.filter(
    (b) => b.status === BookingStatus.COMPLETED,
  );

  const totalRevenue = completedBookings.reduce(
    (sum, b) => sum + (b.providerService?.price || 0),
    0,
  );

  const activeServices = services.filter((s) => s.isAvailable).length;

  // Fetch all reviews for provider's services
  useEffect(() => {
    const fetchAllReviews = async () => {
      if (services.length === 0) return;

      setIsLoadingReviews(true);
      try {
        const reviewPromises = services.map((service) =>
          reviewApi.getByService(service.id),
        );
        const reviewsArrays = await Promise.all(reviewPromises);
        const flattenedReviews = reviewsArrays.flat();
        setAllReviews(flattenedReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setAllReviews([]);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchAllReviews();
  }, [services]);

  // Calculate average rating
  const averageRating =
    allReviews.length > 0
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      : 0;

  if (bookingsLoading || servicesLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-slate-600 mt-1">
          Here's your business overview for today
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Revenue</p>
                <p className="text-3xl font-bold mt-2 text-green-600">
                  ${totalRevenue.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-500 bg-opacity-10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Bookings</p>
                <p className="text-3xl font-bold mt-2">{bookings.length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-500 bg-opacity-10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Active Services</p>
                <p className="text-3xl font-bold mt-2">{activeServices}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-500 bg-opacity-10 flex items-center justify-center">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Completed</p>
                <p className="text-3xl font-bold mt-2">
                  {completedBookings.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-orange-500 bg-opacity-10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Bookings Alert */}
      {pendingBookings.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div className="flex-1">
                <p className="font-medium text-yellow-800">
                  You have {pendingBookings.length} pending booking
                  {pendingBookings.length > 1 ? "s" : ""} awaiting your response
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => router.push("/provider/bookings")}
              >
                Review Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Today's Schedule</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/provider/bookings")}
              >
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {todayBookings.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Clock className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p className="font-medium">No bookings today</p>
                <p className="text-sm mt-1">Your schedule is clear for today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-slate-50 cursor-pointer"
                    onClick={() => router.push("/provider/bookings")}
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold">
                        {booking.providerService?.serviceTemplate?.title}
                      </h4>
                      <p className="text-sm text-slate-600 mt-1">
                        Customer: {booking.user?.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        Time: {booking.timeSlot}
                      </p>
                    </div>
                    <div className="text-right">
                      <BookingStatusBadge status={booking.status} />
                      <p className="text-sm font-semibold text-green-600 mt-2">
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
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => router.push("/provider/bookings")}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Manage Bookings
              {pendingBookings.length > 0 && (
                <span className="ml-auto bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {pendingBookings.length}
                </span>
              )}
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => router.push("/provider/services")}
            >
              <Package className="h-4 w-4 mr-2" />
              My Services
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => router.push("/provider/profile")}
            >
              <Users className="h-4 w-4 mr-2" />
              My Profile
            </Button>
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Bookings</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/provider/bookings")}
              >
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bookings.slice(0, 5).map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {booking.providerService?.serviceTemplate?.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
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

        {/* Performance Metrics - UPDATED WITH REAL REVIEW DATA */}
        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Completion Rate</span>
                <span className="font-semibold">
                  {bookings.length > 0
                    ? (
                        (completedBookings.length / bookings.length) *
                        100
                      ).toFixed(0)
                    : 0}
                  %
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${
                      bookings.length > 0
                        ? (completedBookings.length / bookings.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Avg. Rating</span>
                <span className="font-semibold flex items-center gap-1">
                  {allReviews.length > 0 ? averageRating.toFixed(1) : "0.0"}
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Based on {allReviews.length} reviews
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Total Customers</span>
                <span className="font-semibold">
                  {new Set(bookings.map((b) => b.userId)).size}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
