"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProvider } from "@/lib/hooks/useProviders";
import { Provider } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye } from "lucide-react";
import { ProviderStats } from "@/components/Admin/provider/ProviderStats";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { DataTable } from "@/components/shared/DataTable";

export default function AdminProvidersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const { useProviders } = useProvider();
  const { data: providers = [], isLoading, error, refetch } = useProviders();

  // Filter providers
  const filteredProviders = providers.filter((provider) => {
    const matchesSearch = provider.user?.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Handlers
  const handleView = (provider: Provider) => {
    router.push(`/admin/providers/${provider.id}`);
  };

  // Table columns
  const columns = [
    {
      header: "Provider Name",
      accessorKey: "name",
      cell: (provider: Provider) => (
        <div>
          <p className="font-medium">{provider.user?.name}</p>
          <p className="text-sm text-slate-500">{provider.user?.email}</p>
        </div>
      ),
    },
    {
      header: "Services",
      accessorKey: "services",
      cell: (provider: Provider) => (
        <p className="text-sm">
          {provider._count?.providerServices ?? 0} services
        </p>
      ),
    },
    {
      header: "Joined",
      accessorKey: "createdAt",
      cell: (provider: Provider) => (
        <div>
          <p>{new Date(provider.createdAt).toLocaleDateString()}</p>
          <p className="text-sm text-slate-500">
            {new Date(provider.createdAt).toLocaleTimeString([], {
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
      cell: (provider: Provider) => (
        <Button variant="ghost" size="sm" onClick={() => handleView(provider)}>
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
      ),
    },
  ];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorState message="Failed to load providers" onRetry={refetch} />;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Providers Management</h1>
        <p className="text-slate-600 mt-1">View all service providers</p>
      </div>

      {/* Stats */}
      <ProviderStats providers={providers} />

      {/* Search */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search by provider name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Providers Table */}
      <div className="bg-white rounded-lg border border-slate-200">
        <DataTable
          data={filteredProviders}
          columns={columns}
          emptyMessage="No providers found"
        />
      </div>
    </div>
  );
}
