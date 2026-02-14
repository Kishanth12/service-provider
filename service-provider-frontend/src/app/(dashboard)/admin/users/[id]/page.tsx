"use client";

import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/lib/hooks/useUsers";
import { DeleteConfirmModal } from "@/components/shared/DeleteConfirmModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Role } from "@/types";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Calendar,
  Shield,
  User as UserIcon,
} from "lucide-react";
import { useState } from "react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";

function RoleBadge({ role }: { role: Role }) {
  const variants = {
    [Role.ADMIN]: "bg-purple-100 text-purple-800",
    [Role.PROVIDER]: "bg-green-100 text-green-800",
    [Role.USER]: "bg-blue-100 text-blue-800",
  };

  return <Badge className={variants[role]}>{role}</Badge>;
}

export default function UserViewPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { useUserById, deleteUser, isDeleting } = useUser();
  const { data: user, isLoading, error, refetch } = useUserById(userId);

  const handleEdit = () => {
    router.push(`/admin/users/${userId}/edit`);
  };

  const handleDelete = () => {
    deleteUser(userId, {
      onSuccess: () => {
        router.push("/admin/users");
      },
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !user) {
    return (
      <ErrorState message="Failed to load user details" onRetry={refetch} />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/users")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-slate-600 mt-1">User Details</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteModal(true)}
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
              <UserIcon className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-slate-600 mb-1">Full Name</p>
              <p className="font-medium">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Role
              </p>
              <RoleBadge role={user.role as Role} />
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-slate-600 mb-1">User ID</p>
              <p className="font-mono text-sm bg-slate-100 p-2 rounded">
                {user.id}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Created At</p>
              <p className="font-medium">
                {new Date(user.createdAt).toLocaleString("en-US", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Role Description */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Role Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            {user.role === Role.ADMIN && (
              <div className="space-y-2">
                <p className="font-medium text-purple-800">Administrator</p>
                <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                  <li>Full access to all system features</li>
                  <li>Manage users, providers, and services</li>
                  <li>View and manage all bookings</li>
                  <li>Access to system settings and configurations</li>
                </ul>
              </div>
            )}
            {user.role === Role.PROVIDER && (
              <div className="space-y-2">
                <p className="font-medium text-green-800">Service Provider</p>
                <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                  <li>Create and manage services</li>
                  <li>View and manage bookings for their services</li>
                  <li>Update service availability and pricing</li>
                  <li>Respond to customer reviews</li>
                </ul>
              </div>
            )}
            {user.role === Role.USER && (
              <div className="space-y-2">
                <p className="font-medium text-blue-800">Regular User</p>
                <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                  <li>Browse and search services</li>
                  <li>Make and manage bookings</li>
                  <li>Leave reviews for services</li>
                  <li>Update profile information</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity Summary (Placeholder for future) */}
        <Card className="md:col-span-2 bg-slate-50">
          <CardHeader>
            <CardTitle>Activity Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-slate-600">Total Bookings</p>
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-slate-600">Reviews</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {Math.floor(
                    (Date.now() - new Date(user.createdAt).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}
                </p>
                <p className="text-sm text-slate-600">Days Active</p>
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
        isDeleting={isDeleting}
        title="Delete User"
        itemName={user.name}
        description={`Are you sure you want to delete ${user.name}? This will permanently remove the user and all associated data. This action cannot be undone.`}
      />
    </div>
  );
}
