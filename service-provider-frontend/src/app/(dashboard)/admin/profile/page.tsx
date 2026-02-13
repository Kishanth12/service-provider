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

  const totalRevenue = bookings
    .filter((b) => b.status === BookingStatus.COMPLETED)
    .reduce((sum, b) => sum + (b.providerService?.price || 0), 0);

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Admin Profile</h1>
        <p className="text-slate-600 mt-1">
          System administrator account and platform overview
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input value={user.name} disabled={!isEditing} className="mt-1" />
            </div>
            <div>
              <Label className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input value={user.email} disabled className="mt-1" />
              <p className="text-xs text-slate-500 mt-1">
                Email cannot be changed
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Account Details */}
        <Card>
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
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                  {user.role}
                </span>
              </div>
            </div>
            <div>
              <Label>Admin Since</Label>
              <p className="text-slate-700 mt-1">
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Total Users</span>
              <span className="text-xl font-bold">{allUsers.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Providers</span>
              <span className="text-xl font-bold">{providers.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Bookings</span>
              <span className="text-xl font-bold">{bookings.length}</span>
            </div>
          </CardContent>
        </Card>

        {/* Platform Statistics */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Platform Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-blue-600">
                  {allUsers.filter((u) => u.role === Role.USER).length}
                </p>
                <p className="text-sm text-slate-600 mt-1">Customers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-600">
                  {providers.length}
                </p>
                <p className="text-sm text-slate-600 mt-1">Service Providers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-600">
                  {templates.length}
                </p>
                <p className="text-sm text-slate-600 mt-1">Service Templates</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-orange-600">
                  {allUsers.filter((u) => u.role === Role.ADMIN).length}
                </p>
                <p className="text-sm text-slate-600 mt-1">Administrators</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Statistics */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Booking Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{bookings.length}</p>
                <p className="text-sm text-slate-600">Total Bookings</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">
                  {
                    bookings.filter((b) => b.status === BookingStatus.PENDING)
                      .length
                  }
                </p>
                <p className="text-sm text-slate-600">Pending</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {
                    bookings.filter((b) => b.status === BookingStatus.ACCEPTED)
                      .length
                  }
                </p>
                <p className="text-sm text-slate-600">Accepted</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {
                    bookings.filter((b) => b.status === BookingStatus.COMPLETED)
                      .length
                  }
                </p>
                <p className="text-sm text-slate-600">Completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">
                  {
                    bookings.filter((b) => b.status === BookingStatus.CANCELLED)
                      .length
                  }
                </p>
                <p className="text-sm text-slate-600">Cancelled</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue */}
        <Card className="md:col-span-2 lg:col-span-3 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Financial Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-green-600">
                  {bookings.length > 0
                    ? (
                        (bookings.filter(
                          (b) => b.status === BookingStatus.COMPLETED
                        ).length /
                          bookings.length) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </p>
                <p className="text-sm text-slate-600 mt-1">Completion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-3">
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        ) : (
          <>
            <Button onClick={() => setIsEditing(false)}>Save Changes</Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
