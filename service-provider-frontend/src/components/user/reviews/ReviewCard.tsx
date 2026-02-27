import { Review } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Star, User } from "lucide-react";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const userName = review.user?.name ?? "Anonymous";

  return (
    <Card className="group overflow-hidden rounded-2xl border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:border-slate-800/60 dark:bg-slate-950/40">
      {/* subtle top accent */}
      <div className="h-1 w-full bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 opacity-70" />

      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 shadow-sm dark:bg-slate-900/40">
            <User className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          </div>

          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-slate-900 dark:text-white">
                {userName}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 transition ${
                    star <= review.rating
                      ? "fill-yellow-400 text-yellow-400 drop-shadow-sm"
                      : "text-slate-300 dark:text-slate-600"
                  }`}
                />
              ))}

              <span className="text-sm font-medium text-slate-600 ml-2 dark:text-slate-300">
                {review.rating}/5
              </span>
            </div>

            {/* Comment */}
            {review.comment && (
              <div className="mt-2 rounded-xl bg-slate-50/70 border border-slate-200/60 p-3 dark:bg-slate-900/30 dark:border-slate-800/60">
                <p className="text-sm text-slate-700 leading-relaxed dark:text-slate-300">
                  {review.comment}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
