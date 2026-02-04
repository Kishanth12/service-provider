import { apiClient } from "../client";
import { Provider } from "@/types";

export const providerApi = {
  // Get all providers (Admin only)
  getAll: async (): Promise<Provider[]> => {
    const response = await apiClient.get("/providers");
    return response.data.data;
  },

  // Get single provider by ID
  getById: async (id: string): Promise<Provider> => {
    const response = await apiClient.get(`/providers/${id}`);
    return response.data.data;
  },
};
