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

const EARTH_RADIUS_KM = 6371;

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

export function validateCoordinates(latitude: number, longitude: number): boolean {
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

export function filterByDistance<T extends Coordinates>(
  items: T[],
  center: Coordinates,
  maxDistanceKm: number,
): T[] {
  return items.filter((item) => {
    const distance = calculateDistance(
      center.latitude,
      center.longitude,
      item.latitude,
      item.longitude,
    );
    return distance <= maxDistanceKm;
  });
}

export function sortByDistance<T extends Coordinates>(
  items: T[],
  center: Coordinates,
): T[] {
  return [...items].sort((a, b) => {
    const distanceA = calculateDistance(
      center.latitude,
      center.longitude,
      a.latitude,
      a.longitude,
    );
    const distanceB = calculateDistance(
      center.latitude,
      center.longitude,
      b.latitude,
      b.longitude,
    );
    return distanceA - distanceB;
  });
}

export function parseGeocodingResponse(
  response: GeocodingApiResponse,
): ParsedGeocodingResult {
  return {
    address: response.display_name,
    latitude: parseFloat(response.lat),
    longitude: parseFloat(response.lon),
  };
}

export function getFallbackGeocodingResult(): ParsedGeocodingResult & { error: true } {
  return {
    address: "Adresse inconnue",
    latitude: 0,
    longitude: 0,
    error: true,
  };
}
