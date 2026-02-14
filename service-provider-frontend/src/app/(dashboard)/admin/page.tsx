"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useUser } from "@/lib/hooks/useUsers";
import { useProvider } from "@/lib/hooks/useProviders";
import { useService } from "@/lib/hooks/useServices";
import { useBooking } from "@/lib/hooks/useBookings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import {
  Users,
  Briefcase,
  Calendar,
  DollarSign,
  TrendingUp,
  Package,
  ChevronRight,
  Activity,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Role, BookingStatus } from "@/types";
import { BookingStatusBadge } from "@/components/user/bookings/BookingStatusBadge";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { useUsers } = useUser();
  const { useProviders } = useProvider();
  const { useServiceTemplates } = useService();
  const { useAllBookings } = useBooking();

  const { data: usersData, isLoading: usersLoading } = useUsers();
  const { data: providersData, isLoading: providersLoading } = useProviders();
  const { data: templatesData, isLoading: templatesLoading } =
    useServiceTemplates();
  const { data: bookingsData, isLoading: bookingsLoading } = useAllBookings();

  const allUsers = Array.isArray(usersData) ? usersData : [];
  const providers = Array.isArray(providersData) ? providersData : [];
  const templates = Array.isArray(templatesData) ? templatesData : [];
  const bookings = Array.isArray(bookingsData) ? bookingsData : [];

  const customers = allUsers.filter((u) => u.role === Role.USER);
  const admins = allUsers.filter((u) => u.role === Role.ADMIN);

  const totalRevenue = bookings
    .filter((b) => b.status === BookingStatus.COMPLETED)
    .reduce((sum, b) => sum + (b.providerService?.price || 0), 0);

  const completedBookings = bookings.filter(
    (b) => b.status === BookingStatus.COMPLETED
  ).length;

  const pendingBookings = bookings.filter(
    (b) => b.status === BookingStatus.PENDING
  ).length;

  const recentBookings = bookings
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const recentUsers = allUsers
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  if (usersLoading || providersLoading || templatesLoading || bookingsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, Admin {user?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-slate-600 mt-1">
          Here's your platform overview and analytics
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Users</p>
                <p className="text-3xl font-bold mt-2">{allUsers.length}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {customers.length} customers
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-500 bg-opacity-10 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Providers</p>
                <p className="text-3xl font-bold mt-2">{providers.length}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {providers.length} active
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-500 bg-opacity-10 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Bookings</p>
                <p className="text-3xl font-bold mt-2">{bookings.length}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {pendingBookings} pending
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-500 bg-opacity-10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{templates.length}</p>
                <p className="text-sm text-slate-600">Service Templates</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {bookings.length > 0
                    ? ((completedBookings / bookings.length) * 100).toFixed(1)
                    : 0}
                  %
                </p>
                <p className="text-sm text-slate-600">Completion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Activity className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {new Set(bookings.map((b) => b.userId)).size}
                </p>
                <p className="text-sm text-slate-600">Active Customers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Bookings</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/admin/bookings")}
              >
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50 cursor-pointer"
                  onClick={() => router.push("/admin/bookings")}
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {booking.providerService?.serviceTemplate?.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Customer: {booking.user?.name} • Provider:{" "}
                      {booking.providerService?.provider?.user?.name}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(booking.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <BookingStatusBadge status={booking.status} />
                    <p className="text-sm font-semibold text-green-600">
                      ${booking.providerService?.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => router.push("/admin/users")}
            >
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => router.push("/admin/providers")}
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Manage Providers
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => router.push("/admin/services")}
            >
              <Package className="h-4 w-4 mr-2" />
              Service Templates
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => router.push("/admin/bookings")}
            >
              <Calendar className="h-4 w-4 mr-2" />
              All Bookings
            </Button>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Users</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/admin/users")}
              >
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-slate-500 mt-1">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        user.role === Role.ADMIN
                          ? "bg-purple-100 text-purple-800"
                          : user.role === Role.PROVIDER
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role}
                    </span>
                    <p className="text-xs text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Platform Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Active Services</span>
                <span className="font-semibold">
                  {templates.filter((t) => t.isActive).length}/
                  {templates.length}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${
                      templates.length > 0
                        ? (templates.filter((t) => t.isActive).length /
                            templates.length) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Provider Growth</span>
                <span className="font-semibold text-green-600">
                  +{providers.length}
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Customer Growth</span>
                <span className="font-semibold text-blue-600">
                  +{customers.length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
