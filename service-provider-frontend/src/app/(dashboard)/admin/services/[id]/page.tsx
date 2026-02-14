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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !template) {
    return (
      <ErrorState message="Failed to load service template" onRetry={refetch} />
    );
  }

  const canDelete =
    !template._count?.providerServices ||
    template._count.providerServices === 0;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Templates
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{template.title}</h1>
            <p className="text-slate-600 mt-1">Service Template Details</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteModal(true)}
              disabled={!canDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Template Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-slate-600 mb-1">Title</p>
              <p className="font-medium">{template.title}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Description</p>
              <p className="text-slate-700">{template.description}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Status</p>
              <ServiceStatusBadge isActive={template.isActive} />
            </div>
          </CardContent>
        </Card>

        {/* Template Metadata */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Template Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-slate-600 mb-1">Created At</p>
              <p className="font-medium">
                {new Date(template.createdAt).toLocaleString("en-US", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Usage Statistics */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Usage Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-4xl font-bold text-blue-600">
                {template._count?.providerServices || 0}
              </p>
              <p className="text-slate-600 mt-2">
                Providers using this template
              </p>
              {!canDelete && (
                <p className="text-sm text-red-600 mt-4">
                  This template cannot be deleted while providers are using it
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Status Information */}
        <Card className="md:col-span-2 bg-slate-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  template.isActive ? "bg-green-500" : "bg-slate-400"
                }`}
              />
              <div>
                <p className="font-medium">
                  {template.isActive ? "Active Template" : "Inactive Template"}
                </p>
                <p className="text-sm text-slate-600">
                  {template.isActive
                    ? "This template is visible to providers and can be added to their services"
                    : "This template is hidden from providers and cannot be added to new services"}
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
            ? `This template is being used by ${template._count?.providerServices} provider(s). You cannot delete it until all providers remove this service.`
            : `Are you sure you want to delete "${template.title}"? This action cannot be undone.`
        }
      />
    </div>
  );
}
