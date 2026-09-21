import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import FeatherIcon from "@react-native-vector-icons/feather";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { fonts, fontSize, makeStyles, radius, spacing, useTheme } from "@/src/theme";
import {
  ACTIVITY_META,
  HOME_HERO,
  RECENT_ACTIVITIES,
  STORIES,
  SQUADS,
  TOMORROW_WEATHER,
} from "@/src/data/mock";
import {
  Avatar,
  Badge,
  Chip,
  IconButton,
  MetricCard,
  SectionHeader,
} from "@/src/components/ui";
import { useAppState } from "@/src/state/store";

const useStyles = makeStyles((colors) => ({
  root: { flex: 1, backgroundColor: colors.surface },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  greeting: {
    color: colors.muted,
    fontFamily: fonts.text,
    fontSize: fontSize.sm,
    letterSpacing: 0.4,
  },
  name: {
    color: colors.onSurface,
    fontFamily: fonts.display,
    fontSize: fontSize.xxl,
    letterSpacing: -0.5,
    marginTop: 2,
  },
  heroCard: {
    height: 380,
    marginHorizontal: spacing.lg,
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.surfaceSecondary,
  },
  heroImage: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0 },
  heroContent: {
    flex: 1,
    justifyContent: "flex-end",
    padding: spacing.xl,
  },
  heroEyebrow: {
    color: colors.brandPrimary,
    fontFamily: fonts.textMedium,
    fontSize: fontSize.xs,
    letterSpacing: 2.2,
    textTransform: "uppercase",
    marginBottom: spacing.sm,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontFamily: fonts.display,
    fontSize: 34,
    letterSpacing: -0.8,
    lineHeight: 38,
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.75)",
    fontFamily: fonts.text,
    fontSize: fontSize.base,
    marginTop: spacing.xs,
  },
  heroCTA: {
    marginTop: spacing.lg,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.brandPrimary,
    paddingHorizontal: spacing.xl,
    height: 48,
    borderRadius: radius.pill,
  },
  heroCTALabel: {
    color: colors.onBrandPrimary,
    fontFamily: fonts.textMedium,
    fontSize: fontSize.base,
    letterSpacing: 0.3,
  },
  activityCard: {
    width: 220,
    marginRight: spacing.md,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  actTitle: {
    color: colors.onSurface,
    fontFamily: fonts.textMedium,
    fontSize: fontSize.base,
    marginTop: spacing.sm,
  },
  actMetrics: {
    color: colors.onSurface,
    fontFamily: fonts.metric,
    fontSize: fontSize.xxl,
    letterSpacing: -0.8,
    marginTop: spacing.sm,
  },
  actUnit: {
    color: colors.muted,
    fontFamily: fonts.text,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  storyTeaser: {
    height: 220,
    marginHorizontal: spacing.lg,
    borderRadius: radius.md,
    overflow: "hidden",
  },
  storyImage: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0 },
  storyContent: { flex: 1, justifyContent: "flex-end", padding: spacing.lg },
  storyTitle: {
    color: "#FFFFFF",
    fontFamily: fonts.display,
    fontSize: fontSize.xl,
    letterSpacing: -0.3,
    marginTop: spacing.xs,
  },
  squadRow: {
    marginHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.md,
  },
  squadName: {
    color: colors.onSurface,
    fontFamily: fonts.textMedium,
    fontSize: fontSize.base,
  },
  squadMeta: {
    color: colors.muted,
    fontFamily: fonts.text,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
}));

export default function HomeScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const tabBarHeight = 68 + insets.bottom;
  const router = useRouter();
  const { weeklyMoveDays, streakDays } = useAppState();
  const activeDaySet = new Set(weeklyMoveDays);
  const todayIdx = (new Date().getDay() + 6) % 7;
  const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + spacing.md,
          paddingBottom: tabBarHeight + spacing.xl,
        }}
        testID="home-scroll"
      >
        {/* Header row */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Good morning</Text>
            <Text style={styles.name}>Alex</Text>
          </View>
          <View style={{ flexDirection: "row", gap: spacing.sm }}>
            <IconButton name="shield" testID="home-safety-button" />
            <Pressable onPress={() => router.push("/profile")} testID="home-profile-button">
              <Avatar
                uri="https://images.unsplash.com/photo-1600505570235-b30d6fe213f9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDV8MHwxfHNlYXJjaHw0fHxkYXJrJTIwbW9vZHklMjBvdXRkb29yJTIwcG9ydHJhaXR8ZW58MHx8fHwxNzg5ODg1ODk5fDA&ixlib=rb-4.1.0&q=85"
                size={44}
              />
            </Pressable>
          </View>
        </View>

        {/* Hero Recommendation */}
        <Pressable
          style={styles.heroCard}
          onPress={() => router.push("/move")}
          testID="home-hero-card"
        >
          <Image source={{ uri: HOME_HERO.image }} style={styles.heroImage} contentFit="cover" />
          <LinearGradient
            colors={["rgba(10,10,10,0)", "rgba(10,10,10,0.4)", "rgba(10,10,10,0.95)"]}
            locations={[0, 0.55, 1]}
            style={styles.heroImage}
          />
          <View style={styles.heroContent}>
            <Text style={styles.heroEyebrow}>Today · recommended</Text>
            <Text style={styles.heroTitle}>{HOME_HERO.title}</Text>
            <Text style={styles.heroSubtitle}>{HOME_HERO.subtitle}</Text>
            <View style={styles.heroCTA}>
              <FeatherIcon
                name="play"
                size={16}
                color={colors.onBrandPrimary}
                style={{ marginRight: spacing.sm }}
              />
              <Text style={styles.heroCTALabel}>Start session</Text>
            </View>
          </View>
        </Pressable>

        {/* Streak card */}
        <View
          style={{
            marginHorizontal: spacing.lg,
            marginTop: spacing.lg,
            padding: spacing.lg,
            backgroundColor: colors.surfaceSecondary,
            borderRadius: radius.md,
          }}
          testID="home-streak-card"
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: colors.brandTertiary,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FeatherIcon name="zap" size={20} color={colors.brandPrimary} />
              </View>
              <View>
                <Text
                  style={{
                    color: colors.onSurface,
                    fontFamily: fonts.display,
                    fontSize: fontSize.xxl,
                    letterSpacing: -0.5,
                  }}
                >
                  {streakDays} day{streakDays === 1 ? "" : "s"}
                </Text>
                <Text
                  style={{
                    color: colors.muted,
                    fontFamily: fonts.text,
                    fontSize: fontSize.sm,
                  }}
                >
                  {streakDays > 0 ? "current streak" : "start your streak today"}
                </Text>
              </View>
            </View>
            <Text
              style={{
                color: colors.muted,
                fontFamily: fonts.textMedium,
                fontSize: fontSize.xs,
                textTransform: "uppercase",
                letterSpacing: 1.5,
              }}
            >
              Rest days welcome
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: spacing.lg,
              gap: spacing.xs,
            }}
          >
            {dayLabels.map((d, i) => {
              const active = activeDaySet.has(i);
              const isToday = i === todayIdx;
              return (
                <View
                  key={`day-${i}`}
                  style={{ alignItems: "center", flex: 1 }}
                  testID={`streak-day-${i}`}
                >
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: active ? colors.brandPrimary : colors.surfaceTertiary,
                      borderWidth: isToday && !active ? 1.5 : 0,
                      borderColor: colors.brandPrimary,
                    }}
                  >
                    {active ? (
                      <FeatherIcon name="zap" size={14} color={colors.onBrandPrimary} />
                    ) : null}
                  </View>
                  <Text
                    style={{
                      color: isToday ? colors.brandPrimary : colors.muted,
                      fontFamily: fonts.textMedium,
                      fontSize: fontSize.xs,
                      marginTop: 6,
                    }}
                  >
                    {d}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Tomorrow weather chips */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: spacing.lg,
            marginTop: spacing.lg,
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
            Tomorrow · plan ahead
          </Text>
          <Text style={{ color: colors.brandPrimary, fontFamily: fonts.textMedium, fontSize: fontSize.sm }}>
            {TOMORROW_WEATHER.condition}
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            gap: spacing.sm,
            paddingTop: spacing.sm,
          }}
          testID="home-weather-strip"
        >
          <WeatherChip icon="sunrise" label={TOMORROW_WEATHER.sunrise} sub="Sunrise" />
          <WeatherChip icon="sunset" label={TOMORROW_WEATHER.sunset} sub="Sunset" />
          <WeatherChip
            icon="thermometer"
            label={`${TOMORROW_WEATHER.tempHigh}° / ${TOMORROW_WEATHER.tempLow}°`}
            sub="High / Low"
          />
          <WeatherChip icon="wind" label={TOMORROW_WEATHER.wind} sub="Wind" />
        </ScrollView>

        {/* Weekly summary metrics */}
        <View
          style={{
            flexDirection: "row",
            gap: spacing.md,
            paddingHorizontal: spacing.lg,
            marginTop: spacing.lg,
          }}
        >
          <MetricCard value="54.7" label="km this week" compact accent testID="metric-week-km" />
          <MetricCard value="4" label="sessions" compact testID="metric-week-sessions" />
          <MetricCard value="1,240m" label="elevation" compact testID="metric-week-elev" />
        </View>

        {/* Recent activity horizontal scroll */}
        <SectionHeader title="Recent" action="See all" onActionPress={() => {}} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.md }}
          testID="home-recent-scroll"
        >
          {RECENT_ACTIVITIES.map((a) => {
            const meta = ACTIVITY_META[a.type];
            return (
              <View key={a.id} style={styles.activityCard} testID={`recent-${a.id}`}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: colors.brandTertiary,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FeatherIcon
                      name={meta.icon as any}
                      size={16}
                      color={colors.brandPrimary}
                    />
                  </View>
                  <Text
                    style={{
                      color: colors.muted,
                      fontFamily: fonts.text,
                      fontSize: fontSize.xs,
                    }}
                  >
                    {a.date}
                  </Text>
                </View>
                <Text style={styles.actTitle}>{a.title}</Text>
                <Text style={styles.actMetrics}>{a.distanceKm.toFixed(1)}</Text>
                <Text style={styles.actUnit}>
                  km · {a.durationMin}m · {a.pace}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        {/* Explore teaser */}
        <SectionHeader title="Explore" action="Discover" onActionPress={() => router.push("/explore")} />
        <Pressable
          style={styles.storyTeaser}
          onPress={() => router.push("/explore")}
          testID="home-explore-teaser"
        >
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1753119326723-55f030d81da5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxkcmFtYXRpYyUyMG1vdW50YWluJTIwZm9yZXN0JTIwdHJhaWwlMjBhZXJpYWx8ZW58MHx8fHwxNzg5ODg1ODk5fDA&ixlib=rb-4.1.0&q=85",
            }}
            style={styles.storyImage}
            contentFit="cover"
          />
          <LinearGradient
            colors={["rgba(10,10,10,0)", "rgba(10,10,10,0.4)", "rgba(10,10,10,0.9)"]}
            locations={[0, 0.55, 1]}
            style={styles.storyImage}
          />
          <View style={styles.storyContent}>
            <Badge label="New routes near you" />
            <Text style={styles.storyTitle}>Iron Canyon Loop · 9.6 km</Text>
          </View>
        </Pressable>

        {/* Story of the week */}
        <SectionHeader title="From the trail" action="Read stories" onActionPress={() => router.push("/stories")} />
        <Pressable
          style={styles.storyTeaser}
          onPress={() => router.push("/stories")}
          testID="home-story-teaser"
        >
          <Image
            source={{ uri: STORIES[0].image }}
            style={styles.storyImage}
            contentFit="cover"
          />
          <LinearGradient
            colors={["rgba(10,10,10,0)", "rgba(10,10,10,0.4)", "rgba(10,10,10,0.9)"]}
            locations={[0, 0.55, 1]}
            style={styles.storyImage}
          />
          <View style={styles.storyContent}>
            <View style={{ flexDirection: "row", gap: spacing.sm }}>
              <Chip label={STORIES[0].activityChip} variant="brand" />
            </View>
            <Text style={styles.storyTitle}>{STORIES[0].title}</Text>
          </View>
        </Pressable>

        {/* Squad activity */}
        <SectionHeader title="Your squad" action="Open" onActionPress={() => router.push("/connect")} />
        <View style={styles.squadRow}>
          <Avatar uri={SQUADS[0].avatars[0]} size={48} ring />
          <View style={{ flex: 1 }}>
            <Text style={styles.squadName}>{SQUADS[0].name}</Text>
            <Text style={styles.squadMeta}>
              {SQUADS[0].members} members · {SQUADS[0].weekKm} km this week
            </Text>
          </View>
          <FeatherIcon name="chevron-right" size={20} color={colors.muted} />
        </View>
      </ScrollView>
    </View>
  );
}

function WeatherChip({ icon, label, sub }: { icon: string; label: string; sub: string }) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        backgroundColor: colors.surfaceSecondary,
        borderRadius: radius.md,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
      }}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: colors.brandTertiary,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FeatherIcon name={icon as any} size={14} color={colors.brandPrimary} />
      </View>
      <View>
        <Text style={{ color: colors.onSurface, fontFamily: fonts.textMedium, fontSize: fontSize.sm }}>
          {label}
        </Text>
        <Text
          style={{
            color: colors.muted,
            fontFamily: fonts.text,
            fontSize: fontSize.xs,
            letterSpacing: 0.8,
            textTransform: "uppercase",
            marginTop: 2,
          }}
        >
          {sub}
        </Text>
      </View>
    </View>
  );
}
