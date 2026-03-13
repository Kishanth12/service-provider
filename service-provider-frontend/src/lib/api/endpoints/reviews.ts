import { apiClient } from "../client";
import { Review } from "@/types";

export interface CreateReviewDto {
  bookingId: string;
  rating: number;
  comment?: string;
}

export const reviewApi = {
  create: async (data: CreateReviewDto): Promise<Review> => {
    try {
      const response = await apiClient.post("/reviews", data);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.response?.message) {
        const msg = error.response.data.response.message;
        throw new Error(typeof msg === 'string' ? msg : msg[0]);
      }
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }

      throw new Error("Something went wrong while submitting review.");
    }
  },
  getByService: async (providerServiceId: string): Promise<Review[]> => {
    const response = await apiClient.get(
      `/reviews/service/${providerServiceId}`,
    );
    return response.data.data;
  },
};
