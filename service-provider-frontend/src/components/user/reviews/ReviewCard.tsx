import { Review } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Star, User } from "lucide-react";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
            <User className="h-5 w-5 text-slate-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold">{review.user?.name}</p>
              <p className="text-xs text-slate-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= review.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-slate-300"
                  }`}
                />
              ))}
              <span className="text-sm text-slate-600 ml-1">
                {review.rating}/5
              </span>
            </div>
            {review.comment && (
              <p className="text-sm text-slate-700">{review.comment}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
