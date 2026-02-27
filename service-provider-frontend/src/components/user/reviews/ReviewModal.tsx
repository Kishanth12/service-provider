"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, X, Sparkles, User2 } from "lucide-react";
import { Booking } from "@/types";

interface ReviewModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { rating: number; comment: string }) => void;
  isSubmitting: boolean;
}

export function ReviewModal({
  booking,
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<{ rating?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { rating?: string } = {};
    if (rating === 0) newErrors.rating = "Please select a rating";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    onSubmit({ rating, comment });
  };

  const handleClose = () => {
    setRating(0);
    setHoveredRating(0);
    setComment("");
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const serviceTitle =
    booking.providerService?.serviceTemplate?.title ?? "Service";
  const providerName =
    booking.providerService?.provider?.user?.name ?? "Unknown Provider";

  const activeValue = hoveredRating || rating;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200/70 bg-white/90 backdrop-blur-xl shadow-2xl dark:border-slate-800/60 dark:bg-slate-950/90"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient Top Line */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 opacity-80" />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-6 border-b border-slate-200/70 dark:border-slate-800/60">
          <div className="min-w-0">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Write a Review
            </h2>
            <p className="text-sm text-slate-600 mt-1 truncate dark:text-slate-300">
              {serviceTitle}
            </p>

            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300">
              <Sparkles className="h-3.5 w-3.5" />
              Share your experience
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-9 w-9 rounded-xl p-0 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Service Info */}
          <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-slate-950/40">
                  <User2 className="h-4 w-4 text-slate-500 dark:text-slate-300" />
                </span>
                <span>Provider</span>
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">
                {providerName}
              </span>
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label className="text-slate-700 dark:text-slate-200">
              Your Rating <span className="text-red-500">*</span>
            </Label>

            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isActive = star <= activeValue;

                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    disabled={isSubmitting}
                    className="rounded-xl p-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 disabled:opacity-60"
                    aria-label={`${star} star`}
                  >
                    <Star
                      className={`h-8 w-8 transition-all ${
                        isActive
                          ? "fill-yellow-400 text-yellow-400 drop-shadow-sm"
                          : "text-slate-300 dark:text-slate-600"
                      }`}
                    />
                  </button>
                );
              })}

              {rating > 0 && (
                <span className="ml-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 rounded-full border border-slate-200 bg-white/70 px-3 py-1 backdrop-blur dark:border-slate-800 dark:bg-slate-950/40">
                  {rating} out of 5
                </span>
              )}
            </div>

            {errors.rating && (
              <p className="text-sm text-red-500">{errors.rating}</p>
            )}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label
              htmlFor="comment"
              className="text-slate-700 dark:text-slate-200"
            >
              Your Review (Optional)
            </Label>

            <Textarea
              id="comment"
              placeholder="Share your experience with this service..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isSubmitting}
              rows={4}
              className="rounded-xl border-slate-200 bg-white shadow-sm transition focus-visible:ring-2 focus-visible:ring-slate-300 dark:border-slate-800 dark:bg-slate-950/30 dark:focus-visible:ring-slate-700"
            />

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Help others by sharing honest feedback</span>
              <span className="tabular-nums">{comment.length}/500</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-slate-200/70 dark:border-slate-800/60">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1 h-11 rounded-xl border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950/30 dark:hover:bg-slate-900/40"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 h-11 rounded-xl shadow-sm transition hover:shadow-md"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </div>
    </div>
  );
}
