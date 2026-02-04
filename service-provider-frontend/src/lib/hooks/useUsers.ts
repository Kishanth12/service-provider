"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi, UpdateUserDto } from "@/lib/api/endpoints/users";
import { Role, User } from "@/types";
import { toast } from "react-toastify";

export const useUser = () => {
  const queryClient = useQueryClient();

  // Get all users
  const useUsers = (role?: Role) => {
    return useQuery({
      queryKey: ["users", role],
      queryFn: () => userApi.getAll(role),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) =>
      userApi.update(id, data),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", updatedUser.id] });
      toast.success("User updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update user");
    },
  });

  // Get single user
  const useUserById = (id: string) => {
    return useQuery({
      queryKey: ["user", id],
      queryFn: () => userApi.getById(id),
      enabled: !!id,
    });
  };

  // Get current user
  const useCurrentUser = () => {
    return useQuery({
      queryKey: ["currentUser"],
      queryFn: userApi.getCurrentUser,
    });
  };

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => userApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete user");
    },
  });

  return {
    useUsers,
    useUserById,
    useCurrentUser,
    deleteUser: deleteUserMutation.mutate,
    isDeleting: deleteUserMutation.isPending,
  };
};
