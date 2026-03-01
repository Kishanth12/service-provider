"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Calendar, Shield, Pencil, Save, X } from "lucide-react";

export default function UserProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (!user) return null;

  const daysActive = useMemo(() => {
    return Math.floor(
      (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24),
    );
  }, [user.createdAt]);

  const memberSince = useMemo(() => {
    return new Date(user.createdAt).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }, [user.createdAt]);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
          <p className="text-sm text-slate-600">
            Manage your account information
          </p>
        </div>

        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="w-full sm:w-auto"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              onClick={() => setIsEditing(false)}
              className="flex-1 sm:flex-none"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="flex-1 sm:flex-none"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Info */}
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-5 w-5 text-slate-700" />
              Personal Information
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label className="text-slate-600">Full Name</Label>
              <Input value={user.name} disabled={!isEditing} className="h-11" />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-slate-600">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input value={user.email} disabled className="h-11" />
              <p className="text-xs text-slate-500">Email cannot be changed</p>
            </div>
          </CardContent>
        </Card>

        {/* Account Details */}
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-5 w-5 text-slate-700" />
              Account Details
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-slate-600">
                <Shield className="h-4 w-4" />
                Account Type
              </Label>
              <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700">
                {user.role}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-600">Member Since</Label>
              <p className="text-slate-900 font-semibold">{memberSince}</p>
              <p className="text-xs text-slate-500">
                Active for <span className="font-semibold">{daysActive}</span>{" "}
                days
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Activity Summary */}
        <Card className="md:col-span-2 border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Activity Summary</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
                <p className="text-2xl font-bold text-slate-900">0</p>
                <p className="text-sm text-slate-600 mt-1">Total Bookings</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
                <p className="text-2xl font-bold text-slate-900">
                  {daysActive}
                </p>
                <p className="text-sm text-slate-600 mt-1">Days Active</p>
              </div>

              <div className="hidden sm:block rounded-xl border border-slate-200 bg-white p-4 text-center">
                <p className="text-2xl font-bold text-slate-900">{user.role}</p>
                <p className="text-sm text-slate-600 mt-1">Current Role</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
