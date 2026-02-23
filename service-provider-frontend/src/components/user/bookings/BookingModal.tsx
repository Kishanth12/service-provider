"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  Clock,
  X,
  Sparkles,
  User2,
  BadgeDollarSign,
} from "lucide-react";
import { ProviderService } from "@/types";

interface BookingModalProps {
  service: ProviderService;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { date: string; timeSlot: string }) => void;
  isSubmitting: boolean;
}

export function BookingModal({
  service,
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: BookingModalProps) {
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [errors, setErrors] = useState<{ date?: string; timeSlot?: string }>(
    {},
  );

  const timeSlots = [
    "09:00-10:00",
    "10:00-11:00",
    "11:00-12:00",
    "12:00-13:00",
    "13:00-14:00",
    "14:00-15:00",
    "15:00-16:00",
    "16:00-17:00",
    "17:00-18:00",
  ];

  const validateForm = (): boolean => {
    const newErrors: { date?: string; timeSlot?: string } = {};

    if (!date) {
      newErrors.date = "Please select a date";
    } else {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.date = "Please select a future date";
      }
    }

    if (!timeSlot) {
      newErrors.timeSlot = "Please select a time slot";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    onSubmit({ date, timeSlot });
  };

  const handleClose = () => {
    setDate("");
    setTimeSlot("");
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const today = new Date().toISOString().split("T")[0];

  const title = service.serviceTemplate?.title ?? "Service";
  const providerName = service.provider?.user?.name ?? "Unknown Provider";
  const price = service.price;
  const priceText = typeof price === "number" ? `$${price.toFixed(2)}` : "N/A";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200/70 bg-white/90 backdrop-blur-xl shadow-2xl dark:border-slate-800/60 dark:bg-slate-950/90"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient Top Line */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 opacity-80" />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-6 border-b border-slate-200/70 dark:border-slate-800/60">
          <div className="min-w-0">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Book Service
            </h2>
            <p className="text-sm text-slate-600 mt-1 truncate dark:text-slate-300">
              {title}
            </p>

            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300">
              <Sparkles className="h-3.5 w-3.5" />
              Quick booking
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-9 w-9 rounded-xl p-0 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Service Info */}
          <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-slate-950/40">
                  <User2 className="h-4 w-4 text-slate-500 dark:text-slate-300" />
                </span>
                <span>Provider</span>
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">
                {providerName}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 shadow-sm dark:bg-emerald-900/20 dark:text-emerald-300">
                  <BadgeDollarSign className="h-4 w-4" />
                </span>
                <span>Price</span>
              </div>
              <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {priceText}
              </span>
            </div>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label
              htmlFor="date"
              className="flex items-center gap-2 text-slate-700 dark:text-slate-200"
            >
              <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              Select Date <span className="text-red-500">*</span>
            </Label>

            <Input
              id="date"
              type="date"
              min={today}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (errors.date) setErrors({ ...errors, date: undefined });
              }}
              className={`h-11 rounded-xl bg-white shadow-sm transition focus-visible:ring-2 dark:bg-slate-950/30 ${
                errors.date
                  ? "border-red-500 focus-visible:ring-red-200"
                  : "border-slate-200 focus-visible:ring-slate-300 dark:border-slate-800 dark:focus-visible:ring-slate-700"
              }`}
              disabled={isSubmitting}
            />

            {errors.date && (
              <p className="text-sm text-red-500">{errors.date}</p>
            )}
          </div>

          {/* Time Slot Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
              <Clock className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              Select Time Slot <span className="text-red-500">*</span>
            </Label>

            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((slot) => {
                const selected = timeSlot === slot;

                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => {
                      setTimeSlot(slot);
                      if (errors.timeSlot)
                        setErrors({ ...errors, timeSlot: undefined });
                    }}
                    disabled={isSubmitting}
                    className={[
                      "rounded-xl border px-2 py-2 text-xs sm:text-sm font-semibold transition-all",
                      "shadow-sm hover:shadow-md",
                      selected
                        ? "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 dark:from-blue-900/20 dark:to-indigo-900/20 dark:text-blue-300"
                        : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/30 dark:hover:bg-slate-900/40",
                      isSubmitting
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer",
                    ].join(" ")}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>

            {errors.timeSlot && (
              <p className="text-sm text-red-500">{errors.timeSlot}</p>
            )}
          </div>

          {/* Notes */}
          <div className="rounded-2xl border border-blue-200/70 bg-blue-50/60 p-4 dark:border-blue-900/40 dark:bg-blue-900/20">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
              Important Notes
            </p>
            <ul className="text-sm text-blue-800 dark:text-blue-200/90 space-y-1 list-disc list-inside">
              <li>Your booking will be pending until provider accepts</li>
              <li>You can cancel before the service starts</li>
              <li>Payment will be processed after service completion</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-slate-200/70 dark:border-slate-800/60">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1 h-11 rounded-xl border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950/30 dark:hover:bg-slate-900/40"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 h-11 rounded-xl shadow-sm transition hover:shadow-md"
          >
            {isSubmitting ? "Booking..." : "Confirm Booking"}
          </Button>
        </div>
      </div>
    </div>
  );
}
