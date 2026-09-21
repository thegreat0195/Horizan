// In-memory app state for Project Horizon.
// Kept intentionally lightweight — no persistence in this demo pass.
// (Users can add AsyncStorage later; the shape is stable.)

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";

import { ACTIVITY_META, ActivityType, SQUADS, STORIES } from "@/src/data/mock";

export type CompletedSession = {
  id: string;
  activity: ActivityType;
  distanceKm: number;
  durationSec: number;
  finishedAt: string;
};

export type UserStory = {
  id: string;
  title: string;
  reflection: string;
  moods: string[];
  activity: ActivityType;
  distanceKm: number;
  durationSec: number;
  photoUri: string;
  location: string;
  createdAt: string;
};

export type SafetyContact = { name: string; relation: string };
export type SafetyPing = { at: string; contactName: string };

export type ChatMessage = {
  id: string;
  author: string;
  avatar?: string;
  kind: "text" | "cheer" | "photo";
  body?: string;
  photoUri?: string;
  createdAt: string;
  mine?: boolean;
};

export type SquadMission = {
  id: string;
  squadId: string;
  title: string;
  description: string;
  targetKm: number;
  endsIn: string;
  members: { id: string; name: string; avatar?: string; km: number }[];
};

// Weekly missions — one per squad. Keep in sync with SQUADS ids.
const INITIAL_MISSIONS: SquadMission[] = [
  {
    id: "m-northside",
    squadId: SQUADS[0].id,
    title: "Sunrise Sprint",
    description: "Log a run, walk, or ride before 8:00 AM at least once this week.",
    targetKm: 300,
    endsIn: "3 days",
    members: [
      { id: "me", name: "You", km: 12.4 },
      { id: "n1", name: "Ada Winter", avatar: "https://images.pexels.com/photos/3955423/pexels-photo-3955423.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=200&w=200", km: 48.2 },
      { id: "n2", name: "Kai Rowan", avatar: "https://images.unsplash.com/photo-1600505570235-b30d6fe213f9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDV8MHwxfHNlYXJjaHw0fHxkYXJrJTIwbW9vZHklMjBvdXRkb29yJTIwcG9ydHJhaXR8ZW58MHx8fHwxNzg5ODg1ODk5fDA&ixlib=rb-4.1.0&q=85", km: 41.8 },
      { id: "n3", name: "Sana M.", km: 33.5 },
      { id: "n4", name: "Marco V.", km: 27.9 },
      { id: "n5", name: "Jules P.", km: 22.4 },
    ],
  },
  {
    id: "m-cascade",
    squadId: SQUADS[1].id,
    title: "Elevation Chase",
    description: "Squad climbs 5,000 m of trail elevation together.",
    targetKm: 200,
    endsIn: "5 days",
    members: [
      { id: "me", name: "You", km: 8.2 },
      { id: "c1", name: "Fern L.", km: 34.6 },
      { id: "c2", name: "Owen T.", km: 28.1 },
    ],
  },
  {
    id: "m-ironwheels",
    squadId: SQUADS[2].id,
    title: "500 km Rally",
    description: "Log 500 km of cycling as a squad.",
    targetKm: 500,
    endsIn: "6 days",
    members: [
      { id: "me", name: "You", km: 42.1 },
      { id: "iw1", name: "Rio B.", km: 128.3 },
      { id: "iw2", name: "Priya S.", km: 98.7 },
    ],
  },
];

// Seed user stories mirror the mock stories so the Stories feed is populated
// without duplicating shape.
const SEED_USER_STORIES: UserStory[] = STORIES.map((s) => ({
  id: s.id,
  title: s.title,
  reflection: s.reflection,
  moods: [],
  activity: s.activityType,
  distanceKm: parseFloat(s.activityChip),
  durationSec: 0,
  photoUri: s.image,
  location: s.location,
  createdAt: "seed",
}));

// Seed chat threads for the missions so the UI shows life.
const SEED_CHATS: Record<string, ChatMessage[]> = {
  "m-northside": [
    {
      id: "c1",
      author: "Ada Winter",
      avatar:
        "https://images.pexels.com/photos/3955423/pexels-photo-3955423.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=200&w=200",
      kind: "text",
      body: "Anyone doing the 6am tomorrow? Foggy but calm.",
      createdAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
    },
    {
      id: "c2",
      author: "Kai Rowan",
      avatar:
        "https://images.unsplash.com/photo-1600505570235-b30d6fe213f9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDV8MHwxfHNlYXJjaHw0fHxkYXJrJTIwbW9vZHklMjBvdXRkb29yJTIwcG9ydHJhaXR8ZW58MHx8fHwxNzg5ODg1ODk5fDA&ixlib=rb-4.1.0&q=85",
      kind: "photo",
      body: "Top of Blackridge — squad's crushing it 👏",
      photoUri:
        "https://images.pexels.com/photos/26628623/pexels-photo-26628623.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    },
    {
      id: "c3",
      author: "Sana M.",
      kind: "cheer",
      body: "👏 Sending love from the trail",
      createdAt: new Date(Date.now() - 60 * 1000 * 40).toISOString(),
    },
  ],
  "m-cascade": [
    {
      id: "cc1",
      author: "Fern L.",
      kind: "text",
      body: "Weather looks perfect Saturday — meet at trailhead?",
      createdAt: new Date(Date.now() - 3600 * 1000 * 8).toISOString(),
    },
  ],
  "m-ironwheels": [
    {
      id: "iw1",
      author: "Rio B.",
      kind: "cheer",
      body: "👏 Send it 🚴",
      createdAt: new Date(Date.now() - 60 * 1000 * 90).toISOString(),
    },
  ],
};

type Ctx = {
  sessions: CompletedSession[];
  addSession: (s: Omit<CompletedSession, "id" | "finishedAt">) => CompletedSession;
  maxSessionDistanceKm: number;

  stories: UserStory[];
  addStory: (s: Omit<UserStory, "id" | "createdAt">) => void;

  safetyContact: SafetyContact | null;
  setSafetyContact: (c: SafetyContact) => void;
  lastSafetyPing: SafetyPing | null;
  sendSafetyPing: () => SafetyPing;

  missions: SquadMission[];
  contributeKm: (squadId: string, km: number) => void;

  chats: Record<string, ChatMessage[]>;
  sendChat: (
    missionId: string,
    msg: Omit<ChatMessage, "id" | "createdAt" | "mine" | "author">,
  ) => void;

  weeklyMoveDays: number[]; // day-of-week indices (0=Mon..6=Sun) the user moved
  streakDays: number;
};

const AppContext = createContext<Ctx | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<CompletedSession[]>([]);
  const [stories, setStories] = useState<UserStory[]>(SEED_USER_STORIES);
  const [safetyContact, setSafetyContactState] = useState<SafetyContact | null>({
    name: "Sam Reyes",
    relation: "Partner",
  });
  const [lastSafetyPing, setLastSafetyPing] = useState<SafetyPing | null>(null);
  const [missions, setMissions] = useState<SquadMission[]>(INITIAL_MISSIONS);
  const [chats, setChats] = useState<Record<string, ChatMessage[]>>(SEED_CHATS);
  // Seed streak: current day-of-week + prior 4 days as active (Mon..today).
  const [weeklyMoveDays, setWeeklyMoveDays] = useState<number[]>(() => {
    const today = (new Date().getDay() + 6) % 7; // 0=Mon..6=Sun
    const seed = new Set<number>();
    // Seed a plausible active pattern: today, yesterday, and 2 earlier days
    seed.add(today);
    if (today - 1 >= 0) seed.add(today - 1);
    if (today - 3 >= 0) seed.add(today - 3);
    return Array.from(seed).sort((a, b) => a - b);
  });

  const addSession = useCallback(
    (s: Omit<CompletedSession, "id" | "finishedAt">) => {
      const session: CompletedSession = {
        ...s,
        id: `s-${Date.now()}`,
        finishedAt: new Date().toISOString(),
      };
      setSessions((prev) => [session, ...prev]);
      // Mark today active in the streak.
      const today = (new Date().getDay() + 6) % 7;
      setWeeklyMoveDays((prev) => (prev.includes(today) ? prev : [...prev, today].sort((a, b) => a - b)));
      return session;
    },
    [],
  );

  const addStory = useCallback((s: Omit<UserStory, "id" | "createdAt">) => {
    const story: UserStory = {
      ...s,
      id: `us-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setStories((prev) => [story, ...prev]);
  }, []);

  const setSafetyContact = useCallback((c: SafetyContact) => {
    setSafetyContactState(c);
  }, []);

  const sendSafetyPing = useCallback((): SafetyPing => {
    const ping: SafetyPing = {
      at: new Date().toISOString(),
      contactName: safetyContact?.name ?? "trusted contact",
    };
    setLastSafetyPing(ping);
    return ping;
  }, [safetyContact]);

  const contributeKm = useCallback((squadId: string, km: number) => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.squadId !== squadId) return m;
        return {
          ...m,
          members: m.members.map((mem) =>
            mem.id === "me" ? { ...mem, km: Math.round((mem.km + km) * 10) / 10 } : mem,
          ),
        };
      }),
    );
  }, []);

  const sendChat = useCallback(
    (
      missionId: string,
      msg: Omit<ChatMessage, "id" | "createdAt" | "mine" | "author">,
    ) => {
      const message: ChatMessage = {
        ...msg,
        id: `chat-${Date.now()}`,
        author: "You",
        mine: true,
        createdAt: new Date().toISOString(),
      };
      setChats((prev) => ({
        ...prev,
        [missionId]: [...(prev[missionId] ?? []), message],
      }));
    },
    [],
  );

  // Streak = current consecutive active days ending today (rest days do NOT reset
  // if the user simply hasn't moved *yet* today — we still show the streak up
  // to yesterday). Any older gap breaks the streak.
  const streakDays = useMemo(() => {
    const today = (new Date().getDay() + 6) % 7;
    const set = new Set(weeklyMoveDays);
    let count = 0;
    // Walk back from today; if today isn't active yet, start from yesterday.
    let cursor = set.has(today) ? today : today - 1;
    while (cursor >= 0 && set.has(cursor)) {
      count++;
      cursor--;
    }
    return count;
  }, [weeklyMoveDays]);

  const maxSessionDistanceKm = useMemo(() => {
    return sessions.reduce((mx, s) => Math.max(mx, s.distanceKm), 0);
  }, [sessions]);

  const value = useMemo(
    () => ({
      sessions,
      addSession,
      maxSessionDistanceKm,
      stories,
      addStory,
      safetyContact,
      setSafetyContact,
      lastSafetyPing,
      sendSafetyPing,
      missions,
      contributeKm,
      chats,
      sendChat,
      weeklyMoveDays,
      streakDays,
    }),
    [
      sessions,
      addSession,
      maxSessionDistanceKm,
      stories,
      addStory,
      safetyContact,
      setSafetyContact,
      lastSafetyPing,
      sendSafetyPing,
      missions,
      contributeKm,
      chats,
      sendChat,
      weeklyMoveDays,
      streakDays,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppState must be used inside AppStateProvider");
  }
  return ctx;
}

// Helper to look up label for an activity type.
export function activityLabel(a: ActivityType) {
  return ACTIVITY_META[a].label;
}

// Mood options for Adventure Journal.
export const MOODS: { id: string; label: string; icon: string }[] = [
  { id: "focused", label: "Focused", icon: "target" },
  { id: "grateful", label: "Grateful", icon: "sun" },
  { id: "peaceful", label: "Peaceful", icon: "moon" },
  { id: "wild", label: "Wild", icon: "wind" },
  { id: "humbled", label: "Humbled", icon: "triangle" },
  { id: "joyful", label: "Joyful", icon: "smile" },
];
