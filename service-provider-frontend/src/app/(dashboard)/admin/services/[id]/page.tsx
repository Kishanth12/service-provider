"use client";

import { useParams, useRouter } from "next/navigation";
import { useService } from "@/lib/hooks/useServices";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Edit,
  Trash2,
  FileText,
  Calendar,
  Users,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { ServiceStatusBadge } from "@/components/Admin/services/ServiceStatusBadge";
import { useState } from "react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";
import { DeleteConfirmModal } from "@/components/shared/DeleteConfirmModal";

export default function ServiceTemplateViewPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.id as string;

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { useServiceTemplateById, deleteServiceTemplate, isDeletingTemplate } =
    useService();

  const {
    data: template,
    isLoading,
    error,
    refetch,
  } = useServiceTemplateById(templateId);

  const handleEdit = () => {
    router.push(`/admin/services/${templateId}/edit`);
  };

  const handleDelete = () => {
    deleteServiceTemplate(templateId, {
      onSuccess: () => {
        router.push("/admin/services");
      },
    });
  };

  if (isLoading) return <LoadingSpinner />;

  if (error || !template) {
    return (
      <ErrorState message="Failed to load service template" onRetry={refetch} />
    );
  }

  const usageCount = template._count?.providerServices ?? 0;

  const canDelete = usageCount === 0;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-28 -right-28 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-28 h-80 w-80 rounded-full bg-fuchsia-300/15 blur-3xl" />
      </div>

      {/* Back */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-4 rounded-xl border border-transparent hover:border-slate-200 hover:bg-white/60"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Templates
      </Button>

      {/* Header Card */}
      <div className="mb-6 rounded-3xl border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 opacity-70" />

        <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-slate-900/5 flex items-center justify-center">
                <FileText className="h-6 w-6 text-slate-900" />
              </div>

              <div className="min-w-0">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 truncate">
                  {template.title}
                </h1>
                <p className="text-slate-600 mt-1">Service Template Details</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600">
                    <Sparkles className="h-4 w-4" />
                    Template
                  </span>

                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600">
                    <Users className="h-4 w-4" />
                    {usageCount} using
                  </span>

                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600">
                    Status: <ServiceStatusBadge isActive={template.isActive} />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleEdit}
              className="rounded-xl"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>

            <Button
              variant="destructive"
              onClick={() => setShowDeleteModal(true)}
              disabled={!canDelete || isDeletingTemplate}
              className="rounded-xl"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeletingTemplate ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Template Information */}
        <Card className="rounded-2xl border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 opacity-60" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Template Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl bg-slate-900/5 p-4">
              <p className="text-xs text-slate-600 mb-1">Title</p>
              <p className="font-semibold text-slate-900">{template.title}</p>
            </div>

            <div className="rounded-2xl bg-slate-900/5 p-4">
              <p className="text-xs text-slate-600 mb-1">Description</p>
              <p className="text-slate-800 leading-relaxed">
                {template.description}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-900/5 p-4">
              <p className="text-xs text-slate-600 mb-2">Status</p>
              <ServiceStatusBadge isActive={template.isActive} />
            </div>
          </CardContent>
        </Card>

        {/* Template Details */}
        <Card className="rounded-2xl border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 opacity-60" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Template Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl bg-slate-900/5 p-4">
              <p className="text-xs text-slate-600 mb-1">Created At</p>
              <p className="font-semibold text-slate-900">
                {new Date(template.createdAt).toLocaleString("en-US", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-900/5 p-4">
              <p className="text-xs text-slate-600 mb-1">Template ID</p>
              <p className="font-mono text-sm text-slate-600 break-all">
                {template.id}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Usage Statistics */}
        <Card className="md:col-span-2 rounded-2xl border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 opacity-60" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Usage Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-slate-900/5 p-5 text-center">
                <p className="text-xs text-slate-600">Providers Using</p>
                <p className="mt-2 text-4xl font-extrabold text-slate-900">
                  {usageCount}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-900/5 p-5 text-center">
                <p className="text-xs text-slate-600">Deletable</p>
                <p
                  className={`mt-2 text-2xl font-extrabold ${
                    canDelete ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {canDelete ? "Yes" : "No"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-900/5 p-5 text-center">
                <p className="text-xs text-slate-600">Current Status</p>
                <p className="mt-2 text-2xl font-extrabold text-slate-900">
                  {template.isActive ? "Active" : "Inactive"}
                </p>
              </div>
            </div>

            {!canDelete && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-800">
                      This template cannot be deleted
                    </p>
                    <p className="text-sm text-red-700 mt-1">
                      It is being used by{" "}
                      <span className="font-bold">{usageCount}</span>{" "}
                      provider(s). Remove it from all providers first.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status Information */}
        <Card className="md:col-span-2 rounded-2xl border border-slate-200/70 bg-white/60 backdrop-blur-xl shadow-sm overflow-hidden">
          <div
            className={`h-1 w-full ${
              template.isActive
                ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500"
                : "bg-gradient-to-r from-slate-400 via-slate-500 to-slate-600"
            } opacity-60`}
          />
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div
                className={`mt-1 h-3 w-3 rounded-full ${
                  template.isActive ? "bg-emerald-500" : "bg-slate-400"
                }`}
              />
              <div>
                <p className="font-semibold text-slate-900">
                  {template.isActive ? "Active Template" : "Inactive Template"}
                </p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  {template.isActive
                    ? "This template is visible to providers and can be added to their services."
                    : "This template is hidden from providers and cannot be added to new services."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isDeleting={isDeletingTemplate}
        title="Delete Service Template"
        itemName={template.title}
        description={
          !canDelete
            ? `This template is being used by ${usageCount} provider(s). You cannot delete it until all providers remove this service.`
            : `Are you sure you want to delete "${template.title}"? This action cannot be undone.`
        }
      />
    </div>
  );
}
