"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  bookingApi,
  CreateBookingDto,
  UpdateBookingStatusDto,
} from "@/lib/api/endpoints/bookings";
import { toast } from "react-toastify";

export const useBooking = () => {
  const queryClient = useQueryClient();

  // ==================== USER BOOKINGS ====================

  // Get user's bookings
  const useMyBookings = () => {
    return useQuery({
      queryKey: ["myBookings"],
      queryFn: () => bookingApi.getMyBookings(),
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  };

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: (data: CreateBookingDto) => bookingApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
      toast.success("Booking created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create booking");
    },
  });

  // Cancel booking mutation
  const cancelBookingMutation = useMutation({
    mutationFn: (id: string) => bookingApi.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
      toast.success("Booking cancelled successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    },
  });

  // ==================== PROVIDER BOOKINGS ====================



  // Update booking status mutation
  const updateBookingStatusMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBookingStatusDto }) =>
      bookingApi.updateStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providerBookings"] });
      toast.success("Booking status updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update booking status"
      );
    },
  });

  // ==================== ADMIN BOOKINGS ====================

  // Get all bookings (Admin)
  const useAllBookings = () => {
    return useQuery({
      queryKey: ["allBookings"],
      queryFn: () => bookingApi.getAll(),
      staleTime: 2 * 60 * 1000,
    });
  };

  return {
    // User
    useMyBookings,
    createBooking: createBookingMutation.mutate,
    cancelBooking: cancelBookingMutation.mutate,
    isCreatingBooking: createBookingMutation.isPending,
    isCancellingBooking: cancelBookingMutation.isPending,

    // Provider
    updateBookingStatus: updateBookingStatusMutation.mutate,
    isUpdatingStatus: updateBookingStatusMutation.isPending,

    // Admin
    useAllBookings,
  };
};
