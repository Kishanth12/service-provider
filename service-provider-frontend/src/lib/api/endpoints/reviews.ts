import { apiClient } from "../client";
import { Review } from "@/types";

export interface CreateReviewDto {
  bookingId: string;
  rating: number; // 1-5
  comment?: string;
}

export const reviewApi = {
  // Create review (User after completed booking)
  create: async (data: CreateReviewDto): Promise<Review> => {
    const response = await apiClient.post("/reviews", data);
    return response.data.data;
  },

  // Get reviews for a specific provider service
  getByService: async (providerServiceId: string): Promise<Review[]> => {
    const response = await apiClient.get(
      `/reviews/service/${providerServiceId}`
    );
    return response.data.data;
  },
};
