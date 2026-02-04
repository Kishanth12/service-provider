"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  serviceTemplateApi,
  providerServiceApi,
  CreateServiceTemplateDto,
  UpdateServiceTemplateDto,
  CreateProviderServiceDto,
  UpdateProviderServiceDto,
} from "@/lib/api/endpoints/services";
import { toast } from "react-toastify";

export const useService = () => {
  const queryClient = useQueryClient();

  // ==================== SERVICE TEMPLATES ====================

  const useServiceTemplates = () => {
    return useQuery({
      queryKey: ["serviceTemplates"],
      queryFn: () => serviceTemplateApi.getAll(),
      staleTime: 5 * 60 * 1000,
    });
  };

  const useServiceTemplateById = (id: string) => {
    return useQuery({
      queryKey: ["serviceTemplate", id],
      queryFn: () => serviceTemplateApi.getById(id),
      enabled: !!id,
    });
  };

  const createServiceTemplateMutation = useMutation({
    mutationFn: (data: CreateServiceTemplateDto) =>
      serviceTemplateApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serviceTemplates"] });
      toast.success("Service template created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create template");
    },
  });

  const updateServiceTemplateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateServiceTemplateDto;
    }) => serviceTemplateApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serviceTemplates"] });
      toast.success("Service template updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update template");
    },
  });

  const deleteServiceTemplateMutation = useMutation({
    mutationFn: (id: string) => serviceTemplateApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serviceTemplates"] });
      toast.success("Service template deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete template");
    },
  });

  // ==================== PROVIDER SERVICES ====================

  const useProviderServices = () => {
    return useQuery({
      queryKey: ["providerServices"],
      queryFn: () => providerServiceApi.getAll(),
      staleTime: 5 * 60 * 1000,
    });
  };

  const useProviderServiceById = (id: string) => {
    return useQuery({
      queryKey: ["providerService", id],
      queryFn: () => providerServiceApi.getById(id),
      enabled: !!id,
    });
  };

  const createProviderServiceMutation = useMutation({
    mutationFn: (data: CreateProviderServiceDto) =>
      providerServiceApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providerServices"] });
      toast.success("Service added successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add service");
    },
  });

  const updateProviderServiceMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateProviderServiceDto;
    }) => providerServiceApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providerServices"] });
      toast.success("Service updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update service");
    },
  });

  const deleteProviderServiceMutation = useMutation({
    mutationFn: (id: string) => providerServiceApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providerServices"] });
      toast.success("Service deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete service");
    },
  });

  const useAvailableServices = (serviceTemplateId?: string) => {
    return useQuery({
      queryKey: ["availableServices", serviceTemplateId],
      queryFn: () => providerServiceApi.getAvailable(serviceTemplateId),
      staleTime: 2 * 60 * 1000,
    });
  };

  return {
    // Service Templates
    useServiceTemplates,
    useServiceTemplateById,
    createServiceTemplate: createServiceTemplateMutation.mutate,
    updateServiceTemplate: updateServiceTemplateMutation.mutate,
    deleteServiceTemplate: deleteServiceTemplateMutation.mutate,
    isCreatingTemplate: createServiceTemplateMutation.isPending,
    isUpdatingTemplate: updateServiceTemplateMutation.isPending,
    isDeletingTemplate: deleteServiceTemplateMutation.isPending,

    // Provider Services
    useProviderServices,
    useProviderServiceById,
    createProviderService: createProviderServiceMutation.mutate,
    updateProviderService: updateProviderServiceMutation.mutate,
    deleteProviderService: deleteProviderServiceMutation.mutate,
    isCreatingService: createProviderServiceMutation.isPending,
    isUpdatingService: updateProviderServiceMutation.isPending,
    isDeletingService: deleteProviderServiceMutation.isPending,

    // Available Services
    useAvailableServices,
  };
};
