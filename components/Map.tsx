'use client';

import React, { useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import { Beach } from '@/lib/types';
import { FLAG_COLORS } from '@/lib/constants';
import { trackMapInteraction } from '@/lib/analytics';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  beaches: Beach[];
  selectedBeach: Beach | null;
  onSelectBeach: (beach: Beach) => void;
}

// Component to handle flying to selected beach
function MapController({ selectedBeach }: { selectedBeach: Beach | null }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedBeach) {
      return;
    }

    const { lat, lng } = selectedBeach.coordinates;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return;
    }

    try {
      map.flyTo([lat, lng], 12, {
        duration: 1.5,
      });
    } catch (error) {
      console.error('Map flyTo error:', error);
    }
  }, [selectedBeach, map]);

  return null;
}

function MapInteractionTracker() {
  const lastTrackedAt = useRef(0);

  useMapEvents({
    moveend: () => {
      const now = Date.now();
      if (now - lastTrackedAt.current > 15000) {
        trackMapInteraction('move');
        lastTrackedAt.current = now;
      }
    },
    zoomend: () => {
      const now = Date.now();
      if (now - lastTrackedAt.current > 15000) {
        trackMapInteraction('zoom');
        lastTrackedAt.current = now;
      }
    },
  });

  return null;
}

export default function Map({ beaches, selectedBeach, onSelectBeach }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);

  // Create custom marker icons based on flag status
  const createMarkerIcon = (flagStatus: string) => {
    const color = FLAG_COLORS[flagStatus as keyof typeof FLAG_COLORS];
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          width: 32px;
          height: 32px;
          background-color: ${color};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        ">
          🏖️
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });
  };

  // Calculate center of San Mateo County coastline
  const centerLat = 37.4;
  const centerLng = -122.45;

  return (
    <MapContainer
      center={[centerLat, centerLng]}
      zoom={10}
      className="h-full w-full"
      ref={mapRef}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapController selectedBeach={selectedBeach} />
      <MapInteractionTracker />

      {beaches.map((beach) => (
        <Marker
          key={beach.id}
          position={[beach.coordinates.lat, beach.coordinates.lng]}
          icon={createMarkerIcon(beach.flagStatus)}
          eventHandlers={{
            click: () => {
              trackMapInteraction('marker_click', beach.id);
              onSelectBeach(beach);
            },
          }}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <h3 className="font-bold text-sm mb-1">{beach.name}</h3>
              {beach.nickname && (
                <p className="text-xs text-gray-600 mb-2">({beach.nickname})</p>
              )}
              <div className="space-y-1 text-xs">
                <p>🌊 Waves: {beach.conditions.waveHeight} ft</p>
                <p>💨 Wind: {beach.conditions.windSpeed} mph</p>
                <p>🌡️ Water: {beach.conditions.waterTemp}°F</p>
              </div>
              <button
                onClick={() => onSelectBeach(beach)}
                className="mt-3 w-full bg-primary text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-primary/90 transition-colors"
              >
                View Details
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
