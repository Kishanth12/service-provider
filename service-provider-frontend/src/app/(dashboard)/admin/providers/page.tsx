"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProvider } from "@/lib/hooks/useProviders";
import { Provider } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, Users, Briefcase, Sparkles } from "lucide-react";
import { ProviderStats } from "@/components/Admin/provider/ProviderStats";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { DataTable } from "@/components/shared/DataTable";

export default function AdminProvidersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const { useProviders } = useProvider();
  const { data: providers = [], isLoading, error, refetch } = useProviders();

  const filteredProviders = providers.filter((provider) => {
    const name = provider.user?.name?.toLowerCase() || "";
    return name.includes(searchQuery.toLowerCase());
  });

  const handleView = (provider: Provider) => {
    router.push(`/admin/providers/${provider.id}`);
  };

  const columns = [
    {
      header: "Provider",
      accessorKey: "name",
      cell: (provider: Provider) => (
        <div className="min-w-[220px]">
          <p className="font-semibold text-slate-900">
            {provider.user?.name || "-"}
          </p>
          <p className="text-sm text-slate-500">
            {provider.user?.email || "-"}
          </p>
        </div>
      ),
    },
    {
      header: "Services",
      accessorKey: "services",
      cell: (provider: Provider) => (
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700">
          <Briefcase className="h-4 w-4 text-slate-500" />
          {provider._count?.providerServices ?? 0} services
        </div>
      ),
    },
    {
      header: "Joined",
      accessorKey: "createdAt",
      cell: (provider: Provider) => (
        <div className="min-w-[150px]">
          <p className="font-medium text-slate-900">
            {new Date(provider.createdAt).toLocaleDateString()}
          </p>
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
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleView(provider)}
          className="rounded-xl border border-transparent hover:border-slate-200 hover:bg-slate-50"
        >
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
      ),
    },
  ];

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return <ErrorState message="Failed to load providers" onRetry={refetch} />;

  return (
    <div className="p-6">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-28 -right-28 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-28 h-80 w-80 rounded-full bg-fuchsia-300/15 blur-3xl" />
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex h-1 w-28 rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 opacity-80" />
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
              Providers Management
            </h1>
            <p className="text-slate-600 mt-1">
              View and monitor all service providers
            </p>
          </div>

          {/* Small badge */}
          <div className="hidden md:flex items-center gap-2 rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3 shadow-sm backdrop-blur-xl">
            <Users className="h-5 w-5 text-slate-600" />
            <div>
              <p className="text-xs text-slate-500">Total Providers</p>
              <p className="text-lg font-extrabold text-slate-900">
                {providers.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats (your component) */}
      <div className="mb-6">
        <ProviderStats providers={providers} />
      </div>

      {/* Search */}
      <div className="mb-6 rounded-2xl border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm">
        <div className="p-4 md:p-5">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search by provider name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 rounded-xl bg-white shadow-sm border-slate-200"
              />
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
              <Sparkles className="h-4 w-4" />
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {filteredProviders.length}
              </span>{" "}
              results
            </div>
          </div>
        </div>
      </div>

      {/* Providers Table */}
      <div className="rounded-2xl border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm overflow-hidden">
        <DataTable
          data={filteredProviders}
          columns={columns}
          emptyMessage="No providers found"
        />
      </div>
    </div>
  );
}
