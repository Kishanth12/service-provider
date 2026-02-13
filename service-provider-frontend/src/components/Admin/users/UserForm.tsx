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
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Edit User</h1>
        <p className="text-slate-600 mt-1">Update user details and role</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label>Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              disabled={isSubmitting}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Email (read-only) */}
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={formData.email} disabled />
            <p className="text-sm text-slate-500">Email cannot be changed</p>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label>New Password</Label>
            <Input
              type="password"
              placeholder="Leave blank to keep current password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              disabled={isSubmitting}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label>Role *</Label>
            <Select
              value={formData.role}
              onValueChange={(v) => handleChange("role", v as Role)}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Role.USER}>User</SelectItem>
                <SelectItem value={Role.PROVIDER}>Provider</SelectItem>
                <SelectItem value={Role.ADMIN}>Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button variant="outline" onClick={() => router.back()}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Saving..." : "Update User"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Meta Info */}
      <Card className="mt-6 bg-slate-50">
        <CardContent className="pt-6 text-sm space-y-2">
          <div className="flex justify-between">
            <span>User ID</span>
            <span className="font-mono">{user.id}</span>
          </div>
          <div className="flex justify-between">
            <span>Created</span>
            <span>{new Date(user.createdAt).toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
