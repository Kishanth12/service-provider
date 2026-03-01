"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useService } from "@/lib/hooks/useServices";
import { ProviderService, ServiceTemplate } from "@/types";
import { ServiceCard } from "@/components/user/service/ServiceCard";
import { ServiceFilters } from "@/components/user/service/ServiceFilters";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";

export default function UserServicesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const { useAvailableServices } = useService();
  const {
    data: servicesData,
    isLoading: servicesLoading,
    error: servicesError,
    refetch,
  } = useAvailableServices();

  const services = Array.isArray(servicesData) ? servicesData : [];

  // Extract unique templates from services
  const templates = useMemo(() => {
    const uniqueTemplates = new Map<string, ServiceTemplate>();
    services.forEach((service) => {
      if (
        service.serviceTemplate &&
        !uniqueTemplates.has(service.serviceTemplate.id)
      ) {
        uniqueTemplates.set(
          service.serviceTemplate.id,
          service.serviceTemplate,
        );
      }
    });
    return Array.from(uniqueTemplates.values());
  }, [services]);

  // Filter and sort services
  const filteredAndSortedServices = useMemo(() => {
    let filtered = [...services];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (service) =>
          service.serviceTemplate?.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          service.serviceTemplate?.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          service.provider?.user?.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
    }

    // Template filter
    if (selectedTemplate !== "all") {
      filtered = filtered.filter(
        (service) => service.serviceTemplateId === selectedTemplate,
      );
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case "popular":
        // Placeholder for popularity sorting
        break;
    }

    return filtered;
  }, [services, searchQuery, selectedTemplate, sortBy]);

  const handleViewService = (service: ProviderService) => {
    router.push(`/user/services/${service.id}`);
  };

  if (servicesLoading) {
    return <LoadingSpinner />;
  }

  if (servicesError) {
    return <ErrorState message="Failed to load services" onRetry={refetch} />;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Browse Services</h1>
        <p className="text-slate-600 mt-1">
          Find and book services from trusted providers
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Card 1 */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sky-500/10 blur-2xl" />
          <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-2xl" />

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Available Services
              </p>
              <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
                {services.length}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Live services you can book
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600 ring-1 ring-sky-200/60 transition-transform duration-300 group-hover:scale-105">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 7h16M7 4v6m10-6v6M6 20h12a2 2 0 002-2V9a2 2 0 00-2-2H6a2 2 0 00-2 2v9a2 2 0 002 2z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 opacity-90" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-2xl" />
          <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-teal-500/10 blur-2xl" />

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Service Categories
              </p>
              <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
                {templates.length}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Unique templates available
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-200/60 transition-transform duration-300 group-hover:scale-105">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M7 6v12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.7"
                />
              </svg>
            </div>
          </div>

          <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 opacity-90" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-2xl" />
          <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-purple-500/10 blur-2xl" />

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Active Providers
              </p>
              <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
                {new Set(services.map((s) => s.providerId)).size}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Providers currently offering services
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 ring-1 ring-purple-200/60 transition-transform duration-300 group-hover:scale-105">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M16 11a4 4 0 10-8 0 4 4 0 008 0z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 21a8 8 0 10-16 0"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-500 opacity-90" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <ServiceFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedTemplate={selectedTemplate}
        onTemplateChange={setSelectedTemplate}
        templates={templates}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Services Grid */}
      {filteredAndSortedServices.length === 0 ? (
        <EmptyState
          title="No services found"
          description="Try adjusting your filters or search query"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onView={handleViewService}
            />
          ))}
        </div>
      )}
    </div>
  );
}
