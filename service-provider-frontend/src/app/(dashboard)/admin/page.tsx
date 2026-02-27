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

function formatMoney(amount: number) {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function StatCard({
  title,
  value,
  subText,
  icon: Icon,
  accent = "blue",
}: {
  title: string;
  value: React.ReactNode;
  subText?: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  accent?: "blue" | "green" | "purple" | "orange";
}) {
  const accentMap = {
    blue: {
      border: "border-sky-200/70",
      glow: "from-sky-500/15 via-indigo-500/10 to-transparent",
      iconBg: "bg-sky-500/10",
      iconText: "text-sky-600",
      dot: "bg-sky-500",
    },
    green: {
      border: "border-emerald-200/70",
      glow: "from-emerald-500/15 via-lime-500/10 to-transparent",
      iconBg: "bg-emerald-500/10",
      iconText: "text-emerald-600",
      dot: "bg-emerald-500",
    },
    purple: {
      border: "border-violet-200/70",
      glow: "from-violet-500/15 via-fuchsia-500/10 to-transparent",
      iconBg: "bg-violet-500/10",
      iconText: "text-violet-600",
      dot: "bg-violet-500",
    },
    orange: {
      border: "border-orange-200/70",
      glow: "from-orange-500/15 via-amber-500/10 to-transparent",
      iconBg: "bg-orange-500/10",
      iconText: "text-orange-600",
      dot: "bg-orange-500",
    },
  } as const;

  const a = accentMap[accent];

  return (
    <Card
      className={`relative overflow-hidden border ${a.border} bg-white/75 backdrop-blur-xl shadow-sm`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${a.glow}`}
      />
      <CardContent className="relative p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span className={`h-2 w-2 rounded-full ${a.dot}`} />
              {title}
            </div>
            <div className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
              {value}
            </div>
            {subText && (
              <div className="mt-1 text-xs text-slate-500">{subText}</div>
            )}
          </div>

          <div
            className={`h-12 w-12 rounded-2xl ${a.iconBg} flex items-center justify-center`}
          >
            <Icon className={`h-6 w-6 ${a.iconText}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RolePill({ role }: { role: Role }) {
  const cls =
    role === Role.ADMIN
      ? "bg-purple-100 text-purple-800"
      : role === Role.PROVIDER
        ? "bg-green-100 text-green-800"
        : "bg-blue-100 text-blue-800";

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${cls}`}>{role}</span>
  );
}

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
    (b) => b.status === BookingStatus.COMPLETED,
  ).length;
  const pendingBookings = bookings.filter(
    (b) => b.status === BookingStatus.PENDING,
  ).length;

  const completionRate =
    bookings.length > 0 ? (completedBookings / bookings.length) * 100 : 0;

  const activeCustomers = new Set(bookings.map((b) => b.userId)).size;

  const recentBookings = [...bookings]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  const recentUsers = [...allUsers]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  const activeTemplatesCount = templates.filter((t) => t.isActive).length;
  const activeTemplatesPercent =
    templates.length > 0 ? (activeTemplatesCount / templates.length) * 100 : 0;

  if (usersLoading || providersLoading || templatesLoading || bookingsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-[calc(100vh-1px)]">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-28 -right-28 h-96 w-96 rounded-full bg-sky-300/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-fuchsia-300/15 blur-3xl" />
      </div>

      <div className="p-6 space-y-6">
        {/* Hero Header */}
        <Card className="overflow-hidden border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm">
          <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 opacity-70" />
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                  Welcome back, {user?.name?.split(" ")[0] || "Admin"} 👋
                </h1>
                <p className="text-slate-600 mt-1">
                  Here’s your platform overview and analytics
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                  <span className="rounded-full bg-slate-100 px-3 py-1">
                    {customers.length} customers
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">
                    {providers.length} providers
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">
                    {admins.length} admins
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => router.push("/admin/bookings")}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  View Bookings
                </Button>
                <Button onClick={() => router.push("/admin/services")}>
                  <Package className="h-4 w-4 mr-2" />
                  Manage Templates
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Users"
            value={allUsers.length}
            subText={`${customers.length} customers`}
            icon={Users}
            accent="blue"
          />
          <StatCard
            title="Providers"
            value={providers.length}
            subText={`${providers.length} active`}
            icon={Briefcase}
            accent="green"
          />
          <StatCard
            title="Total Bookings"
            value={bookings.length}
            subText={`${pendingBookings} pending`}
            icon={Calendar}
            accent="purple"
          />
          <StatCard
            title="Revenue"
            value={`$${formatMoney(totalRevenue)}`}
            subText={`${completedBookings} completed bookings`}
            icon={DollarSign}
            accent="orange"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <StatCard
            title="Service Templates"
            value={templates.length}
            subText={`${activeTemplatesCount} active`}
            icon={Package}
            accent="blue"
          />
          <StatCard
            title="Completion Rate"
            value={`${completionRate.toFixed(1)}%`}
            subText="completed / total bookings"
            icon={TrendingUp}
            accent="green"
          />
          <StatCard
            title="Active Customers"
            value={activeCustomers}
            subText="unique customers who booked"
            icon={Activity}
            accent="purple"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Bookings */}
          <Card className="lg:col-span-2 border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Bookings</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/admin/bookings")}
                >
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentBookings.length === 0 ? (
                  <div className="text-center py-10 text-slate-500">
                    No bookings yet
                  </div>
                ) : (
                  recentBookings.map((booking) => {
                    const title =
                      booking.providerService?.serviceTemplate?.title ??
                      "Service";
                    const customerName = booking.user?.name ?? "Unknown";
                    const providerName =
                      booking.providerService?.provider?.user?.name ??
                      "Unknown";
                    const price =
                      booking.providerService?.price != null
                        ? booking.providerService.price.toFixed(2)
                        : "0.00";

                    return (
                      <div
                        key={booking.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200/70 hover:bg-white/70 transition cursor-pointer"
                        onClick={() => router.push("/admin/bookings")}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm text-slate-900 truncate">
                            {title}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            Customer: {customerName} • Provider: {providerName}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {new Date(booking.createdAt).toLocaleString()}
                          </p>
                        </div>

                        <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center gap-2">
                          <BookingStatusBadge status={booking.status} />
                          <p className="text-sm font-extrabold text-emerald-600">
                            ${price}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm">
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
          <Card className="lg:col-span-2 border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Users</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/admin/users")}
                >
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentUsers.length === 0 ? (
                  <div className="text-center py-10 text-slate-500">
                    No users yet
                  </div>
                ) : (
                  recentUsers.map((u) => (
                    <div
                      key={u.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200/70"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm text-slate-900 truncate">
                          {u.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-1 truncate">
                          {u.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <RolePill role={u.role as Role} />
                        <p className="text-xs text-slate-400">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Platform Health */}
          <Card className="border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm">
            <CardHeader>
              <CardTitle>Platform Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">
                    Active Templates
                  </span>
                  <span className="font-semibold">
                    {activeTemplatesCount}/{templates.length}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{ width: `${activeTemplatesPercent}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  {activeTemplatesPercent.toFixed(1)}% templates active
                </p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Provider Count</span>
                <span className="font-semibold text-emerald-600">
                  +{providers.length}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Customer Count</span>
                <span className="font-semibold text-sky-600">
                  +{customers.length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
