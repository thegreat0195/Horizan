import React, { useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import FeatherIcon from "@react-native-vector-icons/feather";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Path } from "react-native-svg";
import Animated, {
  cancelAnimation,
  Easing,
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
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

const MAP_TERRAIN =
  "https://images.pexels.com/photos/26628623/pexels-photo-26628623.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

const useStyles = makeStyles((colors) => ({
  root: { flex: 1, backgroundColor: colors.surface },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
  },
  headerTitle: {
    color: colors.onSurface,
    fontFamily: fonts.display,
    fontSize: fontSize.xl,
  },
  tileCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.surfaceSecondary,
    aspectRatio: 1.6,
  },
  tileBg: { ...StyleSheet.absoluteFillObject },
  tileLabel: {
    position: "absolute",
    left: spacing.md,
    top: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: "rgba(10,10,10,0.7)",
  },
  tileLabelText: {
    color: "#FFFFFF",
    fontFamily: fonts.textMedium,
    fontSize: fontSize.xs,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  tileTime: {
    position: "absolute",
    right: spacing.md,
    top: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.md,
    backgroundColor: "rgba(10,10,10,0.7)",
  },
  tileTimeValue: {
    color: "#FFFFFF",
    fontFamily: fonts.metric,
    fontSize: fontSize.lg,
  },
  tileStats: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
    flexDirection: "row",
    gap: spacing.md,
  },
  statChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: "rgba(10,10,10,0.7)",
  },
  statText: {
    color: "#FFFFFF",
    fontFamily: fonts.textMedium,
    fontSize: fontSize.sm,
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
  emptyBox: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: spacing.xl,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSecondary,
    alignItems: "center",
    gap: spacing.md,
  },
  emptyTitle: {
    color: colors.onSurface,
    fontFamily: fonts.display,
    fontSize: fontSize.xl,
    letterSpacing: -0.3,
    textAlign: "center",
  },
  emptyText: {
    color: colors.muted,
    fontFamily: fonts.text,
    fontSize: fontSize.sm,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 260,
  },
}));

type Tile = {
  seed: string;
  activity: keyof typeof ACTIVITY_META;
  distanceKm: number;
  durationSec: number;
  label: string;
  color: "brand" | "amber";
};

export default function RouteCompareScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const { stories, getBestSession } = useAppState();

  const story = stories.find((s) => s.id === params.id) ?? stories[0];
  const best = getBestSession(story.activity, story.id);

  const tiles: Tile[] = useMemo(() => {
    const primary: Tile = {
      seed: `${story.id}-${story.activity}`,
      activity: story.activity,
      distanceKm: story.distanceKm > 0 ? story.distanceKm : 8.4,
      durationSec: story.durationSec > 0 ? story.durationSec : 42 * 60,
      label: "This session",
      color: "brand",
    };
    if (!best) return [primary];
    const secondary: Tile = {
      seed: `${best.id}-${best.activity}-best`,
      activity: best.activity,
      distanceKm: best.distanceKm,
      durationSec: best.durationSec,
      label: "Your best",
      color: "amber",
    };
    return [primary, secondary];
  }, [story, best]);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <IconButton
          name="arrow-left"
          onPress={() => router.back()}
          testID="compare-back-button"
        />
        <Text style={styles.headerTitle}>Route compare</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxxl }}
        showsVerticalScrollIndicator={false}
        testID="compare-scroll"
      >
        <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.md, marginBottom: spacing.lg }}>
          <Text
            style={{
              color: colors.brandPrimary,
              fontFamily: fonts.textMedium,
              fontSize: fontSize.xs,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            {ACTIVITY_META[story.activity].label}
          </Text>
          <Text
            style={{
              color: colors.onSurface,
              fontFamily: fonts.display,
              fontSize: fontSize.display,
              letterSpacing: -1,
              marginTop: 4,
            }}
          >
            {story.title}
          </Text>
          {best ? (
            <Text
              style={{
                color: colors.muted,
                fontFamily: fonts.text,
                fontSize: fontSize.base,
                marginTop: spacing.xs,
              }}
            >
              vs your best {ACTIVITY_META[best.activity].label.toLowerCase()} —{" "}
              {best.distanceKm.toFixed(1)} km
            </Text>
          ) : null}
        </View>

        {best ? (
          <PairedPlayer tiles={tiles} />
        ) : (
          <View style={styles.emptyBox}>
            <FeatherIcon name="git-branch" size={28} color={colors.brandPrimary} />
            <Text style={styles.emptyTitle}>No comparison yet</Text>
            <Text style={styles.emptyText}>
              Finish another {ACTIVITY_META[story.activity].label.toLowerCase()} session and we&apos;ll
              overlay it against this one.
            </Text>
            <SecondaryButton
              label="Start a session"
              icon="play"
              onPress={() => router.replace("/move")}
              testID="compare-start-session"
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function PairedPlayer({ tiles }: { tiles: Tile[] }) {
  const styles = useStyles();
  const { colors } = useTheme();
  const progress = useSharedValue(0);
  const [playing, setPlaying] = useState(false);
  const [elapsedByTile, setElapsedByTile] = useState<number[]>(tiles.map(() => 0));
  const stopTick = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (stopTick.current) clearInterval(stopTick.current);
    },
    [],
  );

  const setPlayingSafe = (v: boolean) => setPlaying(v);

  const play = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    if (progress.value >= 0.999) {
      progress.value = 0;
      setElapsedByTile(tiles.map(() => 0));
    }
    const remaining = 1 - progress.value;
    const duration = Math.max(1500, 8000 * remaining);
    setPlaying(true);
    progress.value = withTiming(1, { duration, easing: Easing.linear }, (fin) => {
      if (fin) runOnJS(setPlayingSafe)(false);
    });
    if (stopTick.current) clearInterval(stopTick.current);
    const start = Date.now();
    const startProgress = progress.value;
    stopTick.current = setInterval(() => {
      const t = (Date.now() - start) / duration;
      const p = Math.min(1, startProgress + t * remaining);
      setElapsedByTile(tiles.map((tile) => Math.floor(p * tile.durationSec)));
      if (p >= 0.999 && stopTick.current) clearInterval(stopTick.current);
    }, 100) as unknown as number;
  };

  const reset = () => {
    Haptics.selectionAsync().catch(() => {});
    cancelAnimation(progress);
    progress.value = 0;
    setPlaying(false);
    setElapsedByTile(tiles.map(() => 0));
    if (stopTick.current) clearInterval(stopTick.current);
  };

  return (
    <>
      {tiles.map((tile, idx) => (
        <RouteTile
          key={tile.seed}
          tile={tile}
          progress={progress}
          elapsedSec={elapsedByTile[idx]}
        />
      ))}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.md,
          paddingHorizontal: spacing.lg,
          marginTop: spacing.lg,
        }}
      >
        <Pressable onPress={play} style={styles.playBtn} testID="compare-play-button">
          <FeatherIcon
            name={playing ? "pause" : "play"}
            size={26}
            color={colors.onBrandPrimary}
          />
        </Pressable>
        <View style={styles.trackBar}>
          <CompareTrack progress={progress} />
        </View>
      </View>
      <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.lg }}>
        <SecondaryButton
          label="Reset"
          icon="rotate-ccw"
          onPress={reset}
          testID="compare-reset-button"
        />
      </View>
    </>
  );
}

function CompareTrack({ progress }: { progress: Animated.SharedValue<number> }) {
  const { colors } = useTheme();
  const style = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
    height: "100%",
    backgroundColor: colors.brandPrimary,
    borderRadius: 999,
  }));
  return <Animated.View style={style} />;
}

function RouteTile({
  tile,
  progress,
  elapsedSec,
}: {
  tile: Tile;
  progress: Animated.SharedValue<number>;
  elapsedSec: number;
}) {
  const styles = useStyles();
  const { colors } = useTheme();
  const points = useMemo(() => generateRoute(tile.seed, 72), [tile.seed]);
  const size = SCREEN_W - spacing.lg * 2;
  const mapH = size / 1.6;
  const pathD = useMemo(
    () => points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x * size} ${p.y * mapH}`).join(" "),
    [points, size, mapH],
  );
  const [pathLenPx, setPathLenPx] = useState<number>(0);
  useEffect(() => {
    const norm = pathLength(points);
    setPathLenPx(norm * Math.max(size, mapH) * 1.05);
  }, [points, size, mapH]);

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

  const brandColor = tile.color === "amber" ? colors.warning : colors.brandPrimary;

  return (
    <View style={styles.tileCard} testID={`compare-tile-${tile.label}`}>
      <Image source={{ uri: MAP_TERRAIN }} style={styles.tileBg} contentFit="cover" />
      <LinearGradient
        colors={["rgba(10,10,10,0.55)", "rgba(10,10,10,0.85)"]}
        style={StyleSheet.absoluteFill}
      />
      <Svg width={size} height={mapH} style={StyleSheet.absoluteFill}>
        <Path
          d={pathD}
          stroke="rgba(255,255,255,0.16)"
          strokeWidth={3}
          fill="none"
          strokeDasharray="2 6"
        />
        <AnimatedPath
          d={pathD}
          stroke={brandColor}
          strokeWidth={4}
          fill="none"
          strokeDasharray="4 6"
          strokeLinecap="round"
          animatedProps={animatedPathProps}
        />
        <Circle
          cx={points[0].x * size}
          cy={points[0].y * mapH}
          r={5}
          fill="#FFFFFF"
          stroke={brandColor}
          strokeWidth={2}
        />
        <Circle
          cx={points[points.length - 1].x * size}
          cy={points[points.length - 1].y * mapH}
          r={5}
          fill={brandColor}
        />
        <AnimatedCircle
          r={8}
          fill={brandColor}
          stroke={colors.surface}
          strokeWidth={3}
          animatedProps={animatedDotProps}
        />
      </Svg>

      <View style={styles.tileLabel}>
        <View
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: brandColor,
          }}
        />
        <Text style={styles.tileLabelText}>{tile.label}</Text>
      </View>
      <View style={styles.tileTime}>
        <Text style={styles.tileTimeValue}>{formatClock(elapsedSec)}</Text>
      </View>
      <View style={styles.tileStats}>
        <View style={styles.statChip}>
          <FeatherIcon name="map" size={13} color={brandColor} />
          <Text style={styles.statText}>{tile.distanceKm.toFixed(1)} km</Text>
        </View>
        <View style={styles.statChip}>
          <FeatherIcon name="clock" size={13} color={brandColor} />
          <Text style={styles.statText}>{formatClock(tile.durationSec)}</Text>
        </View>
      </View>
    </View>
  );
}
