"use client";

import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/lib/hooks/useUsers";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { UserForm, UserFormData } from "@/components/Admin/users/UserForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/lib/api/endpoints/users";
import { toast } from "react-toastify";
import { ErrorState } from "@/components/shared/ErrorState";

export default function UserEditPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const userId = params.id as string;

  const { useUserById } = useUser();
  const { data: user, isLoading, error, refetch } = useUserById(userId);

  // Update user mutation
  const updateMutation = useMutation({
    mutationFn: (data: UserFormData) => {
      // Remove password if it's empty (user doesn't want to change it)
      const updateData = { ...data };
      if (!updateData.password || updateData.password.trim() === "") {
        delete updateData.password;
      }
      return userApi.update(userId, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully");
      router.push(`/admin/users/${userId}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update user");
    },
  });

  const handleSubmit = async (data: UserFormData) => {
    await updateMutation.mutateAsync(data);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !user) {
    return (
      <ErrorState message="Failed to load user details" onRetry={refetch} />
    );
  }

  return (
    <UserForm
      user={user}
      onSubmit={handleSubmit}
      isSubmitting={updateMutation.isPending}
    />
  );
}
