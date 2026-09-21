// Project Horizon core UI primitives.
// All components consume theme tokens from src/theme.ts.

import React from "react";
import {
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import FeatherIcon from "@react-native-vector-icons/feather";
import * as Haptics from "expo-haptics";

import { fonts, fontSize, makeStyles, radius, spacing, useTheme } from "../theme";

// ---------------- Buttons ----------------
type ButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  fullWidth?: boolean;
  testID?: string;
  style?: StyleProp<ViewStyle>;
};

const useBtnStyles = makeStyles((colors) => ({
  base: {
    height: 56,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: spacing.xl,
  },
  primary: { backgroundColor: colors.brandPrimary },
  secondary: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
  },
  danger: { backgroundColor: colors.error },
  labelPrimary: {
    color: colors.onBrandPrimary,
    fontFamily: fonts.textMedium,
    fontSize: fontSize.lg,
    letterSpacing: 0.2,
  },
  labelSecondary: {
    color: colors.onSurface,
    fontFamily: fonts.textMedium,
    fontSize: fontSize.lg,
    letterSpacing: 0.2,
  },
  labelDanger: {
    color: colors.onError,
    fontFamily: fonts.textMedium,
    fontSize: fontSize.lg,
    letterSpacing: 0.2,
  },
  disabled: { opacity: 0.4 },
  iconLeft: { marginRight: spacing.sm },
}));

export function PrimaryButton(props: ButtonProps) {
  const styles = useBtnStyles();
  const { colors } = useTheme();
  return (
    <Pressable
      testID={props.testID ?? "primary-button"}
      onPress={() => {
        if (props.disabled || props.loading) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        props.onPress?.();
      }}
      disabled={props.disabled || props.loading}
      style={({ pressed }) => [
        styles.base,
        styles.primary,
        props.fullWidth && { alignSelf: "stretch" },
        (props.disabled || props.loading) && styles.disabled,
        pressed && { opacity: 0.85 },
        props.style,
      ]}
    >
      {props.loading ? (
        <ActivityIndicator color={colors.onBrandPrimary} />
      ) : (
        <>
          {props.icon ? (
            <FeatherIcon
              name={props.icon as any}
              size={18}
              color={colors.onBrandPrimary}
              style={styles.iconLeft}
            />
          ) : null}
          <Text style={styles.labelPrimary}>{props.label}</Text>
        </>
      )}
    </Pressable>
  );
}

export function SecondaryButton(props: ButtonProps) {
  const styles = useBtnStyles();
  const { colors } = useTheme();
  return (
    <Pressable
      testID={props.testID ?? "secondary-button"}
      onPress={() => {
        if (props.disabled) return;
        Haptics.selectionAsync().catch(() => {});
        props.onPress?.();
      }}
      disabled={props.disabled}
      style={({ pressed }) => [
        styles.base,
        styles.secondary,
        props.fullWidth && { alignSelf: "stretch" },
        props.disabled && styles.disabled,
        pressed && { opacity: 0.75 },
        props.style,
      ]}
    >
      {props.icon ? (
        <FeatherIcon
          name={props.icon as any}
          size={18}
          color={colors.onSurface}
          style={styles.iconLeft}
        />
      ) : null}
      <Text style={styles.labelSecondary}>{props.label}</Text>
    </Pressable>
  );
}

export function DangerButton(props: ButtonProps) {
  const styles = useBtnStyles();
  const { colors } = useTheme();
  return (
    <Pressable
      testID={props.testID ?? "danger-button"}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
        props.onPress?.();
      }}
      style={({ pressed }) => [
        styles.base,
        styles.danger,
        props.fullWidth && { alignSelf: "stretch" },
        pressed && { opacity: 0.85 },
        props.style,
      ]}
    >
      {props.icon ? (
        <FeatherIcon
          name={props.icon as any}
          size={18}
          color={colors.onError}
          style={styles.iconLeft}
        />
      ) : null}
      <Text style={styles.labelDanger}>{props.label}</Text>
    </Pressable>
  );
}

// ---------------- IconButton ----------------
export function IconButton({
  name,
  onPress,
  size = 22,
  color,
  testID,
  style,
}: {
  name: string;
  onPress?: () => void;
  size?: number;
  color?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      testID={testID ?? `icon-button-${name}`}
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress?.();
      }}
      style={({ pressed }) => [
        {
          height: 44,
          width: 44,
          borderRadius: radius.pill,
          backgroundColor: colors.surfaceSecondary,
          alignItems: "center",
          justifyContent: "center",
        },
        pressed && { opacity: 0.7 },
        style,
      ]}
    >
      <FeatherIcon name={name as any} size={size} color={color ?? colors.onSurface} />
    </Pressable>
  );
}

// ---------------- SectionHeader ----------------
export function SectionHeader({
  title,
  action,
  onActionPress,
}: {
  title: string;
  action?: string;
  onActionPress?: () => void;
}) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: spacing.lg,
        marginTop: spacing.xxl,
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
        {title}
      </Text>
      {action ? (
        <Pressable onPress={onActionPress} testID={`section-action-${title}`}>
          <Text
            style={{ color: colors.muted, fontFamily: fonts.textMedium, fontSize: fontSize.base }}
          >
            {action}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

// ---------------- MetricCard ----------------
export function MetricCard({
  value,
  label,
  compact,
  accent,
  testID,
}: {
  value: string;
  label: string;
  compact?: boolean;
  accent?: boolean;
  testID?: string;
}) {
  const { colors } = useTheme();
  return (
    <View
      testID={testID}
      style={{
        backgroundColor: colors.surfaceSecondary,
        borderRadius: radius.md,
        paddingVertical: compact ? spacing.md : spacing.lg,
        paddingHorizontal: spacing.lg,
        flex: 1,
      }}
    >
      <Text
        style={{
          color: accent ? colors.brandPrimary : colors.onSurface,
          fontFamily: fonts.metric,
          fontSize: compact ? fontSize.xxl : fontSize.display,
          letterSpacing: -1,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          color: colors.muted,
          fontFamily: fonts.text,
          fontSize: fontSize.sm,
          marginTop: 2,
          textTransform: "uppercase",
          letterSpacing: 1.2,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

// ---------------- Chip ----------------
export function Chip({
  label,
  active,
  onPress,
  icon,
  variant = "default",
  testID,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
  icon?: string;
  variant?: "default" | "brand";
  testID?: string;
}) {
  const { colors } = useTheme();
  const bg =
    variant === "brand" || active ? colors.brandTertiary : colors.surfaceTertiary;
  const fg =
    variant === "brand" || active ? colors.onBrandTertiary : colors.onSurfaceTertiary;
  return (
    <Pressable
      testID={testID ?? `chip-${label}`}
      onPress={onPress}
      style={({ pressed }) => [
        {
          height: 36,
          borderRadius: radius.pill,
          paddingHorizontal: spacing.lg,
          backgroundColor: bg,
          flexDirection: "row",
          alignItems: "center",
          flexShrink: 0,
          borderWidth: active ? 1 : 0,
          borderColor: colors.brandPrimary,
        },
        pressed && { opacity: 0.8 },
      ]}
    >
      {icon ? (
        <FeatherIcon
          name={icon as any}
          size={14}
          color={fg}
          style={{ marginRight: spacing.sm }}
        />
      ) : null}
      <Text
        style={{
          color: fg,
          fontFamily: fonts.textMedium,
          fontSize: fontSize.sm,
          letterSpacing: 0.3,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// ---------------- Avatar ----------------
export function Avatar({
  uri,
  size = 40,
  ring,
  testID,
}: {
  uri?: string;
  size?: number;
  ring?: boolean;
  testID?: string;
}) {
  const { colors } = useTheme();
  return (
    <View
      testID={testID}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.surfaceTertiary,
        borderWidth: ring ? 2 : 0,
        borderColor: colors.brandPrimary,
        overflow: "hidden",
      }}
    >
      {uri ? (
        <Image source={{ uri }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
      ) : null}
    </View>
  );
}

// ---------------- Badge ----------------
export function Badge({
  label,
  tone = "brand",
}: {
  label: string;
  tone?: "brand" | "muted" | "warning";
}) {
  const { colors } = useTheme();
  const bg =
    tone === "brand"
      ? colors.brandTertiary
      : tone === "warning"
        ? colors.warning
        : colors.surfaceTertiary;
  const fg =
    tone === "brand"
      ? colors.onBrandTertiary
      : tone === "warning"
        ? colors.onWarning
        : colors.onSurfaceTertiary;
  return (
    <View
      style={{
        alignSelf: "flex-start",
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: radius.sm,
        backgroundColor: bg,
      }}
    >
      <Text
        style={{
          color: fg,
          fontFamily: fonts.textMedium,
          fontSize: fontSize.xs,
          letterSpacing: 1.2,
          textTransform: "uppercase",
        }}
      >
        {label}
      </Text>
    </View>
  );
}

// ---------------- ProgressBar ----------------
export function ProgressBar({
  value,
  height = 6,
}: {
  value: number; // 0..1
  height?: number;
}) {
  const { colors } = useTheme();
  const pct = Math.max(0, Math.min(1, value));
  return (
    <View
      style={{
        height,
        backgroundColor: colors.surfaceTertiary,
        borderRadius: radius.pill,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          width: `${pct * 100}%`,
          height: "100%",
          backgroundColor: colors.brandPrimary,
          borderRadius: radius.pill,
        }}
      />
    </View>
  );
}

// ---------------- EmptyState ----------------
export function EmptyState({
  icon,
  title,
  message,
  ctaLabel,
  onCta,
}: {
  icon: string;
  title: string;
  message: string;
  ctaLabel?: string;
  onCta?: () => void;
}) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.xxxl,
      }}
    >
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          backgroundColor: colors.surfaceSecondary,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: spacing.lg,
        }}
      >
        <FeatherIcon name={icon as any} size={28} color={colors.brandPrimary} />
      </View>
      <Text
        style={{
          color: colors.onSurface,
          fontFamily: fonts.display,
          fontSize: fontSize.xl,
          textAlign: "center",
          letterSpacing: -0.3,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          color: colors.muted,
          fontFamily: fonts.text,
          fontSize: fontSize.base,
          textAlign: "center",
          marginTop: spacing.sm,
          maxWidth: 300,
        }}
      >
        {message}
      </Text>
      {ctaLabel ? (
        <View style={{ marginTop: spacing.xl }}>
          <PrimaryButton label={ctaLabel} onPress={onCta} />
        </View>
      ) : null}
    </View>
  );
}

// ---------------- Screen container ----------------
export function ScreenHeading({
  eyebrow,
  title,
  subtitle,
  style,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  style?: StyleProp<TextStyle>;
}) {
  const { colors } = useTheme();
  return (
    <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg }}>
      {eyebrow ? (
        <Text
          style={{
            color: colors.brandPrimary,
            fontFamily: fonts.textMedium,
            fontSize: fontSize.xs,
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: spacing.sm,
          }}
        >
          {eyebrow}
        </Text>
      ) : null}
      <Text
        style={[
          {
            color: colors.onSurface,
            fontFamily: fonts.display,
            fontSize: fontSize.display,
            letterSpacing: -1,
          },
          style,
        ]}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          style={{
            color: colors.muted,
            fontFamily: fonts.text,
            fontSize: fontSize.base,
            marginTop: spacing.xs,
          }}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
