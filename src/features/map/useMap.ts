import { useRef, useEffect, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import {
  THARGOMINDAH_CENTER,
  DEFAULT_ZOOM,
  MAP_BOUNDS,
  STYLE_SATELLITE,
  STYLE_STREETS,
} from './mapConstants';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

export function useMap(containerRef: React.RefObject<HTMLDivElement | null>) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isSatellite, setIsSatellite] = useState(true);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: STYLE_SATELLITE,
      center: THARGOMINDAH_CENTER,
      zoom: DEFAULT_ZOOM,
      maxBounds: MAP_BOUNDS,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-left');

    const hidePoi = () => {
      if (map.getLayer('poi-label')) {
        map.removeLayer('poi-label');
      }
    };

    map.on('load', () => {
      hidePoi();
      setMapLoaded(true);
    });

    map.on('style.load', hidePoi);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [containerRef]);

  const flyTo = useCallback(
    (coords: [number, number], options?: Record<string, unknown>) => {
      mapRef.current?.flyTo({
        center: [coords[1], coords[0]] as [number, number], // tour.json is [lat, lng], Mapbox wants [lng, lat]
        duration: 3000,
        ...options,
      } as Parameters<mapboxgl.Map['flyTo']>[0]);
    },
    []
  );

  const setPitch = useCallback((degrees: number) => {
    mapRef.current?.setPitch(degrees);
  }, []);

  const setBearing = useCallback((degrees: number) => {
    mapRef.current?.setBearing(degrees);
  }, []);

  const resetView = useCallback(() => {
    mapRef.current?.flyTo({
      center: THARGOMINDAH_CENTER,
      zoom: DEFAULT_ZOOM,
      pitch: 0,
      bearing: 0,
      duration: 2000,
    });
  }, []);

  const toggleStyle = useCallback(() => {
    const next = isSatellite ? STYLE_STREETS : STYLE_SATELLITE;
    mapRef.current?.setStyle(next);
    setIsSatellite(!isSatellite);
  }, [isSatellite]);

  return {
    mapRef,
    mapLoaded,
    isSatellite,
    flyTo,
    setPitch,
    setBearing,
    resetView,
    toggleStyle,
  };
}
