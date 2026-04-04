"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDistance = calculateDistance;
exports.validateCoordinates = validateCoordinates;
exports.filterByDistance = filterByDistance;
exports.sortByDistance = sortByDistance;
exports.parseGeocodingResponse = parseGeocodingResponse;
exports.getFallbackGeocodingResult = getFallbackGeocodingResult;
const EARTH_RADIUS_KM = 6371;
function calculateDistance(lat1, lon1, lat2, lon2) {
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS_KM * c;
}
function validateCoordinates(latitude, longitude) {
    return (Number.isFinite(latitude) &&
        Number.isFinite(longitude) &&
        latitude >= -90 &&
        latitude <= 90 &&
        longitude >= -180 &&
        longitude <= 180);
}
function filterByDistance(items, center, maxDistanceKm) {
    return items.filter((item) => {
        const distance = calculateDistance(center.latitude, center.longitude, item.latitude, item.longitude);
        return distance <= maxDistanceKm;
    });
}
function sortByDistance(items, center) {
    return [...items].sort((a, b) => {
        const distanceA = calculateDistance(center.latitude, center.longitude, a.latitude, a.longitude);
        const distanceB = calculateDistance(center.latitude, center.longitude, b.latitude, b.longitude);
        return distanceA - distanceB;
    });
}
function parseGeocodingResponse(response) {
    return {
        address: response.display_name,
        latitude: parseFloat(response.lat),
        longitude: parseFloat(response.lon),
    };
}
function getFallbackGeocodingResult() {
    return {
        address: "Adresse inconnue",
        latitude: 0,
        longitude: 0,
        error: true,
    };
}
//# sourceMappingURL=geolocationService.js.map