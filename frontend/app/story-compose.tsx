import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import FeatherIcon from "@react-native-vector-icons/feather";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";

import { fonts, fontSize, makeStyles, radius, spacing, useTheme } from "@/src/theme";
import { ACTIVITY_META, ActivityType } from "@/src/data/mock";
import { Chip, IconButton, PrimaryButton, SecondaryButton } from "@/src/components/ui";
import { MOODS, useAppState } from "@/src/state/store";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1623228675987-57d5999f6c5b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MjJ8MHwxfHNlYXJjaHwxfHxwb3YlMjBvdXRkb29yJTIwYWR2ZW50dXJlJTIwaGlraW5nJTIwY2FtcGluZyUyMGZyaWVuZHN8ZW58MHx8fHwxNzg5ODg1OTA2fDA&ixlib=rb-4.1.0&q=85",
  "https://images.pexels.com/photos/4275973/pexels-photo-4275973.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "https://images.pexels.com/photos/29176030/pexels-photo-29176030.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "https://images.pexels.com/photos/34377535/pexels-photo-34377535.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
];

const useStyles = makeStyles((colors) => ({
  root: { flex: 1, backgroundColor: colors.surface },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    color: colors.onSurface,
    fontFamily: fonts.display,
    fontSize: fontSize.xl,
    letterSpacing: -0.3,
  },
  hero: {
    height: 320,
    marginHorizontal: spacing.lg,
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.surfaceSecondary,
  },
  heroImg: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0 },
  heroChange: {
    position: "absolute",
    right: spacing.md,
    bottom: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(10,10,10,0.65)",
    paddingHorizontal: spacing.md,
    height: 36,
    borderRadius: radius.pill,
    gap: spacing.sm,
  },
  heroChangeText: {
    color: "#FFFFFF",
    fontFamily: fonts.textMedium,
    fontSize: fontSize.sm,
  },
  metricStrip: {
    flexDirection: "row",
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  metricPill: {
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.md,
    height: 32,
    borderRadius: radius.pill,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metricText: {
    color: colors.onSurface,
    fontFamily: fonts.textMedium,
    fontSize: fontSize.sm,
  },
  section: { marginTop: spacing.xl, paddingHorizontal: spacing.lg },
  sectionLabel: {
    color: colors.muted,
    fontFamily: fonts.textMedium,
    fontSize: fontSize.xs,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: spacing.sm,
  },
  input: {
    color: colors.onSurface,
    fontFamily: fonts.display,
    fontSize: 28,
    letterSpacing: -0.5,
    paddingVertical: spacing.sm,
    minHeight: 40,
  },
  reflection: {
    color: colors.onSurface,
    fontFamily: fonts.text,
    fontSize: fontSize.lg,
    minHeight: 90,
    textAlignVertical: "top",
    paddingTop: 0,
  },
  moodRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  cta: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    gap: spacing.md,
  },
}));

function formatDuration(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function StoryComposeScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{
    activity?: string;
    distance?: string;
    duration?: string;
  }>();
  const { addStory } = useAppState();

  const activity = ((params.activity as ActivityType) || "run") as ActivityType;
  const distance = parseFloat(params.distance || "0") || 0;
  const duration = parseInt(params.duration || "0", 10) || 0;

  const [photoUri, setPhotoUri] = useState<string>(FALLBACK_IMAGES[0]);
  const [title, setTitle] = useState("");
  const [reflection, setReflection] = useState("");
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [galleryIdx, setGalleryIdx] = useState(0);

  const toggleMood = (id: string) => {
    Haptics.selectionAsync().catch(() => {});
    setSelectedMoods((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

  const cycleImage = () => {
    Haptics.selectionAsync().catch(() => {});
    const next = (galleryIdx + 1) % FALLBACK_IMAGES.length;
    setGalleryIdx(next);
    setPhotoUri(FALLBACK_IMAGES[next]);
  };

  const pickPhoto = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (perm.status !== "granted") {
        cycleImage();
        return;
      }
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });
      if (!res.canceled && res.assets && res.assets[0]) {
        setPhotoUri(res.assets[0].uri);
      }
    } catch {
      cycleImage();
    }
  };

  const canSave = title.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    addStory({
      title: title.trim(),
      reflection: reflection.trim(),
      moods: selectedMoods,
      activity,
      distanceKm: distance,
      durationSec: duration,
      photoUri,
      location: ACTIVITY_META[activity].label + " session",
    });
    router.replace("/stories");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.surface }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <IconButton
            name="x"
            onPress={() => router.back()}
            testID="story-compose-close"
          />
          <Text style={styles.headerTitle}>New story</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxxl }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          testID="story-compose-scroll"
        >
          {/* Hero photo */}
          <Pressable style={styles.hero} onPress={pickPhoto} testID="story-hero-photo">
            <Image source={{ uri: photoUri }} style={styles.heroImg} contentFit="cover" />
            <LinearGradient
              colors={["rgba(10,10,10,0)", "rgba(10,10,10,0.5)"]}
              locations={[0.4, 1]}
              style={styles.heroImg}
            />
            <View style={styles.heroChange}>
              <FeatherIcon name="image" size={14} color="#FFFFFF" />
              <Text style={styles.heroChangeText}>Change photo</Text>
            </View>
          </Pressable>

          {/* Metric strip */}
          <View style={styles.metricStrip}>
            <View style={styles.metricPill}>
              <FeatherIcon
                name={ACTIVITY_META[activity].icon as any}
                size={14}
                color={colors.brandPrimary}
              />
              <Text style={styles.metricText}>{ACTIVITY_META[activity].label}</Text>
            </View>
            <View style={styles.metricPill}>
              <FeatherIcon name="map" size={14} color={colors.brandPrimary} />
              <Text style={styles.metricText}>{distance.toFixed(2)} km</Text>
            </View>
            <View style={styles.metricPill}>
              <FeatherIcon name="clock" size={14} color={colors.brandPrimary} />
              <Text style={styles.metricText}>{formatDuration(duration)}</Text>
            </View>
          </View>

          {/* Title */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Golden hour trail run"
              placeholderTextColor={colors.muted}
              style={styles.input}
              testID="story-title-input"
            />
          </View>

          {/* Reflection */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Reflection</Text>
            <TextInput
              value={reflection}
              onChangeText={setReflection}
              placeholder="What did today feel like?"
              placeholderTextColor={colors.muted}
              style={styles.reflection}
              multiline
              testID="story-reflection-input"
            />
          </View>

          {/* Moods */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Mood</Text>
            <View style={styles.moodRow}>
              {MOODS.map((m) => (
                <Chip
                  key={m.id}
                  label={m.label}
                  icon={m.icon}
                  active={selectedMoods.includes(m.id)}
                  onPress={() => toggleMood(m.id)}
                  testID={`mood-${m.id}`}
                />
              ))}
            </View>
          </View>

          <View style={styles.cta}>
            <PrimaryButton
              label="Publish story"
              icon="check"
              fullWidth
              onPress={handleSave}
              disabled={!canSave}
              testID="story-publish-button"
            />
            <SecondaryButton
              label="Save draft"
              fullWidth
              onPress={() => router.back()}
              testID="story-draft-button"
            />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
