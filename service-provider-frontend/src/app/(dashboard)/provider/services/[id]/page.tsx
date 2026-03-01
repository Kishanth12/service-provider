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
  Layers,
  ClipboardList,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import { AvailabilityToggle } from "@/components/providers/services/AvailabilityToggle";
import { ReviewCard } from "@/components/user/reviews/ReviewCard";
import { RatingSummary } from "@/components/user/reviews/RatingSummary";
import { useMemo, useState } from "react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";
import { DeleteConfirmModal } from "@/components/shared/DeleteConfirmModal";
import { BookingStatus } from "@/types";
import { cn } from "@/lib/utils/cn";

function StatCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  tone: "blue" | "emerald" | "amber" | "slate";
}) {
  const tones = {
    blue: {
      top: "from-sky-500 via-indigo-500 to-violet-500",
      iconWrap: "bg-sky-500/10 text-sky-700 ring-sky-200/70",
    },
    emerald: {
      top: "from-emerald-500 via-green-500 to-teal-500",
      iconWrap: "bg-emerald-500/10 text-emerald-700 ring-emerald-200/70",
    },
    amber: {
      top: "from-amber-500 via-yellow-500 to-orange-500",
      iconWrap: "bg-amber-500/10 text-amber-700 ring-amber-200/70",
    },
    slate: {
      top: "from-slate-700 via-slate-600 to-slate-500",
      iconWrap: "bg-slate-900/5 text-slate-700 ring-slate-200/70",
    },
  } as const;

  const t = tones[tone];

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 backdrop-blur-xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
      <div
        className={cn("absolute inset-x-0 top-0 h-1 bg-gradient-to-r", t.top)}
      />
      <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-slate-900/5 blur-2xl" />
      <div className="pointer-events-none absolute -left-14 -bottom-14 h-36 w-36 rounded-full bg-slate-900/5 blur-2xl" />

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-600">{label}</p>
          <p className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
            {value}
          </p>
        </div>

        <div
          className={cn(
            "shrink-0 rounded-2xl p-3 shadow-sm ring-1 transition-transform duration-300 group-hover:scale-105",
            t.iconWrap,
          )}
          aria-hidden="true"
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white/60 p-4">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <div className="mt-1 text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}

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

  const serviceBookings = useMemo(
    () => bookings.filter((b) => b.providerServiceId === serviceId),
    [bookings, serviceId],
  );

  const completedBookings = useMemo(
    () =>
      serviceBookings.filter((b) => b.status === BookingStatus.COMPLETED)
        .length,
    [serviceBookings],
  );

  const avgRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  }, [reviews]);

  const daysActive = useMemo(() => {
    if (!service?.createdAt) return 0;
    return Math.floor(
      (Date.now() - new Date(service.createdAt).getTime()) /
        (1000 * 60 * 60 * 24),
    );
  }, [service?.createdAt]);

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

  if (isLoading) return <LoadingSpinner />;

  if (error || !service) {
    return (
      <ErrorState message="Failed to load service details" onRetry={refetch} />
    );
  }

  return (
    <div className="relative max-w-5xl mx-auto p-6">
      {/* soft background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-28 -right-24 h-72 w-72 rounded-full bg-sky-300/20 blur-3xl" />
        <div className="absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-fuchsia-300/15 blur-3xl" />
      </div>

      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 rounded-xl border border-transparent hover:border-slate-200 hover:bg-white/60"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Services
        </Button>

        <div className="rounded-3xl border border-slate-200/70 bg-white/80 backdrop-blur-xl shadow-sm overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 opacity-70" />

          <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-slate-900/5 flex items-center justify-center">
                  <Layers className="h-6 w-6 text-slate-900" />
                </div>

                <div className="min-w-0">
                  <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                    {service.serviceTemplate?.title}
                  </h1>
                  <p className="text-slate-600 mt-1">Service Details</p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
                        service.isAvailable
                          ? "border-emerald-200/70 bg-emerald-50/70 text-emerald-700"
                          : "border-rose-200/70 bg-rose-50/70 text-rose-700",
                      )}
                    >
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full",
                          service.isAvailable
                            ? "bg-emerald-500"
                            : "bg-rose-500",
                        )}
                      />
                      {service.isAvailable ? "Available" : "Unavailable"}
                    </span>

                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600">
                      <Clock3 className="h-4 w-4" />
                      Active for{" "}
                      <span className="font-semibold">{daysActive}</span> days
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleEdit}
                className="rounded-xl"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteModal(true)}
                className="rounded-xl"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats (upgraded + professional) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Bookings"
          value={serviceBookings.length}
          tone="blue"
          icon={<ClipboardList className="h-5 w-5" />}
        />
        <StatCard
          label="Completed"
          value={completedBookings}
          tone="emerald"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <StatCard
          label="Reviews"
          value={reviews.length}
          tone="amber"
          icon={<MessageSquare className="h-5 w-5" />}
        />
        <StatCard
          label="Avg Rating"
          value={
            reviews.length === 0 ? (
              <span className="text-slate-400">—</span>
            ) : (
              <span className="inline-flex items-center gap-2">
                {avgRating.toFixed(1)}
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              </span>
            )
          }
          tone="amber"
          icon={<Star className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Service Information */}
        <Card className="rounded-3xl border border-slate-200/70 bg-white/80 backdrop-blur-xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <FileText className="h-5 w-5" />
              Service Information
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <InfoRow
              label="Service Type"
              value={service.serviceTemplate?.title ?? "—"}
            />
            <div className="rounded-2xl border border-slate-200/60 bg-white/60 p-4">
              <p className="text-xs font-medium text-slate-500">Description</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-700">
                {service.serviceTemplate?.description ?? "—"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/60 bg-white/60 p-4">
              <p className="text-xs font-medium text-slate-500 mb-2">
                Availability
              </p>
              <AvailabilityToggle isAvailable={service.isAvailable} />
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card className="rounded-3xl border border-slate-200/70 bg-white/80 backdrop-blur-xl shadow-sm overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 opacity-60" />
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <DollarSign className="h-5 w-5" />
              Pricing
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-slate-200/60 bg-white/60 p-5 text-center">
              <p className="text-xs font-medium text-slate-500">
                Service Price
              </p>
              <p className="mt-2 text-4xl font-extrabold tracking-tight text-emerald-600">
                ${service.price.toFixed(2)}
              </p>
              <p className="mt-1 text-xs text-slate-500">Per booking</p>
            </div>

            <p className="text-sm text-slate-500">
              This is the price customers will see when booking your service.
            </p>
          </CardContent>
        </Card>

        {/* Service Details */}
        <Card className="md:col-span-2 rounded-3xl border border-slate-200/70 bg-white/80 backdrop-blur-xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Calendar className="h-5 w-5" />
              Service Details
            </CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoRow
              label="Added On"
              value={new Date(service.createdAt).toLocaleString("en-US", {
                dateStyle: "long",
                timeStyle: "short",
              })}
            />
            <div className="rounded-2xl border border-slate-200/60 bg-white/60 p-4">
              <p className="text-xs font-medium text-slate-500">Status</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {service.isAvailable
                  ? "Visible to customers"
                  : "Hidden from customers"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {service.isAvailable
                  ? "Customers can book this service right now."
                  : "Customers cannot book while this service is unavailable."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Rating Summary */}
        {reviews.length > 0 && (
          <div className="md:col-span-2">
            <RatingSummary reviews={reviews} />
          </div>
        )}

        {/* Customer Reviews */}
        <Card className="md:col-span-2 rounded-3xl border border-slate-200/70 bg-white/80 backdrop-blur-xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-slate-900">
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
              <div className="text-center py-10 text-slate-500">
                <Star className="h-12 w-12 mx-auto mb-2 text-slate-300" />
                <p className="font-medium">No reviews yet</p>
                <p className="text-sm">
                  Reviews will appear here after customers complete their
                  bookings.
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
