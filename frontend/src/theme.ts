// Project Horizon design tokens — DARK theme only.
// Keys match /app/design_guidelines.json.
//
// Usage:
//   const useStyles = makeStyles((colors) => ({
//     card: { backgroundColor: colors.surfaceSecondary },
//   }));
//   const styles = useStyles();

import { useMemo } from "react";
import { Appearance, StyleSheet, useColorScheme } from "react-native";

export type ColorScheme = "light" | "dark";

const dark = {
  // Surfaces
  surface: "#0A0A0A",
  onSurface: "#FFFFFF",
  surfaceSecondary: "#1A1A1A",
  onSurfaceSecondary: "#EAEAEA",
  surfaceTertiary: "#242424",
  onSurfaceTertiary: "#D4D4D4",
  surfaceInverse: "#FFFFFF",
  onSurfaceInverse: "#0A0A0A",
  muted: "#808080",

  // Brand — Electric Lime
  brand: "#C6FF3D",
  onBrand: "#000000",
  brandPrimary: "#C6FF3D",
  onBrandPrimary: "#000000",
  brandSecondary: "#9ACC2A",
  onBrandSecondary: "#000000",
  brandTertiary: "#2A3311",
  onBrandTertiary: "#C6FF3D",

  // Status
  success: "#C6FF3D",
  onSuccess: "#000000",
  warning: "#FFB340",
  onWarning: "#000000",
  error: "#FF4D4D",
  onError: "#FFFFFF",
  info: "#E0E0E0",
  onInfo: "#000000",

  // Lines
  border: "#333333",
  borderStrong: "#4D4D4D",
  divider: "#2A2A2A",
};

export type ThemeColors = typeof dark;

export const defaultScheme = "dark" satisfies ColorScheme;

export const themes: { light?: ThemeColors; dark: ThemeColors } = { dark };

export function setColorScheme(scheme: ColorScheme | null) {
  Appearance.setColorScheme?.(scheme ?? "unspecified");
}

setColorScheme?.(themes.light ? null : defaultScheme);

export function useTheme(): { scheme: ColorScheme; colors: ThemeColors } {
  const system = useColorScheme();
  const scheme: ColorScheme =
    system && themes[system as ColorScheme] ? (system as ColorScheme) : defaultScheme;
  return { scheme, colors: themes[scheme] ?? themes.dark };
}

export function makeStyles<T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>>(
  factory: (colors: ThemeColors) => T & StyleSheet.NamedStyles<any>,
): () => T {
  return function useStyles(): T {
    const { colors } = useTheme();
    return useMemo(() => StyleSheet.create(factory(colors)), [colors]);
  };
}

// Design tokens (spacing, radius, typography)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const radius = {
  sm: 6,
  md: 12,
  lg: 20,
  pill: 999,
};

export const fonts = {
  display: "SpaceGrotesk-Medium",
  displayBold: "SpaceGrotesk-Bold",
  text: "Geist-Regular",
  textMedium: "Geist-Medium",
  metric: "SpaceGrotesk-Medium",
};

export const fontSize = {
  xs: 11,
  sm: 12,
  base: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  display: 32,
  hero: 48,
  metric: 56,
};
