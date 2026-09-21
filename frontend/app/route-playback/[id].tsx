import React, { useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import FeatherIcon from "@react-native-vector-icons/feather";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Path } from "react-native-svg";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { fonts, fontSize, makeStyles, radius, spacing, useTheme } from "@/src/theme";
import { ACTIVITY_META } from "@/src/data/mock";
import { IconButton, SecondaryButton } from "@/src/components/ui";
import { useAppState } from "@/src/state/store";
import { generateRoute, pathLength, pointAt } from "@/src/utils/route";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const { width: SCREEN_W } = Dimensions.get("window");

function formatClock(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const useStyles = makeStyles((colors) => ({
  root: { flex: 1, backgroundColor: colors.surface },
  header: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  },
  eyebrow: {
    color: colors.brandPrimary,
    fontFamily: fonts.textMedium,
    fontSize: fontSize.xs,
    letterSpacing: 2.2,
    textTransform: "uppercase",
  },
  title: {
    color: "#FFFFFF",
    fontFamily: fonts.display,
    fontSize: fontSize.xxl,
    letterSpacing: -0.3,
    marginTop: 2,
  },
  mapCard: {
    marginHorizontal: spacing.lg,
    borderRadius: radius.lg,
    overflow: "hidden",
    aspectRatio: 0.95,
    backgroundColor: colors.surfaceSecondary,
  },
  mapBg: { ...StyleSheet.absoluteFillObject },
  timeCard: {
    position: "absolute",
    left: spacing.md,
    top: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: "rgba(10,10,10,0.7)",
  },
  timeValue: {
    color: "#FFFFFF",
    fontFamily: fonts.metric,
    fontSize: fontSize.xxl,
    letterSpacing: -0.5,
  },
  timeLabel: {
    color: "rgba(255,255,255,0.7)",
    fontFamily: fonts.text,
    fontSize: fontSize.xs,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginTop: 2,
  },
  chipRow: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  metricPill: {
    backgroundColor: "rgba(10,10,10,0.7)",
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metricPillText: {
    color: "#FFFFFF",
    fontFamily: fonts.textMedium,
    fontSize: fontSize.sm,
  },
  meta: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  metaLabel: {
    color: colors.muted,
    fontFamily: fonts.textMedium,
    fontSize: fontSize.xs,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  metaTitle: {
    color: colors.onSurface,
    fontFamily: fonts.display,
    fontSize: fontSize.display,
    letterSpacing: -1,
    marginTop: 4,
  },
  metaLocation: {
    color: colors.muted,
    fontFamily: fonts.text,
    fontSize: fontSize.base,
    marginTop: spacing.xs,
  },
  playRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  playBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.brandPrimary,
    alignItems: "center",
    justifyContent: "center",
  },
  trackBar: {
    flex: 1,
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceSecondary,
    overflow: "hidden",
  },
  trackFill: {
    height: "100%",
    backgroundColor: colors.brandPrimary,
    borderRadius: radius.pill,
  },
  demoBadge: {
    position: "absolute",
    right: spacing.md,
    top: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: "rgba(10,10,10,0.7)",
    gap: spacing.sm,
  },
  demoDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.warning },
  demoText: {
    color: "rgba(255,255,255,0.85)",
    fontFamily: fonts.textMedium,
    fontSize: fontSize.xs,
    letterSpacing: 1.2,
  },
}));

const MAP_TERRAIN =
  "https://images.pexels.com/photos/26628623/pexels-photo-26628623.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

export default function RoutePlaybackScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string }>();
  const { stories } = useAppState();

  const story = stories.find((s) => s.id === params.id) ?? stories[0];
  const meta = ACTIVITY_META[story.activity];

  // Deterministic route from the story id + activity so it is stable.
  const points = useMemo(
    () => generateRoute(`${story.id}-${story.activity}`, 72),
    [story.id, story.activity],
  );
  // Fixed viewport
  const size = SCREEN_W - spacing.lg * 2;
  const mapH = size / 0.95;
  const pathD = useMemo(() => {
    return points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x * size} ${p.y * mapH}`)
      .join(" ");
  }, [points, size, mapH]);

  // Length used for stroke-dasharray animation
  const [pathLenPx, setPathLenPx] = useState<number>(0);
  useEffect(() => {
    const norm = pathLength(points);
    // rough conversion to px length by scaling with the mean of viewport dims
    setPathLenPx(norm * Math.max(size, mapH) * 1.05);
  }, [points, size, mapH]);

  const progress = useSharedValue(0);
  const [playing, setPlaying] = useState(false);
  const [displayedElapsed, setDisplayedElapsed] = useState(0);
  const totalDurationSec = story.durationSec > 0 ? story.durationSec : 42 * 60; // fallback 42:00

  const dashOffset = useDerivedValue(() => pathLenPx * (1 - progress.value));
  const animatedPathProps = useAnimatedProps(() => ({
    strokeDashoffset: dashOffset.value,
  }));

  const dotXY = useDerivedValue(() => {
    const p = pointAt(points, progress.value);
    return { cx: p.x * size, cy: p.y * mapH };
  });
  const animatedDotProps = useAnimatedProps(() => ({
    cx: dotXY.value.cx,
    cy: dotXY.value.cy,
  }));

  const stopTick = useRef<number | null>(null);
  useEffect(() => () => {
    if (stopTick.current) clearInterval(stopTick.current);
  }, []);

  const setPlayingSafe = (v: boolean) => setPlaying(v);

  const handlePlay = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    if (progress.value >= 0.999) {
      progress.value = 0;
      setDisplayedElapsed(0);
    }
    const remaining = 1 - progress.value;
    const duration = Math.max(1500, 8000 * remaining);
    setPlaying(true);
    progress.value = withTiming(1, { duration, easing: Easing.linear }, (finished) => {
      if (finished) runOnJS(setPlayingSafe)(false);
    });
    if (stopTick.current) clearInterval(stopTick.current);
    const startTs = Date.now();
    const startElapsedSec = progress.value * totalDurationSec;
    stopTick.current = setInterval(() => {
      const t = (Date.now() - startTs) / duration; // 0..1 within this play span
      const frac = Math.min(1, progress.value); // approximation
      const overall = Math.min(1, (startElapsedSec / totalDurationSec) + t * remaining);
      setDisplayedElapsed(overall * totalDurationSec);
      if (frac >= 0.999) {
        if (stopTick.current) clearInterval(stopTick.current);
      }
    }, 100) as unknown as number;
  };

  const handleReset = () => {
    Haptics.selectionAsync().catch(() => {});
    cancelAnimation(progress);
    progress.value = 0;
    setPlaying(false);
    setDisplayedElapsed(0);
    if (stopTick.current) clearInterval(stopTick.current);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={[styles.header, { top: insets.top + spacing.md }]}>
        <IconButton
          name="arrow-left"
          onPress={() => router.back()}
          testID="playback-back-button"
        />
        <View style={{ alignItems: "center", flex: 1 }}>
          <Text style={styles.eyebrow}>Route replay</Text>
          <Text style={styles.title} numberOfLines={1}>{story.title}</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      <View style={{ marginTop: insets.top + 72 }}>
        <View style={styles.mapCard}>
          <Image source={{ uri: MAP_TERRAIN }} style={styles.mapBg} contentFit="cover" />
          <LinearGradient
            colors={["rgba(10,10,10,0.55)", "rgba(10,10,10,0.85)"]}
            locations={[0, 1]}
            style={StyleSheet.absoluteFill}
          />
          <Svg width={size} height={mapH} style={StyleSheet.absoluteFill}>
            {/* Ghost path (full route, dim) */}
            <Path
              d={pathD}
              stroke="rgba(255,255,255,0.18)"
              strokeWidth={3}
              fill="none"
              strokeDasharray="2 8"
              strokeLinecap="round"
            />
            {/* Animated dotted lime path */}
            <AnimatedPath
              d={pathD}
              stroke={colors.brandPrimary}
              strokeWidth={4}
              fill="none"
              strokeDasharray={`4 6`}
              strokeLinecap="round"
              animatedProps={animatedPathProps}
            />
            {/* Start marker */}
            <Circle
              cx={points[0].x * size}
              cy={points[0].y * mapH}
              r={6}
              fill={colors.onSurface}
              stroke={colors.brandPrimary}
              strokeWidth={2}
            />
            {/* End marker */}
            <Circle
              cx={points[points.length - 1].x * size}
              cy={points[points.length - 1].y * mapH}
              r={6}
              fill={colors.brandPrimary}
            />
            {/* Runner dot */}
            <AnimatedCircle
              r={9}
              fill={colors.brandPrimary}
              stroke={colors.surface}
              strokeWidth={3}
              animatedProps={animatedDotProps}
            />
          </Svg>

          <View style={styles.timeCard}>
            <Text style={styles.timeValue}>{formatClock(displayedElapsed)}</Text>
            <Text style={styles.timeLabel}>Elapsed</Text>
          </View>

          <View style={styles.demoBadge}>
            <View style={styles.demoDot} />
            <Text style={styles.demoText}>DEMO ROUTE</Text>
          </View>

          <View style={styles.chipRow}>
            <View style={styles.metricPill}>
              <FeatherIcon name={meta.icon as any} size={14} color={colors.brandPrimary} />
              <Text style={styles.metricPillText}>{meta.label}</Text>
            </View>
            <View style={styles.metricPill}>
              <FeatherIcon name="map" size={14} color={colors.brandPrimary} />
              <Text style={styles.metricPillText}>
                {story.distanceKm > 0 ? `${story.distanceKm.toFixed(1)} km` : "—"}
              </Text>
            </View>
            <View style={styles.metricPill}>
              <FeatherIcon name="clock" size={14} color={colors.brandPrimary} />
              <Text style={styles.metricPillText}>{formatClock(totalDurationSec)}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.meta}>
        <Text style={styles.metaLabel}>{meta.label} · story</Text>
        <Text style={styles.metaTitle} numberOfLines={1}>
          {story.title}
        </Text>
        <Text style={styles.metaLocation}>{story.location}</Text>
      </View>

      <View style={styles.playRow}>
        <Pressable
          onPress={handlePlay}
          style={styles.playBtn}
          testID="playback-play-button"
        >
          <FeatherIcon
            name={playing ? "pause" : "play"}
            size={26}
            color={colors.onBrandPrimary}
          />
        </Pressable>
        <View style={styles.trackBar}>
          <PlaybackTrack progress={progress} />
        </View>
      </View>
      <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.lg }}>
        <SecondaryButton
          label="Reset"
          icon="rotate-ccw"
          onPress={handleReset}
          testID="playback-reset-button"
        />
      </View>
    </View>
  );
}

// Small helper that projects the Reanimated shared progress into a width style.
function PlaybackTrack({ progress }: { progress: Animated.SharedValue<number> }) {
  const { colors } = useTheme();
  const style = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
    height: "100%",
    backgroundColor: colors.brandPrimary,
    borderRadius: 999,
  }));
  return <Animated.View style={style} />;
}
