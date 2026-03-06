/**
 * Service d'avis
 * Responsabilité: logique métier liée aux avis
 */
import { IReview, CreateReviewInput } from ".//interfaces/index.ts";
/**
 * Crée un nouvel avis
 */
export declare const createReview: (data: CreateReviewInput, clientId: string) => Promise<IReview>;
/**
 * Obtient les avis d'un prestataire
 */
export declare const getProviderReviews: (providerId: string, limit?: number, offset?: number) => Promise<{
    data: IReview[];
    total: number;
}>;
//# sourceMappingURL=ReviewService.d.ts.map