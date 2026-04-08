import { useState, useCallback } from 'react';
import { MapProvider } from '../../features/map/MapContext';
import { MapView } from '../../features/map/MapView';
import { StopModal } from '../../features/stops/StopModal';
import { SimulationControls } from '../../features/simulation/SimulationControls';
import { useSimulation } from '../../features/simulation/useSimulation';
import { useMapContext } from '../../features/map/MapContext';
import tourData from '../../data/tour.json';
import type { TourData, TourStop } from '../../features/stops/types';

const tour = tourData as TourData;

function AppContent() {
  const { flyTo, resetView } = useMapContext();
  const [activeStopId, setActiveStopId] = useState<string | null>(null);

  const activeStop: TourStop | null =
    tour.stops.find((s) => s.id === activeStopId) ?? null;

  const handleStopActivated = useCallback((stopId: string) => {
    setActiveStopId(stopId);
  }, []);

  const handleCloseModal = useCallback(() => {
    setActiveStopId(null);
  }, []);

  const simulation = useSimulation({
    stops: tour.stops as TourStop[],
    simulationRoute: tour.simulationRoute,
    flyTo,
    resetView,
    onStopActivated: handleStopActivated,
  });

  return (
    <>
      <MapView stops={tour.stops as TourStop[]} onStopActivated={handleStopActivated}>
        <SimulationControls
          active={simulation.active}
          currentIndex={simulation.currentIndex}
          totalStops={simulation.totalStops}
          isLastStop={simulation.isLastStop}
          onStart={simulation.start}
          onNext={simulation.next}
          onExit={simulation.exit}
        />
      </MapView>
      <StopModal stop={activeStop} onClose={handleCloseModal} />
    </>
  );
}

export function App() {
  return (
    <MapProvider>
      <AppContent />
    </MapProvider>
  );
}
