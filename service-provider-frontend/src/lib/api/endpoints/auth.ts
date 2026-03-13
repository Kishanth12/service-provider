import { apiClient } from "../client";
import { AuthResponse, LoginCredentials, RegisterData, Role } from "@/types";

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/login", credentials, {
      withCredentials: true, 
    });
    const data = response?.data?.data;
    if (!data) {
      throw new Error("Invalid response format from server");
    }

    return {
      user: {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role as Role,
        providerId: data.providerId,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      accessToken: data.access_token,
    };
  },

  register: async (registerData: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/register", registerData, {
      withCredentials: true,
    });
    const data = response?.data?.data;
    if (!data) {
      throw new Error("Invalid response format from server");
    }

    return {
      user: {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role as Role,
        providerId: data.providerId,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      accessToken: data.access_token,
    };
  },

  logout: async () => {
    await apiClient.post(
      "/auth/logout",
      {},
      {
        withCredentials: true, 
      }
    );
  },
};
