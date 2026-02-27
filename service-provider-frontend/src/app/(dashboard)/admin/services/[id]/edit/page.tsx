"use client";

import { useParams, useRouter } from "next/navigation";
import { useService } from "@/lib/hooks/useServices";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import {
  ServiceTemplateForm,
  ServiceTemplateFormData,
} from "@/components/Admin/services/ServiceTemplateForm";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Sparkles } from "lucide-react";

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
      },
    );
  };

  if (isLoading) return <LoadingSpinner />;

  if (error || !template) {
    return (
      <ErrorState message="Failed to load service template" onRetry={refetch} />
    );
  }

  return (
    <div className="min-h-[calc(100vh-1px)]">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-28 -right-28 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-28 h-80 w-80 rounded-full bg-fuchsia-300/15 blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto p-6">
        {/* Back */}

        {/* Page Header */}
        <div className="mb-6 rounded-3xl border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 opacity-70" />

          {/* Right Info Box */}
          <div className="w-full md:w-auto">
            <div className="rounded-2xl bg-slate-900/5 p-4 text-center">
              <p className="text-xs text-slate-600">Status</p>
              <p
                className={`mt-1 text-lg font-extrabold ${
                  template.isActive ? "text-emerald-600" : "text-slate-600"
                }`}
              >
                {template.isActive ? "Active" : "Inactive"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Your existing form (unchanged logic) */}
      <div className="rounded-3xl border border-slate-200/70 bg-white/70 backdrop-blur-xl shadow-sm p-2">
        <ServiceTemplateForm
          template={template}
          isEdit={true}
          onSubmit={handleSubmit}
          isSubmitting={isUpdatingTemplate}
        />
      </div>
    </div>
  );
}
