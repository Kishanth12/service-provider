// ============================================
// FILE: app/provider/profile/page.tsx
// ============================================

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/hooks/useAuth";
import { useService } from "@/lib/hooks/useServices";
import { useBooking } from "@/lib/hooks/useBookings";
import {
  User,
  Mail,
  Calendar,
  Shield,
  Briefcase,
  Star,
  ClipboardList,
  CalendarCheck2,
  DollarSign,
  MessageSquareText,
  CheckCircle2,
  Timer,
  Activity,
} from "lucide-react";
import { useState, useEffect } from "react";
import { BookingStatus } from "@/types";
import { reviewApi } from "@/lib/api/endpoints/reviews";

export default function ProviderProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [allReviews, setAllReviews] = useState<any[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  const { useProviderServices } = useService();
  const { useAllBookings } = useBooking();

  const { data: servicesData } = useProviderServices();
  const { data: bookingsData } = useAllBookings();

  const services = Array.isArray(servicesData) ? servicesData : [];
  const bookings = Array.isArray(bookingsData) ? bookingsData : [];

  const completedBookings = bookings.filter(
    (b) => b.status === BookingStatus.COMPLETED,
  ).length;

  const totalRevenue = bookings
    .filter((b) => b.status === BookingStatus.COMPLETED)
    .reduce((sum, b) => sum + (b.providerService?.price || 0), 0);

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

  // Calculate review statistics
  const totalReviews = allReviews.length;
  const averageRating =
    totalReviews > 0
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

  if (!user) return null;

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="relative max-w-5xl mx-auto p-6">
      {/* Soft background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -right-28 h-72 w-72 rounded-full bg-sky-300/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-28 h-72 w-72 rounded-full bg-fuchsia-300/15 blur-3xl" />
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Provider Profile
        </h1>
        <p className="text-slate-600 mt-1">
          Manage your provider account and business information
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Information */}
        <Card className="overflow-hidden border border-slate-200/70 bg-white/80 backdrop-blur-xl shadow-sm">
          <CardHeader className="border-b border-slate-200/70">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-slate-700" />
              Personal Information
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            <div className="space-y-1.5">
              <Label>Full Name</Label>
              <Input value={user.name} disabled={!isEditing} className="mt-1" />
              {!isEditing && (
                <p className="text-xs text-slate-500">
                  Click “Edit Profile” to update your name.
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input value={user.email} disabled className="mt-1" />
              <p className="text-xs text-slate-500 mt-1">
                Email cannot be changed
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Account Details */}
        <Card className="overflow-hidden border border-slate-200/70 bg-white/80 backdrop-blur-xl shadow-sm">
          <CardHeader className="border-b border-slate-200/70">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-slate-700" />
              Account Details
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            <div className="flex items-start justify-between rounded-2xl border border-slate-200/70 bg-white p-4">
              <div>
                <Label className="flex items-center gap-2 text-slate-700">
                  <Shield className="h-4 w-4" />
                  Account Type
                </Label>
                <p className="mt-2 inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-800">
                  {user.role}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700">
                <Shield className="h-5 w-5" />
              </div>
            </div>

            <div className="flex items-start justify-between rounded-2xl border border-slate-200/70 bg-white p-4">
              <div>
                <Label className="text-slate-700">Member Since</Label>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {memberSince}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-700">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Stats */}
        <Card className="md:col-span-2 overflow-hidden border border-slate-200/70 bg-white/80 backdrop-blur-xl shadow-sm">
          <CardHeader className="border-b border-slate-200/70">
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-slate-700" />
              Business Statistics
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Active Services */}
              <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Active Services
                    </p>
                    <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
                      {services.length}
                    </p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-700">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Total Bookings */}
              <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Total Bookings
                    </p>
                    <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
                      {bookings.length}
                    </p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-700">
                    <Activity className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Completed */}
              <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Completed
                    </p>
                    <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
                      {completedBookings}
                    </p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700">
                    <CalendarCheck2 className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Revenue */}
              <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Total Revenue
                    </p>
                    <p className="mt-2 text-3xl font-extrabold tracking-tight text-emerald-700">
                      ${totalRevenue.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700">
                    <DollarSign className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="md:col-span-2 overflow-hidden border border-slate-200/70 bg-white/80 backdrop-blur-xl shadow-sm">
          <CardHeader className="border-b border-slate-200/70">
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-slate-700" />
              Performance Metrics
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Avg Rating */}
              <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Average Rating
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <p className="text-3xl font-extrabold tracking-tight text-slate-900">
                        {totalReviews > 0 ? averageRating.toFixed(1) : "0.0"}
                      </p>
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {isLoadingReviews
                        ? "Loading reviews..."
                        : `Based on ${totalReviews} reviews`}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-500/10 text-yellow-700">
                    <Star className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Total Reviews */}
              <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Total Reviews
                    </p>
                    <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
                      {totalReviews}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Customer feedback
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-700">
                    <MessageSquareText className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Completion Rate */}
              <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Completion Rate
                    </p>
                    <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
                      {bookings.length > 0
                        ? ((completedBookings / bookings.length) * 100).toFixed(
                            0,
                          )
                        : 0}
                      %
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Completed vs total
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Rating Breakdown */}
            {totalReviews > 0 && (
              <div className="mt-6 rounded-2xl border border-slate-200/70 bg-white p-5">
                <p className="text-sm font-semibold text-slate-800 mb-4">
                  Rating Breakdown
                </p>

                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = allReviews.filter(
                      (r) => r.rating === rating,
                    ).length;
                    const percentage = totalReviews
                      ? (count / totalReviews) * 100
                      : 0;

                    return (
                      <div key={rating} className="flex items-center gap-3">
                        <div className="w-16 text-xs text-slate-600 flex items-center gap-1">
                          <span className="font-medium">{rating}</span>
                          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        </div>

                        <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className="h-2 rounded-full bg-yellow-400 transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>

                        <div className="w-10 text-right text-xs text-slate-600">
                          {count}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="md:col-span-2 overflow-hidden border border-slate-200/70 bg-white/80 backdrop-blur-xl shadow-sm">
          <CardHeader className="border-b border-slate-200/70">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-slate-700" />
              Recent Activity
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-700">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Available Services
                    </p>
                    <p className="text-xs text-slate-500">
                      Services currently enabled
                    </p>
                  </div>
                </div>
                <p className="text-sm font-bold text-slate-900">
                  {services.filter((s) => s.isAvailable).length}{" "}
                  <span className="text-slate-400 font-medium">
                    / {services.length}
                  </span>
                </p>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-700">
                    <Timer className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Pending Bookings
                    </p>
                    <p className="text-xs text-slate-500">Needs your action</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-slate-900">
                  {
                    bookings.filter((b) => b.status === BookingStatus.PENDING)
                      .length
                  }
                </p>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-700">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Active Bookings
                    </p>
                    <p className="text-xs text-slate-500">
                      Accepted / In progress
                    </p>
                  </div>
                </div>
                <p className="text-sm font-bold text-slate-900">
                  {
                    bookings.filter(
                      (b) =>
                        b.status === BookingStatus.ACCEPTED ||
                        b.status === BookingStatus.IN_PROGRESS,
                    ).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-3">
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        ) : (
          <>
            <Button onClick={() => setIsEditing(false)}>Save Changes</Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
