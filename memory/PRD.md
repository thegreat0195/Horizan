# Project Horizon — Product Requirements Document

## Product

Premium outdoor experience platform organized around 5 pillars: **Move, Explore, Stories, Connect, Safety**.
Not a fitness tracker, not a social feed, not a map app — its own identity.

## Design language

- **Foundation**: `#0A0A0A` background, graphite `#1A1A1A` / `#242424` surfaces.
- **Accent**: Electric lime `#C6FF3D` — CTAs, active states, progress, achievements only.
- **Typography**: `SpaceGrotesk-Medium` display/metric, `Geist-Regular/Medium` body (local `.ttf`).
- **Icons**: `@react-native-vector-icons/feather` (no emoji, no `@expo/vector-icons`).
- Tokens live in `src/theme.ts` — every screen consumes it.

## Navigation

- Bottom tabs: Home, Move, Explore, Stories, Connect.
- Stack routes: `/profile`, `/story-compose`, `/safety-contact`, `/mission/[id]`, `/route-playback/[id]`.

## Feature surfaces

### 1. Home — command center
Greeting, hero recommendation card, **Streak card** (`home-streak-card`), **Tomorrow weather strip**
(`home-weather-strip`), weekly summary metrics, recent-activity horizontal scroll, Explore & Stories
teasers, squad row.

### 2. Move — active session
State machine `select → active → paused → summary`. Distraction-free active view with huge duration
timer, three compact metric cards, and the **Safety Halo**. Finishing commits to app state which
drives Explore unlocks, mission progress, streak advancement, and story creation.

### 3. Territory Explorer (Explore)
- Native: real `react-native-maps` with a custom dark topographic style, locked/unlocked pins.
- Web preview: atmospheric fallback image.
- Routes unlock when max completed session distance meets each route's `distanceKm`.
- Route detail bottom sheet with elevation/difficulty and Plan CTA (when unlocked).

### 4. Adventure Journal (`/story-compose`)
Photo-first composer reached from Move summary. Real gallery picker on device
(`expo-image-picker`), curated fallback on web. Title, reflection, 6 mood chips. Publish prepends
story to the feed with "You" attribution.

### 5. Safety Halo (in Move active session)
Hold-to-send button, SVG progress ring + reanimated pulse, haptics, confirmation banner. First-run
routes to `/safety-contact` for name + relation. Every surface is labelled "demo mode — no real
message sent" so it can never be mistaken for emergency infrastructure.

### 6. Weekly Mission (Connect + `/mission/[id]`)
- Connect hero card: this week's mission with progress bar.
- Detail: cover image, big progress metric, leaderboard with current user highlighted.
- 100% → **Celebration** panel with pulsing lime award icon.
- Every finished Move session contributes km to the user's leaderboard row.

### 7. Squad Chat (Mission detail)
Lightweight thread pinned to each mission. Three seeded teammate messages (text, photo, cheer)
per mission demonstrate the surface. Composer contains:
- Photo picker (`chat-photo-button`) — real gallery on device.
- One-tap Cheer (`chat-cheer-button`) — sends "👏 Sending love from the trail" without keyboard.
- Text input + Send (`chat-input`, `chat-send-button`) — Enter also sends.
- Own messages right-aligned in lime; others left-aligned; cheers highlighted in brandTertiary.
- `KeyboardAvoidingView` on iOS.

### 8. Route Playback (`/route-playback/[id]`)
Every story card gets a Play route action (`story-play-<id>`). Screen renders:
- Full-bleed dark map card with atmospheric terrain, DEMO ROUTE badge.
- Deterministic pseudo-random polyline (generated from story id/activity via `src/utils/route.ts`).
- Ghost dotted trail + animated lime dotted route + animated runner dot along the path
  (`react-native-svg` + `react-native-reanimated` UI-thread animation).
- Elapsed time counter that syncs with playback progress.
- Play/Reset controls with a progress bar underneath.

### 9. Streak Tracker (Home)
- Fire-icon (zap) card showing consecutive-days streak count.
- 7-day pill row (Mon..Sun) — active days lit in lime, today outlined even if not yet moved.
- Copy explicitly says "Rest days welcome" so users are never punished for a rest day.
- Streak advances automatically on every finished Move session.

### 10. Weather Hero (Home)
Horizontal scroll of "Tomorrow" chips: Sunrise, Sunset, High/Low, Wind. Section label + top-right
condition summary ("Clear"). Mock data in `src/data/mock.ts` (`TOMORROW_WEATHER`).

## State (`src/state/store.tsx`)

Single React Context — no persistence yet (in-memory demo). Exposes:
- `sessions`, `addSession`, `maxSessionDistanceKm`
- `stories`, `addStory`
- `safetyContact`, `setSafetyContact`, `lastSafetyPing`, `sendSafetyPing`
- `missions`, `contributeKm`
- `chats`, `sendChat`
- `weeklyMoveDays`, `streakDays`

## Data

Mock content in `src/data/mock.ts`: activities, routes (with lat/lng for real map pins), stories,
squads, achievements, profile, and `TOMORROW_WEATHER`.

## Component library (`src/components/`)

`ui.tsx` — buttons, MetricCard, Chip, Avatar, Badge, ProgressBar, EmptyState, SectionHeader,
ScreenHeading. `safety-halo.tsx` — the hold-to-send safety button.

## Tech

Expo SDK 57, Expo Router v5, React Native 0.86. `react-native-maps`, `react-native-svg`,
`react-native-reanimated`, `expo-location`, `expo-image-picker`, `expo-blur`, `expo-image`,
`expo-haptics`, `expo-font`, `expo-linear-gradient`, `react-native-safe-area-context`.

## Native-only features

- Interactive Territory map — atmospheric fallback on web.
- Native photo gallery — curated fallback on web.
- Haptics — silent no-op on web.

## Out-of-scope / future

Real backend, authentication, real messaging, wearables, AI recommendations. Architecture leaves
clean boundaries so any of those can slot in.
