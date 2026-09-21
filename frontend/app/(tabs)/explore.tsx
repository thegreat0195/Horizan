import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import FeatherIcon from "@react-native-vector-icons/feather";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Location from "expo-location";
import * as Haptics from "expo-haptics";

import { fonts, fontSize, makeStyles, radius, spacing, useTheme } from "@/src/theme";
import { EXPLORE_ROUTES } from "@/src/data/mock";
import { Chip, IconButton, PrimaryButton, SecondaryButton } from "@/src/components/ui";
import { useAppState } from "@/src/state/store";

// Load react-native-maps lazily so web doesn't crash.
let MapView: any = null;
let Marker: any = null;
let PROVIDER_DEFAULT: any = undefined;
if (Platform.OS !== "web") {
  const maps = require("react-native-maps");
  MapView = maps.default;
  Marker = maps.Marker;
  PROVIDER_DEFAULT = maps.PROVIDER_DEFAULT;
}

const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#0a0a0a" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0a0a0a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#6c6c6c" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#a0a0a0" }],
  },
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#152016" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1a1a1a" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#242424" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#242424" }],
  },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0f1a24" }],
  },
];

const CATEGORIES = ["Near you", "Trails", "Peaks", "Loops", "Sunset", "Long routes"];

const useStyles = makeStyles((colors) => ({
  root: { flex: 1, backgroundColor: colors.surface },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    flexDirection: "row",
    alignItems: "flex-end",
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
  mapWrap: {
    height: 320,
    marginHorizontal: spacing.lg,
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.surfaceSecondary,
  },
  floatingControls: {
    position: "absolute",
    right: spacing.md,
    top: spacing.md,
    gap: spacing.sm,
  },
  unlockedBadge: {
    position: "absolute",
    left: spacing.md,
    top: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: "rgba(10,10,10,0.72)",
    gap: spacing.sm,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.brandPrimary,
  },
  badgeText: {
    color: colors.onSurface,
    fontFamily: fonts.textMedium,
    fontSize: fontSize.xs,
    letterSpacing: 1.2,
  },
  markerLocked: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(10,10,10,0.85)",
    borderWidth: 1.5,
    borderColor: colors.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  markerUnlocked: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.brandPrimary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.surface,
  },
  markerActive: {
    borderColor: colors.brandPrimary,
    borderWidth: 3,
  },
  chipRow: {
    height: 56,
    marginBottom: spacing.sm,
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
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10,10,10,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  lockLabel: {
    color: colors.onSurface,
    fontFamily: fonts.textMedium,
    fontSize: fontSize.sm,
    marginTop: spacing.sm,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  // Detail sheet
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingTop: spacing.md,
  },
  sheetHandle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderStrong,
    alignSelf: "center",
  },
  sheetImage: {
    height: 180,
    width: "100%",
  },
  sheetContent: { padding: spacing.lg, gap: spacing.md },
  sheetTitle: {
    color: colors.onSurface,
    fontFamily: fonts.display,
    fontSize: fontSize.display,
    letterSpacing: -0.8,
  },
  sheetRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  sheetMetric: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  sheetMetricValue: {
    color: colors.onSurface,
    fontFamily: fonts.metric,
    fontSize: fontSize.xxl,
    letterSpacing: -0.5,
  },
  sheetMetricLabel: {
    color: colors.muted,
    fontFamily: fonts.text,
    fontSize: fontSize.xs,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginTop: 2,
  },
}));

export default function ExploreScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const tabBarHeight = 68 + insets.bottom;
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [locPermStatus, setLocPermStatus] = useState<Location.PermissionStatus | null>(null);
  const [myCoord, setMyCoord] = useState<{ latitude: number; longitude: number } | null>(
    null,
  );
  const mapRef = useRef<any>(null);
  const { maxSessionDistanceKm } = useAppState();

  const unlocked = useMemo(() => {
    // Unlock every route with distanceKm <= maxSessionDistanceKm + baseline.
    // Baseline 6.0 km means Pine River Trail starts unlocked.
    const threshold = Math.max(6.0, maxSessionDistanceKm);
    return new Set(EXPLORE_ROUTES.filter((r) => r.distanceKm <= threshold).map((r) => r.id));
  }, [maxSessionDistanceKm]);

  const selected = EXPLORE_ROUTES.find((r) => r.id === selectedRouteId) || null;

  const initialRegion = {
    latitude: 47.615,
    longitude: -122.32,
    latitudeDelta: 0.18,
    longitudeDelta: 0.18,
  };

  const requestLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocPermStatus(status);
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        setMyCoord({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
        mapRef.current?.animateToRegion?.(
          {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          },
          800,
        );
      }
    } catch {
      // no-op
    }
  };

  useEffect(() => {
    // Best-effort: check current status silently on mount (do not prompt).
    Location.getForegroundPermissionsAsync().then((res) => setLocPermStatus(res.status));
  }, []);

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
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Territory</Text>
            <Text style={styles.title}>Explore</Text>
          </View>
          <IconButton name="search" testID="explore-search-button" />
        </View>

        {/* Map */}
        <View style={styles.mapWrap}>
          {Platform.OS !== "web" && MapView ? (
            <MapView
              ref={mapRef}
              style={StyleSheet.absoluteFill}
              provider={PROVIDER_DEFAULT}
              customMapStyle={DARK_MAP_STYLE}
              initialRegion={initialRegion}
              showsUserLocation={locPermStatus === "granted"}
              showsMyLocationButton={false}
              testID="explore-map"
            >
              {EXPLORE_ROUTES.map((r) => {
                const isUnlocked = unlocked.has(r.id);
                const isActive = selectedRouteId === r.id;
                return (
                  <Marker
                    key={r.id}
                    coordinate={r.coord}
                    onPress={() => {
                      Haptics.selectionAsync().catch(() => {});
                      setSelectedRouteId(r.id);
                    }}
                    tracksViewChanges={false}
                    testID={`map-marker-${r.id}`}
                  >
                    <View
                      style={
                        isUnlocked
                          ? [styles.markerUnlocked, isActive && styles.markerActive]
                          : styles.markerLocked
                      }
                    >
                      <FeatherIcon
                        name={isUnlocked ? "map-pin" : "lock"}
                        size={isUnlocked ? 16 : 12}
                        color={isUnlocked ? colors.onBrandPrimary : colors.muted}
                      />
                    </View>
                  </Marker>
                );
              })}
            </MapView>
          ) : (
            <>
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
                  }}
                >
                  Northern Cascades
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
                  Interactive map · mobile only
                </Text>
              </View>
            </>
          )}

          <View style={styles.unlockedBadge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>
              {unlocked.size} / {EXPLORE_ROUTES.length} UNLOCKED
            </Text>
          </View>
          <View style={styles.floatingControls}>
            <IconButton name="layers" testID="explore-layers-button" />
            <IconButton
              name="navigation"
              onPress={requestLocation}
              testID="explore-locate-button"
            />
          </View>
        </View>

        {/* Sticky category chip row */}
        <View style={{ backgroundColor: colors.surface, paddingTop: spacing.lg }}>
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

        {/* Routes */}
        <View style={{ paddingTop: spacing.md }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: spacing.lg,
              marginBottom: spacing.md,
            }}
          >
            <Text
              style={{
                color: colors.onSurface,
                fontFamily: fonts.display,
                fontSize: fontSize.xl,
                letterSpacing: -0.3,
              }}
            >
              Territory
            </Text>
            <Text
              style={{
                color: colors.muted,
                fontFamily: fonts.text,
                fontSize: fontSize.xs,
                letterSpacing: 1.5,
                textTransform: "uppercase",
              }}
            >
              {maxSessionDistanceKm > 0
                ? `Best session · ${maxSessionDistanceKm.toFixed(1)} km`
                : "Complete a session to unlock more"}
            </Text>
          </View>

          {EXPLORE_ROUTES.map((r) => {
            const isUnlocked = unlocked.has(r.id);
            return (
              <Pressable
                key={r.id}
                style={styles.routeCard}
                onPress={() => setSelectedRouteId(r.id)}
                testID={`route-${r.id}`}
              >
                <Image source={{ uri: r.image }} style={styles.routeImage} contentFit="cover" />
                <LinearGradient
                  colors={["rgba(10,10,10,0)", "rgba(10,10,10,0.5)", "rgba(10,10,10,0.95)"]}
                  locations={[0, 0.55, 1]}
                  style={styles.routeImage}
                />
                <View style={styles.routeContent}>
                  <View style={{ flexDirection: "row", gap: spacing.sm }}>
                    <Chip
                      label={isUnlocked ? "Unlocked" : `Unlock at ${r.distanceKm.toFixed(1)} km`}
                      variant="brand"
                    />
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
                {!isUnlocked ? (
                  <View style={styles.lockedOverlay}>
                    <FeatherIcon name="lock" size={22} color={colors.onSurface} />
                    <Text style={styles.lockLabel}>Locked</Text>
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Route detail sheet */}
      {selected ? (
        <Pressable
          style={styles.sheetBackdrop}
          onPress={() => setSelectedRouteId(null)}
          testID="explore-sheet-backdrop"
        >
          <Pressable
            style={[styles.sheet, { paddingBottom: insets.bottom + spacing.xl }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.sheetHandle} />
            <Image
              source={{ uri: selected.image }}
              style={[styles.sheetImage, { marginTop: spacing.md }]}
              contentFit="cover"
            />
            <View style={styles.sheetContent}>
              <View>
                <Text style={{ color: colors.muted, fontFamily: fonts.text, fontSize: fontSize.sm }}>
                  {selected.region}
                </Text>
                <Text style={styles.sheetTitle}>{selected.name}</Text>
              </View>
              <View style={styles.sheetRow}>
                <View style={styles.sheetMetric}>
                  <Text style={styles.sheetMetricValue}>{selected.distanceKm}</Text>
                  <Text style={styles.sheetMetricLabel}>km</Text>
                </View>
                <View style={styles.sheetMetric}>
                  <Text style={styles.sheetMetricValue}>{selected.elevationM}</Text>
                  <Text style={styles.sheetMetricLabel}>m elevation</Text>
                </View>
                <View style={styles.sheetMetric}>
                  <Text style={styles.sheetMetricValue}>{selected.difficulty}</Text>
                  <Text style={styles.sheetMetricLabel}>difficulty</Text>
                </View>
              </View>
              {unlocked.has(selected.id) ? (
                <PrimaryButton
                  label="Plan route"
                  icon="navigation"
                  onPress={() => setSelectedRouteId(null)}
                  testID="explore-plan-route"
                />
              ) : (
                <View
                  style={{
                    backgroundColor: colors.surfaceSecondary,
                    borderRadius: radius.md,
                    padding: spacing.lg,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing.md,
                  }}
                >
                  <FeatherIcon name="lock" size={20} color={colors.brandPrimary} />
                  <Text
                    style={{
                      color: colors.onSurface,
                      fontFamily: fonts.text,
                      fontSize: fontSize.sm,
                      flex: 1,
                    }}
                  >
                    Complete a {selected.distanceKm.toFixed(1)} km session to unlock this route.
                  </Text>
                </View>
              )}
              <SecondaryButton
                label="Close"
                onPress={() => setSelectedRouteId(null)}
                testID="explore-sheet-close"
              />
              {locPermStatus === "denied" ? (
                <Text
                  style={{
                    color: colors.muted,
                    fontFamily: fonts.text,
                    fontSize: fontSize.xs,
                    textAlign: "center",
                  }}
                >
                  Enable location in Settings to see your position on the map.
                </Text>
              ) : null}
            </View>
          </Pressable>
        </Pressable>
      ) : null}
    </View>
  );
}
