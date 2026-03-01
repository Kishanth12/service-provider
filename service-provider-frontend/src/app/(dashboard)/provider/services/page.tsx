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
  Layers,
  CheckCircle2,
  MessageSquareText,
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
import { cn } from "@/lib/utils/cn";

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
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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

function StatCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: "blue" | "emerald" | "amber";
}) {
  const tones = {
    blue: {
      chip: "bg-sky-500/10 text-sky-700 ring-sky-200",
      iconWrap: "bg-sky-500/10 text-sky-700",
      top: "from-sky-500 via-indigo-500 to-violet-500",
    },
    emerald: {
      chip: "bg-emerald-500/10 text-emerald-700 ring-emerald-200",
      iconWrap: "bg-emerald-500/10 text-emerald-700",
      top: "from-emerald-500 via-green-500 to-teal-500",
    },
    amber: {
      chip: "bg-amber-500/10 text-amber-700 ring-amber-200",
      iconWrap: "bg-amber-500/10 text-amber-700",
      top: "from-amber-500 via-yellow-500 to-orange-500",
    },
  };

  const t = tones[tone];

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 backdrop-blur-xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
      {/* top gradient accent */}
      <div
        className={cn("absolute inset-x-0 top-0 h-1 bg-gradient-to-r", t.top)}
      />

      {/* subtle decor */}
      <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-slate-900/5 blur-2xl" />
      <div className="pointer-events-none absolute -left-14 -bottom-14 h-40 w-40 rounded-full bg-slate-900/5 blur-2xl" />

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900">
            {value}
          </p>

          <div
            className={cn(
              "mt-3 inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
              t.chip,
            )}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Real-time
          </div>
        </div>

        <div
          className={cn(
            "shrink-0 rounded-2xl p-3 shadow-sm transition-transform duration-300 group-hover:scale-105",
            t.iconWrap,
          )}
          aria-hidden="true"
        >
          {icon}
        </div>
      </div>
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

  const totalServices = services.length;
  const availableCount = services.filter((s) => s.isAvailable).length;

  // Table columns
  const columns = [
    {
      header: "Service",
      accessorKey: "title",
      cell: (service: ProviderService) => (
        <div className="min-w-0">
          <p className="font-medium text-slate-900">
            {service.serviceTemplate?.title}
          </p>
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
        <p className="font-semibold text-slate-900">
          ${service.price.toFixed(2)}
        </p>
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
        <p className="text-sm text-slate-600">
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

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return <ErrorState message="Failed to load services" onRetry={refetch} />;
  }

  return (
    <div className="relative p-6">
      {/* subtle page glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-28 -right-24 h-72 w-72 rounded-full bg-sky-300/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-fuchsia-300/15 blur-3xl" />
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          My Services
        </h1>
        <p className="text-slate-600 mt-1">
          Manage your service offerings and availability
        </p>
      </div>

      {/* Stats (updated UI + professional icons) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Total Services"
          value={totalServices}
          tone="blue"
          icon={<Layers className="h-5 w-5" />}
        />
        <StatCard
          label="Available"
          value={availableCount}
          tone="emerald"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <StatCard
          label="Total Reviews"
          value={totalReviews}
          tone="amber"
          icon={<MessageSquareText className="h-5 w-5" />}
        />
      </div>

      {/* Filters and Actions */}
      <div className="rounded-2xl border border-slate-200/70 bg-white/80 backdrop-blur-xl p-4 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
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
            <SelectTrigger className="w-full md:w-56">
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
      <div className="rounded-2xl border border-slate-200/70 bg-white/80 backdrop-blur-xl shadow-sm overflow-hidden">
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
