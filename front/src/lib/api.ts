/**
 * Configuration API pour KaayJob
 * Point central pour les appels au backend
 * Utilise le proxy Vite (/api -> backend) en local
 * Utilise le proxy Vercel (/api -> backend) en production
 */

// En production (Vercel), utiliser le proxy Vercel (/api -> backend)
// En local, utiliser le proxy Vite (/api -> backend localhost)
const API_BASE_URL = "/api";

/**
 * headers par défaut pour les requêtes
 */
const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const token = localStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Gestion des réponses API
 */
const handleResponse = async (response: Response): Promise<any> => {
  const data = await response.json();

  if (!response.ok) {
    // Gérer les erreurs de validation
    if (data.errors && Array.isArray(data.errors)) {
      const errorMessages = data.errors
        .map((e: any) => e.msg || e.message)
        .join(", ");
      throw new Error(errorMessages || "Une erreur de validation est survenue");
    }
    throw new Error(data.message || "Une erreur est survenue");
  }

  return data;
};

/**
 * Methods HTTP
 */

export const api = {
  // GET request
  async get<T = any>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  // POST request
  async post<T = any>(endpoint: string, body?: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse(response);
  },

  // PUT request
  async put<T = any>(endpoint: string, body?: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse(response);
  },

  // DELETE request
  async delete<T = any>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

/**
 * Types de réponses API
 */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: "client" | "prestataire" | "admin";
    avatar?: string;
  };
  token: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: "client" | "prestataire" | "admin";
  avatar?: string;
}

export interface Provider {
  id: string;
  userId: string;
  specialty?: string;
  bio?: string;
  hourlyRate?: number;
  yearsExperience?: number;
  location?: string;
  isAvailable: boolean;
  rating: number;
  totalReviews: number;
  totalBookings: number;
  isVerified: boolean;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface Service {
  id: string;
  providerId: string;
  categoryId?: string;
  name: string;
  description?: string;
  price: number;
  priceType: "fixed" | "hourly" | "quote";
  duration?: number;
  isActive: boolean;
}

export interface Booking {
  id: string;
  clientId: string;
  providerId: string;
  serviceId?: string;
  bookingDate: string;
  bookingTime: string;
  duration: number;
  status:
    | "pending"
    | "confirmed"
    | "in_progress"
    | "completed"
    | "cancelled"
    | "rejected";
  address: string;
  city: string;
  phone?: string;
  notes?: string;
  totalAmount: number;
  paymentStatus: "pending" | "paid" | "refunded";
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
}
