/**
 * Calculate bearing (heading) from one [lat, lng] coordinate to another.
 */
export function getBearing(
  from: [number, number],
  to: [number, number]
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;

  const dLng = toRad(to[1] - from[1]);
  const lat1 = toRad(from[0]);
  const lat2 = toRad(to[0]);

  const x = Math.sin(dLng) * Math.cos(lat2);
  const y =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  return (toDeg(Math.atan2(x, y)) + 360) % 360;
}

/**
 * Build a flyTo config to move from one stop to another in 3D mode.
 */
export function buildFlyToConfig(
  targetCoords: [number, number],
  bearing: number,
  pitch: number,
  zoom: number
): Record<string, unknown> {
  return {
    center: [targetCoords[1], targetCoords[0]], // [lng, lat]
    bearing,
    pitch,
    zoom,
    duration: 3000,
    essential: true,
  };
}
