import { format } from "date-fns";

export const formatDate = (date: string | Date, formatStr: string = "PPP") => {
  return format(new Date(date), formatStr);
};

export const formatTime = (date: string | Date) => {
  return format(new Date(date), "p");
};

export const formatDateTime = (date: string | Date) => {
  return format(new Date(date), "PPP p");
};

export const formatCurrency = (amount: number, currency: string = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};

export const formatTimeSlot = (timeSlot: string) => {
  // Assumes format like "09:00-10:00"
  return timeSlot;
};
