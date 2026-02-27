"use client";

import { useRouter } from "next/navigation";
import { useService } from "@/lib/hooks/useServices";
import {
  ServiceTemplateForm,
  ServiceTemplateFormData,
} from "@/components/Admin/services/ServiceTemplateForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlusCircle, Sparkles } from "lucide-react";

export default function NewServiceTemplatePage() {
  const router = useRouter();
  const { createServiceTemplate, isCreatingTemplate } = useService();

  const handleSubmit = async (data: ServiceTemplateFormData) => {
    createServiceTemplate(data, {
      onSuccess: () => {
        router.push(`/admin/services`);
      },
    });
  };

  return (
    <div className="min-h-[calc(100vh-1px)]">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-28 -right-28 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-28 h-80 w-80 rounded-full bg-fuchsia-300/15 blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto p-6">
        {/* Form wrapper */}
        <div className="rounded-3xl border border-slate-200/70 bg-white/70 backdrop-blur-xl shadow-sm p-2">
          <ServiceTemplateForm
            isEdit={false}
            onSubmit={handleSubmit}
            isSubmitting={isCreatingTemplate}
          />
        </div>
      </div>
    </div>
  );
}
