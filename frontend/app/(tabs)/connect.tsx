import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import FeatherIcon from "@react-native-vector-icons/feather";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { fonts, fontSize, makeStyles, radius, spacing, useTheme } from "@/src/theme";
import { CHALLENGES, SQUADS } from "@/src/data/mock";
import { Avatar, Badge, ProgressBar } from "@/src/components/ui";
import { useAppState } from "@/src/state/store";

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
  const router = useRouter();
  const { missions } = useAppState();

  const myMission = missions[0];
  const mySquad = SQUADS.find((s) => s.id === myMission.squadId) ?? SQUADS[0];
  const myTotalKm = myMission.members.reduce((acc, m) => acc + m.km, 0);
  const missionProgress = Math.min(1, myTotalKm / myMission.targetKm);

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

        {/* Weekly Mission — hero card for the user's primary squad */}
        <Pressable
          onPress={() => router.push({ pathname: "/mission/[id]", params: { id: myMission.id } })}
          testID={`mission-card-${myMission.id}`}
          style={{
            marginHorizontal: spacing.lg,
            marginTop: spacing.xl,
            borderRadius: radius.lg,
            overflow: "hidden",
            height: 220,
            backgroundColor: colors.surfaceSecondary,
          }}
        >
          <Image
            source={{
              uri: "https://images.pexels.com/photos/18804214/pexels-photo-18804214.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
            }}
            style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
            contentFit="cover"
          />
          <LinearGradient
            colors={["rgba(10,10,10,0.35)", "rgba(10,10,10,0.9)"]}
            locations={[0, 1]}
            style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
          />
          <View style={{ flex: 1, padding: spacing.lg, justifyContent: "flex-end" }}>
            <Text
              style={{
                color: colors.brandPrimary,
                fontFamily: fonts.textMedium,
                fontSize: fontSize.xs,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: spacing.xs,
              }}
            >
              This week · {mySquad.name}
            </Text>
            <Text
              style={{
                color: "#FFFFFF",
                fontFamily: fonts.display,
                fontSize: fontSize.xxl,
                letterSpacing: -0.5,
              }}
            >
              {myMission.title}
            </Text>
            <View style={{ marginTop: spacing.md }}>
              <ProgressBar value={missionProgress} height={6} />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: spacing.sm,
              }}
            >
              <Text
                style={{
                  color: colors.onSurfaceSecondary,
                  fontFamily: fonts.text,
                  fontSize: fontSize.sm,
                }}
              >
                {myTotalKm.toFixed(1)} / {myMission.targetKm} km
              </Text>
              <Text
                style={{
                  color: colors.brandPrimary,
                  fontFamily: fonts.textMedium,
                  fontSize: fontSize.sm,
                }}
              >
                Ends in {myMission.endsIn} ›
              </Text>
            </View>
          </View>
        </Pressable>

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
