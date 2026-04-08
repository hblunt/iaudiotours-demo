# iAudioTours — MVP Demo Build Plan

## Purpose

Build a minimal web-based audio tour demo for **Thargomindah, QLD** that can be shown to regional councils as a sales tool. The demo must feel polished enough to sell from, but stay ruthlessly scoped to what's needed for a pitch meeting.

The person demoing this (the founder) pulls it up on their phone, walks a councillor through a few points of interest on a map, taps into 3D street-level flyovers, and plays audio/shows images at each stop. The councillor immediately understands what tourists in their town would experience.

---

## What We're Building

A **React PWA** using **Mapbox GL JS** that displays a map of Thargomindah with interactive tour stops. Two modes:

1. **2D Map View (default)** — satellite/street map with clickable markers for all tour stops. Tapping a marker opens a modal with text description, image, and audio player.
2. **3D Simulation View** — activated via a bottom-bar button. Camera pitches to 60° street-level perspective along Dowling Street. User taps to advance between stops via Mapbox `flyTo`. Same modals trigger at each stop.

Three tour stops for the demo:
- **Old Jail** (Dowling Street / Gilmore Street area)
- **Leahy Historical House** (Dowling Street, near Old Jail)
- **Hydro Power Plant** (north end of town — first town in Australia with hydroelectric street lighting)

---

## Architecture

### Vertical Slices (Conceptual)

Organise by feature, not by file type. Each feature owns its components, hooks, and logic. Features do not import from each other directly — shared concerns live in `shared/`.

```
src/
  features/
    map/
      MapView.tsx          — Mapbox GL JS wrapper, renders markers, handles style toggle
      useMap.ts             — hook exposing map instance + helpers (flyTo, pitch, etc.)
      mapConstants.ts       — Thargomindah center coords, default zoom, bounds, style URLs

    stops/
      TourMarker.tsx        — individual marker rendered on map (styled dot/pin)
      StopModal.tsx         — slide-up panel: title, description, image, audio player
      AudioPlayer.tsx       — isolated <audio> wrapper, takes src prop
      types.ts              — TypeScript type definitions for a tour stop

    simulation/
      SimulationControls.tsx — bottom bar: "Start Walking Tour" / "Next Stop" / "Exit"
      useSimulation.ts       — manages simulation state: current stop index, camera transitions
      cameraUtils.ts         — flyTo configs, pitch/bearing calculations between stops

  shared/
    theme/
      theme.css             — all CSS custom properties (colors, fonts, spacing, radii, shadows)
      fonts.css             — Google Fonts imports (font-family is a CSS variable)
    layout/
      App.tsx               — app shell, context providers, view switching
      BottomBar.tsx          — persistent bottom bar container

  data/
    tour.json               — ALL tour content (see schema below)

  public/
    assets/
      audio/                — .mp3 files per stop (added later)
      images/               — .jpg files per stop (added later)
    manifest.json           — PWA manifest
    sw.js                   — service worker for offline caching
```

### Key Boundaries

- `map/` knows how to render a Mapbox map and place markers. It does NOT know what a "tour stop" contains.
- `stops/` knows how to display stop content in a modal. It does NOT know about Mapbox.
- `simulation/` knows how to sequence camera movements between coordinates. It does NOT render UI beyond its own controls.
- Communication between features goes through **React context or callbacks passed via App.jsx**. Example: simulation triggers a stop modal by calling a shared `onStopActivated(stopId)` callback, not by importing StopModal directly.

### Tour Data Schema

All content lives in `tour.json`. Swapping this file = new town. This is the white-label mechanism.

```json
{
  "tourId": "thargomindah-heritage",
  "townName": "Thargomindah",
  "council": "Bulloo Shire Council",
  "region": "Outback Queensland",
  "center": [-27.9939, 143.8117],
  "defaultZoom": 15,
  "bounds": [[-28.005, 143.800], [-27.985, 143.825]],
  "simulationRoute": {
    "startBearing": 90,
    "pitch": 60,
    "zoom": 17,
    "stopIds": ["old-jail", "leahy-house"]
  },
  "stops": [
    {
      "id": "old-jail",
      "name": "Old Thargomindah Jail",
      "coordinates": [-27.9965, 143.8090],
      "description": "Built in the 1880s during the pastoral boom...",
      "image": "assets/images/old-jail.jpg",
      "audio": "assets/audio/old-jail.mp3",
      "onSimulationRoute": true
    },
    {
      "id": "leahy-house",
      "name": "Leahy Historical House",
      "coordinates": [-27.9970, 143.8080],
      "description": "One of the oldest surviving residences...",
      "image": "assets/images/leahy-house.jpg",
      "audio": "assets/audio/leahy-house.mp3",
      "onSimulationRoute": true
    },
    {
      "id": "hydro-plant",
      "name": "Hydro Power Plant",
      "coordinates": [-27.9910, 143.8095],
      "description": "In 1901, Thargomindah became the first town in Australia to have hydroelectric street lighting...",
      "image": "assets/images/hydro-plant.jpg",
      "audio": "assets/audio/hydro-plant.mp3",
      "onSimulationRoute": false
    }
  ]
}
```

**Note:** Coordinates above are approximate. Verify against the uploaded town map before building. The Old Jail is marked as item 41, Leahy House as item 29, and Hydro Power Plant as item 33 on the Thargomindah town map.

---

## Mapbox Integration

### Setup
- Use **Mapbox GL JS v3** via CDN or npm
- Requires a Mapbox access token (env variable `REACT_APP_MAPBOX_TOKEN`)
- Two map styles available, toggled by user:
  - `mapbox://styles/mapbox/satellite-streets-v12` (immersive, shows landscape)
  - `mapbox://styles/mapbox/streets-v12` (clean, readable)

### Map Provider Pattern

Wrap Mapbox in a single provider so it never leaks into other features:

```jsx
// useMap.js exposes:
{
  mapRef,                    // raw mapbox instance (escape hatch)
  flyTo(coords, options),    // animated camera move
  setPitch(degrees),         // tilt camera
  setBearing(degrees),       // rotate camera
  resetView(),               // back to default 2D overview
  setStyle(styleUrl),        // toggle satellite/streets
  addMarker(stop),           // place a marker from stop data
}
```

### 3D / Simulation Camera

- Use `map.flyTo()` with `pitch: 60`, `zoom: 17`, `bearing` calculated from current→next stop heading
- `flyTo` duration: ~3 seconds per transition (adjustable)
- On arriving at a stop, auto-trigger the stop modal
- "Next Stop" button advances to next stop in `simulationRoute.stopIds`
- "Exit" resets to 2D overview via `resetView()`

---

## Theming System

One theme, fully driven by CSS custom properties. No hardcoded colors or font sizes anywhere in components.

```css
/* theme.css */
:root {
  /* Colors */
  --color-primary: #;        /* TBD — earthy/outback tone */
  --color-primary-light: #;
  --color-accent: #;
  --color-bg: #;
  --color-bg-overlay: rgba(0,0,0,0.7);
  --color-text: #;
  --color-text-muted: #;
  --color-text-on-primary: #;

  /* Typography */
  --font-display: 'TBD', serif;
  --font-body: 'TBD', sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.5rem;
  --font-size-2xl: 2rem;

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;

  /* Shape */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.15);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.2);

  /* Layout */
  --bottom-bar-height: 64px;
  --modal-max-height: 60vh;
}
```

To retheme for a different council or aesthetic: edit only `theme.css`. No component changes needed. Font families are imported in `fonts.css` and referenced only via variables.

---

## UI Components — Specifications

### TourMarker
- Styled circle on map at stop coordinates
- Pulsing animation to indicate interactivity
- Shows stop name on hover/long-press
- On tap → opens StopModal for that stop
- Styled via theme variables (color, size, shadow)

### StopModal
- Slides up from bottom of screen (mobile-first)
- Content: stop name (h2), image (full-width, rounded), text description, AudioPlayer
- Close button (X) top-right corner
- Backdrop tap also closes
- Transitions: CSS slide-up + fade, ~300ms ease-out
- If no image/audio provided for a stop, those sections gracefully hide (no broken placeholders)

### AudioPlayer
- Simple: play/pause button, progress bar, duration
- Takes a single `src` prop
- Graceful empty state if no audio URL provided (shows "Audio coming soon" text)
- Minimal — not a full media player

### SimulationControls (Bottom Bar)
- Default state: single button "Start Walking Tour"
- Active simulation state: "Next Stop" button + "Exit" button + current stop indicator (e.g., "Stop 1 of 2")
- Sits in persistent bottom bar, above map
- When simulation starts: camera pitches to 3D, flies to first stop, modal auto-opens

### Map Style Toggle
- Small toggle button in top-right corner of map
- Switches between satellite and streets
- Icon-based (satellite dish / street grid), no text needed

---

## PWA Configuration

### manifest.json
```json
{
  "name": "Thargomindah Heritage Tour",
  "short_name": "Thargo Tour",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1a1a1a",
  "theme_color": "#TBD",
  "icons": [
    { "src": "icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### Service Worker (sw.js)
- Cache-first strategy for: map tiles (Mapbox), audio files, images, app shell
- Network-first for: tour data JSON (allows live updates)
- Pre-cache critical assets on install
- This is important for Thargomindah specifically — cell service is limited in outback QLD. Tourist loads the app on caravan park wifi, everything works offline on the walk.

---

## What is NOT in This MVP

Explicitly out of scope — do not build:

- User accounts, login, or authentication
- Backend/API server (everything is static files)
- Admin panel for managing tours
- GPS-triggered auto-play (simulation is manual tap-to-advance)
- Real-time location tracking (future feature)
- Multiple tours per town
- Payment or subscription logic
- Analytics or usage tracking
- Sharing or social features
- Multi-language support
- Accessibility audit (do it right later, not half-baked now)

---

## Build Sequence

Suggested order to build this incrementally:

1. **Scaffold** — React app with theme.css wired up, empty App shell, tour.json with real data
2. **Map** — Mapbox rendering Thargomindah, correct center/zoom/bounds, style toggle working
3. **Markers** — TourMarker components placed at stop coordinates from tour.json
4. **Modal** — StopModal slides up on marker tap, displays text content, close works
5. **Audio** — AudioPlayer component in modal, works with placeholder or real audio
6. **Simulation** — Bottom bar, 3D camera flyTo between Dowling Street stops, modal auto-triggers
7. **PWA** — manifest.json, service worker, offline caching
8. **Polish** — animations, typography, final theme tuning, test on mobile

---

## Asset Checklist

Things Holly needs to provide or create:

- [ ] Mapbox access token
- [ ] Verify stop coordinates against town map (Old Jail #41, Leahy House #29, Hydro Plant #33)
- [ ] Stop descriptions (3x — can be placeholder text initially)
- [ ] Stop images (3x — photos or placeholder)
- [ ] Stop audio (3x — ElevenLabs generated or recorded, can be added last)
- [ ] App icon (192x192 + 512x512 PNG)
- [ ] Choose theme colors and fonts (or iterate after first build)
- [ ] Final hosting URL for QR code generation

---

## Notes for Future (Post-Demo)

Once the demo sells and a council signs on:

- **Multi-tenancy**: tour.json becomes a per-council config loaded by subdomain or URL param
- **CMS**: simple admin panel for non-technical staff to edit tour content
- **Real GPS**: swap simulation for live `navigator.geolocation.watchPosition()` with proximity triggers
- **Offline maps**: Mapbox supports offline tile packs for mobile SDKs
- **Analytics**: which stops get played, completion rates, drop-off points
- **Pricing**: annual license per council per tour, tiered by number of stops
