"use client";

import { useParams, useRouter } from "next/navigation";
import { useService } from "@/lib/hooks/useServices";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import {
  ServiceTemplateForm,
  ServiceTemplateFormData,
} from "@/components/Admin/services/ServiceTemplateForm";
import { ErrorState } from "@/components/shared/ErrorState";

export default function ServiceTemplateEditPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.id as string;

  const { useServiceTemplateById, updateServiceTemplate, isUpdatingTemplate } =
    useService();
  const {
    data: template,
    isLoading,
    error,
    refetch,
  } = useServiceTemplateById(templateId);

  const handleSubmit = async (data: ServiceTemplateFormData) => {
    updateServiceTemplate(
      { id: templateId, data },
      {
        onSuccess: () => {
          router.push(`/admin/services`);
        },
      }
    );
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !template) {
    return (
      <ErrorState message="Failed to load service template" onRetry={refetch} />
    );
  }

  return (
    <ServiceTemplateForm
      template={template}
      isEdit={true}
      onSubmit={handleSubmit}
      isSubmitting={isUpdatingTemplate}
    />
  );
}
