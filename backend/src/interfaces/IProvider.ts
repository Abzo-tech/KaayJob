/**
 * Interfaces pour les prestataires
 */

export interface IProvider {
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
  createdAt: Date;
  updatedAt?: Date;
  // Joined fields
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  businessName?: string;
}

export interface IProviderCreate {
  specialty?: string;
  bio?: string;
  hourlyRate?: number;
  yearsExperience?: number;
  location?: string;
}

export interface IProviderUpdate {
  specialty?: string;
  bio?: string;
  hourlyRate?: number;
  yearsExperience?: number;
  location?: string;
  isAvailable?: boolean;
}

export interface IProviderFilter {
  specialty?: string;
  location?: string;
  minRating?: number;
  isAvailable?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}
