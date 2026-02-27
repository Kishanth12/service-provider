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
    [Role.ADMIN]: "bg-purple-50 text-purple-700 border border-purple-200/70",
    [Role.PROVIDER]:
      "bg-emerald-50 text-emerald-700 border border-emerald-200/70",
    [Role.USER]: "bg-sky-50 text-sky-700 border border-sky-200/70",
  };

  return (
    <Badge
      className={`rounded-full px-3 py-1 text-xs font-medium ${variants[role]}`}
    >
      {role}
    </Badge>
  );
}

export default function UserViewPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { useUserById, deleteUser, isDeleting } = useUser();
  const { data: user, isLoading, error, refetch } = useUserById(userId);

  const handleEdit = () => router.push(`/admin/users/${userId}/edit`);

  const handleDelete = () => {
    deleteUser(userId, {
      onSuccess: () => router.push("/admin/users"),
    });
  };

  if (isLoading) return <LoadingSpinner />;

  if (error || !user) {
    return (
      <ErrorState message="Failed to load user details" onRetry={refetch} />
    );
  }

  const daysActive = Math.floor(
    (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24),
  );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Back */}
      <Button
        variant="ghost"
        onClick={() => router.push("/admin/users")}
        className="px-0 hover:bg-transparent text-slate-700"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Users
      </Button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-start gap-3">
            <div className="h-11 w-11 rounded-xl bg-slate-100 flex items-center justify-center">
              <UserIcon className="h-5 w-5 text-slate-700" />
            </div>

            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-slate-900 truncate">
                {user.name}
              </h1>
              <p className="text-sm text-slate-600">User Details</p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <RoleBadge role={user.role as Role} />
                <span className="text-xs text-slate-500">
                  Active for <span className="font-semibold">{daysActive}</span>{" "}
                  days
                </span>
              </div>
            </div>
          </div>
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

      {/* Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-slate-500">Full Name</p>
              <p className="mt-1 font-semibold text-slate-900">{user.name}</p>
            </div>

            <div>
              <p className="text-xs text-slate-500 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </p>
              <p className="mt-1 font-semibold text-slate-900">{user.email}</p>
            </div>

            <div>
              <p className="text-xs text-slate-500 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Role
              </p>
              <div className="mt-2">
                <RoleBadge role={user.role as Role} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-slate-500">User ID</p>
              <p className="mt-2 font-mono text-xs sm:text-sm break-all rounded-lg bg-slate-50 border px-3 py-2">
                {user.id}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Created At</p>
              <p className="mt-1 font-semibold text-slate-900">
                {new Date(user.createdAt).toLocaleString("en-US", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Permissions */}
        <Card className="md:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Role Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            {user.role === Role.ADMIN && (
              <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                <li>Full access to all system features</li>
                <li>Manage users, providers, and services</li>
                <li>View and manage all bookings</li>
                <li>Access to system settings</li>
              </ul>
            )}

            {user.role === Role.PROVIDER && (
              <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                <li>Create and manage services</li>
                <li>View and manage bookings</li>
                <li>Update availability and pricing</li>
                <li>Respond to customer reviews</li>
              </ul>
            )}

            {user.role === Role.USER && (
              <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                <li>Browse and search services</li>
                <li>Make and manage bookings</li>
                <li>Leave reviews</li>
                <li>Update profile</li>
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Activity */}
        <Card className="md:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Activity Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border bg-white p-5 text-center">
                <p className="text-3xl font-bold text-slate-900">0</p>
                <p className="text-sm text-slate-600 mt-1">Total Bookings</p>
              </div>
              <div className="rounded-xl border bg-white p-5 text-center">
                <p className="text-3xl font-bold text-slate-900">0</p>
                <p className="text-sm text-slate-600 mt-1">Reviews</p>
              </div>
              <div className="rounded-xl border bg-white p-5 text-center">
                <p className="text-3xl font-bold text-slate-900">
                  {daysActive}
                </p>
                <p className="text-sm text-slate-600 mt-1">Days Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title="Delete User"
        itemName={user.name}
        description={`Are you sure you want to delete ${user.name}? This will permanently remove the user and all associated data.`}
      />
    </div>
  );
}
