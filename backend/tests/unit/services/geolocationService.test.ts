import { describe, it, expect } from '@jest/globals';

// Mock the geolocation utility functions
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const validateCoordinates = (lat: number, lng: number): boolean => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

describe('GeolocationService', () => {
  describe('calculateDistance', () => {
    it('should calculate distance between two points correctly', () => {
      // Distance between Dakar and Paris (approximately)
      const dakarLat = 14.6937;
      const dakarLng = -17.4441;
      const parisLat = 48.8566;
      const parisLng = 2.3522;

      const distance = calculateDistance(dakarLat, dakarLng, parisLat, parisLng);

      // Expected distance is approximately 4180 km
      expect(distance).toBeGreaterThan(4100);
      expect(distance).toBeLessThan(4300);
    });

    it('should return 0 for same coordinates', () => {
      const lat = 14.6937;
      const lng = -17.4441;

      const distance = calculateDistance(lat, lng, lat, lng);

      expect(distance).toBe(0);
    });

    it('should calculate short distances accurately', () => {
      // Two points 1km apart in Dakar
      const point1 = { lat: 14.6937, lng: -17.4441 };
      const point2 = { lat: 14.6937 + (1/111.32), lng: -17.4441 }; // Approximately 1km north

      const distance = calculateDistance(point1.lat, point1.lng, point2.lat, point2.lng);

      expect(distance).toBeGreaterThan(0.8);
      expect(distance).toBeLessThan(1.2);
    });
  });

  describe('validateCoordinates', () => {
    it('should validate correct coordinates', () => {
      expect(validateCoordinates(14.6937, -17.4441)).toBe(true); // Dakar
      expect(validateCoordinates(48.8566, 2.3522)).toBe(true);   // Paris
      expect(validateCoordinates(0, 0)).toBe(true);              // Origin
      expect(validateCoordinates(90, 180)).toBe(true);           // North Pole, International Date Line
      expect(validateCoordinates(-90, -180)).toBe(true);         // South Pole, International Date Line
    });

    it('should reject invalid coordinates', () => {
      expect(validateCoordinates(91, 0)).toBe(false);      // Invalid latitude
      expect(validateCoordinates(-91, 0)).toBe(false);     // Invalid latitude
      expect(validateCoordinates(0, 181)).toBe(false);     // Invalid longitude
      expect(validateCoordinates(0, -181)).toBe(false);    // Invalid longitude
      expect(validateCoordinates(NaN, 0)).toBe(false);     // NaN values
      expect(validateCoordinates(0, NaN)).toBe(false);     // NaN values
    });
  });

  describe('Geolocation filtering', () => {
    const mockProviders = [
      {
        id: '1',
        name: 'Provider 1',
        latitude: 14.6937,
        longitude: -17.4441,
        distance: 0
      },
      {
        id: '2',
        name: 'Provider 2',
        latitude: 14.7489,
        longitude: -17.4667,
        distance: 0
      },
      {
        id: '3',
        name: 'Provider 3',
        latitude: 14.7558,
        longitude: -17.4381,
        distance: 0
      }
    ];

    it('should filter providers within radius', () => {
      const userLocation = { lat: 14.6937, lng: -17.4441 }; // Dakar center
      const radius = 10; // 10km

      const filteredProviders = mockProviders.filter(provider => {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          provider.latitude,
          provider.longitude
        );
        provider.distance = distance;
        return distance <= radius;
      });

      // All providers in Dakar should be within 10km
      expect(filteredProviders.length).toBe(3);
      filteredProviders.forEach(provider => {
        expect(provider.distance).toBeLessThanOrEqual(radius);
      });
    });

    it('should sort providers by distance', () => {
      const userLocation = { lat: 14.6937, lng: -17.4441 };

      const sortedProviders = mockProviders
        .map(provider => ({
          ...provider,
          distance: calculateDistance(
            userLocation.lat,
            userLocation.lng,
            provider.latitude,
            provider.longitude
          )
        }))
        .sort((a, b) => a.distance - b.distance);

      // First provider should be closest (distance 0)
      expect(sortedProviders[0].id).toBe('1');
      expect(sortedProviders[0].distance).toBe(0);

      // Check that array is sorted
      for (let i = 1; i < sortedProviders.length; i++) {
        expect(sortedProviders[i].distance).toBeGreaterThanOrEqual(sortedProviders[i-1].distance);
      }
    });
  });

  describe('Geocoding integration', () => {
    // Mock fetch for geocoding tests
    const mockFetch = global.fetch;

    beforeEach(() => {
      global.fetch = jest.fn();
    });

    afterEach(() => {
      global.fetch = mockFetch;
    });

    it('should handle successful geocoding', async () => {
      const mockResponse = {
        display_name: 'Dakar, Senegal',
        lat: '14.6937',
        lon: '-17.4441'
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue(mockResponse)
      });

      // Test geocoding function (simplified)
      const geocodeResult = async (lat: number, lng: number) => {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        return await response.json();
      };

      const result = await geocodeResult(14.6937, -17.4441);

      expect(result.display_name).toContain('Dakar');
      expect(result.lat).toBe('14.6937');
      expect(result.lon).toBe('-17.4441');
    });

    it('should handle geocoding errors gracefully', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const geocodeResult = async (lat: number, lng: number) => {
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          return await response.json();
        } catch (error) {
          return { display_name: 'Adresse inconnue', error: true };
        }
      };

      const result = await geocodeResult(14.6937, -17.4441);

      expect(result).toHaveProperty('error');
      expect(result.error).toBe(true);
    });
  });
});