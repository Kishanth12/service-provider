"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ServiceTemplate } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, X } from "lucide-react";

interface ServiceTemplateFormProps {
  template?: ServiceTemplate;
  isEdit?: boolean;
  onSubmit: (data: ServiceTemplateFormData) => Promise<void>;
  isSubmitting: boolean;
}

export interface ServiceTemplateFormData {
  title: string;
  description: string;
  isActive: boolean;
}

export function ServiceTemplateForm({
  template,
  isEdit = false,
  onSubmit,
  isSubmitting,
}: ServiceTemplateFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<ServiceTemplateFormData>({
    title: template?.title || "",
    description: template?.description || "",
    isActive: template?.isActive ?? true,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ServiceTemplateFormData, string>>
  >({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ServiceTemplateFormData, string>> =
      {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleChange = (
    field: keyof ServiceTemplateFormData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* soft background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-purple-300/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl" />
        <div className="absolute top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-sky-300/20 blur-3xl" />
      </div>

      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 -ml-2 rounded-xl px-3 text-slate-700 hover:bg-slate-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {isEdit ? "Edit Service Template" : "Create Service Template"}
            </h1>
            <p className="text-slate-600 mt-2 max-w-2xl">
              {isEdit
                ? "Update service template information"
                : "Create a new service template for providers"}
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm backdrop-blur">
              {isEdit ? "Edit Mode" : "New Template"}
            </span>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <Card className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm">
        <CardHeader className="border-b border-slate-200/60 bg-gradient-to-r from-slate-50 to-white">
          <CardTitle className="text-lg font-bold text-slate-900">
            Template Information
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 sm:p-8">
          <div className="space-y-7">
            {/* Title Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="title" className="text-slate-700">
                  Title <span className="text-red-500">*</span>
                </Label>
                {errors.title && (
                  <span className="text-xs font-medium text-red-600">
                    {errors.title}
                  </span>
                )}
              </div>

              <div className="relative">
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g., Home Cleaning, Plumbing Service"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className={`h-11 rounded-xl bg-white shadow-sm transition focus-visible:ring-2 focus-visible:ring-slate-300 ${
                    errors.title
                      ? "border-red-500 focus-visible:ring-red-200"
                      : "border-slate-200"
                  }`}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="description" className="text-slate-700">
                  Description <span className="text-red-500">*</span>
                </Label>
                {errors.description && (
                  <span className="text-xs font-medium text-red-600">
                    {errors.description}
                  </span>
                )}
              </div>

              <Textarea
                id="description"
                placeholder="Describe the service template..."
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className={`min-h-[110px] rounded-xl bg-white shadow-sm transition focus-visible:ring-2 focus-visible:ring-slate-300 ${
                  errors.description
                    ? "border-red-500 focus-visible:ring-red-200"
                    : "border-slate-200"
                }`}
                disabled={isSubmitting}
                rows={4}
              />

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>
                  Tip: Mention what providers should include in this service.
                </span>
                <span className="tabular-nums">
                  {formData.description.trim().length}/10+
                </span>
              </div>
            </div>

            {/* Status Field */}
            <div className="space-y-2">
              <Label htmlFor="isActive" className="text-slate-700">
                Status <span className="text-red-500">*</span>
              </Label>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-start">
                <div className="sm:col-span-2">
                  <Select
                    value={formData.isActive.toString()}
                    onValueChange={(value) =>
                      handleChange("isActive", value === "true")
                    }
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white shadow-sm">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="sm:col-span-3">
                  <div
                    className={`rounded-xl border p-3 text-sm shadow-sm ${
                      formData.isActive
                        ? "border-emerald-200 bg-emerald-50/60 text-emerald-900"
                        : "border-slate-200 bg-slate-50/60 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          formData.isActive ? "bg-emerald-500" : "bg-slate-400"
                        }`}
                      />
                      <p className="font-medium">
                        {formData.isActive ? "Visible to providers" : "Hidden"}
                      </p>
                    </div>
                    <p className="mt-1 text-xs opacity-90">
                      {formData.isActive
                        ? "Providers can add this service to their offerings."
                        : "This template will be hidden from providers."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-slate-200/70">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
                className="h-11 rounded-xl border-slate-200 bg-white hover:bg-slate-50"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="h-11 rounded-xl shadow-sm transition hover:shadow-md"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting
                  ? "Saving..."
                  : isEdit
                    ? "Update Template"
                    : "Create Template"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Card for Edit Mode */}
      {isEdit && template && (
        <Card className="mt-6 rounded-2xl border border-slate-200/70 bg-white/70 backdrop-blur-xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-slate-800">
                Template Details
              </p>
              <span className="text-xs rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-600">
                Read only
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-600">Template ID</span>
                <span className="font-mono text-xs rounded-lg bg-slate-100 px-2 py-1 text-slate-800">
                  {template.id}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-600">Providers Using</span>
                <span className="font-semibold text-slate-900">
                  {template._count?.providerServices || 0}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-600">Created</span>
                <span className="text-slate-800">
                  {new Date(template.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
