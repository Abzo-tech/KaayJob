export interface Coordinates {
    latitude: number;
    longitude: number;
}
export interface GeocodingApiResponse {
    display_name: string;
    lat: string;
    lon: string;
}
export interface ParsedGeocodingResult {
    address: string;
    latitude: number;
    longitude: number;
}
export declare function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number;
export declare function validateCoordinates(latitude: number, longitude: number): boolean;
export declare function filterByDistance<T extends Coordinates>(items: T[], center: Coordinates, maxDistanceKm: number): T[];
export declare function sortByDistance<T extends Coordinates>(items: T[], center: Coordinates): T[];
export declare function parseGeocodingResponse(response: GeocodingApiResponse): ParsedGeocodingResult;
export declare function getFallbackGeocodingResult(): ParsedGeocodingResult & {
    error: true;
};
//# sourceMappingURL=geolocationService.d.ts.map