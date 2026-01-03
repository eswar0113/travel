'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Stop {
  id: string;
  cityName: string;
  country: string;
  startDate: Date | string;
  endDate: Date | string;
}

interface TripMapProps {
  stops: Stop[];
}

// Normalize country names to handle common variations
const normalizeCountry = (country: string): string[] => {
  const normalized = country.toLowerCase().trim();
  const variants: { [key: string]: string[] } = {
    'usa': ['USA', 'US', 'United States', 'United States of America'],
    'us': ['USA', 'US', 'United States', 'United States of America'],
    'united states': ['USA', 'US', 'United States', 'United States of America'],
    'united states of america': ['USA', 'US', 'United States', 'United States of America'],
    'uk': ['UK', 'United Kingdom', 'Great Britain', 'England'],
    'united kingdom': ['UK', 'United Kingdom', 'Great Britain'],
    'uae': ['UAE', 'United Arab Emirates'],
    'united arab emirates': ['UAE', 'United Arab Emirates'],
  };
  
  return variants[normalized] || [country];
};

// Preloaded coordinates for popular cities
const cityCoordinates: { [key: string]: { lat: number; lng: number } } = {
  'Paris,France': { lat: 48.8566, lng: 2.3522 },
  'New York,United States': { lat: 40.7128, lng: -74.006 },
  'New York,USA': { lat: 40.7128, lng: -74.006 },
  'New York,US': { lat: 40.7128, lng: -74.006 },
  'Tokyo,Japan': { lat: 35.6762, lng: 139.6503 },
  'London,United Kingdom': { lat: 51.5074, lng: -0.1278 },
  'London,UK': { lat: 51.5074, lng: -0.1278 },
  'London,England': { lat: 51.5074, lng: -0.1278 },
  'Sydney,Australia': { lat: -33.8688, lng: 151.2093 },
  'Dubai,United Arab Emirates': { lat: 25.2048, lng: 55.2708 },
  'Dubai,UAE': { lat: 25.2048, lng: 55.2708 },
  'Rome,Italy': { lat: 41.9028, lng: 12.4964 },
  'Barcelona,Spain': { lat: 41.3851, lng: 2.1734 },
  'Amsterdam,Netherlands': { lat: 52.3676, lng: 4.9041 },
  'Berlin,Germany': { lat: 52.52, lng: 13.405 },
  'Singapore,Singapore': { lat: 1.3521, lng: 103.8198 },
  'Hong Kong,Hong Kong': { lat: 22.3193, lng: 114.1694 },
  'Istanbul,Turkey': { lat: 41.0082, lng: 28.9784 },
  'Bangkok,Thailand': { lat: 13.7563, lng: 100.5018 },
  'Los Angeles,United States': { lat: 34.0522, lng: -118.2437 },
  'Los Angeles,USA': { lat: 34.0522, lng: -118.2437 },
  'Los Angeles,US': { lat: 34.0522, lng: -118.2437 },
  'San Francisco,United States': { lat: 37.7749, lng: -122.4194 },
  'San Francisco,USA': { lat: 37.7749, lng: -122.4194 },
  'San Francisco,US': { lat: 37.7749, lng: -122.4194 },
  'Chicago,United States': { lat: 41.8781, lng: -87.6298 },
  'Chicago,USA': { lat: 41.8781, lng: -87.6298 },
  'Chicago,US': { lat: 41.8781, lng: -87.6298 },
  'Miami,United States': { lat: 25.7617, lng: -80.1918 },
  'Miami,USA': { lat: 25.7617, lng: -80.1918 },
  'Miami,US': { lat: 25.7617, lng: -80.1918 },
  'Las Vegas,United States': { lat: 36.1699, lng: -115.1398 },
  'Las Vegas,USA': { lat: 36.1699, lng: -115.1398 },
  'Las Vegas,US': { lat: 36.1699, lng: -115.1398 },
  'Toronto,Canada': { lat: 43.6532, lng: -79.3832 },
  'Vancouver,Canada': { lat: 49.2827, lng: -123.1207 },
  'Mexico City,Mexico': { lat: 19.4326, lng: -99.1332 },
  'Rio de Janeiro,Brazil': { lat: -22.9068, lng: -43.1729 },
  'Buenos Aires,Argentina': { lat: -34.6037, lng: -58.3816 },
  'Cairo,Egypt': { lat: 30.0444, lng: 31.2357 },
  'Cape Town,South Africa': { lat: -33.9249, lng: 18.4241 },
  'Mumbai,India': { lat: 19.076, lng: 72.8777 },
  'Delhi,India': { lat: 28.7041, lng: 77.1025 },
  'Beijing,China': { lat: 39.9042, lng: 116.4074 },
  'Shanghai,China': { lat: 31.2304, lng: 121.4737 },
  'Seoul,South Korea': { lat: 37.5665, lng: 126.978 },
  'Moscow,Russia': { lat: 55.7558, lng: 37.6173 },
  'Athens,Greece': { lat: 37.9838, lng: 23.7275 },
  'Lisbon,Portugal': { lat: 38.7223, lng: -9.1393 },
  'Vienna,Austria': { lat: 48.2082, lng: 16.3738 },
  'Prague,Czech Republic': { lat: 50.0755, lng: 14.4378 },
  'Budapest,Hungary': { lat: 47.4979, lng: 19.0402 },
  'Warsaw,Poland': { lat: 52.2297, lng: 21.0122 },
  'Stockholm,Sweden': { lat: 59.3293, lng: 18.0686 },
  'Copenhagen,Denmark': { lat: 55.6761, lng: 12.5683 },
  'Oslo,Norway': { lat: 59.9139, lng: 10.7522 },
  'Helsinki,Finland': { lat: 60.1699, lng: 24.9384 },
  'Reykjavik,Iceland': { lat: 64.1466, lng: -21.9426 },
  'Dublin,Ireland': { lat: 53.3498, lng: -6.2603 },
  'Edinburgh,United Kingdom': { lat: 55.9533, lng: -3.1883 },
  'Edinburgh,UK': { lat: 55.9533, lng: -3.1883 },
  'Edinburgh,Scotland': { lat: 55.9533, lng: -3.1883 },
  'Brussels,Belgium': { lat: 50.8503, lng: 4.3517 },
  'Zurich,Switzerland': { lat: 47.3769, lng: 8.5417 },
  'Geneva,Switzerland': { lat: 46.2044, lng: 6.1432 },
};

const getCoordinates = (stop: Stop): { lat: number; lng: number } | null => {
  const { cityName, country } = stop;
  
  // Try exact match first
  const exactKey = `${cityName},${country}`;
  if (cityCoordinates[exactKey]) {
    return cityCoordinates[exactKey];
  }
  
  // Try with country variants
  const countryVariants = normalizeCountry(country);
  for (const variant of countryVariants) {
    const key = `${cityName},${variant}`;
    if (cityCoordinates[key]) {
      return cityCoordinates[key];
    }
  }
  
  // Try case-insensitive match
  const lowerKey = `${cityName.toLowerCase()},${country.toLowerCase()}`;
  const foundKey = Object.keys(cityCoordinates).find(
    key => key.toLowerCase() === lowerKey
  );
  if (foundKey) {
    return cityCoordinates[foundKey];
  }
  
  // Try partial match (city name only, case-insensitive)
  const partialKey = Object.keys(cityCoordinates).find(
    key => key.toLowerCase().startsWith(cityName.toLowerCase() + ',')
  );
  if (partialKey) {
    return cityCoordinates[partialKey];
  }
  
  return null;
};

export default function TripMap({ stops }: TripMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([20, 0], 2);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    const map = mapRef.current;

    // Clear existing layers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    // Add markers and polylines
    const coordinates: L.LatLngExpression[] = [];
    
    stops.forEach((stop, index) => {
      const coords = getCoordinates(stop);
      if (coords) {
        coordinates.push([coords.lat, coords.lng]);
        
        // Create numbered marker
        const numberIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `
            <div style="
              background-color: #3b82f6;
              color: white;
              border-radius: 50%;
              width: 32px;
              height: 32px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              border: 2px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            ">
              ${index + 1}
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([coords.lat, coords.lng], { icon: numberIcon })
          .bindPopup(`
            <div style="font-family: system-ui; padding: 4px;">
              <strong>${stop.cityName}, ${stop.country}</strong><br/>
              ${new Date(stop.startDate).toLocaleDateString()} - ${new Date(stop.endDate).toLocaleDateString()}
            </div>
          `)
          .addTo(map);
      }
    });

    // Draw polyline connecting stops
    if (coordinates.length > 1) {
      L.polyline(coordinates, {
        color: '#3b82f6',
        weight: 3,
        opacity: 0.7,
        dashArray: '10, 10',
      }).addTo(map);
    }

    // Fit bounds if we have coordinates
    if (coordinates.length > 0) {
      map.fitBounds(coordinates as L.LatLngBoundsLiteral, { padding: [50, 50] });
    }

    return () => {
      // Cleanup on unmount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [stops]);

  return (
    <div
      ref={mapContainerRef}
      style={{ height: '500px', width: '100%', borderRadius: '8px' }}
    />
  );
}
