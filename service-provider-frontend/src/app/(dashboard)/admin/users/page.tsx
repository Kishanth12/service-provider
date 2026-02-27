"use client";

import { useState } from "react";
import { useUser } from "@/lib/hooks/useUsers";
import { Role, User } from "@/types";
import { Input } from "@/components/ui/input";
import { Search, Filter, Users, Sparkles } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoleBadge } from "@/components/Admin/users/RoleBadge";
import { UserActionsMenu } from "@/components/Admin/users/UserActionsMenu";
import { UserStats } from "@/components/Admin/users/UserStats";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";
import { DataTable } from "@/components/shared/DataTable";
import { DeleteConfirmModal } from "@/components/shared/DeleteConfirmModal";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AdminUsersPage() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

  const { useUsers, deleteUser: deleteUserMutation, isDeleting } = useUser();
  const { data: users = [], isLoading, error, refetch } = useUsers();

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleView = (user: User) => {
    router.push(`/admin/users/${user.id}`);
  };
  const handleEdit = (user: User) => {
    router.push(`/admin/users/${user.id}/edit`);
  };

  const handleDeleteClick = (user: User) => {
    setDeleteUser(user);
  };

  const handleDeleteConfirm = () => {
    if (!deleteUser) return;

    deleteUserMutation(deleteUser.id, {
      onSuccess: () => {
        setDeleteUser(null);
        refetch();
      },
    });
  };

  const columns = [
    {
      header: "User",
      accessorKey: "name",
      cell: (user: User) => (
        <div className="min-w-0">
          <p className="font-semibold text-slate-900">{user.name}</p>
          <p className="text-sm text-slate-500 truncate">{user.email}</p>
        </div>
      ),
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: (user: User) => <RoleBadge role={user.role as Role} />,
    },
    {
      header: "Joined",
      accessorKey: "createdAt",
      cell: (user: User) => (
        <div>
          <p className="text-sm text-slate-900">
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
          <p className="text-sm text-slate-500">
            {new Date(user.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (user: User) => (
        <UserActionsMenu
          user={user}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      ),
    },
  ];

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return <ErrorState message="Failed to load users" onRetry={refetch} />;
  }

  return (
    <div className="min-h-[calc(100vh-1px)]">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-28 -right-28 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-28 h-80 w-80 rounded-full bg-fuchsia-300/15 blur-3xl" />
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        {/* Premium Header */}
        <div className="mb-6 rounded-3xl border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 opacity-70" />

          <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-slate-900/5 flex items-center justify-center">
                  <Users className="h-6 w-6 text-slate-900" />
                </div>

                <div className="min-w-0">
                  <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                    Users Management
                  </h1>
                  <p className="text-slate-600 mt-1">
                    Manage all users, providers, and administrators
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600">
                      <Sparkles className="h-4 w-4" />
                      Total:{" "}
                      <span className="font-semibold">{users.length}</span>
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600">
                      Showing:{" "}
                      <span className="font-semibold">
                        {filteredUsers.length}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Optional refresh action */}
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="rounded-xl"
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="rounded-3xl border border-slate-200/70 bg-white/70 backdrop-blur-xl shadow-sm p-4 mb-6">
          <UserStats users={users} />
        </div>

        {/* Filters */}
        <div className="rounded-3xl border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl"
              />
            </div>

            <Select
              value={roleFilter}
              onValueChange={(value) => setRoleFilter(value as Role | "all")}
            >
              <SelectTrigger className="w-full md:w-56 rounded-xl">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value={Role.USER}>Users</SelectItem>
                <SelectItem value={Role.PROVIDER}>Providers</SelectItem>
                <SelectItem value={Role.ADMIN}>Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-3xl border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm overflow-hidden">
          <DataTable
            data={filteredUsers}
            columns={columns}
            emptyMessage="No users found"
          />
        </div>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={!!deleteUser}
          onClose={() => setDeleteUser(null)}
          onConfirm={handleDeleteConfirm}
          isDeleting={isDeleting}
          title="Delete User"
          itemName={deleteUser?.name}
        />
      </div>
    </div>
  );
}
