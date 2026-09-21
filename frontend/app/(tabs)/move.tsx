import React, { useEffect, useRef, useState } from "react";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import FeatherIcon from "@react-native-vector-icons/feather";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";

import { fonts, fontSize, makeStyles, radius, spacing, useTheme } from "@/src/theme";
import { ACTIVITY_META, ActivityType, SQUADS } from "@/src/data/mock";
import { DangerButton, IconButton, MetricCard, PrimaryButton, ScreenHeading, SecondaryButton } from "@/src/components/ui";
import { SafetyHalo } from "@/src/components/safety-halo";
import { useAppState } from "@/src/state/store";

type Phase = "select" | "ready" | "active" | "paused" | "summary";

const ACTIVITY_KEYS: ActivityType[] = ["run", "walk", "cycle", "hike"];

// Mock pace/hr generator — clearly synthetic. No real GPS.
const MOCK_PACE = { run: "5:04", walk: "12:30", cycle: "21.6", hike: "16:45" };
const MOCK_HR = { run: 156, walk: 108, cycle: 142, hike: 128 };
const MOCK_UNIT_PACE = { run: "/km", walk: "/km", cycle: "km/h", hike: "/km" };

function formatDuration(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

const useStyles = makeStyles((colors) => ({
  root: { flex: 1, backgroundColor: colors.surface },
  gridCard: {
    flex: 1,
    aspectRatio: 0.9,
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: colors.surfaceSecondary,
  },
  gridImage: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0 },
  gridScrim: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0 },
  gridContent: {
    flex: 1,
    justifyContent: "space-between",
    padding: spacing.lg,
  },
  gridIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  gridLabel: {
    color: "#FFFFFF",
    fontFamily: fonts.display,
    fontSize: 22,
    letterSpacing: -0.5,
  },
  gridSelected: {
    borderWidth: 2,
    borderColor: colors.brandPrimary,
  },
  // Active session
  activeRoot: { flex: 1, backgroundColor: colors.surface },
  activeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
  },
  eyebrow: {
    color: colors.brandPrimary,
    fontFamily: fonts.textMedium,
    fontSize: fontSize.xs,
    letterSpacing: 2.2,
    textTransform: "uppercase",
  },
  activeType: {
    color: colors.onSurface,
    fontFamily: fonts.display,
    fontSize: fontSize.xxl,
    letterSpacing: -0.5,
    marginTop: 4,
  },
  bigMetric: {
    color: colors.onSurface,
    fontFamily: fonts.metric,
    fontSize: 96,
    letterSpacing: -3,
    lineHeight: 100,
    textAlign: "center",
  },
  bigLabel: {
    color: colors.muted,
    fontFamily: fonts.text,
    fontSize: fontSize.sm,
    textAlign: "center",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginTop: spacing.sm,
  },
  gpsBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceSecondary,
    gap: spacing.sm,
  },
  gpsDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.warning,
  },
  gpsText: {
    color: colors.muted,
    fontFamily: fonts.text,
    fontSize: fontSize.xs,
    letterSpacing: 0.6,
  },
}));

export default function MoveScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const tabBarHeight = 68 + insets.bottom;
  const router = useRouter();
  const { addSession, contributeKm, recoveryScore } = useAppState();

  const [phase, setPhase] = useState<Phase>("select");
  const [selected, setSelected] = useState<ActivityType>("run");
  const [elapsed, setElapsed] = useState(0);
  const [distance, setDistance] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (phase === "active") {
      timerRef.current = setInterval(() => {
        setElapsed((e) => e + 1);
        // Mock distance progression (demo-only; not real GPS)
        setDistance((d) => d + (selected === "cycle" ? 0.006 : 0.003));
      }, 1000) as unknown as number;
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, selected]);

  const reset = () => {
    setElapsed(0);
    setDistance(0);
  };

  const handleStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    reset();
    setPhase("active");
  };

  const handlePause = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    setPhase("paused");
  };

  const handleResume = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setPhase("active");
  };

  const handleFinish = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    // Commit session to app state so Explore territory + missions update.
    addSession({
      activity: selected,
      distanceKm: parseFloat(distance.toFixed(2)),
      durationSec: elapsed,
    });
    contributeKm(SQUADS[0].id, parseFloat(distance.toFixed(2)));
    setPhase("summary");
  };

  const handleDiscard = () => {
    reset();
    setPhase("select");
  };

  // ---------------- Selector view ----------------
  if (phase === "select" || phase === "ready") {
    const meta = ACTIVITY_META[selected];
    return (
      <View style={styles.root}>
        <ScrollView
          contentContainerStyle={{
            paddingTop: insets.top + spacing.md,
            paddingBottom: tabBarHeight + 120,
          }}
          showsVerticalScrollIndicator={false}
          testID="move-scroll"
        >
          <ScreenHeading eyebrow="Move" title="Choose activity" subtitle="Pick how you'll go outside today." />

          {/* Recovery bar — subtle. Never hides Start. */}
          <View
            style={{
              marginHorizontal: spacing.lg,
              marginTop: spacing.lg,
              padding: spacing.lg,
              borderRadius: radius.md,
              backgroundColor: colors.surfaceSecondary,
            }}
            testID="move-recovery-bar"
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: spacing.sm,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
                <FeatherIcon name="battery-charging" size={16} color={colors.brandPrimary} />
                <Text
                  style={{
                    color: colors.muted,
                    fontFamily: fonts.textMedium,
                    fontSize: fontSize.xs,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                  }}
                >
                  Recovery
                </Text>
              </View>
              <Text
                style={{
                  color: recoveryScore >= 60 ? colors.brandPrimary : colors.warning,
                  fontFamily: fonts.metric,
                  fontSize: fontSize.lg,
                  letterSpacing: -0.3,
                }}
              >
                {recoveryScore}%
              </Text>
            </View>
            <View
              style={{
                height: 6,
                borderRadius: 999,
                backgroundColor: colors.surfaceTertiary,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  width: `${recoveryScore}%`,
                  height: "100%",
                  backgroundColor:
                    recoveryScore >= 60 ? colors.brandPrimary : colors.warning,
                  borderRadius: 999,
                }}
              />
            </View>
            <Text
              style={{
                color: colors.muted,
                fontFamily: fonts.text,
                fontSize: fontSize.sm,
                marginTop: spacing.sm,
                lineHeight: 18,
              }}
            >
              {recoveryScore >= 75
                ? "Fully rested — a long session is on the table."
                : recoveryScore >= 45
                  ? "Solid. A steady effort is a good call today."
                  : "Body's asking for lighter work. Rest is a valid choice."}
            </Text>
          </View>

          <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.xl }}>
            <View style={{ flexDirection: "row", gap: spacing.md, marginBottom: spacing.md }}>
              {ACTIVITY_KEYS.slice(0, 2).map((k) => (
                <ActivityGridCard
                  key={k}
                  type={k}
                  selected={selected === k}
                  onPress={() => {
                    Haptics.selectionAsync().catch(() => {});
                    setSelected(k);
                  }}
                />
              ))}
            </View>
            <View style={{ flexDirection: "row", gap: spacing.md }}>
              {ACTIVITY_KEYS.slice(2, 4).map((k) => (
                <ActivityGridCard
                  key={k}
                  type={k}
                  selected={selected === k}
                  onPress={() => {
                    Haptics.selectionAsync().catch(() => {});
                    setSelected(k);
                  }}
                />
              ))}
            </View>
          </View>

          {/* Info row */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: colors.surfaceSecondary,
              marginHorizontal: spacing.lg,
              marginTop: spacing.xl,
              borderRadius: radius.md,
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.md,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
              <FeatherIcon name="info" size={16} color={colors.muted} />
              <Text style={{ color: colors.muted, fontFamily: fonts.text, fontSize: fontSize.sm }}>
                Demo mode · metrics simulated
              </Text>
            </View>
            <Text style={{ color: colors.brandPrimary, fontFamily: fonts.textMedium, fontSize: fontSize.xs, letterSpacing: 1.5 }}>
              NO GPS
            </Text>
          </View>
        </ScrollView>

        {/* Floating start */}
        <View
          style={{
            position: "absolute",
            left: spacing.lg,
            right: spacing.lg,
            bottom: tabBarHeight + spacing.md,
          }}
        >
          <PrimaryButton
            label={`Start ${meta.label}`}
            icon="play"
            fullWidth
            onPress={handleStart}
            testID="move-start-button"
          />
        </View>
      </View>
    );
  }

  // ---------------- Summary ----------------
  if (phase === "summary") {
    const meta = ACTIVITY_META[selected];
    return (
      <View style={styles.root}>
        <ScrollView
          contentContainerStyle={{
            paddingTop: insets.top + spacing.md,
            paddingBottom: tabBarHeight + spacing.xl,
          }}
          testID="move-summary-scroll"
        >
          <View style={{ paddingHorizontal: spacing.lg }}>
            <Text style={styles.eyebrow}>Session complete</Text>
            <Text
              style={{
                color: colors.onSurface,
                fontFamily: fonts.display,
                fontSize: 40,
                letterSpacing: -1,
                marginTop: spacing.xs,
              }}
            >
              Nice work.
            </Text>
            <Text
              style={{
                color: colors.muted,
                fontFamily: fonts.text,
                fontSize: fontSize.base,
                marginTop: spacing.xs,
              }}
            >
              {meta.label} · {new Date().toLocaleDateString()}
            </Text>
          </View>

          {/* Big metric */}
          <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.xxl }}>
            <Text style={styles.bigMetric}>{distance.toFixed(2)}</Text>
            <Text style={styles.bigLabel}>Distance · km</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              gap: spacing.md,
              paddingHorizontal: spacing.lg,
              marginTop: spacing.xl,
            }}
          >
            <MetricCard value={formatDuration(elapsed)} label="Duration" compact />
            <MetricCard value={MOCK_PACE[selected]} label={`Pace ${MOCK_UNIT_PACE[selected]}`} compact />
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: spacing.md,
              paddingHorizontal: spacing.lg,
              marginTop: spacing.md,
            }}
          >
            <MetricCard value={`${MOCK_HR[selected]}`} label="Avg BPM (demo)" compact />
            <MetricCard value="+124m" label="Elev (demo)" compact />
          </View>

          <View style={{ padding: spacing.lg, marginTop: spacing.xl, gap: spacing.md }}>
            <PrimaryButton
              label="Save as story"
              icon="book-open"
              fullWidth
              onPress={() => {
                router.push({
                  pathname: "/story-compose",
                  params: {
                    activity: selected,
                    distance: distance.toFixed(2),
                    duration: String(elapsed),
                  },
                });
                // Reset so returning shows the selector
                setTimeout(() => handleDiscard(), 300);
              }}
              testID="move-save-story"
            />
            <SecondaryButton
              label="Done"
              fullWidth
              onPress={handleDiscard}
              testID="move-done-button"
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  // ---------------- Active / Paused ----------------
  const meta = ACTIVITY_META[selected];
  const isPaused = phase === "paused";
  return (
    <View style={styles.activeRoot}>
      <View style={{ paddingTop: insets.top + spacing.md }}>
        <View style={styles.activeHeader}>
          <View>
            <Text style={styles.eyebrow}>{isPaused ? "Paused" : "Active"}</Text>
            <Text style={styles.activeType}>{meta.label}</Text>
          </View>
          <IconButton
            name="user"
            onPress={() => router.push("/safety-contact")}
            testID="move-safety-contact-button"
          />
        </View>
      </View>

      <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: spacing.lg }}>
        <View style={styles.gpsBadge}>
          <View style={[styles.gpsDot, { backgroundColor: colors.warning }]} />
          <Text style={styles.gpsText}>DEMO MODE · SIMULATED METRICS</Text>
        </View>

        <View style={{ marginTop: spacing.xl }}>
          <Text style={styles.bigMetric}>{formatDuration(elapsed)}</Text>
          <Text style={styles.bigLabel}>Duration</Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: spacing.md,
            marginTop: spacing.xl,
          }}
        >
          <MetricCard
            value={distance.toFixed(2)}
            label="km"
            compact
            accent
            testID="move-metric-distance"
          />
          <MetricCard
            value={MOCK_PACE[selected]}
            label={`Pace ${MOCK_UNIT_PACE[selected]}`}
            compact
          />
          <MetricCard value={`${MOCK_HR[selected]}`} label="BPM" compact />
        </View>

        <View style={{ marginTop: spacing.xl, alignItems: "center" }}>
          <SafetyHalo activityLabel={meta.label} />
        </View>
      </View>

      {/* Bottom controls */}
      <View
        style={{
          paddingHorizontal: spacing.lg,
          paddingBottom: tabBarHeight + spacing.md,
          gap: spacing.md,
        }}
      >
        {isPaused ? (
          <>
            <PrimaryButton
              label="Resume"
              icon="play"
              fullWidth
              onPress={handleResume}
              testID="move-resume-button"
            />
            <DangerButton
              label="Finish"
              icon="flag"
              fullWidth
              onPress={handleFinish}
              testID="move-finish-button"
            />
          </>
        ) : (
          <PrimaryButton
            label="Pause"
            icon="pause"
            fullWidth
            onPress={handlePause}
            testID="move-pause-button"
          />
        )}
      </View>
    </View>
  );
}

function ActivityGridCard({
  type,
  selected,
  onPress,
}: {
  type: ActivityType;
  selected: boolean;
  onPress: () => void;
}) {
  const styles = useStyles();
  const { colors } = useTheme();
  const meta = ACTIVITY_META[type];
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.gridCard,
        selected && styles.gridSelected,
        pressed && { opacity: 0.85 },
      ]}
      testID={`activity-card-${type}`}
    >
      <Image source={{ uri: meta.image }} style={styles.gridImage} contentFit="cover" />
      <LinearGradient
        colors={[
          selected ? "rgba(198,255,61,0.15)" : "rgba(10,10,10,0.15)",
          "rgba(10,10,10,0.65)",
          "rgba(10,10,10,0.95)",
        ]}
        locations={[0, 0.55, 1]}
        style={styles.gridScrim}
      />
      <View style={styles.gridContent}>
        <View style={styles.gridIconWrap}>
          <FeatherIcon
            name={meta.icon as any}
            size={20}
            color={selected ? colors.brandPrimary : "#FFFFFF"}
          />
        </View>
        <Text style={styles.gridLabel}>{meta.label}</Text>
      </View>
    </Pressable>
  );
}
