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
      
      let errorMsg = "invalid credentials please try again";
      
      if (error.isHtmlError) {
        errorMsg = error.message;
      } else {
        try {
          // Try to extract from NestJS AllExceptionsFilter format
          const resData = error.response?.data;
          if (resData?.response?.message) {
            const msg = resData.response.message;
            if (typeof msg === 'string' && msg.trim() !== '') {
              errorMsg = msg;
            } else if (Array.isArray(msg) && msg.length > 0) {
              errorMsg = msg[0];
            }
          } else if (typeof resData?.response === 'string') {
            errorMsg = resData.response;
          } else if (resData?.message) {
             errorMsg = resData.message;
          } else if (error.message) {
             errorMsg = error.message;
             if (errorMsg.includes("AxiosError") || errorMsg.includes("Network Error") || errorMsg.includes("status code")) {
               errorMsg = "invalid credentials please try again";
             }
          }
        } catch (e) {}
      }

      toast.error(errorMsg);
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => handleAuthSuccess(data, `Welcome, ${data.user.name}!`),
    onError: (error: any) => {
      console.error("Register error:", error);
      let errorMsg = "Something went wrong";
      
      if (error.isHtmlError) {
        errorMsg = error.message;
      } else {
        try {
          // Try to extract from NestJS AllExceptionsFilter format
          const resData = error.response?.data;
          if (resData?.response?.message) {
            const msg = resData.response.message;
            if (typeof msg === 'string' && msg.trim() !== '') {
              errorMsg = msg;
            } else if (Array.isArray(msg) && msg.length > 0) {
              errorMsg = msg[0];
            }
          } else if (typeof resData?.response === 'string') {
            errorMsg = resData.response;
          } else if (resData?.message) {
             errorMsg = resData.message;
          } else if (error.message && !error.message.includes("AxiosError")) {
             errorMsg = error.message;
          }
        } catch (e) {}
      }
      toast.error(errorMsg);
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
