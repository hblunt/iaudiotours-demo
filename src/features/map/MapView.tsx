import { useEffect, useCallback } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapContext } from './MapContext';
import type { TourStop } from '../stops/types';
import './MapView.css';

interface MapViewProps {
  stops: TourStop[];
  onStopActivated: (stopId: string) => void;
  children?: React.ReactNode;
}

const SOURCE_ID = 'tour-stops';
const CIRCLE_LAYER = 'tour-stops-circle';
const PULSE_LAYER = 'tour-stops-pulse';

function buildGeoJSON(stops: TourStop[]): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: stops.map((stop) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [stop.coordinates[1], stop.coordinates[0]], // [lng, lat]
      },
      properties: {
        id: stop.id,
        name: stop.name,
      },
    })),
  };
}

export function MapView({ stops, onStopActivated, children }: MapViewProps) {
  const { mapRef, mapLoaded, isSatellite, toggleStyle } = useMapContext();

  const addLayers = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove existing if present (e.g. after style swap)
    if (map.getLayer(PULSE_LAYER)) map.removeLayer(PULSE_LAYER);
    if (map.getLayer(CIRCLE_LAYER)) map.removeLayer(CIRCLE_LAYER);
    if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID);

    map.addSource(SOURCE_ID, {
      type: 'geojson',
      data: buildGeoJSON(stops),
    });

    // Outer pulse ring
    map.addLayer({
      id: PULSE_LAYER,
      type: 'circle',
      source: SOURCE_ID,
      paint: {
        'circle-radius': 18,
        'circle-color': 'transparent',
        'circle-stroke-width': 2,
        'circle-stroke-color': '#D4A574',
        'circle-stroke-opacity': 0.4,
      },
    });

    // Main marker dot
    map.addLayer({
      id: CIRCLE_LAYER,
      type: 'circle',
      source: SOURCE_ID,
      paint: {
        'circle-radius': 10,
        'circle-color': '#D4A574',
        'circle-stroke-width': 3,
        'circle-stroke-color': '#FFFFFF',
      },
    });

    // Click handler
    map.on('click', CIRCLE_LAYER, (e) => {
      const feature = e.features?.[0];
      if (feature?.properties?.id) {
        onStopActivated(feature.properties.id);
      }
    });

    // Pointer cursor on hover
    map.on('mouseenter', CIRCLE_LAYER, () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', CIRCLE_LAYER, () => {
      map.getCanvas().style.cursor = '';
    });
  }, [mapRef, stops, onStopActivated]);

  // Add layers on initial load
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    addLayers();
  }, [mapLoaded, addLayers, mapRef]);

  // Re-add layers after style swap (style.load fires, layers are lost)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleStyleLoad = () => {
      addLayers();
    };

    map.on('style.load', handleStyleLoad);
    return () => {
      map.off('style.load', handleStyleLoad);
    };
  }, [mapRef, addLayers]);

  return (
    <div className="map-container">
      <button
        className="style-toggle"
        onClick={toggleStyle}
        aria-label={isSatellite ? 'Switch to street map' : 'Switch to satellite'}
      >
        {isSatellite ? '🗺️' : '🛰️'}
      </button>
      {children}
    </div>
  );
}
