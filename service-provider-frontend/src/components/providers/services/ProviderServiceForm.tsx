"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProviderService, ServiceTemplate } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, X, DollarSign, Sparkles } from "lucide-react";
import { ServiceTemplateSelector } from "./ServiceTemplateSelector";

interface ProviderServiceFormProps {
  service?: ProviderService;
  isEdit?: boolean;
  templates?: ServiceTemplate[];
  existingServiceTemplateIds?: string[];
  onSubmit: (data: ProviderServiceFormData) => Promise<void>;
  isSubmitting: boolean;
}

export interface ProviderServiceFormData {
  serviceTemplateId?: string;
  price: number;
  isAvailable: boolean;
}

export function ProviderServiceForm({
  service,
  isEdit = false,
  templates = [],
  existingServiceTemplateIds = [],
  onSubmit,
  isSubmitting,
}: ProviderServiceFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<ProviderServiceFormData>({
    serviceTemplateId: service?.serviceTemplateId || "",
    price: service?.price || 0,
    isAvailable: service?.isAvailable ?? true,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ProviderServiceFormData, string>>
  >({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProviderServiceFormData, string>> =
      {};

    if (!isEdit && !formData.serviceTemplateId) {
      newErrors.serviceTemplateId = "Please select a service template";
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleChange = (
    field: keyof ProviderServiceFormData,
    value: string | number | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="relative max-w-4xl mx-auto p-6">
      {/* soft background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 -right-24 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl dark:bg-sky-500/10" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-purple-300/20 blur-3xl dark:bg-purple-500/10" />
      </div>

      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 h-9 rounded-xl px-3 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/60"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {isEdit ? "Edit Service" : "Add New Service"}
            </h1>
            <p className="text-slate-600 mt-2 dark:text-slate-300">
              {isEdit
                ? "Update your service details"
                : "Add a service from available templates"}
            </p>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300">
            <Sparkles className="h-3.5 w-3.5" />
            Provider Services
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Template Selection */}
        {!isEdit && (
          <Card className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm dark:border-slate-800/60 dark:bg-slate-950/40">
            <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 opacity-75" />
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                Select Service Template
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ServiceTemplateSelector
                templates={templates}
                selectedTemplateId={formData.serviceTemplateId || null}
                onSelect={(id) => handleChange("serviceTemplateId", id)}
                existingServiceTemplateIds={existingServiceTemplateIds}
              />
              {errors.serviceTemplateId && (
                <p className="text-sm text-red-500 mt-2">
                  {errors.serviceTemplateId}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Service Details */}
        {(isEdit || formData.serviceTemplateId) && (
          <Card className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm dark:border-slate-800/60 dark:bg-slate-950/40">
            <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500 opacity-70" />
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                Service Details
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-6">
                {/* Template info for edit mode */}
                {isEdit && service && (
                  <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/20">
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">
                      Service Type
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {service.serviceTemplate?.title ?? "Service"}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                      {service.serviceTemplate?.description ?? "—"}
                    </p>
                  </div>
                )}

                {/* Price */}
                <div className="space-y-2">
                  <Label
                    htmlFor="price"
                    className="text-slate-700 dark:text-slate-200"
                  >
                    Price <span className="text-red-500">*</span>
                  </Label>

                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      id="price"
                      type="number"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      value={formData.price || ""}
                      onChange={(e) =>
                        handleChange("price", parseFloat(e.target.value) || 0)
                      }
                      className={`h-11 rounded-xl pl-10 bg-white shadow-sm transition focus-visible:ring-2 dark:bg-slate-950/30 ${
                        errors.price
                          ? "border-red-500 focus-visible:ring-red-200"
                          : "border-slate-200 focus-visible:ring-slate-300 dark:border-slate-800 dark:focus-visible:ring-slate-700"
                      }`}
                      disabled={isSubmitting}
                    />
                  </div>

                  {errors.price && (
                    <p className="text-sm text-red-500">{errors.price}</p>
                  )}
                </div>

                {/* Availability */}
                <div className="space-y-2">
                  <Label className="text-slate-700 dark:text-slate-200">
                    Availability <span className="text-red-500">*</span>
                  </Label>

                  <Select
                    value={formData.isAvailable.toString()}
                    onValueChange={(value) =>
                      handleChange("isAvailable", value === "true")
                    }
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/30">
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="true">Available</SelectItem>
                      <SelectItem value="false">Unavailable</SelectItem>
                    </SelectContent>
                  </Select>

                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {formData.isAvailable
                      ? "Customers can book this service"
                      : "This service is hidden from customers"}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-6 border-t border-slate-200/70 dark:border-slate-800/60">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isSubmitting}
                    className="h-11 rounded-xl border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950/30 dark:hover:bg-slate-900/40"
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
                        ? "Update Service"
                        : "Add Service"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Card for Edit Mode */}
        {isEdit && service && (
          <Card className="rounded-2xl border border-slate-200/70 bg-slate-50/70 backdrop-blur-xl shadow-sm dark:border-slate-800/60 dark:bg-slate-900/20">
            <CardContent className="pt-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Service ID:
                  </span>
                  <span className="font-mono text-slate-900 dark:text-white">
                    {service.id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Added:
                  </span>
                  <span className="text-slate-900 dark:text-white">
                    {new Date(service.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Last Updated:
                  </span>
                  <span className="text-slate-900 dark:text-white">
                    {new Date(service.updatedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
