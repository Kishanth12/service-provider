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
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">
          {isEdit ? "Edit Service Template" : "Create Service Template"}
        </h1>
        <p className="text-slate-600 mt-1">
          {isEdit
            ? "Update service template information"
            : "Create a new service template for providers"}
        </p>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Template Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Title Field */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="e.g., Home Cleaning, Plumbing Service"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className={errors.title ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Describe the service template..."
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className={errors.description ? "border-red-500" : ""}
                disabled={isSubmitting}
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            {/* Status Field */}
            <div className="space-y-2">
              <Label htmlFor="isActive">
                Status <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.isActive.toString()}
                onValueChange={(value) =>
                  handleChange("isActive", value === "true")
                }
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-slate-500">
                {formData.isActive
                  ? "Providers can add this service to their offerings"
                  : "This template will be hidden from providers"}
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
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
        <Card className="mt-6 bg-slate-50">
          <CardContent className="pt-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Template ID:</span>
                <span className="font-mono">{template.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Providers Using:</span>
                <span className="font-semibold">
                  {template._count?.providerServices || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Created:</span>
                <span>{new Date(template.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
