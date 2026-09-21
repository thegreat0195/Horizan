// Mock data for Project Horizon — clearly demo content.
// No real GPS, no real backend, no fake emergency services.

export type ActivityType = "run" | "walk" | "cycle" | "hike";

export const ACTIVITY_META: Record<
  ActivityType,
  { label: string; icon: string; image: string; unit: string }
> = {
  run: {
    label: "Run",
    icon: "activity",
    image:
      "https://images.pexels.com/photos/15457899/pexels-photo-15457899.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    unit: "km",
  },
  walk: {
    label: "Walk",
    icon: "trending-up",
    image:
      "https://images.unsplash.com/photo-1699959560616-aa17ace76879?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTJ8MHwxfHNlYXJjaHwyfHxydW5uaW5nJTIwY3ljbGluZyUyMGhpa2luZyUyMHdhbGtpbmclMjBvdXRkb29yfGVufDB8fHx8MTc4OTg4NTg5OXww&ixlib=rb-4.1.0&q=85",
    unit: "km",
  },
  cycle: {
    label: "Cycle",
    icon: "wind",
    image:
      "https://images.pexels.com/photos/5965907/pexels-photo-5965907.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    unit: "km",
  },
  hike: {
    label: "Hike",
    icon: "map",
    image:
      "https://images.unsplash.com/photo-1699959560616-aa17ace76879?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTJ8MHwxfHNlYXJjaHwyfHxydW5uaW5nJTIwY3ljbGluZyUyMGhpa2luZyUyMHdhbGtpbmclMjBvdXRkb29yfGVufDB8fHx8MTc4OTg4NTg5OXww&ixlib=rb-4.1.0&q=85",
    unit: "km",
  },
};

export const HOME_HERO = {
  title: "Golden hour trail run",
  subtitle: "Sunset at 6:42 pm · 12°C, clear",
  image:
    "https://images.pexels.com/photos/34377535/pexels-photo-34377535.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
};

export const RECENT_ACTIVITIES = [
  {
    id: "a1",
    type: "run" as ActivityType,
    title: "Riverside loop",
    distanceKm: 8.4,
    durationMin: 42,
    pace: "5:00 /km",
    date: "Yesterday",
  },
  {
    id: "a2",
    type: "hike" as ActivityType,
    title: "Blackridge Summit",
    distanceKm: 14.2,
    durationMin: 245,
    pace: "17:15 /km",
    date: "3 days ago",
  },
  {
    id: "a3",
    type: "cycle" as ActivityType,
    title: "Pine Valley loop",
    distanceKm: 32.1,
    durationMin: 88,
    pace: "21.8 km/h",
    date: "5 days ago",
  },
];

export const EXPLORE_ROUTES = [
  {
    id: "r1",
    name: "Blackridge Summit",
    region: "Northern Cascades",
    distanceKm: 14.2,
    elevationM: 820,
    difficulty: "Hard",
    coord: { latitude: 47.6062, longitude: -122.3321 },
    image:
      "https://images.pexels.com/photos/18804214/pexels-photo-18804214.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    id: "r2",
    name: "Emerald Traverse",
    region: "Southern Range",
    distanceKm: 22.8,
    elevationM: 1240,
    difficulty: "Expert",
    coord: { latitude: 47.65, longitude: -122.4 },
    image:
      "https://images.pexels.com/photos/26628623/pexels-photo-26628623.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    id: "r3",
    name: "Iron Canyon Loop",
    region: "Eastern Basin",
    distanceKm: 9.6,
    elevationM: 340,
    difficulty: "Moderate",
    coord: { latitude: 47.58, longitude: -122.27 },
    image:
      "https://images.unsplash.com/photo-1753119326723-55f030d81da5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxkcmFtYXRpYyUyMG1vdW50YWluJTIwZm9yZXN0JTIwdHJhaWwlMjBhZXJpYWx8ZW58MHx8fHwxNzg5ODg1ODk5fDA&ixlib=rb-4.1.0&q=85",
  },
  {
    id: "r4",
    name: "Pine River Trail",
    region: "West Woods",
    distanceKm: 6.2,
    elevationM: 120,
    difficulty: "Easy",
    coord: { latitude: 47.62, longitude: -122.36 },
    image:
      "https://images.pexels.com/photos/18804214/pexels-photo-18804214.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
];

export const STORIES = [
  {
    id: "s1",
    title: "Sleeping above the clouds",
    author: "Ada Winter",
    avatar:
      "https://images.pexels.com/photos/3955423/pexels-photo-3955423.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    activityChip: "14.2km · Hike",
    activityType: "hike" as ActivityType,
    location: "Blackridge Summit",
    image:
      "https://images.unsplash.com/photo-1623228675987-57d5999f6c5b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MjJ8MHwxfHNlYXJjaHwxfHxwb3YlMjBvdXRkb29yJTIwYWR2ZW50dXJlJTIwaGlraW5nJTIwY2FtcGluZyUyMGZyaWVuZHN8ZW58MHx8fHwxNzg5ODg1OTA2fDA&ixlib=rb-4.1.0&q=85",
    reflection:
      "The wind never stopped, and neither did we. Twelve hours of switchbacks paid off at first light.",
  },
  {
    id: "s2",
    title: "Lake camp, alone",
    author: "Kai Rowan",
    avatar:
      "https://images.unsplash.com/photo-1600505570235-b30d6fe213f9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDV8MHwxfHNlYXJjaHw0fHxkYXJrJTIwbW9vZHklMjBvdXRkb29yJTIwcG9ydHJhaXR8ZW58MHx8fHwxNzg5ODg1ODk5fDA&ixlib=rb-4.1.0&q=85",
    activityChip: "9.6km · Hike",
    activityType: "hike" as ActivityType,
    location: "Iron Canyon Loop",
    image:
      "https://images.pexels.com/photos/4275973/pexels-photo-4275973.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    reflection: "No signal, no notifications, no plans. Water was cold enough to hurt.",
  },
  {
    id: "s3",
    title: "Night trail, no moon",
    author: "Sana M.",
    avatar:
      "https://images.pexels.com/photos/3955423/pexels-photo-3955423.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    activityChip: "6.2km · Run",
    activityType: "run" as ActivityType,
    location: "Pine River Trail",
    image:
      "https://images.pexels.com/photos/29176030/pexels-photo-29176030.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    reflection: "Headlamp on, headphones off. Two owls, one deer, zero regrets.",
  },
];

export const SQUADS = [
  {
    id: "sq1",
    name: "Northside Runners",
    members: 24,
    weekKm: 218.4,
    rank: 1,
    avatars: [
      "https://images.pexels.com/photos/3955423/pexels-photo-3955423.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=200&w=200",
      "https://images.unsplash.com/photo-1600505570235-b30d6fe213f9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDV8MHwxfHNlYXJjaHw0fHxkYXJrJTIwbW9vZHklMjBvdXRkb29yJTIwcG9ydHJhaXR8ZW58MHx8fHwxNzg5ODg1ODk5fDA&ixlib=rb-4.1.0&q=85",
    ],
  },
  {
    id: "sq2",
    name: "Cascade Hikers",
    members: 18,
    weekKm: 184.9,
    rank: 2,
    avatars: [
      "https://images.pexels.com/photos/3955423/pexels-photo-3955423.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=200&w=200",
    ],
  },
  {
    id: "sq3",
    name: "Iron Wheels",
    members: 12,
    weekKm: 462.7,
    rank: 3,
    avatars: [
      "https://images.unsplash.com/photo-1600505570235-b30d6fe213f9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDV8MHwxfHNlYXJjaHw0fHxkYXJrJTIwbW9vZHklMjBvdXRkb29yJTIwcG9ydHJhaXR8ZW58MHx8fHwxNzg5ODg1ODk5fDA&ixlib=rb-4.1.0&q=85",
    ],
  },
];

export const CHALLENGES = [
  {
    id: "c1",
    title: "May 100km",
    progress: 0.68,
    detail: "68 / 100 km",
    endsIn: "12 days",
  },
  {
    id: "c2",
    title: "Everest Elevation",
    progress: 0.31,
    detail: "2,741 / 8,848 m",
    endsIn: "48 days",
  },
  {
    id: "c3",
    title: "Weekend Warrior",
    progress: 1,
    detail: "Completed",
    endsIn: "Complete",
  },
];

export const ACHIEVEMENTS = [
  { id: "b1", label: "First 10K", icon: "award", unlocked: true },
  { id: "b2", label: "5 Peaks", icon: "triangle", unlocked: true },
  { id: "b3", label: "Night Owl", icon: "moon", unlocked: true },
  { id: "b4", label: "Century", icon: "target", unlocked: false },
  { id: "b5", label: "Sunrise", icon: "sunrise", unlocked: true },
  { id: "b6", label: "Explorer", icon: "compass", unlocked: false },
];

export const PROFILE = {
  name: "Alex Ryder",
  handle: "@alexryder",
  bio: "Cold mornings, long trails, quieter routes.",
  cover:
    "https://images.pexels.com/photos/26628623/pexels-photo-26628623.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  avatar:
    "https://images.unsplash.com/photo-1600505570235-b30d6fe213f9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDV8MHwxfHNlYXJjaHw0fHxkYXJrJTIwbW9vZHklMjBvdXRkb29yJTIwcG9ydHJhaXR8ZW58MHx8fHwxNzg5ODg1ODk5fDA&ixlib=rb-4.1.0&q=85",
  lifetimeKm: 1284.6,
  activitiesCount: 187,
  peaksCount: 12,
};
