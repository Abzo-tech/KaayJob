import {
  calculateDistance,
  filterByDistance,
  getFallbackGeocodingResult,
  parseGeocodingResponse,
  sortByDistance,
  validateCoordinates,
} from "../../../src/services/geolocationService";

describe("geolocationService", () => {
  describe("calculateDistance", () => {
    it("calculates long distances correctly", () => {
      const distance = calculateDistance(14.6937, -17.4441, 48.8566, 2.3522);

      expect(distance).toBeGreaterThan(4100);
      expect(distance).toBeLessThan(4300);
    });

    it("returns 0 for identical coordinates", () => {
      expect(calculateDistance(14.6937, -17.4441, 14.6937, -17.4441)).toBe(0);
    });

    it("calculates short distances accurately", () => {
      const distance = calculateDistance(
        14.6937,
        -17.4441,
        14.6937 + 1 / 111.32,
        -17.4441,
      );

      expect(distance).toBeGreaterThan(0.8);
      expect(distance).toBeLessThan(1.2);
    });
  });

  describe("validateCoordinates", () => {
    it("accepts valid coordinates", () => {
      expect(validateCoordinates(14.6937, -17.4441)).toBe(true);
      expect(validateCoordinates(48.8566, 2.3522)).toBe(true);
      expect(validateCoordinates(0, 0)).toBe(true);
      expect(validateCoordinates(90, 180)).toBe(true);
      expect(validateCoordinates(-90, -180)).toBe(true);
    });

    it("rejects invalid coordinates", () => {
      expect(validateCoordinates(91, 0)).toBe(false);
      expect(validateCoordinates(-91, 0)).toBe(false);
      expect(validateCoordinates(0, 181)).toBe(false);
      expect(validateCoordinates(0, -181)).toBe(false);
      expect(validateCoordinates(Number.NaN, 0)).toBe(false);
      expect(validateCoordinates(0, Number.NaN)).toBe(false);
    });
  });

  describe("distance helpers", () => {
    const providers = [
      { id: "1", latitude: 14.6937, longitude: -17.4441 },
      { id: "2", latitude: 14.7489, longitude: -17.4667 },
      { id: "3", latitude: 14.7558, longitude: -17.4381 },
    ];

    const center = { latitude: 14.6937, longitude: -17.4441 };

    it("filters providers by maximum distance", () => {
      const filtered = filterByDistance(providers, center, 5);

      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe("1");
    });

    it("sorts providers by distance", () => {
      const sorted = sortByDistance(providers, center);

      expect(sorted.map((provider) => provider.id)).toEqual(["1", "2", "3"]);
    });
  });

  describe("geocoding helpers", () => {
    it("parses a successful geocoding response", () => {
      const result = parseGeocodingResponse({
        display_name: "Dakar, Senegal",
        lat: "14.6937",
        lon: "-17.4441",
      });

      expect(result).toEqual({
        address: "Dakar, Senegal",
        latitude: 14.6937,
        longitude: -17.4441,
      });
    });

    it("returns a safe fallback geocoding result", () => {
      expect(getFallbackGeocodingResult()).toEqual({
        address: "Adresse inconnue",
        latitude: 0,
        longitude: 0,
        error: true,
      });
    });
  });
});
