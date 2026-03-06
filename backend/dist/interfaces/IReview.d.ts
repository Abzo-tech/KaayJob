/**
 * Interfaces pour les avis
 */
export interface IReview {
    id: string;
    bookingId: string;
    clientId: string;
    providerId: string;
    serviceId?: string;
    rating: number;
    comment?: string;
    isVerified: boolean;
    createdAt: Date;
    updatedAt?: Date;
}
export interface IReviewCreate {
    bookingId: string;
    rating: number;
    comment?: string;
}
export interface IReviewUpdate {
    rating?: number;
    comment?: string;
}
export interface IReviewFilter {
    providerId?: string;
    serviceId?: string;
    minRating?: number;
    page?: number;
    limit?: number;
}
//# sourceMappingURL=IReview.d.ts.map