"use client";

import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/lib/hooks/useUsers";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { UserForm, UserFormData } from "@/components/Admin/users/UserForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/lib/api/endpoints/users";
import { toast } from "react-toastify";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function UserEditPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const userId = params.id as string;

  const { useUserById } = useUser();
  const { data: user, isLoading, error, refetch } = useUserById(userId);

  const updateMutation = useMutation({
    mutationFn: (data: UserFormData) => {
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

  if (isLoading) return <LoadingSpinner />;

  if (error || !user) {
    return (
      <ErrorState message="Failed to load user details" onRetry={refetch} />
    );
  }

  return (
    <div className="min-h-[calc(100vh-1px)]">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-28 -right-28 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-28 h-80 w-80 rounded-full bg-fuchsia-300/15 blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto p-6">
        {/* Top Header */}
        <div className="mb-6 rounded-3xl border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 opacity-70" />
 
        </div>

        {/* Keep your existing form component */}
        <div className="rounded-3xl border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm p-2">
          <UserForm
            user={user}
            onSubmit={handleSubmit}
            isSubmitting={updateMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}
