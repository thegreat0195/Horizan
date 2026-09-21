import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import FeatherIcon from "@react-native-vector-icons/feather";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { fonts, fontSize, makeStyles, radius, spacing, useTheme } from "@/src/theme";
import { CHALLENGES, SQUADS } from "@/src/data/mock";
import { Avatar, Badge, ProgressBar } from "@/src/components/ui";

type Segment = "squads" | "challenges";

const useStyles = makeStyles((colors) => ({
  root: { flex: 1, backgroundColor: colors.surface },
  eyebrow: {
    color: colors.brandPrimary,
    fontFamily: fonts.textMedium,
    fontSize: fontSize.xs,
    letterSpacing: 2.2,
    textTransform: "uppercase",
  },
  title: {
    color: colors.onSurface,
    fontFamily: fonts.display,
    fontSize: fontSize.display,
    letterSpacing: -1,
    marginTop: 4,
  },
  segment: {
    flexDirection: "row",
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.pill,
    padding: 4,
  },
  segItem: {
    flex: 1,
    height: 40,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  segItemActive: { backgroundColor: colors.brandPrimary },
  segLabel: {
    fontFamily: fonts.textMedium,
    fontSize: fontSize.base,
  },
  squadRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.md,
    borderBottomWidth: StyleSheet_hairline(),
    borderBottomColor: colors.divider,
  },
  rank: {
    color: colors.brandPrimary,
    fontFamily: fonts.metric,
    fontSize: fontSize.xxl,
    letterSpacing: -0.8,
    width: 36,
  },
  squadName: {
    color: colors.onSurface,
    fontFamily: fonts.textMedium,
    fontSize: fontSize.lg,
  },
  squadMeta: {
    color: colors.muted,
    fontFamily: fonts.text,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  challengeCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  chalTitle: {
    color: colors.onSurface,
    fontFamily: fonts.display,
    fontSize: fontSize.xl,
    letterSpacing: -0.3,
  },
  chalDetail: {
    color: colors.muted,
    fontFamily: fonts.text,
    fontSize: fontSize.sm,
    marginTop: 4,
  },
  chalEnds: {
    color: colors.muted,
    fontFamily: fonts.text,
    fontSize: fontSize.xs,
    textTransform: "uppercase",
    letterSpacing: 1.4,
  },
}));

function StyleSheet_hairline() {
  return 0.5;
}

export default function ConnectScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const tabBarHeight = 68 + insets.bottom;
  const [seg, setSeg] = useState<Segment>("squads");

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + spacing.md,
          paddingBottom: tabBarHeight + spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
        testID="connect-scroll"
      >
        <View style={{ paddingHorizontal: spacing.lg }}>
          <Text style={styles.eyebrow}>Connect</Text>
          <Text style={styles.title}>Your community</Text>
        </View>

        {/* Segmented control */}
        <View style={styles.segment}>
          {(["squads", "challenges"] as Segment[]).map((s) => {
            const active = seg === s;
            return (
              <Pressable
                key={s}
                onPress={() => setSeg(s)}
                style={[styles.segItem, active && styles.segItemActive]}
                testID={`connect-segment-${s}`}
              >
                <Text
                  style={[
                    styles.segLabel,
                    { color: active ? colors.onBrandPrimary : colors.muted },
                  ]}
                >
                  {s === "squads" ? "Squads" : "Challenges"}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {seg === "squads" ? (
          <View style={{ marginTop: spacing.xl }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: spacing.lg,
                marginBottom: spacing.sm,
              }}
            >
              <Text
                style={{
                  color: colors.muted,
                  fontFamily: fonts.textMedium,
                  fontSize: fontSize.xs,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                }}
              >
                Weekly leaderboard
              </Text>
              <Badge label="Week 21" tone="muted" />
            </View>
            {SQUADS.map((sq) => (
              <View key={sq.id} style={styles.squadRow} testID={`squad-${sq.id}`}>
                <Text style={styles.rank}>{sq.rank}</Text>
                <Avatar uri={sq.avatars[0]} size={44} ring={sq.rank === 1} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.squadName}>{sq.name}</Text>
                  <Text style={styles.squadMeta}>
                    {sq.members} members · {sq.weekKm} km
                  </Text>
                </View>
                <FeatherIcon name="chevron-right" size={20} color={colors.muted} />
              </View>
            ))}
          </View>
        ) : (
          <View style={{ marginTop: spacing.md }}>
            {CHALLENGES.map((c) => (
              <View key={c.id} style={styles.challengeCard} testID={`challenge-${c.id}`}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: spacing.md,
                  }}
                >
                  <Text style={styles.chalTitle}>{c.title}</Text>
                  {c.progress >= 1 ? (
                    <Badge label="Complete" tone="brand" />
                  ) : (
                    <Text style={styles.chalEnds}>{c.endsIn} left</Text>
                  )}
                </View>
                <ProgressBar value={c.progress} height={8} />
                <Text style={styles.chalDetail}>{c.detail}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
