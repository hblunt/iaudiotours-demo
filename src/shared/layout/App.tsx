import { useState, useCallback } from 'react';
import { MapProvider } from '../../features/map/MapContext';
import { MapView } from '../../features/map/MapView';
import { WelcomeOverlay } from '../../features/map/WelcomeOverlay';
import { StopModal } from '../../features/stops/StopModal';
import { SimulationControls } from '../../features/simulation/SimulationControls';
import { useSimulation } from '../../features/simulation/useSimulation';
import { useMapContext } from '../../features/map/MapContext';
import { Info } from 'lucide-react';
import tourData from '../../data/tour.json';
import type { TourData, TourStop } from '../../features/stops/types';

const tour = tourData as TourData;

function AppContent() {
  const { flyTo, resetView } = useMapContext();
  const [activeStopId, setActiveStopId] = useState<string | null>(null);
  const [welcomeVisible, setWelcomeVisible] = useState(true);

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
        {/* Info button to reopen welcome */}
        <button
          className="absolute top-4 left-4 z-10 w-10 h-10 rounded-xl flex items-center justify-center pointer-events-auto transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
          style={{
            background: 'rgba(26,26,26,0.75)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
          onClick={() => setWelcomeVisible(true)}
          aria-label="Tour info"
        >
          <Info className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
        </button>

        <WelcomeOverlay
          townName={tour.townName}
          region={tour.region}
          visible={welcomeVisible}
          onClose={() => setWelcomeVisible(false)}
        />
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
