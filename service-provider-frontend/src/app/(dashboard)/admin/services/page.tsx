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
        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onView(template)}>
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(template)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Template
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(template)}
          className="text-red-600"
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
    null
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

  // Filter templates
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

  // Handlers
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
    if (deleteTemplate) {
      deleteServiceTemplate(deleteTemplate.id, {
        onSuccess: () => {
          setDeleteTemplate(null);
          refetch();
        },
      });
    }
  };

  // Table columns
  const columns = [
    {
      header: "Service",
      accessorKey: "title",
      cell: (template: ServiceTemplate) => (
        <div>
          <p className="font-medium">{template.title}</p>
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
        <p className="text-sm">{template._count?.providerServices || 0}</p>
      ),
    },
    {
      header: "Created",
      accessorKey: "createdAt",
      cell: (template: ServiceTemplate) => (
        <p className="text-sm">
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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorState
        message="Failed to load service templates"
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Service Templates</h1>
        <p className="text-slate-600 mt-1">
          Manage service templates for providers
        </p>
      </div>

      {/* Stats */}
      <ServiceTemplateStats templates={templates} />

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as "all" | "active" | "inactive")
            }
          >
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* Add Template Button */}
          <Button onClick={() => router.push("/admin/services/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Template
          </Button>
        </div>
      </div>

      {/* Templates Table */}
      <div className="bg-white rounded-lg border border-slate-200">
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
  );
}
