import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapContext } from './MapContext';
import type { TourStop } from '../stops/types';
import { Map, Layers } from 'lucide-react';
import { PinContainer } from '@/components/ui/3d-pin';
import './MapView.css';

interface MapViewProps {
  stops: TourStop[];
  onStopActivated: (stopId: string) => void;
  children?: React.ReactNode;
}

const ZOOM_ACTIVATE_THRESHOLD = 16.5;

export function MapView({ stops, onStopActivated, children }: MapViewProps) {
  const { mapRef, mapLoaded, isSatellite, toggleStyle } = useMapContext();
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // Clean up old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    stops.forEach((stop) => {
      const el = document.createElement('div');
      el.style.cursor = 'pointer';

      const root = createRoot(el);
      root.render(
        <PinContainer
          title={stop.name}
          stopId={stop.id}
          onClick={() => onStopActivated(stop.id)}
        />
      );

      const marker = new mapboxgl.Marker({ element: el, anchor: 'center', offset: [0, 3] })
        .setLngLat([stop.coordinates[1], stop.coordinates[0]])
        .addTo(map);

      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
    };
  }, [mapRef, mapLoaded, stops, onStopActivated]);

  // Check which stops are near center on zoom/move
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const checkProximity = () => {
      const activeIds: string[] = [];

      if (map.getZoom() >= ZOOM_ACTIVATE_THRESHOLD) {
        const center = map.getCenter();
        const centerPx = map.project(center);
        const viewportW = map.getCanvas().clientWidth;
        const viewportH = map.getCanvas().clientHeight;
        // Activate pins within the center 50% of the viewport
        const radiusX = viewportW * 0.25;
        const radiusY = viewportH * 0.25;

        stops.forEach((stop) => {
          const stopPx = map.project([stop.coordinates[1], stop.coordinates[0]]);
          const dx = Math.abs(stopPx.x - centerPx.x);
          const dy = Math.abs(stopPx.y - centerPx.y);
          if (dx < radiusX && dy < radiusY) {
            activeIds.push(stop.id);
          }
        });
      }

      window.dispatchEvent(new CustomEvent('pin-zoom-activate', { detail: { activeIds } }));
    };

    map.on('zoom', checkProximity);
    map.on('move', checkProximity);
    return () => {
      map.off('zoom', checkProximity);
      map.off('move', checkProximity);
    };
  }, [mapRef, mapLoaded, stops]);

  return (
    <div className="map-container">
      <button
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-xl flex items-center justify-center pointer-events-auto transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
        style={{
          background: 'rgba(26,26,26,0.75)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
        onClick={toggleStyle}
        aria-label={isSatellite ? 'Switch to street map' : 'Switch to satellite'}
      >
        {isSatellite ? (
          <Map className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
        ) : (
          <Layers className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
        )}
      </button>
      {children}
    </div>
  );
}
