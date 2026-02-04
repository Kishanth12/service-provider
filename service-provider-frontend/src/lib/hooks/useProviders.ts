"use client";

import { useQuery } from "@tanstack/react-query";
import { providerApi } from "@/lib/api/endpoints/providers";

export const useProvider = () => {
  const useProviders = () => {
    return useQuery({
      queryKey: ["providers"],
      queryFn: () => providerApi.getAll(),
      staleTime: 5 * 60 * 1000,
    });
  };

  const useProviderById = (id: string) => {
    return useQuery({
      queryKey: ["provider", id],
      queryFn: () => providerApi.getById(id),
      enabled: !!id,
    });
  };

  return {
    useProviders,
    useProviderById,
  };
};
