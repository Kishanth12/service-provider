"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Role } from "@/types";
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
import { ArrowLeft, Save, X } from "lucide-react";

interface UserFormProps {
  user: User;
  onSubmit: (data: UserFormData) => Promise<void>;
  isSubmitting: boolean;
}

export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  role: Role;
}

export function UserForm({ user, onSubmit, isSubmitting }: UserFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<UserFormData>({
    name: user.name,
    email: user.email,
    password: "",
    role: user.role,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof UserFormData, string>>
  >({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UserFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    await onSubmit(formData);
  };

  const handleChange = (field: keyof UserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* soft background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-purple-300/25 blur-3xl dark:bg-purple-500/10" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-300/25 blur-3xl dark:bg-emerald-500/10" />
        <div className="absolute top-16 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-sky-300/20 blur-3xl dark:bg-sky-500/10" />
      </div>

      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 -ml-2 rounded-xl px-3 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 dark:text-slate-200 dark:hover:bg-slate-800/60"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Edit User
            </h1>
            <p className="text-slate-600 mt-2 dark:text-slate-300">
              Update user details and role
            </p>
          </div>

          <span className="hidden sm:inline-flex items-center rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300">
            User Management
          </span>
        </div>
      </div>

      {/* Main Form Card */}
      <Card className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm dark:border-slate-800/60 dark:bg-slate-950/40">
        <CardHeader className="border-b border-slate-200/60 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900/40 dark:to-slate-950/20 dark:border-slate-800/60">
          <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
            User Information
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 sm:p-8">
          <div className="space-y-7">
            {/* Name */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-slate-700 dark:text-slate-200">
                  Name <span className="text-red-500">*</span>
                </Label>
                {errors.name && (
                  <span className="text-xs font-medium text-red-600">
                    {errors.name}
                  </span>
                )}
              </div>

              <Input
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                disabled={isSubmitting}
                className={`h-11 rounded-xl bg-white shadow-sm transition focus-visible:ring-2 dark:bg-slate-950/30 ${
                  errors.name
                    ? "border-red-500 focus-visible:ring-red-200"
                    : "border-slate-200 focus-visible:ring-slate-300 dark:border-slate-800 dark:focus-visible:ring-slate-700"
                }`}
              />
            </div>

            {/* Email (read-only) */}
            <div className="space-y-2">
              <Label className="text-slate-700 dark:text-slate-200">
                Email
              </Label>
              <Input
                value={formData.email}
                disabled
                className="h-11 rounded-xl bg-slate-50 border-slate-200 text-slate-700 shadow-sm dark:bg-slate-900/30 dark:border-slate-800 dark:text-slate-200"
              />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Email cannot be changed
              </p>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-slate-700 dark:text-slate-200">
                  New Password
                </Label>
                {errors.password && (
                  <span className="text-xs font-medium text-red-600">
                    {errors.password}
                  </span>
                )}
              </div>

              <Input
                type="password"
                placeholder="Leave blank to keep current password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                disabled={isSubmitting}
                className={`h-11 rounded-xl bg-white shadow-sm transition focus-visible:ring-2 dark:bg-slate-950/30 ${
                  errors.password
                    ? "border-red-500 focus-visible:ring-red-200"
                    : "border-slate-200 focus-visible:ring-slate-300 dark:border-slate-800 dark:focus-visible:ring-slate-700"
                }`}
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Only fill this if you want to change the password.
              </p>
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label className="text-slate-700 dark:text-slate-200">
                Role <span className="text-red-500">*</span>
              </Label>

              <Select
                value={formData.role}
                onValueChange={(v) => handleChange("role", v as Role)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value={Role.USER}>User</SelectItem>
                  <SelectItem value={Role.PROVIDER}>Provider</SelectItem>
                  <SelectItem value={Role.ADMIN}>Admin</SelectItem>
                </SelectContent>
              </Select>

              {errors.role && (
                <p className="text-sm text-red-500">{errors.role}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-slate-200/70 dark:border-slate-800/60">
              <Button
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
                {isSubmitting ? "Saving..." : "Update User"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meta Info */}
      <Card className="mt-6 rounded-2xl border border-slate-200/70 bg-white/70 backdrop-blur-xl shadow-sm dark:border-slate-800/60 dark:bg-slate-950/40">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Account Details
            </p>
            <span className="text-xs rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-600 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300">
              Read only
            </span>
          </div>

          <div className="text-sm space-y-3">
            <div className="flex justify-between gap-4">
              <span className="text-slate-600 dark:text-slate-400">
                User ID
              </span>
              <span className="font-mono text-xs rounded-lg bg-slate-100 px-2 py-1 text-slate-800 dark:bg-slate-900/60 dark:text-slate-200">
                {user.id}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-slate-600 dark:text-slate-400">
                Created
              </span>
              <span className="text-slate-800 dark:text-slate-200">
                {new Date(user.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
