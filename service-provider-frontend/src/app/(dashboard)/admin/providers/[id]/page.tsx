"use client";

import { useParams, useRouter } from "next/navigation";
import { useProvider } from "@/lib/hooks/useProviders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, Calendar, Package } from "lucide-react";
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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !provider) {
    return (
      <ErrorState message="Failed to load provider details" onRetry={refetch} />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Providers
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{provider.user?.name}</h1>
            <p className="text-slate-600 mt-1">Provider Details</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-slate-600 mb-1">Full Name</p>
              <p className="font-medium">{provider.user?.name}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Email Address</p>
              <p className="font-medium">{provider.user?.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-slate-600 mb-1">Created At</p>
              <p className="font-medium">
                {new Date(provider.createdAt).toLocaleString("en-US", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Services Summary */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Services Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-4xl font-bold">
                {provider.providerServices?.length || 0}
              </p>
              <p className="text-slate-600 mt-2">Active Services</p>
            </div>
          </CardContent>
        </Card>

        {/* Activity Summary */}
        <Card className="md:col-span-2 bg-slate-50">
          <CardHeader>
            <CardTitle>Activity Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">
                  {provider.providerServices?.length || 0}
                </p>
                <p className="text-sm text-slate-600">Total Services</p>
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-slate-600">Total Bookings</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {Math.floor(
                    (Date.now() - new Date(provider.createdAt).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}
                </p>
                <p className="text-sm text-slate-600">Days Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
