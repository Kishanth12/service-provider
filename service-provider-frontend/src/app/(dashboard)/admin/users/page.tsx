"use client";

import { useState } from "react";
import { useUser } from "@/lib/hooks/useUsers";
import { Role, User } from "@/types";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

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

export default function AdminUsersPage() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

  const { useUsers, deleteUser: deleteUserMutation, isDeleting } = useUser();
  const { data: users = [], isLoading, error, refetch } = useUsers();
  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Handlers
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
    if (deleteUser) {
      deleteUserMutation(deleteUser.id, {
        onSuccess: () => {
          setDeleteUser(null);
          refetch();
        },
      });
    }
  };

  // Table columns
  const columns = [
    {
      header: "User",
      accessorKey: "name",
      cell: (user: User) => (
        <div>
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-slate-500">{user.email}</p>
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
          <p>{new Date(user.createdAt).toLocaleDateString()}</p>
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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorState message="Failed to load users" onRetry={refetch} />;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Users Management</h1>
        <p className="text-slate-600 mt-1">
          Manage all users, providers, and administrators
        </p>
      </div>

      {/* Stats */}
      <UserStats users={users} />

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Role Filter */}
          <Select
            value={roleFilter}
            onValueChange={(value) => setRoleFilter(value as Role | "all")}
          >
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value={Role.USER}>Users</SelectItem>
              <SelectItem value={Role.PROVIDER}>Providers</SelectItem>
              <SelectItem value={Role.ADMIN}>Admins</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-slate-200">
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
  );
}
