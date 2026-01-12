"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/endpoints/auth";
import { useAuthStore } from "@/stores/authStore";
import { AuthResponse, Role } from "@/types";
import { toast } from "react-toastify";

const ROLE_DASHBOARDS: Record<Role, string> = {
  [Role.USER]: "/user",
  [Role.PROVIDER]: "/provider",
  [Role.ADMIN]: "/admin",
};

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setAuth, clearAuth, user, isAuthenticated } = useAuthStore();

  const handleAuthSuccess = (data: AuthResponse, welcomeMessage: string) => {
    setAuth(data.user, data.accessToken);
    const dashboard = ROLE_DASHBOARDS[data.user.role];

    if (!dashboard) {
      console.error("Invalid role:", data.user.role);
      toast.error("Invalid user role");
      clearAuth();
      return;
    }

    toast.success(welcomeMessage, { autoClose: 1500 });

    // Wait for cookie to be set, then redirect
    setTimeout(() => {
      router.push(dashboard);
      router.refresh(); // Force middleware to re-run
    }, 300);
  };

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) =>
      handleAuthSuccess(data, `Welcome back, ${data.user.name}!`),
    onError: (error: any) => {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Invalid credentials");
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => handleAuthSuccess(data, `Welcome, ${data.user.name}!`),
    onError: (error: any) => {
      console.error("Register error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  const logout = async () => {
    try {
      await authApi.logout(); // Call backend to clear cookie
      clearAuth();
      queryClient.clear();
      toast.info("You have been successfully logged out");

      setTimeout(() => {
        router.push("/login");
        router.refresh();
      }, 300);
    } catch (error) {
      console.error("Logout error:", error);
      // Clear auth anyway
      clearAuth();
      router.push("/login");
    }
  };

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    user,
    isAuthenticated,
    isLoading: loginMutation.isPending || registerMutation.isPending,
  };
};
