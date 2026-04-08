import { createContext, useContext, useRef, type ReactNode } from 'react';
import { useMap } from './useMap';

type MapContextValue = ReturnType<typeof useMap>;

const MapContext = createContext<MapContextValue | null>(null);

export function MapProvider({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const map = useMap(containerRef);

  return (
    <MapContext.Provider value={map}>
      <div
        ref={containerRef}
        style={{ position: 'absolute', inset: 0 }}
      />
      {children}
    </MapContext.Provider>
  );
}

export function useMapContext(): MapContextValue {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error('useMapContext must be used within MapProvider');
  return ctx;
}
