import { useState, useCallback } from 'react';
import type { TourStop, SimulationRoute } from '../stops/types';
import { getBearing, buildFlyToConfig } from './cameraUtils';

interface UseSimulationOptions {
  stops: TourStop[];
  simulationRoute: SimulationRoute;
  flyTo: (coords: [number, number], options?: Record<string, unknown>) => void;
  resetView: () => void;
  onStopActivated: (stopId: string) => void;
}

export function useSimulation({
  stops,
  simulationRoute,
  flyTo,
  resetView,
  onStopActivated,
}: UseSimulationOptions) {
  const [active, setActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const routeStops = simulationRoute.stopIds
    .map((id) => stops.find((s) => s.id === id))
    .filter((s): s is TourStop => !!s);

  const totalStops = routeStops.length;

  const flyToStop = useCallback(
    (index: number) => {
      const stop = routeStops[index];
      if (!stop) return;

      const prevStop = index > 0 ? routeStops[index - 1] : null;
      const bearing = prevStop
        ? getBearing(prevStop.coordinates, stop.coordinates)
        : simulationRoute.startBearing;

      const config = buildFlyToConfig(
        stop.coordinates,
        bearing,
        simulationRoute.pitch,
        simulationRoute.zoom
      );

      flyTo(stop.coordinates, config);

      // Open modal after fly animation completes
      setTimeout(() => {
        onStopActivated(stop.id);
      }, 3200);
    },
    [routeStops, simulationRoute, flyTo, onStopActivated]
  );

  const start = useCallback(() => {
    setActive(true);
    setCurrentIndex(0);
    flyToStop(0);
  }, [flyToStop]);

  const next = useCallback(() => {
    const nextIdx = currentIndex + 1;
    if (nextIdx >= totalStops) return;
    setCurrentIndex(nextIdx);
    flyToStop(nextIdx);
  }, [currentIndex, totalStops, flyToStop]);

  const exit = useCallback(() => {
    setActive(false);
    setCurrentIndex(0);
    resetView();
  }, [resetView]);

  return {
    active,
    currentIndex,
    totalStops,
    currentStop: routeStops[currentIndex] ?? null,
    isLastStop: currentIndex >= totalStops - 1,
    start,
    next,
    exit,
  };
}
