// Enums matching your Prisma schema
export enum Role {
  USER = "USER",
  PROVIDER = "PROVIDER",
  ADMIN = "ADMIN",
}

export enum BookingStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

// Models
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Provider {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  _count?: {
    providerServices: number;
  };
}

export interface ProviderService {
  id: string;
  providerId: string;
  serviceTemplateId: string;
  price: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  averageRating?: number; // Add this
  reviewCount?: number;   // Add this
  serviceTemplate?: ServiceTemplate;
  provider?: Provider;
}
export interface ServiceTemplate {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    providerServices: number;
  };
}

export interface Booking {
  id: string;
  userId: string;
  providerServiceId: string;
  date: string;
  timeSlot: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  user?: User;
  providerService?: ProviderService;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  userId: string;
  providerServiceId: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  providerService?: ProviderService;
}

// Auth types
export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: Role;
}
