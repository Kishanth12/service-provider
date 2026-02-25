"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Clock3, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils/cn";

const bookingSchema = z.object({
  providerServiceId: z.string().min(1, "Please select a service"),
  date: z.date({
    message: "Please select a date",
  }),
  timeSlot: z.string().min(1, "Please select a time slot"),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  providerServiceId?: string;
  onSubmit: (data: BookingFormValues) => void;
  isLoading?: boolean;
}

const timeSlots = [
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-13:00",
  "14:00-15:00",
  "15:00-16:00",
  "16:00-17:00",
  "17:00-18:00",
];

export function BookingForm({
  providerServiceId,
  onSubmit,
  isLoading,
}: BookingFormProps) {
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      providerServiceId: providerServiceId || "",
      date: undefined,
      timeSlot: "",
    },
  });

  return (
    <div className="relative">
      {/* soft glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-sky-300/20 blur-3xl dark:bg-sky-500/10" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-500/10" />
      </div>

      <div className="rounded-2xl border border-slate-200/70 bg-white/75 backdrop-blur-xl p-5 sm:p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-950/40">
        {/* header */}
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              Create a Booking
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Choose a date and time slot to confirm your booking.
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300">
            <Sparkles className="h-3.5 w-3.5" />
            Fast Booking
          </span>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-slate-700 dark:text-slate-200">
                    Date
                  </FormLabel>

                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "h-11 w-full justify-start rounded-xl border-slate-200 bg-white shadow-sm px-3 text-left font-medium text-slate-800",
                            "hover:bg-slate-50 transition",
                            "dark:border-slate-800 dark:bg-slate-950/30 dark:hover:bg-slate-900/40 dark:text-slate-200",
                            !field.value &&
                              "text-slate-400 dark:text-slate-500",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-60" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>

                    <PopoverContent
                      className="w-auto p-2 rounded-2xl border border-slate-200/70 bg-white/90 backdrop-blur-xl shadow-xl dark:border-slate-800 dark:bg-slate-950/90"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time Slot */}
            <FormField
              control={form.control}
              name="timeSlot"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 dark:text-slate-200">
                    Time Slot
                  </FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/30">
                        <div className="flex items-center gap-2">
                          <Clock3 className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                          <SelectValue placeholder="Select a time slot" />
                        </div>
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent className="rounded-xl">
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-11 rounded-xl shadow-sm transition hover:shadow-md"
              disabled={isLoading}
            >
              {isLoading ? "Creating booking..." : "Book Now"}
            </Button>

            <p className="text-xs text-center text-slate-500 dark:text-slate-400">
              You can’t select past dates.
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
}
