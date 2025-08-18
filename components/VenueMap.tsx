'use client'

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Navigation, Loader2 } from 'lucide-react';

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface VenueMapProps {
  venue: string;
  organization?: string;
}

interface Coordinates {
  lat: number;
  lng: number;
  display_name?: string;
}

export default function VenueMap({ venue, organization }: VenueMapProps) {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    // Geocode the venue address
    const geocodeAddress = async () => {
      if (!venue || venue.length < 10) {
        setLoading(false);
        return;
      }

      try {
        // Clean the venue text for better geocoding
        let searchQuery = venue
          .replace(/\n/g, ', ')
          .replace(/,\s*,/g, ',')
          .replace(/\.$/, '')
          .trim();
        
        // Add "India" if not already present for better results
        if (!searchQuery.toLowerCase().includes('india')) {
          searchQuery += ', India';
        }

        // Use Nominatim (OpenStreetMap) for geocoding - free and no API key required
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?` +
          `q=${encodeURIComponent(searchQuery)}&format=json&limit=1&countrycodes=in`,
          {
            headers: {
              'User-Agent': 'SarkariJobs.cc'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Geocoding failed');
        }

        const data = await response.json();
        
        if (data && data.length > 0) {
          const result = data[0];
          setCoordinates({
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon),
            display_name: result.display_name
          });
        } else {
          // Try with a simpler query if the full address doesn't work
          const simpleQuery = extractCityState(venue);
          if (simpleQuery && simpleQuery !== searchQuery) {
            const simpleResponse = await fetch(
              `https://nominatim.openstreetmap.org/search?` +
              `q=${encodeURIComponent(simpleQuery + ', India')}&format=json&limit=1&countrycodes=in`
            );
            
            if (simpleResponse.ok) {
              const simpleData = await simpleResponse.json();
              if (simpleData && simpleData.length > 0) {
                const result = simpleData[0];
                setCoordinates({
                  lat: parseFloat(result.lat),
                  lng: parseFloat(result.lon),
                  display_name: result.display_name
                });
              } else {
                setError('Location not found on map');
              }
            }
          } else {
            setError('Location not found on map');
          }
        }
      } catch (err) {
        console.error('Geocoding error:', err);
        setError('Unable to load map');
      } finally {
        setLoading(false);
      }
    };

    geocodeAddress();
  }, [venue]);

  // Extract city and state from venue text
  const extractCityState = (text: string): string | null => {

    // Known Indian states and cities for better matching
    const states = [
      'Bihar', 'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Kerala',
      'Andhra Pradesh', 'Telangana', 'Gujarat', 'Rajasthan', 'Uttar Pradesh',
      'West Bengal', 'Punjab', 'Haryana', 'Madhya Pradesh', 'Odisha', 'Assam'
    ];

    const cities = [
      'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata',
      'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur',
      'Mangalagiri', 'Muzaffarpur', 'Chandigarh', 'Bhopal', 'Patna'
    ];

    // Check for state names
    for (const state of states) {
      if (text.includes(state)) {
        // Check for cities too
        for (const city of cities) {
          if (text.includes(city)) {
            return `${city}, ${state}`;
          }
        }
        return state;
      }
    }

    // Check for city names
    for (const city of cities) {
      if (text.includes(city)) {
        return city;
      }
    }

    return null;
  };

  // Setup Leaflet
  useEffect(() => {
    // Add Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    document.head.appendChild(link);
    
    // Fix for default marker icon in React-Leaflet
    import('leaflet').then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '/leaflet/marker-icon-2x.png',
        iconUrl: '/leaflet/marker-icon.png',
        shadowUrl: '/leaflet/marker-shadow.png',
      });
    });
    
    setMapReady(true);
    
    return () => {
      // Cleanup
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };
  }, []);

  if (!venue || venue.length < 10) {
    return null;
  }

  if (loading || !mapReady) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3 text-blue-900 dark:text-blue-100 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Interview Venue / Address
        </h2>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line mb-4">
          {venue}
        </p>
        <div className="flex items-center justify-center h-40 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-blue-200 dark:border-blue-700">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500 mr-2" />
          <span className="text-gray-600 dark:text-gray-400">Loading map...</span>
        </div>
      </div>
    );
  }

  if (error || !coordinates) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3 text-blue-900 dark:text-blue-100 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Interview Venue / Address
        </h2>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
          {venue}
        </p>
        {error && (
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-3 italic">
            Note: {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg overflow-hidden mb-6">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-3 text-blue-900 dark:text-blue-100 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Interview Venue / Address
        </h2>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line mb-4">
          {venue}
        </p>
        
        {/* Map */}
        <div className="h-80 relative rounded-lg overflow-hidden border border-blue-200 dark:border-blue-800 mb-4">
          <MapContainer
            center={[coordinates.lat, coordinates.lng]}
            zoom={15}
            className="h-full w-full"
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[coordinates.lat, coordinates.lng]}>
              <Popup>
                <div className="p-2">
                  <h4 className="font-semibold text-sm mb-1">{organization || 'Interview Venue'}</h4>
                  <p className="text-xs text-gray-600 whitespace-pre-line">
                    {venue}
                  </p>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue + ', India')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Navigation className="w-4 h-4" />
            Get Directions
          </a>
          <a
            href={`https://www.google.com/maps/@${coordinates.lat},${coordinates.lng},15z`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-blue-300 dark:border-blue-700 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors text-sm"
          >
            View in Google Maps
          </a>
        </div>
      </div>
    </div>
  );
}