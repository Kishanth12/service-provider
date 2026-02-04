import { apiClient } from "../client";
import { Booking, BookingStatus } from "@/types";

export interface CreateBookingDto {
  providerServiceId: string;
  date: string; // ISO date string
  timeSlot: string; // e.g., "09:00-10:00"
}

export interface UpdateBookingStatusDto {
  status: BookingStatus;
}

export const bookingApi = {
  // Create booking (User)
  create: async (data: CreateBookingDto): Promise<Booking> => {
    const response = await apiClient.post("/bookings", data);
    return response.data.data;
  },

  // Get user's bookings (User)
  getMyBookings: async (): Promise<Booking[]> => {
    const response = await apiClient.get("/bookings/my");
    return response.data.data;
  },

  // Cancel booking (User)
  cancel: async (id: string): Promise<Booking> => {
    const response = await apiClient.patch(`/bookings/${id}/cancel`);
    return response.data.data;
  },



  // Update booking status (Provider)
  updateStatus: async (
    id: string,
    data: UpdateBookingStatusDto
  ): Promise<Booking> => {
    const response = await apiClient.patch(`/bookings/${id}/status`, data);
    return response.data.data;
  },

  // Get all bookings (Admin)
  getAll: async (): Promise<Booking[]> => {
    const response = await apiClient.get("/bookings");
    return response.data.data;
  },
};
