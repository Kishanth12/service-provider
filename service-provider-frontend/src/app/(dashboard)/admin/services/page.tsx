"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useService } from "@/lib/hooks/useServices";
import { ServiceTemplate } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Trash2,
  Eye,
  Edit,
  Sparkles,
  LayoutGrid,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ServiceTemplateStats } from "@/components/Admin/services/ServiceTemplateStats";
import { ServiceStatusBadge } from "@/components/Admin/services/ServiceStatusBadge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";
import { DataTable } from "@/components/shared/DataTable";
import { DeleteConfirmModal } from "@/components/shared/DeleteConfirmModal";

function ServiceActionsMenu({
  template,
  onView,
  onEdit,
  onDelete,
}: {
  template: ServiceTemplate;
  onView: (template: ServiceTemplate) => void;
  onEdit: (template: ServiceTemplate) => void;
  onDelete: (template: ServiceTemplate) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-xl hover:bg-slate-100"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="rounded-2xl border border-slate-200/70 bg-white/90 backdrop-blur-xl shadow-lg"
      >
        <DropdownMenuItem
          onClick={() => onView(template)}
          className="rounded-xl"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onEdit(template)}
          className="rounded-xl"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Template
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onDelete(template)}
          className="rounded-xl text-red-600 focus:text-red-600"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Template
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function AdminServicesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [deleteTemplate, setDeleteTemplate] = useState<ServiceTemplate | null>(
    null,
  );

  const { useServiceTemplates, deleteServiceTemplate, isDeletingTemplate } =
    useService();

  const {
    data: templatesData,
    isLoading,
    error,
    refetch,
  } = useServiceTemplates();

  const templates = Array.isArray(templatesData) ? templatesData : [];

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && template.isActive) ||
      (statusFilter === "inactive" && !template.isActive);

    return matchesSearch && matchesStatus;
  });

  const handleView = (template: ServiceTemplate) => {
    router.push(`/admin/services/${template.id}`);
  };

  const handleEdit = (template: ServiceTemplate) => {
    router.push(`/admin/services/${template.id}/edit`);
  };

  const handleDeleteClick = (template: ServiceTemplate) => {
    setDeleteTemplate(template);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTemplate) return;

    deleteServiceTemplate(deleteTemplate.id, {
      onSuccess: () => {
        setDeleteTemplate(null);
        refetch();
      },
    });
  };

  const columns = [
    {
      header: "Service",
      accessorKey: "title",
      cell: (template: ServiceTemplate) => (
        <div className="min-w-0">
          <p className="font-semibold text-slate-900">{template.title}</p>
          <p className="text-sm text-slate-500 line-clamp-1">
            {template.description}
          </p>
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "isActive",
      cell: (template: ServiceTemplate) => (
        <ServiceStatusBadge isActive={template.isActive} />
      ),
    },
    {
      header: "Providers Using",
      accessorKey: "usage",
      cell: (template: ServiceTemplate) => (
        <p className="text-sm font-semibold text-slate-900">
          {template._count?.providerServices ?? 0}
        </p>
      ),
    },
    {
      header: "Created",
      accessorKey: "createdAt",
      cell: (template: ServiceTemplate) => (
        <p className="text-sm text-slate-700">
          {new Date(template.createdAt).toLocaleDateString()}
        </p>
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (template: ServiceTemplate) => (
        <ServiceActionsMenu
          template={template}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      ),
    },
  ];

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <ErrorState
        message="Failed to load service templates"
        onRetry={refetch}
      />
    );
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
                  <LayoutGrid className="h-6 w-6 text-slate-900" />
                </div>

                <div className="min-w-0">
                  <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                    Service Templates
                  </h1>
                  <p className="text-slate-600 mt-1">
                    Manage service templates for providers
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600">
                      <Sparkles className="h-4 w-4" />
                      Total:{" "}
                      <span className="font-semibold">{templates.length}</span>
                    </span>

                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600">
                      Showing:{" "}
                      <span className="font-semibold">
                        {filteredTemplates.length}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={() => router.push("/admin/services/new")}
              className="rounded-xl"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Template
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="rounded-3xl border border-slate-200/70 bg-white/70 backdrop-blur-xl shadow-sm p-4 mb-6">
          <ServiceTemplateStats templates={templates} />
        </div>

        {/* Filters */}
        <div className="rounded-3xl border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl"
              />
            </div>

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as "all" | "active" | "inactive")
              }
            >
              <SelectTrigger className="w-full md:w-56 rounded-xl">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            {/* Secondary Add Button (optional, matches your old layout) */}
            <Button
              variant="outline"
              onClick={() => router.push("/admin/services/new")}
              className="rounded-xl"
            >
              <Plus className="h-4 w-4 mr-2" />
              New
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-3xl border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm overflow-hidden">
          <DataTable
            data={filteredTemplates}
            columns={columns}
            emptyMessage="No service templates found"
          />
        </div>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={!!deleteTemplate}
          onClose={() => setDeleteTemplate(null)}
          onConfirm={handleDeleteConfirm}
          isDeleting={isDeletingTemplate}
          title="Delete Service Template"
          itemName={deleteTemplate?.title}
          description={
            deleteTemplate?._count?.providerServices
              ? `This template is being used by ${deleteTemplate._count.providerServices} provider(s). You cannot delete it until all providers remove this service.`
              : `Are you sure you want to delete "${deleteTemplate?.title}"? This action cannot be undone.`
          }
        />
      </div>
    </div>
  );
}
