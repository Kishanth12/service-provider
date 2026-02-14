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
import { User, Mail, Calendar, Shield, Briefcase, Star } from "lucide-react";
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Provider Profile</h1>
        <p className="text-slate-600 mt-1">
          Manage your provider account and business information
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input value={user.name} disabled={!isEditing} className="mt-1" />
            </div>
            <div>
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Account Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Account Type
              </Label>
              <div className="mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                  {user.role}
                </span>
              </div>
            </div>
            <div>
              <Label>Member Since</Label>
              <p className="text-slate-700 mt-1">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Business Stats */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Business Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{services.length}</p>
                <p className="text-sm text-slate-600">Active Services</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{bookings.length}</p>
                <p className="text-sm text-slate-600">Total Bookings</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{completedBookings}</p>
                <p className="text-sm text-slate-600">Completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  ${totalRevenue.toFixed(2)}
                </p>
                <p className="text-sm text-slate-600">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics - UPDATED WITH REAL REVIEW DATA */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <p className="text-2xl font-bold">
                    {totalReviews > 0 ? averageRating.toFixed(1) : "0.0"}
                  </p>
                  {totalReviews > 0 && (
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  )}
                </div>
                <p className="text-sm text-slate-600">Average Rating</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{totalReviews}</p>
                <p className="text-sm text-slate-600">Total Reviews</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {bookings.length > 0
                    ? ((completedBookings / bookings.length) * 100).toFixed(0)
                    : 0}
                  %
                </p>
                <p className="text-sm text-slate-600">Completion Rate</p>
              </div>
            </div>

            {/* Rating Breakdown */}
            {totalReviews > 0 && (
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm font-medium text-slate-700 mb-3">
                  Rating Breakdown
                </p>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = allReviews.filter(
                      (r) => r.rating === rating,
                    ).length;
                    const percentage =
                      totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                    return (
                      <div key={rating} className="flex items-center gap-2">
                        <span className="text-xs w-12 text-slate-600">
                          {rating} star
                        </span>
                        <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-yellow-400 h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-600 w-8 text-right">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        <Card className="md:col-span-2 bg-slate-50">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">
                  Available Services
                </span>
                <span className="font-medium">
                  {services.filter((s) => s.isAvailable).length} of{" "}
                  {services.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Pending Bookings</span>
                <span className="font-medium">
                  {
                    bookings.filter((b) => b.status === BookingStatus.PENDING)
                      .length
                  }
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Active Bookings</span>
                <span className="font-medium">
                  {
                    bookings.filter(
                      (b) =>
                        b.status === BookingStatus.ACCEPTED ||
                        b.status === BookingStatus.IN_PROGRESS,
                    ).length
                  }
                </span>
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
