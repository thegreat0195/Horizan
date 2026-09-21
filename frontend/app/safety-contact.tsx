import React, { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FeatherIcon from "@react-native-vector-icons/feather";
import * as Haptics from "expo-haptics";

import { fonts, fontSize, makeStyles, radius, spacing, useTheme } from "@/src/theme";
import { IconButton, PrimaryButton } from "@/src/components/ui";
import { useAppState } from "@/src/state/store";

const RELATIONS = ["Partner", "Family", "Friend", "Coach", "Other"];

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
  h1: {
    color: colors.onSurface,
    fontFamily: fonts.display,
    fontSize: fontSize.display,
    letterSpacing: -1,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  subtitle: {
    color: colors.muted,
    fontFamily: fonts.text,
    fontSize: fontSize.base,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  label: {
    color: colors.muted,
    fontFamily: fonts.textMedium,
    fontSize: fontSize.xs,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  inputBox: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  input: {
    color: colors.onSurface,
    fontFamily: fonts.text,
    fontSize: fontSize.lg,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  chip: {
    height: 40,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceTertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: { backgroundColor: colors.brandPrimary },
  chipLabel: {
    color: colors.onSurfaceTertiary,
    fontFamily: fonts.textMedium,
    fontSize: fontSize.base,
  },
  chipLabelActive: { color: colors.onBrandPrimary },
  disclaimer: {
    marginTop: spacing.xl,
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSecondary,
    flexDirection: "row",
    gap: spacing.md,
  },
  disclaimerText: {
    color: colors.muted,
    fontFamily: fonts.text,
    fontSize: fontSize.sm,
    flex: 1,
    lineHeight: 20,
  },
}));

export default function SafetyContactScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { safetyContact, setSafetyContact } = useAppState();

  const [name, setName] = useState(safetyContact?.name ?? "");
  const [relation, setRelation] = useState(safetyContact?.relation ?? "Friend");

  const handleSave = () => {
    if (!name.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setSafetyContact({ name: name.trim(), relation });
    router.back();
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <IconButton name="x" onPress={() => router.back()} testID="safety-back-button" />
        <Text style={styles.headerTitle}>Safety Halo</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxxl }}>
        <Text style={styles.h1}>Choose your safety contact</Text>
        <Text style={styles.subtitle}>
          When you hold the shield during a session, we share a preview of your activity with
          this person.
        </Text>

        <Text style={styles.label}>Name</Text>
        <View style={styles.inputBox}>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Sam Reyes"
            placeholderTextColor={colors.muted}
            style={styles.input}
            testID="safety-contact-name"
          />
        </View>

        <Text style={styles.label}>Relation</Text>
        <View style={styles.chipsRow}>
          {RELATIONS.map((r) => {
            const active = relation === r;
            return (
              <Pressable
                key={r}
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  setRelation(r);
                }}
                style={[styles.chip, active && styles.chipActive]}
                testID={`safety-relation-${r}`}
              >
                <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{r}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.disclaimer}>
          <FeatherIcon name="info" size={18} color={colors.warning} />
          <Text style={styles.disclaimerText}>
            Safety Halo is a demo experience. It does not contact emergency services and does
            not send real messages. Wire your provider or SMS gateway before shipping.
          </Text>
        </View>

        <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.xl }}>
          <PrimaryButton
            label="Save contact"
            icon="check"
            fullWidth
            onPress={handleSave}
            disabled={!name.trim()}
            testID="safety-save-button"
          />
        </View>
      </ScrollView>
    </View>
  );
}
