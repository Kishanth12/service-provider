// ============================================
// FILE: app/provider/services/page.tsx
// ============================================

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useService } from "@/lib/hooks/useServices";
import { useReview } from "@/lib/hooks/useReviews";
import { ProviderService } from "@/types";
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
  Star,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { AvailabilityToggle } from "@/components/providers/services/AvailabilityToggle";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";
import { DeleteConfirmModal } from "@/components/shared/DeleteConfirmModal";
import { DataTable } from "@/components/shared/DataTable";

function ServiceActionsMenu({
  service,
  onView,
  onEdit,
  onDelete,
}: {
  service: ProviderService;
  onView: (service: ProviderService) => void;
  onEdit: (service: ProviderService) => void;
  onDelete: (service: ProviderService) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onView(service)}>
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(service)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Service
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(service)}
          className="text-red-600"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Service
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Helper component to get review data for a service
function ServiceRating({ serviceId }: { serviceId: string }) {
  const { useServiceReviews } = useReview();
  const { data: reviewsData } = useServiceReviews(serviceId);
  const reviews = Array.isArray(reviewsData) ? reviewsData : [];

  if (reviews.length === 0) {
    return <p className="text-sm text-slate-400">No reviews</p>;
  }

  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="flex items-center gap-1">
      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      <span className="font-medium">{avgRating.toFixed(1)}</span>
      <span className="text-xs text-slate-500">({reviews.length})</span>
    </div>
  );
}

export default function ProviderServicesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "available" | "unavailable"
  >("all");
  const [deleteService, setDeleteService] = useState<ProviderService | null>(
    null,
  );

  const { useProviderServices, deleteProviderService, isDeletingService } =
    useService();
  const { useServiceReviews } = useReview();

  const {
    data: servicesData,
    isLoading,
    error,
    refetch,
  } = useProviderServices();

  const services = Array.isArray(servicesData) ? servicesData : [];

  // Calculate total reviews across all services
  let totalReviews = 0;
  services.forEach((service) => {
    const { data: reviewsData } = useServiceReviews(service.id);
    const reviews = Array.isArray(reviewsData) ? reviewsData : [];
    totalReviews += reviews.length;
  });

  // Filter services
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.serviceTemplate?.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      service.serviceTemplate?.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "available" && service.isAvailable) ||
      (statusFilter === "unavailable" && !service.isAvailable);

    return matchesSearch && matchesStatus;
  });

  // Handlers
  const handleView = (service: ProviderService) => {
    router.push(`/provider/services/${service.id}`);
  };

  const handleEdit = (service: ProviderService) => {
    router.push(`/provider/services/${service.id}/edit`);
  };

  const handleDeleteClick = (service: ProviderService) => {
    setDeleteService(service);
  };

  const handleDeleteConfirm = () => {
    if (deleteService) {
      deleteProviderService(deleteService.id, {
        onSuccess: () => {
          setDeleteService(null);
          refetch();
        },
      });
    }
  };

  // Stats
  const stats = [
    {
      label: "Total Services",
      value: services.length,
      color: "bg-blue-500",
    },
    {
      label: "Available",
      value: services.filter((s) => s.isAvailable).length,
      color: "bg-green-500",
    },
    {
      label: "Total Reviews",
      value: totalReviews,
      color: "bg-yellow-500",
    },
  ];

  // Table columns
  const columns = [
    {
      header: "Service",
      accessorKey: "title",
      cell: (service: ProviderService) => (
        <div>
          <p className="font-medium">{service.serviceTemplate?.title}</p>
          <p className="text-sm text-slate-500 line-clamp-1">
            {service.serviceTemplate?.description}
          </p>
        </div>
      ),
    },
    {
      header: "Price",
      accessorKey: "price",
      cell: (service: ProviderService) => (
        <p className="font-semibold">${service.price.toFixed(2)}</p>
      ),
    },
    {
      header: "Rating",
      accessorKey: "rating",
      cell: (service: ProviderService) => (
        <ServiceRating serviceId={service.id} />
      ),
    },
    {
      header: "Status",
      accessorKey: "isAvailable",
      cell: (service: ProviderService) => (
        <AvailabilityToggle isAvailable={service.isAvailable} />
      ),
    },
    {
      header: "Added",
      accessorKey: "createdAt",
      cell: (service: ProviderService) => (
        <p className="text-sm">
          {new Date(service.createdAt).toLocaleDateString()}
        </p>
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (service: ProviderService) => (
        <ServiceActionsMenu
          service={service}
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
    return <ErrorState message="Failed to load services" onRetry={refetch} />;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Services</h1>
        <p className="text-slate-600 mt-1">
          Manage your service offerings and availability
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-lg border border-slate-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">{stat.label}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <div
                className={`w-12 h-12 rounded-lg ${stat.color} opacity-10`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as "all" | "available" | "unavailable")
            }
          >
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
            </SelectContent>
          </Select>

          {/* Add Service Button */}
          <Button onClick={() => router.push("/provider/services/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-lg border border-slate-200">
        <DataTable
          data={filteredServices}
          columns={columns}
          emptyMessage="No services found. Add your first service to get started!"
        />
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteService}
        onClose={() => setDeleteService(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeletingService}
        title="Delete Service"
        itemName={deleteService?.serviceTemplate?.title}
        description="Are you sure you want to delete this service? This action cannot be undone. Any existing bookings will remain active."
      />
    </div>
  );
}
