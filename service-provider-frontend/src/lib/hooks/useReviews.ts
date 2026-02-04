"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewApi, CreateReviewDto } from "@/lib/api/endpoints/reviews";
import { toast } from "react-toastify";

export const useReview = () => {
  const queryClient = useQueryClient();

  // Get reviews for a service
  const useServiceReviews = (providerServiceId: string) => {
    return useQuery({
      queryKey: ["serviceReviews", providerServiceId],
      queryFn: () => reviewApi.getByService(providerServiceId),
      enabled: !!providerServiceId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1, // Only retry once on failure
    });
  };

  // Create review mutation
  const createReviewMutation = useMutation({
    mutationFn: (data: CreateReviewDto) => reviewApi.create(data),
    onSuccess: (data, variables) => {
      // Invalidate all review queries
      queryClient.invalidateQueries({ queryKey: ["serviceReviews"] });
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Review submitted successfully!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to submit review";
      toast.error(message);
      console.error("Review submission error:", error);
    },
  });

  return {
    useServiceReviews,
    createReview: createReviewMutation.mutate,
    isCreatingReview: createReviewMutation.isPending,
  };
};
