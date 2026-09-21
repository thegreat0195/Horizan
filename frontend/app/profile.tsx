import React from "react";
import { Pressable, ScrollView, Text, View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import FeatherIcon from "@react-native-vector-icons/feather";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { fonts, fontSize, makeStyles, radius, spacing, useTheme } from "@/src/theme";
import { ACHIEVEMENTS, PROFILE, RECENT_ACTIVITIES, ACTIVITY_META } from "@/src/data/mock";
import { Avatar, IconButton, MetricCard } from "@/src/components/ui";

const useStyles = makeStyles((colors) => ({
  root: { flex: 1, backgroundColor: colors.surface },
  cover: {
    height: 240,
    backgroundColor: colors.surfaceSecondary,
  },
  headerActions: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  avatarWrap: {
    marginTop: -48,
    paddingHorizontal: spacing.lg,
  },
  name: {
    color: colors.onSurface,
    fontFamily: fonts.display,
    fontSize: fontSize.display,
    letterSpacing: -1,
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  handle: {
    color: colors.muted,
    fontFamily: fonts.text,
    fontSize: fontSize.base,
    paddingHorizontal: spacing.lg,
    marginTop: 2,
  },
  bio: {
    color: colors.onSurfaceSecondary,
    fontFamily: fonts.text,
    fontSize: fontSize.base,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    lineHeight: 22,
  },
  hero: {
    marginTop: spacing.xl,
    marginHorizontal: spacing.lg,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    padding: spacing.xl,
  },
  heroLabel: {
    color: colors.muted,
    fontFamily: fonts.text,
    fontSize: fontSize.sm,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  heroValue: {
    color: colors.brandPrimary,
    fontFamily: fonts.metric,
    fontSize: 64,
    letterSpacing: -2,
    marginTop: spacing.xs,
  },
  heroUnit: {
    color: colors.muted,
    fontFamily: fonts.text,
    fontSize: fontSize.base,
    marginTop: 2,
  },
  sectionTitle: {
    color: colors.onSurface,
    fontFamily: fonts.display,
    fontSize: fontSize.xl,
    letterSpacing: -0.3,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
  badgeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  badgeItem: {
    width: "31%",
    aspectRatio: 1,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.md,
  },
  badgeCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.brandTertiary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  badgeLabel: {
    color: colors.onSurface,
    fontFamily: fonts.textMedium,
    fontSize: fontSize.xs,
    textAlign: "center",
  },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  actIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  actName: {
    color: colors.onSurface,
    fontFamily: fonts.textMedium,
    fontSize: fontSize.base,
  },
  actMeta: {
    color: colors.muted,
    fontFamily: fonts.text,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
}));

export default function ProfileScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxxl }}
        showsVerticalScrollIndicator={false}
        testID="profile-scroll"
      >
        {/* Cover */}
        <View style={styles.cover}>
          <Image source={{ uri: PROFILE.cover }} style={StyleSheet.absoluteFill} contentFit="cover" />
          <LinearGradient
            colors={["rgba(10,10,10,0.3)", "rgba(10,10,10,0.95)"]}
            locations={[0, 1]}
            style={StyleSheet.absoluteFill}
          />
          <View style={[styles.headerActions, { top: insets.top + spacing.md }]}>
            <IconButton name="arrow-left" onPress={() => router.back()} testID="profile-back-button" />
            <IconButton name="settings" testID="profile-settings-button" />
          </View>
        </View>

        {/* Avatar overlap */}
        <View style={styles.avatarWrap}>
          <View style={{ borderWidth: 4, borderColor: colors.surface, borderRadius: 999, alignSelf: "flex-start" }}>
            <Avatar uri={PROFILE.avatar} size={96} />
          </View>
        </View>

        <Text style={styles.name}>{PROFILE.name}</Text>
        <Text style={styles.handle}>{PROFILE.handle}</Text>
        <Text style={styles.bio}>{PROFILE.bio}</Text>

        {/* Lifetime hero metric */}
        <View style={styles.hero}>
          <Text style={styles.heroLabel}>Lifetime distance</Text>
          <Text style={styles.heroValue}>{PROFILE.lifetimeKm.toFixed(1)}</Text>
          <Text style={styles.heroUnit}>km moved · outdoors</Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: spacing.md,
            paddingHorizontal: spacing.lg,
            marginTop: spacing.md,
          }}
        >
          <MetricCard value={`${PROFILE.activitiesCount}`} label="Sessions" compact />
          <MetricCard value={`${PROFILE.peaksCount}`} label="Peaks" compact accent />
        </View>

        {/* Achievements */}
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.badgeGrid}>
          {ACHIEVEMENTS.map((b) => (
            <View
              key={b.id}
              style={[styles.badgeItem, !b.unlocked && { opacity: 0.4 }]}
              testID={`achievement-${b.id}`}
            >
              <View
                style={[
                  styles.badgeCircle,
                  !b.unlocked && { backgroundColor: colors.surfaceTertiary },
                ]}
              >
                <FeatherIcon
                  name={b.icon as any}
                  size={20}
                  color={b.unlocked ? colors.brandPrimary : colors.muted}
                />
              </View>
              <Text style={styles.badgeLabel}>{b.label}</Text>
            </View>
          ))}
        </View>

        {/* Recent history */}
        <Text style={styles.sectionTitle}>History</Text>
        {RECENT_ACTIVITIES.map((a) => {
          const meta = ACTIVITY_META[a.type];
          return (
            <Pressable key={a.id} style={styles.activityRow} testID={`history-${a.id}`}>
              <View style={styles.actIcon}>
                <FeatherIcon name={meta.icon as any} size={18} color={colors.brandPrimary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.actName}>{a.title}</Text>
                <Text style={styles.actMeta}>
                  {meta.label} · {a.distanceKm.toFixed(1)} km · {a.date}
                </Text>
              </View>
              <FeatherIcon name="chevron-right" size={18} color={colors.muted} />
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
