"use client";

import { useRouter } from "next/navigation";
import { useService } from "@/lib/hooks/useServices";
import {
  ProviderServiceForm,
  ProviderServiceFormData,
} from "@/components/providers/services/ProviderServiceForm";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";

export default function NewProviderServicePage() {
  const router = useRouter();

  const {
    useServiceTemplates,
    useProviderServices,
    createProviderService,
    isCreatingService,
  } = useService();

  const {
    data: templatesData,
    isLoading: templatesLoading,
    error: templatesError,
  } = useServiceTemplates();
  const { data: servicesData, isLoading: servicesLoading } =
    useProviderServices();

  const templates = Array.isArray(templatesData) ? templatesData : [];
  const services = Array.isArray(servicesData) ? servicesData : [];

  // Get active templates only
  const activeTemplates = templates.filter((t) => t.isActive);

  // Get IDs of templates already added by provider
  const existingServiceTemplateIds = services.map((s) => s.serviceTemplateId);

  const handleSubmit = async (data: ProviderServiceFormData) => {
    // Validate serviceTemplateId exists before submitting
    if (!data.serviceTemplateId) {
      return;
    }

    createProviderService(
      {
        serviceTemplateId: data.serviceTemplateId,
        price: data.price,
        isAvailable: data.isAvailable,
      },
      {
        onSuccess: (newService: any) => {
          router.push(`/provider/services/${newService.id}`);
        },
      }
    );
  };

  if (templatesLoading || servicesLoading) {
    return <LoadingSpinner />;
  }

  if (templatesError) {
    return <ErrorState message="Failed to load service templates" />;
  }

  return (
    <ProviderServiceForm
      isEdit={false}
      templates={activeTemplates}
      existingServiceTemplateIds={existingServiceTemplateIds}
      onSubmit={handleSubmit}
      isSubmitting={isCreatingService}
    />
  );
}
