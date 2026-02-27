"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/hooks/useAuth";
import { useUser } from "@/lib/hooks/useUsers";
import { useProvider } from "@/lib/hooks/useProviders";
import { useService } from "@/lib/hooks/useServices";
import { useBooking } from "@/lib/hooks/useBookings";
import {
  User,
  Mail,
  Calendar,
  Shield,
  Users,
  Briefcase,
  FileText,
  TrendingUp,
  Layers,
  DollarSign,
} from "lucide-react";
import { useState } from "react";
import { Role, BookingStatus } from "@/types";

export default function AdminProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const { useUsers } = useUser();
  const { useProviders } = useProvider();
  const { useServiceTemplates } = useService();
  const { useAllBookings } = useBooking();

  const { data: usersData } = useUsers();
  const { data: providersData } = useProviders();
  const { data: templatesData } = useServiceTemplates();
  const { data: bookingsData } = useAllBookings();

  const allUsers = Array.isArray(usersData) ? usersData : [];
  const providers = Array.isArray(providersData) ? providersData : [];
  const templates = Array.isArray(templatesData) ? templatesData : [];
  const bookings = Array.isArray(bookingsData) ? bookingsData : [];

  const completedCount = bookings.filter(
    (b) => b.status === BookingStatus.COMPLETED,
  ).length;

  const completionRate =
    bookings.length > 0
      ? ((completedCount / bookings.length) * 100).toFixed(1)
      : "0";

  const totalRevenue = bookings
    .filter((b) => b.status === BookingStatus.COMPLETED)
    .reduce((sum, b) => sum + (b.providerService?.price || 0), 0);

  if (!user) return null;

  const rolePill =
    user.role === Role.ADMIN
      ? "bg-purple-500/10 text-purple-700 ring-purple-500/15"
      : "bg-slate-500/10 text-slate-700 ring-slate-500/15";

  const StatTile = ({
    label,
    value,
    icon: Icon,
    glow,
  }: {
    label: string;
    value: React.ReactNode;
    icon: React.ComponentType<{ className?: string }>;
    glow: string;
  }) => (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 opacity-60" />
      <div className="p-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-600">{label}</p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
            {value}
          </p>
        </div>
        <div className="relative">
          <div className={`absolute inset-0 rounded-2xl ${glow} blur-xl`} />
          <div className="relative h-12 w-12 rounded-2xl bg-slate-900/5 flex items-center justify-center">
            <Icon className="h-6 w-6 text-slate-900" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-28 -right-28 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-28 h-80 w-80 rounded-full bg-fuchsia-300/15 blur-3xl" />
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex h-1 w-28 rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 opacity-80" />
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
          Admin Profile
        </h1>
        <p className="text-slate-600 mt-1">
          System administrator account and platform overview
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Personal Information */}
        <Card className="rounded-2xl border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 opacity-60" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input
                value={user.name}
                disabled={!isEditing}
                className="mt-1 rounded-xl"
              />
            </div>
            <div>
              <Label className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input value={user.email} disabled className="mt-1 rounded-xl" />
              <p className="text-xs text-slate-500 mt-1">
                Email cannot be changed
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Account Details */}
        <Card className="rounded-2xl border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 opacity-60" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Account Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Account Type
              </Label>
              <div className="mt-2">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ring-1 ${rolePill}`}
                >
                  {user.role}
                </span>
              </div>
            </div>
            <div>
              <Label>Admin Since</Label>
              <p className="text-slate-700 mt-1 font-medium">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div>
              <Label>Account ID</Label>
              <p className="font-mono text-sm text-slate-500 mt-1">{user.id}</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="rounded-2xl border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 opacity-60" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Total Users", value: allUsers.length },
              { label: "Providers", value: providers.length },
              { label: "Bookings", value: bookings.length },
            ].map((x) => (
              <div
                key={x.label}
                className="flex items-center justify-between rounded-xl bg-slate-900/5 p-3"
              >
                <span className="text-sm text-slate-600">{x.label}</span>
                <span className="text-xl font-extrabold text-slate-900">
                  {x.value}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Platform Overview */}
        <div className="md:col-span-2 lg:col-span-3 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatTile
            label="Customers"
            value={allUsers.filter((u) => u.role === Role.USER).length}
            icon={Users}
            glow="bg-sky-500/10"
          />
          <StatTile
            label="Service Providers"
            value={providers.length}
            icon={Briefcase}
            glow="bg-emerald-500/10"
          />
          <StatTile
            label="Service Templates"
            value={templates.length}
            icon={Layers}
            glow="bg-indigo-500/10"
          />
          <StatTile
            label="Administrators"
            value={allUsers.filter((u) => u.role === Role.ADMIN).length}
            icon={Shield}
            glow="bg-purple-500/10"
          />
        </div>

        {/* Booking Analytics */}
        <Card className="md:col-span-2 lg:col-span-3 rounded-2xl border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 opacity-60" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Booking Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              {[
                {
                  label: "Total",
                  value: bookings.length,
                  cls: "text-slate-900",
                },
                {
                  label: "Pending",
                  value: bookings.filter(
                    (b) => b.status === BookingStatus.PENDING,
                  ).length,
                  cls: "text-yellow-600",
                },
                {
                  label: "Accepted",
                  value: bookings.filter(
                    (b) => b.status === BookingStatus.ACCEPTED,
                  ).length,
                  cls: "text-blue-600",
                },
                {
                  label: "Completed",
                  value: completedCount,
                  cls: "text-emerald-600",
                },
                {
                  label: "Cancelled",
                  value: bookings.filter(
                    (b) => b.status === BookingStatus.CANCELLED,
                  ).length,
                  cls: "text-red-600",
                },
              ].map((x) => (
                <div key={x.label} className="rounded-2xl bg-slate-900/5 p-4">
                  <p className={`text-2xl font-extrabold ${x.cls}`}>
                    {x.value}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">{x.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Financial Overview */}
        <Card className="md:col-span-2 lg:col-span-3 rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/80 to-white backdrop-blur-xl shadow-sm overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 opacity-70" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Financial Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="rounded-2xl bg-white/60 p-5 border border-emerald-100/60">
                <p className="text-sm text-slate-600">Completion Rate</p>
                <p className="mt-2 text-3xl font-extrabold text-emerald-700">
                  {completionRate}%
                </p>
              </div>

              <div className="rounded-2xl bg-white/60 p-5 border border-emerald-100/60">
                <p className="text-sm text-slate-600">Completed Bookings</p>
                <p className="mt-2 text-3xl font-extrabold text-emerald-700">
                  {completedCount}
                </p>
              </div>

              <div className="rounded-2xl bg-white/60 p-5 border border-emerald-100/60">
                <p className="text-sm text-slate-600 flex items-center justify-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Total Revenue
                </p>
                <p className="mt-2 text-3xl font-extrabold text-emerald-700">
                  ${totalRevenue.toFixed(2)}
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-500 text-center">
              Revenue is calculated from{" "}
              <span className="font-semibold">completed</span> bookings only.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-3">
        {!isEditing ? (
          <Button className="rounded-xl" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        ) : (
          <>
            <Button className="rounded-xl" onClick={() => setIsEditing(false)}>
              Save Changes
            </Button>
            <Button
              className="rounded-xl"
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
