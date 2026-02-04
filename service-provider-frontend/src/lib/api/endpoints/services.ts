import { apiClient } from "../client";
import { ServiceTemplate, ProviderService } from "@/types";

// ==================== DTOs ====================

export interface CreateServiceTemplateDto {
  title: string;
  description: string;
  isActive?: boolean;
}

export interface UpdateServiceTemplateDto {
  title?: string;
  description?: string;
  isActive?: boolean;
}

export interface CreateProviderServiceDto {
  serviceTemplateId: string;
  price: number;
  isAvailable?: boolean;
}

export interface UpdateProviderServiceDto {
  price?: number;
  isAvailable?: boolean;
}

// ==================== SERVICE TEMPLATE API ====================

export const serviceTemplateApi = {
  getAll: async (): Promise<ServiceTemplate[]> => {
    const response = await apiClient.get("/services/templates");
    return response.data.data;
  },

  getById: async (id: string): Promise<ServiceTemplate> => {
    const response = await apiClient.get(`/services/templates/${id}`);
    return response.data.data;
  },

  create: async (data: CreateServiceTemplateDto): Promise<ServiceTemplate> => {
    const response = await apiClient.post("/services/templates", data);
    return response.data.data;
  },

  update: async (
    id: string,
    data: UpdateServiceTemplateDto
  ): Promise<ServiceTemplate> => {
    const response = await apiClient.put(`/services/templates/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/services/templates/${id}`);
  },
};

// ==================== PROVIDER SERVICE API ====================

export const providerServiceApi = {
  getAll: async (): Promise<ProviderService[]> => {
    const response = await apiClient.get("/services/provider-services");
    return response.data.data;
  },

  getById: async (id: string): Promise<ProviderService> => {
    const response = await apiClient.get(`/services/provider-services/${id}`);
    return response.data.data;
  },

  create: async (data: CreateProviderServiceDto): Promise<ProviderService> => {
    const response = await apiClient.post("/services/provider-services", data);
    return response.data.data;
  },

  update: async (
    id: string,
    data: UpdateProviderServiceDto
  ): Promise<ProviderService> => {
    const response = await apiClient.put(
      `/services/provider-services/${id}`,
      data
    );
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/services/provider-services/${id}`);
  },

  getAvailable: async (
    serviceTemplateId?: string
  ): Promise<ProviderService[]> => {
    const params = serviceTemplateId
      ? `?serviceTemplateId=${serviceTemplateId}`
      : "";
    const response = await apiClient.get(`/services/available${params}`);
    return response.data.data;
  },
};
