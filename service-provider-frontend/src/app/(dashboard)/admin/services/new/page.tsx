"use client";

import { useRouter } from "next/navigation";
import { useService } from "@/lib/hooks/useServices";
import {
  ServiceTemplateForm,
  ServiceTemplateFormData,
} from "@/components/Admin/services/ServiceTemplateForm";

export default function NewServiceTemplatePage() {
  const router = useRouter();
  const { createServiceTemplate, isCreatingTemplate } = useService();

  const handleSubmit = async (data: ServiceTemplateFormData) => {
    createServiceTemplate(data, {
      onSuccess: (newTemplate: any) => {
        router.push(`/admin/services`);
      },
    });
  };

  return (
    <ServiceTemplateForm
      isEdit={false}
      onSubmit={handleSubmit}
      isSubmitting={isCreatingTemplate}
    />
  );
}
