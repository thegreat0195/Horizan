# Project Horizon — Product Requirements Document

## Product

Premium outdoor experience platform organized around 5 pillars: **Move, Explore, Stories, Connect, Safety**.
Not a fitness tracker, not a social feed, not a map app — its own identity.

## Design language

- **Foundation**: `#0A0A0A` background, graphite `#1A1A1A` / `#242424` surfaces.
- **Accent**: Electric lime `#C6FF3D` — CTAs, active states, progress, achievements only.
- **Typography**: `SpaceGrotesk-Medium` display/metric, `Geist-Regular/Medium` body (local `.ttf`).
- **Icons**: `@react-native-vector-icons/feather`.
- Tokens live in `src/theme.ts`.

## Navigation

- Bottom tabs: Home, Move, Explore, Stories, Connect.
- Stack routes: `/profile`, `/story-compose`, `/safety-contact`, `/mission/[id]`,
  `/route-playback/[id]`, `/route-compare/[id]`.

## Feature surfaces

### 1. Home
Time-based greeting + **Daily Brief** card (streak, recovery, sunrise, today's suggested route),
hero recommendation card, standalone Streak card, weather chip strip, weekly metrics,
recent-activity horizontal scroll, Explore & Stories teasers, squad row.

### 2. Move — active session
State machine `select → active → paused → summary`. Selector shows a **Recovery bar** with a
lime/amber gauge and a supportive message that never hides the Start CTA. Active view uses huge
timer + metric cards + **Safety Halo**. Finishing commits the session, advancing streak, unlocking
territory, and contributing km to the squad mission.

### 3. Territory Explorer (Explore)
Real `react-native-maps` on device (dark topographic style, locked / unlocked pins). Atmospheric
fallback on web. Routes unlock as `maxSessionDistanceKm` grows.

### 4. Adventure Journal (`/story-compose`)
Photo-first composer with real gallery picker on device, curated fallback on web. Title,
reflection, 6 mood chips. Publish prepends story to feed as "You".

### 5. Safety Halo (Move active session)
Hold-to-send button with SVG progress ring + pulse + haptics. Confirmation banner never claims
real emergency contact was made.

### 6. Weekly Mission (Connect + `/mission/[id]`)
Hero card in Connect. Detail screen with cover, big progress metric, leaderboard, and a
Celebration panel when a squad hits 100 %.

### 7. Squad Chat (Mission detail)
Thread pinned to each mission with seed messages (text / photo / cheer). Composer now includes:
Photo picker, one-tap Cheer, **Voice recorder** (`chat-voice-button`), text input, and Send.
Voice notes use `expo-audio`:
  - Press-and-hold to record, release to send. Auto-stops at 15 s.
  - Recording state: red button with pulsing ring + live 0:0X counter.
  - Bubble renders a compact waveform + play/pause that plays the recording back and colors
    bars as playback advances.
  - Web preview shows the mic disabled (expo-audio recording is native-only).

### 8. Route Playback (`/route-playback/[id]`)
Every story card gets a Play route action. Dark map card, generated polyline, animated lime
dotted trail with a runner dot, elapsed timer, play/reset controls. A **Compare with your best**
chip navigates to Route Compare.

### 9. Route Compare (`/route-compare/[id]`)
Stacked pair of map tiles — "This session" (lime) and "Your best" (amber) — sharing one Play button
and progress bar. Each tile shows its own animated route, runner dot and elapsed timer scaled to
its real duration, so you can see pace differences at a glance. Empty state when no comparable
session exists yet.

### 10. Streak Tracker (Home)
Fire-icon card, current consecutive-days streak count, 7-day pill row (Mon..Sun) with today
outlined. Copy: "Rest days welcome" — rest days never reset the streak.

### 11. Weather Hero (Home)
Horizontal scroll of Tomorrow chips: Sunrise, Sunset, High / Low, Wind + condition tag.

### 12. Daily Brief (Home top card)
One-glance morning summary: time-based eyebrow with today's day-of-week, current weather chip,
three inline stat cells (Streak / Recovery / Sunrise), and "Today's pick" route link. Taps into
Move to start.

### 13. Recover Score (Move selector)
Subtle bar + percentage + supportive copy. Colour goes amber under 60 %. Start button is always
visible — the score suggests rest, never blocks a session.

## State (`src/state/store.tsx`)

React Context — in-memory, seeded with 3 prior sessions so Route Compare has data:
- `sessions`, `addSession`, `maxSessionDistanceKm`
- `stories`, `addStory`
- `safetyContact`, `setSafetyContact`, `lastSafetyPing`, `sendSafetyPing`
- `missions`, `contributeKm`
- `chats`, `sendChat` (supports `voice` kind with uri + duration)
- `weeklyMoveDays`, `streakDays`
- `recoveryScore` (0..100, floor 15 so Start stays honest)
- `getBestSession(activity, excludeId?)`

## Utilities

- `src/utils/route.ts` — deterministic `xmur3` seed → normalized polyline generator + arc-length
  helpers (`pathLength`, `pointAt`) used by Playback and Compare.

## Component library (`src/components/`)

- `ui.tsx` — buttons, MetricCard, Chip, Avatar, Badge, ProgressBar, EmptyState, SectionHeader,
  ScreenHeading.
- `safety-halo.tsx` — hold-to-send safety button.
- `voice.tsx` — `VoiceRecorderButton` and `VoiceBubble` (both use `expo-audio`).

## Tech

Expo SDK 57, Expo Router v5, React Native 0.86.
`react-native-maps`, `react-native-svg`, `react-native-reanimated`, `expo-audio`, `expo-location`,
`expo-image-picker`, `expo-blur`, `expo-image`, `expo-haptics`, `expo-font`, `expo-linear-gradient`,
`react-native-safe-area-context`.

## Native-only features

- Interactive Territory map (atmospheric fallback on web).
- Native photo gallery (curated fallback on web).
- Voice note recording (mic button disabled on web).
- Haptics (silent no-op on web).

## Out-of-scope / future

Real backend, authentication, real messaging pipeline, wearables, AI recommendations.
