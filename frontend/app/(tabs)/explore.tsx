import React, { useState } from "react";
import { Pressable, ScrollView, Text, View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import FeatherIcon from "@react-native-vector-icons/feather";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { fonts, fontSize, makeStyles, radius, spacing, useTheme } from "@/src/theme";
import { EXPLORE_ROUTES } from "@/src/data/mock";
import { Chip, IconButton } from "@/src/components/ui";

const CATEGORIES = ["Near you", "Trails", "Peaks", "Loops", "Sunset", "Long routes"];

const useStyles = makeStyles((colors) => ({
  root: { flex: 1, backgroundColor: colors.surface },
  mapWrap: {
    height: 280,
    marginHorizontal: spacing.lg,
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.surfaceSecondary,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
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
  floatingControls: {
    position: "absolute",
    right: spacing.md,
    top: spacing.md,
    gap: spacing.sm,
  },
  demoBadge: {
    position: "absolute",
    left: spacing.md,
    top: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: "rgba(10,10,10,0.7)",
    gap: spacing.sm,
  },
  demoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.warning,
  },
  demoText: {
    color: "rgba(255,255,255,0.85)",
    fontFamily: fonts.text,
    fontSize: fontSize.xs,
    letterSpacing: 1,
  },
  routeCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: colors.surfaceSecondary,
    height: 200,
  },
  routeImage: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0 },
  routeContent: {
    flex: 1,
    justifyContent: "flex-end",
    padding: spacing.lg,
  },
  routeMeta: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  routeMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  routeMetaText: {
    color: "rgba(255,255,255,0.85)",
    fontFamily: fonts.text,
    fontSize: fontSize.sm,
  },
  routeName: {
    color: "#FFFFFF",
    fontFamily: fonts.display,
    fontSize: fontSize.xl,
    letterSpacing: -0.3,
    marginTop: spacing.xs,
  },
  routeRegion: {
    color: "rgba(255,255,255,0.7)",
    fontFamily: fonts.text,
    fontSize: fontSize.sm,
  },
  chipRow: {
    height: 56,
    marginBottom: spacing.sm,
  },
}));

export default function ExploreScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const tabBarHeight = 68 + insets.bottom;
  const [category, setCategory] = useState(CATEGORIES[0]);

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + spacing.md,
          paddingBottom: tabBarHeight + spacing.xl,
        }}
        stickyHeaderIndices={[2]}
        showsVerticalScrollIndicator={false}
        testID="explore-scroll"
      >
        {/* Heading */}
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Explore</Text>
            <Text style={styles.title}>Where to next</Text>
          </View>
          <IconButton name="search" testID="explore-search-button" />
        </View>

        {/* Map placeholder */}
        <View style={styles.mapWrap}>
          <Image
            source={{
              uri: "https://images.pexels.com/photos/26628623/pexels-photo-26628623.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
            }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
          />
          <LinearGradient
            colors={["rgba(10,10,10,0.3)", "rgba(10,10,10,0.85)"]}
            locations={[0, 1]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.demoBadge}>
            <View style={styles.demoDot} />
            <Text style={styles.demoText}>MAP · DEMO PREVIEW</Text>
          </View>
          <View style={styles.floatingControls}>
            <IconButton name="layers" testID="explore-layers-button" />
            <IconButton name="navigation" testID="explore-navigation-button" />
          </View>
          <View
            style={{
              position: "absolute",
              left: spacing.lg,
              right: spacing.lg,
              bottom: spacing.lg,
            }}
          >
            <Text
              style={{
                color: "rgba(255,255,255,0.85)",
                fontFamily: fonts.text,
                fontSize: fontSize.sm,
                letterSpacing: 0.4,
              }}
            >
              Northern Cascades · 4 routes near you
            </Text>
            <Text
              style={{
                color: "#FFFFFF",
                fontFamily: fonts.display,
                fontSize: fontSize.xl,
                letterSpacing: -0.3,
                marginTop: 2,
              }}
            >
              Terrain preview
            </Text>
          </View>
        </View>

        {/* Sticky category chip row */}
        <View
          style={{
            backgroundColor: colors.surface,
            paddingTop: spacing.lg,
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipRow}
            contentContainerStyle={{
              paddingHorizontal: spacing.lg,
              gap: spacing.sm,
              alignItems: "center",
            }}
            testID="explore-chip-row"
          >
            {CATEGORIES.map((c) => (
              <Chip
                key={c}
                label={c}
                active={category === c}
                onPress={() => setCategory(c)}
                testID={`explore-chip-${c}`}
              />
            ))}
          </ScrollView>
        </View>

        {/* Route list */}
        <View
          style={{
            paddingHorizontal: 0,
            paddingTop: spacing.md,
          }}
        >
          <Text
            style={{
              color: colors.onSurface,
              fontFamily: fonts.display,
              fontSize: fontSize.xl,
              paddingHorizontal: spacing.lg,
              marginBottom: spacing.md,
              letterSpacing: -0.3,
            }}
          >
            Curated routes
          </Text>
          {EXPLORE_ROUTES.map((r) => (
            <Pressable key={r.id} style={styles.routeCard} testID={`route-${r.id}`}>
              <Image source={{ uri: r.image }} style={styles.routeImage} contentFit="cover" />
              <LinearGradient
                colors={["rgba(10,10,10,0)", "rgba(10,10,10,0.5)", "rgba(10,10,10,0.95)"]}
                locations={[0, 0.55, 1]}
                style={styles.routeImage}
              />
              <View style={styles.routeContent}>
                <View style={{ flexDirection: "row", gap: spacing.sm }}>
                  <Chip label={r.difficulty} variant="brand" />
                </View>
                <Text style={styles.routeRegion}>{r.region}</Text>
                <Text style={styles.routeName}>{r.name}</Text>
                <View style={styles.routeMeta}>
                  <View style={styles.routeMetaItem}>
                    <FeatherIcon name="map" size={13} color="rgba(255,255,255,0.85)" />
                    <Text style={styles.routeMetaText}>{r.distanceKm} km</Text>
                  </View>
                  <View style={styles.routeMetaItem}>
                    <FeatherIcon name="trending-up" size={13} color="rgba(255,255,255,0.85)" />
                    <Text style={styles.routeMetaText}>{r.elevationM} m</Text>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
