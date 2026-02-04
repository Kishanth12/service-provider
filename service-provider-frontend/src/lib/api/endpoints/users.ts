import { apiClient } from "../client";
import { User, Role } from "@/types";

export interface UpdateUserDto {
  name?: string;
  email?: string;
  role?: Role;
}

export const userApi = {
  // Get all users (optionally filter by role)
  getAll: async (role?: Role): Promise<User[]> => {
    const params = role ? { role } : {};
    const response = await apiClient.get("/users", { params });
    return response.data.data;
  },

  // Get single user by ID
  getById: async (id: string): Promise<User> => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data.data;
  },

  // Get current authenticated user
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get("/users/me");
    return response.data.data;
  },

  update: async (id: string, data: UpdateUserDto): Promise<User> => {
    const response = await apiClient.put(`/users/${id}`, data);
    return response.data.data;
  },

  // Delete user
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};
