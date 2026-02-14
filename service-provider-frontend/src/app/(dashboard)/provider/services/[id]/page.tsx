// ============================================
// FILE: app/provider/services/[id]/page.tsx
// ============================================

"use client";

import { useParams, useRouter } from "next/navigation";
import { useService } from "@/lib/hooks/useServices";
import { useReview } from "@/lib/hooks/useReviews";
import { useBooking } from "@/lib/hooks/useBookings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Edit,
  Trash2,
  FileText,
  DollarSign,
  Calendar,
  Star,
  MessageSquare,
} from "lucide-react";
import { AvailabilityToggle } from "@/components/providers/services/AvailabilityToggle";
import { ReviewCard } from "@/components/user/reviews/ReviewCard";
import { RatingSummary } from "@/components/user/reviews/RatingSummary";
import { useState } from "react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";
import { DeleteConfirmModal } from "@/components/shared/DeleteConfirmModal";
import { BookingStatus } from "@/types";

export default function ProviderServiceViewPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id as string;

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { useProviderServiceById, deleteProviderService, isDeletingService } =
    useService();
  const { useServiceReviews } = useReview();
  const { useAllBookings } = useBooking();

  const {
    data: service,
    isLoading,
    error,
    refetch,
  } = useProviderServiceById(serviceId);

  const { data: reviewsData, isLoading: reviewsLoading } =
    useServiceReviews(serviceId);
  const { data: bookingsData } = useAllBookings();

  const reviews = Array.isArray(reviewsData) ? reviewsData : [];
  const bookings = Array.isArray(bookingsData) ? bookingsData : [];

  // Filter bookings for this specific service
  const serviceBookings = bookings.filter(
    (b) => b.providerServiceId === serviceId,
  );
  const completedBookings = serviceBookings.filter(
    (b) => b.status === BookingStatus.COMPLETED,
  ).length;

  const handleEdit = () => {
    router.push(`/provider/services/${serviceId}/edit`);
  };

  const handleDelete = () => {
    deleteProviderService(serviceId, {
      onSuccess: () => {
        router.push("/provider/services");
      },
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !service) {
    return (
      <ErrorState message="Failed to load service details" onRetry={refetch} />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Services
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {service.serviceTemplate?.title}
            </h1>
            <p className="text-slate-600 mt-1">Service Details</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Service Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Service Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-slate-600 mb-1">Service Type</p>
              <p className="font-medium">{service.serviceTemplate?.title}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Description</p>
              <p className="text-slate-700">
                {service.serviceTemplate?.description}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Availability</p>
              <AvailabilityToggle isAvailable={service.isAvailable} />
            </div>
          </CardContent>
        </Card>

        {/* Pricing Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Pricing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-slate-600 mb-1">Service Price</p>
              <p className="text-4xl font-bold text-blue-600">
                ${service.price.toFixed(2)}
              </p>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-slate-500">
                This is the price customers will see when booking your service
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Service Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Service Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600 mb-1">Added On</p>
                <p className="font-medium">
                  {new Date(service.createdAt).toLocaleString("en-US", {
                    dateStyle: "long",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Information */}
        <Card className="md:col-span-2 bg-slate-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  service.isAvailable ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <div>
                <p className="font-medium">
                  {service.isAvailable
                    ? "Service is Available"
                    : "Service is Unavailable"}
                </p>
                <p className="text-sm text-slate-600">
                  {service.isAvailable
                    ? "Customers can currently book this service"
                    : "This service is hidden from customers and cannot be booked"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Summary */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Activity Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{serviceBookings.length}</p>
                <p className="text-sm text-slate-600">Total Bookings</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{reviews.length}</p>
                <p className="text-sm text-slate-600">Reviews</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {Math.floor(
                    (Date.now() - new Date(service.createdAt).getTime()) /
                      (1000 * 60 * 60 * 24),
                  )}
                </p>
                <p className="text-sm text-slate-600">Days Active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rating Summary */}
        {reviews.length > 0 && (
          <div className="md:col-span-2">
            <RatingSummary reviews={reviews} />
          </div>
        )}

        {/* Customer Reviews Section */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Customer Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reviewsLoading ? (
              <div className="text-center py-8">
                <LoadingSpinner />
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Star className="h-12 w-12 mx-auto mb-2 text-slate-300" />
                <p className="font-medium">No reviews yet</p>
                <p className="text-sm">
                  Reviews will appear here after customers complete their
                  bookings
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isDeleting={isDeletingService}
        title="Delete Service"
        itemName={service.serviceTemplate?.title}
        description="Are you sure you want to delete this service? This action cannot be undone. Any existing bookings will remain active."
      />
    </div>
  );
}
