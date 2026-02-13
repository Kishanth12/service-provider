"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, X } from "lucide-react";
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
    {}
  );

  // Available time slots
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
    if (!validateForm()) {
      return;
    }

    onSubmit({ date, timeSlot });
  };

  const handleClose = () => {
    setDate("");
    setTimeSlot("");
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">Book Service</h2>
            <p className="text-sm text-slate-600 mt-1">
              {service.serviceTemplate?.title}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Service Info */}
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Provider</span>
              <span className="font-medium">
                {service.provider?.user?.name}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Price</span>
              <span className="text-xl font-bold text-green-600">
                ${service.price.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
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
              className={errors.date ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {errors.date && (
              <p className="text-sm text-red-500">{errors.date}</p>
            )}
          </div>

          {/* Time Slot Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Select Time Slot <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => {
                    setTimeSlot(slot);
                    if (errors.timeSlot)
                      setErrors({ ...errors, timeSlot: undefined });
                  }}
                  disabled={isSubmitting}
                  className={`p-2 text-sm rounded border transition-colors ${
                    timeSlot === slot
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 hover:border-slate-300"
                  } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {slot}
                </button>
              ))}
            </div>
            {errors.timeSlot && (
              <p className="text-sm text-red-500">{errors.timeSlot}</p>
            )}
          </div>

          {/* Important Notes */}
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800 font-medium mb-2">
              Important Notes:
            </p>
            <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
              <li>Your booking will be pending until provider accepts</li>
              <li>You can cancel before the service starts</li>
              <li>Payment will be processed after service completion</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? "Booking..." : "Confirm Booking"}
          </Button>
        </div>
      </div>
    </div>
  );
}
