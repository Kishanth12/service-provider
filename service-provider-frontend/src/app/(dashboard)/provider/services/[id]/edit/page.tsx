"use client";

import { useParams, useRouter } from "next/navigation";
import { useService } from "@/lib/hooks/useServices";
import {
  ProviderServiceForm,
  ProviderServiceFormData,
} from "@/components/providers/services/ProviderServiceForm";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";

export default function ProviderServiceEditPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id as string;

  const { useProviderServiceById, updateProviderService, isUpdatingService } =
    useService();
  const {
    data: service,
    isLoading,
    error,
    refetch,
  } = useProviderServiceById(serviceId);

  const handleSubmit = async (data: ProviderServiceFormData) => {
    // Remove serviceTemplateId from update data (it's not editable)
    const updateData = {
      price: data.price,
      isAvailable: data.isAvailable,
    };

    updateProviderService(
      { id: serviceId, data: updateData },
      {
        onSuccess: () => {
          router.push(`/provider/services/${serviceId}`);
        },
      }
    );
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !service) {
    return (
      <ErrorState message="Failed to load service details" onRetry={refetch} />
    );
  }

  return (
    <ProviderServiceForm
      service={service}
      isEdit={true}
      onSubmit={handleSubmit}
      isSubmitting={isUpdatingService}
    />
  );
}
