# Project Horizon — Product Requirements Document

## Product

Project Horizon is a premium, outdoor-focused mobile experience platform organized around 5 pillars:
**Move, Explore, Stories, Connect, Safety**. It is not a generic fitness tracker, not a social feed, not a map app — it is an outdoor experience platform with a strong, distinctive product identity.

## Design language

- **Personality**: Dark-First Utility with Luxe spacing. Premium, energetic, outdoor, technical, human.
- **Foundation**: Near-black `#0A0A0A` background, graphite surfaces `#1A1A1A` / `#242424`.
- **Accent**: Electric lime `#C6FF3D` — used only for primary CTAs, active states, progress, achievements, and important metrics. Never for decorative fill.
- **Typography**: `SpaceGrotesk-Medium` for display and metrics, `Geist-Regular/Medium` for body. Local fonts under `/app/frontend/assets/fonts/`.
- **Icons**: `@react-native-vector-icons/feather` (no emoji, no `@expo/vector-icons`).
- **Hero photography**: Curated outdoor imagery with 3-stop dark scrim for legibility.

Design tokens live in `/app/frontend/src/theme.ts`. Colors match `design_guidelines.json`. Additional exports: `spacing`, `radius`, `fonts`, `fontSize`.

## Navigation

- 5 bottom tabs (Expo Router `(tabs)` group): `Home`, `Move`, `Explore`, `Stories`, `Connect`.
- Profile is a stack route accessible from the home avatar button (`/profile`).
- Safety is a contextual `shield` icon on Home and the active Move session (no fake emergency infra).
- Blur-tinted glass tab bar on native, solid on web.

## Screens

### Home (`app/(tabs)/index.tsx`)
Command center — greeting, hero recommendation card (large image, gradient scrim, lime CTA), weekly summary metrics, recent activity horizontal scroll, Explore teaser, Story of the week, squad activity row.

### Move (`app/(tabs)/move.tsx`)
Local state machine: `select → active → paused → summary`.
- **Select**: 2×2 grid of activity cards (Run/Walk/Cycle/Hike) with dark scrims and outdoor imagery. Selected card gets a lime border + lime icon. Sticky floating "Start" CTA.
- **Active**: Distraction-free session view. Huge duration in `SpaceGrotesk-Medium`. Three compact metric cards (distance, pace, BPM). Clearly labelled "DEMO MODE · SIMULATED METRICS" — no real GPS.
- **Paused**: Same layout, adds Resume + Finish (danger) controls.
- **Summary**: "Nice work.", big distance metric, 4 compact metric cards, Save-as-story CTA.
Haptic feedback on every state change (`impactMedium` start, `impactHeavy` pause, `notificationSuccess` finish).

### Explore (`app/(tabs)/explore.tsx`)
Full-bleed atmospheric terrain "map preview" (image + scrim) clearly labelled `MAP · DEMO PREVIEW`, floating layer/nav icon buttons, sticky horizontal chip row (Near you, Trails, Peaks, Loops, Sunset, Long routes), curated route cards with difficulty chip, distance, elevation.

### Stories (`app/(tabs)/stories.tsx`)
Immersive edge-to-edge story cards. Each card = outdoor image + 3-stop gradient + author row + activity chip + title + reflection + Applaud/Reflect/Share actions. Not a like/comment social feed.

### Connect (`app/(tabs)/connect.tsx`)
Segmented control `Squads | Challenges`. Squads = weekly leaderboard with rank number in lime, avatar, member count and squad km. Challenges = progress bars with lime fill.

### Profile (`app/profile.tsx`)
Cover banner with dark scrim, overlapping avatar, name/handle/bio, lifetime distance hero card in lime, sessions/peaks metric cards, achievements grid (unlocked = lime, locked = muted), history list.

## Component library (`src/components/ui.tsx`)

`PrimaryButton`, `SecondaryButton`, `DangerButton`, `IconButton`, `SectionHeader`, `ScreenHeading`, `MetricCard`, `Chip`, `Avatar`, `Badge`, `ProgressBar`, `EmptyState`.

All consume theme tokens; no hex literals in screens.

## Data

Pure mock content under `src/data/mock.ts` — recent activities, explore routes, stories, squads, challenges, achievements, profile. No backend, no real GPS, no fake emergency services, no auth.

## Out-of-scope / future

Real maps + GPS · real activity persistence · authentication · social graph · emergency services · wearables · AI recommendations. Architecture leaves clean boundaries (single `mock.ts` provider) so real services can slot in without redesign.

## Tech

- Expo SDK 57, Expo Router v5, React Native 0.86.
- Fonts loaded via `expo-font` from local `.ttf` assets.
- Blur tab bar via `expo-blur`.
- Images via `expo-image`, gradients via `expo-linear-gradient`.
- Haptics via `expo-haptics`.
- Safe areas via `react-native-safe-area-context` (all screens honour `useSafeAreaInsets()`).
