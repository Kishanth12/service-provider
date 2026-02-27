"use client";

import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

interface RatingSummaryProps {
  reviews: Review[];
}

export function RatingSummary({ reviews }: RatingSummaryProps) {
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((r) => r.rating === rating).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { rating, count, percentage };
  });

  if (reviews.length === 0) {
    return (
      <Card className="rounded-2xl border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm dark:border-slate-800/60 dark:bg-slate-950/40">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
            Rating Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10">
            <div className="flex h-14 w-14 items-center justify-center mx-auto rounded-2xl bg-slate-100 dark:bg-slate-900/40">
              <Star className="h-7 w-7 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="mt-4 font-semibold text-slate-700 dark:text-slate-200">
              No reviews yet
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Be the first to review this service
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm transition-all duration-300 hover:shadow-xl dark:border-slate-800/60 dark:bg-slate-950/40">
      {/* Gradient top line */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 opacity-80" />

      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
          Rating Summary
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Average Rating */}
          <div className="text-center">
            <p className="text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {averageRating.toFixed(1)}
            </p>

            <div className="flex items-center justify-center gap-1 mt-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 transition ${
                    star <= Math.round(averageRating)
                      ? "fill-yellow-400 text-yellow-400 drop-shadow-sm"
                      : "text-slate-300 dark:text-slate-600"
                  }`}
                />
              ))}
            </div>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Based on {reviews.length}{" "}
              {reviews.length === 1 ? "review" : "reviews"}
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-3">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-sm font-medium w-12 text-slate-700 dark:text-slate-300">
                  {rating}★
                </span>

                <div className="flex-1 h-2.5 bg-slate-200/80 dark:bg-slate-800/60 rounded-full overflow-hidden">
                  <div
                    className="h-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <span className="text-sm text-slate-600 dark:text-slate-400 w-8 text-right">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
