"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useService } from "@/lib/hooks/useServices";
import { useBooking } from "@/lib/hooks/useBookings";
import { useReview } from "@/lib/hooks/useReviews";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingModal } from "@/components/user/bookings/BookingModal";
import { ReviewCard } from "@/components/user/reviews/ReviewCard";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";
import {
  ArrowLeft,
  Star,
  DollarSign,
  User,
  Calendar,
  Clock,
  Mail,
} from "lucide-react";

function Stars({ value }: { value: number }) {
  const rounded = Math.round(value);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`h-4 w-4 ${
            s <= rounded ? "fill-yellow-400 text-yellow-400" : "text-slate-300"
          }`}
        />
      ))}
    </div>
  );
}

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id as string;

  const [showBookingModal, setShowBookingModal] = useState(false);

  const { useProviderServiceById } = useService();
  const { createBooking, isCreatingBooking } = useBooking();
  const { useServiceReviews } = useReview();

  const {
    data: service,
    isLoading,
    error,
    refetch,
  } = useProviderServiceById(serviceId);

  const { data: reviews = [], isLoading: reviewsLoading } =
    useServiceReviews(serviceId);

  const averageRating = useMemo(() => {
    return reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
  }, [reviews]);

  const ratingCount = reviews.length;

  const distribution = useMemo(() => {
    const map = new Map<number, number>();
    [1, 2, 3, 4, 5].forEach((r) => map.set(r, 0));
    reviews.forEach((r) => map.set(r.rating, (map.get(r.rating) || 0) + 1));
    return map;
  }, [reviews]);

  const handleBookingSubmit = (data: { date: string; timeSlot: string }) => {
    createBooking(
      {
        providerServiceId: serviceId,
        date: data.date,
        timeSlot: data.timeSlot,
      },
      {
        onSuccess: () => {
          setShowBookingModal(false);
          router.push("/user/bookings");
        },
      },
    );
  };

  if (isLoading) return <LoadingSpinner />;

  if (error || !service) {
    return (
      <ErrorState message="Failed to load service details" onRetry={refetch} />
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="px-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Title block */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">
          {service.serviceTemplate?.title}
        </h1>
        <p className="text-slate-600">{service.serviceTemplate?.description}</p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <div className="flex items-center gap-2">
            <Stars value={averageRating} />
            <span className="text-sm font-semibold text-slate-900">
              {averageRating.toFixed(1)}
            </span>
          </div>
          <span className="text-sm text-slate-500">
            {ratingCount} {ratingCount === 1 ? "review" : "reviews"}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">About</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-700 leading-relaxed">
              {service.serviceTemplate?.description}
            </CardContent>
          </Card>

          {/* Provider */}
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-5 w-5 text-slate-700" />
                Provider
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs text-slate-500">Name</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {service.provider?.user?.name}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs text-slate-500 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </p>
                <p className="mt-1 text-slate-700">
                  {service.provider?.user?.email}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              {reviewsLoading ? (
                <div className="py-10">
                  <LoadingSpinner />
                </div>
              ) : ratingCount === 0 ? (
                <div className="py-12 text-center text-slate-500">
                  <Star className="h-10 w-10 mx-auto mb-3 text-slate-300" />
                  <p className="font-medium text-slate-700">No reviews yet</p>
                  <p className="text-sm">Be the first to review this service</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Summary */}
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-slate-600">Average rating</p>
                        <div className="mt-1 flex items-center gap-2">
                          <p className="text-3xl font-bold text-slate-900">
                            {averageRating.toFixed(1)}
                          </p>
                          <Stars value={averageRating} />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Based on {ratingCount} reviews
                        </p>
                      </div>

                      <div className="w-full sm:max-w-sm space-y-2">
                        {[5, 4, 3, 2, 1].map((r) => {
                          const count = distribution.get(r) || 0;
                          const pct = ratingCount
                            ? (count / ratingCount) * 100
                            : 0;

                          return (
                            <div
                              key={r}
                              className="flex items-center gap-3 text-sm"
                            >
                              <span className="w-12 text-slate-600">{r}★</span>
                              <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                                <div
                                  className="h-2 bg-yellow-400 rounded-full"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="w-8 text-right text-slate-500">
                                {count}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* List */}
                  <div className="space-y-3">
                    {reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right (Booking) */}
        <div className="lg:col-span-1">
          <Card className="border-slate-200 lg:sticky lg:top-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Book this service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Price */}
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs text-slate-500">Price</p>
                <div className="mt-2 flex items-end gap-2">
                  <DollarSign className="h-5 w-5 text-slate-700" />
                  <p className="text-3xl font-bold text-slate-900">
                    {service.price.toFixed(2)}
                  </p>
                  <span className="text-sm text-slate-500 mb-1">
                    per service
                  </span>
                </div>
              </div>

              {/* Small info */}
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Flexible scheduling
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Quick response time
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  {averageRating.toFixed(1)} rating
                </div>
              </div>

              <Button
                className="w-full h-11"
                onClick={() => setShowBookingModal(true)}
              >
                Book Now
              </Button>

              <p className="text-xs text-center text-slate-500">
                You won’t be charged yet
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        service={service}
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onSubmit={handleBookingSubmit}
        isSubmitting={isCreatingBooking}
      />
    </div>
  );
}
