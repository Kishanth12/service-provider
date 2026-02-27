"use client";

import { useParams, useRouter } from "next/navigation";
import { useProvider } from "@/lib/hooks/useProviders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Mail,
  Calendar,
  Package,
  User,
  Clock,
  Sparkles,
} from "lucide-react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";

export default function ProviderViewPage() {
  const params = useParams();
  const router = useRouter();
  const providerId = params.id as string;

  const { useProviderById } = useProvider();
  const {
    data: provider,
    isLoading,
    error,
    refetch,
  } = useProviderById(providerId);

  if (isLoading) return <LoadingSpinner />;

  if (error || !provider) {
    return (
      <ErrorState message="Failed to load provider details" onRetry={refetch} />
    );
  }

  const servicesCount = provider._count?.providerServices ?? 0;

  const daysActive = Math.floor(
    (Date.now() - new Date(provider.createdAt).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-28 -right-28 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-28 h-80 w-80 rounded-full bg-fuchsia-300/15 blur-3xl" />
      </div>

      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 rounded-xl border border-transparent hover:border-slate-200 hover:bg-white/60"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Providers
        </Button>

        <div className="rounded-3xl border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 opacity-70" />

          <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-slate-900/5 flex items-center justify-center">
                  <User className="h-6 w-6 text-slate-900" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 truncate">
                    {provider.user?.name || "Provider"}
                  </h1>
                  <p className="text-slate-600 mt-1">Provider Details</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600">
                  <Sparkles className="h-4 w-4" />
                  Provider Account
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600">
                  <Package className="h-4 w-4" />
                  {servicesCount} services
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600">
                  <Clock className="h-4 w-4" />
                  {daysActive} days active
                </span>
              </div>
            </div>

            {/* Right mini info */}
            <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
              <div className="rounded-2xl bg-slate-900/5 p-4 text-center">
                <p className="text-xs text-slate-600">Services</p>
                <p className="text-2xl font-extrabold text-slate-900">
                  {servicesCount}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-900/5 p-4 text-center">
                <p className="text-xs text-slate-600">Bookings</p>
                <p className="text-2xl font-extrabold text-slate-900">0</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact */}
        <Card className="rounded-2xl border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 opacity-60" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl bg-slate-900/5 p-4">
              <p className="text-xs text-slate-600 mb-1">Full Name</p>
              <p className="font-semibold text-slate-900">
                {provider.user?.name || "-"}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-900/5 p-4">
              <p className="text-xs text-slate-600 mb-1">Email Address</p>
              <p className="font-semibold text-slate-900">
                {provider.user?.email || "-"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Account */}
        <Card className="rounded-2xl border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 opacity-60" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl bg-slate-900/5 p-4">
              <p className="text-xs text-slate-600 mb-1">Created At</p>
              <p className="font-semibold text-slate-900">
                {new Date(provider.createdAt).toLocaleString("en-US", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-900/5 p-4">
              <p className="text-xs text-slate-600 mb-1">Provider ID</p>
              <p className="font-mono text-sm text-slate-600 break-all">
                {provider.id}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Services Overview */}
        <Card className="md:col-span-2 rounded-2xl border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 opacity-60" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Services Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-slate-900/5 p-5 text-center">
                <p className="text-xs text-slate-600">Active Services</p>
                <p className="mt-2 text-4xl font-extrabold text-slate-900">
                  {servicesCount}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-900/5 p-5 text-center">
                <p className="text-xs text-slate-600">Total Bookings</p>
                <p className="mt-2 text-4xl font-extrabold text-slate-900">0</p>
              </div>

              <div className="rounded-2xl bg-slate-900/5 p-5 text-center">
                <p className="text-xs text-slate-600">Days Active</p>
                <p className="mt-2 text-4xl font-extrabold text-slate-900">
                  {daysActive}
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-500 text-center">
              Services count is taken from{" "}
              <span className="font-semibold">
                provider._count.providerServices
              </span>
              .
            </p>
          </CardContent>
        </Card>

        {/* Activity Summary */}
        <Card className="md:col-span-2 rounded-2xl border border-slate-200/70 bg-white/60 backdrop-blur-xl shadow-sm overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 opacity-60" />
          <CardHeader>
            <CardTitle>Activity Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="rounded-2xl bg-white/60 border border-slate-200/60 p-5">
                <p className="text-2xl font-extrabold text-slate-900">
                  {servicesCount}
                </p>
                <p className="text-sm text-slate-600 mt-1">Total Services</p>
              </div>

              <div className="rounded-2xl bg-white/60 border border-slate-200/60 p-5">
                <p className="text-2xl font-extrabold text-slate-900">0</p>
                <p className="text-sm text-slate-600 mt-1">Total Bookings</p>
              </div>

              <div className="rounded-2xl bg-white/60 border border-slate-200/60 p-5">
                <p className="text-2xl font-extrabold text-slate-900">
                  {daysActive}
                </p>
                <p className="text-sm text-slate-600 mt-1">Days Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
