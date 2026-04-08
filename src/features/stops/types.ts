export interface TourStop {
  id: string;
  name: string;
  coordinates: [number, number];
  description: string;
  image: string;
  audio: string;
  onSimulationRoute: boolean;
}

export interface SimulationRoute {
  startBearing: number;
  pitch: number;
  zoom: number;
  stopIds: string[];
}

export interface TourData {
  tourId: string;
  townName: string;
  council: string;
  region: string;
  center: [number, number];
  defaultZoom: number;
  bounds: [[number, number], [number, number]];
  simulationRoute: SimulationRoute;
  stops: TourStop[];
}
