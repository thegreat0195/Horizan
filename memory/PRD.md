# Project Horizon — Product Requirements Document

## Product

Project Horizon is a premium, outdoor-focused mobile experience platform organized around 5 pillars:
**Move, Explore, Stories, Connect, Safety**. Not a fitness tracker, not a social feed, not a map app —
its own product identity in the outdoor experience category.

## Design language

- **Personality**: Dark-First Utility with Luxe spacing. Premium, energetic, outdoor.
- **Foundation**: `#0A0A0A` background, graphite `#1A1A1A` / `#242424` surfaces.
- **Accent**: Electric lime `#C6FF3D` — CTAs, active states, progress, achievements only.
- **Typography**: `SpaceGrotesk-Medium` display/metric, `Geist-Regular/Medium` body (local `.ttf` assets).
- **Icons**: `@react-native-vector-icons/feather`.

## Navigation

- 5 bottom tabs: Home, Move, Explore, Stories, Connect.
- Stack routes: `/profile`, `/story-compose`, `/safety-contact`, `/mission/[id]`.

## Features

### 1. Home
Personal command center — greeting, dominant hero recommendation card, weekly summary metrics,
recent-activity horizontal scroll, Explore & Stories teasers, squad row.

### 2. Move — active session flow
State machine `select → active → paused → summary`. Each activity has a photo card in a 2×2 grid,
selected card gets a lime border. Active view shows huge `SpaceGrotesk` timer, three compact metric cards,
and the **Safety Halo** (see #5). Every state transition triggers a haptic. Metrics are clearly labelled
`DEMO MODE · SIMULATED METRICS` — no real GPS. Finishing a session commits it to the app store,
which unlocks Explore territory and contributes to the Squad Mission.

### 3. Territory Explorer (Explore)
- **Native** (Expo Go / dev build): Interactive `react-native-maps` with a custom dark topographic
  theme, route pins that are locked (grey lock icon) or unlocked (lime pin). Tap a pin or route card
  to open a detail sheet with distance, elevation, difficulty, and a "Plan route" CTA when unlocked,
  or a locked message when not.
- **Web preview**: Atmospheric fallback image, same locked/unlocked route cards.
- Routes unlock as the user's max completed session distance meets each route's `distanceKm`.
- One-tap locate button requests `expo-location` foreground permission and pans the map.

### 4. Adventure Journal (`/story-compose`)
Photo-first story composer reached from the Move summary. Hero photo picker (native gallery via
`expo-image-picker` with graceful fallback to a curated image gallery). Prefilled activity/distance/
duration pills. Title, reflection, and 6 mood chips (Focused, Grateful, Peaceful, Wild, Humbled,
Joyful). Publishing prepends the story to the Stories feed with a "You" attribution.

### 5. Safety Halo (in the active Move session)
Custom hold-to-send button with an animated SVG progress ring and idle pulse (`react-native-reanimated`
+ `react-native-svg`). Hold 1.6 s → the app records a mock ping to the user's chosen safety contact
and shows an on-screen confirmation. Tap the person icon in the header to set/edit the contact
(`/safety-contact`). Every surface repeats "demo mode — no real message sent" so users cannot mistake
it for real emergency infrastructure.

### 6. Weekly Mission (Connect + `/mission/[id]`)
- Connect gets a hero card showing this week's squad mission with progress bar and ends-in label.
- Tap opens the mission detail: cover image, description, big lime progress metric, full leaderboard
  with the current user highlighted in the brand-tertiary row.
- When squad hits `progress >= 1`, the progress card is replaced with a **Celebration** panel:
  pulsing lime award icon + "Mission complete" copy.
- Every finished Move session contributes km to the user's row in the squad leaderboard.

## Component library (`src/components/ui.tsx`)

`PrimaryButton`, `SecondaryButton`, `DangerButton`, `IconButton`, `SectionHeader`, `ScreenHeading`,
`MetricCard`, `Chip`, `Avatar`, `Badge`, `ProgressBar`, `EmptyState`, `SafetyHalo`.

All consume theme tokens from `src/theme.ts`; no color literals in screens.

## State

`src/state/store.tsx` — a lightweight React Context providing:
`sessions[]`, `addSession`, `maxSessionDistanceKm` (drives Explore unlocks), `stories[]`, `addStory`,
`safetyContact`, `setSafetyContact`, `lastSafetyPing`, `sendSafetyPing`, `missions[]`, `contributeKm`.
In-memory for the demo — swap to persistence later without changing the shape.

## Data

Pure mock content in `src/data/mock.ts` (activities, routes, stories, squads, achievements, profile).
Routes carry real lat/lng so the interactive map has meaningful pins.

## Out-of-scope / future

Real backend, authentication, real messaging, wearables, AI recommendations. Architecture leaves
clean boundaries so any of those can slot in without redesign.

## Tech

- Expo SDK 57, Expo Router v5, React Native 0.86.
- `react-native-maps` (native only), `expo-location`, `expo-image-picker`.
- `react-native-reanimated`, `react-native-svg` for Safety Halo.
- `expo-blur` glass tab bar on native, solid on web.
- `expo-image`, `expo-linear-gradient`, `expo-haptics`, `expo-font`.
- `react-native-safe-area-context` on every screen.

## Native-only features

- **Interactive Territory map** — falls back to an atmospheric image on the web preview. Test on a real device via Expo Go / a dev build.
- **Photo gallery picking** for Adventure Journal — works on device only; the web preview cycles through curated images.
