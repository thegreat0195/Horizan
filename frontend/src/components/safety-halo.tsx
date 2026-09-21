import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import FeatherIcon from "@react-native-vector-icons/feather";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";

import { fonts, fontSize, radius, spacing, useTheme } from "@/src/theme";
import { useAppState } from "@/src/state/store";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const HOLD_MS = 1600;
const SIZE = 88;
const STROKE = 4;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;

/**
 * SafetyHalo — hold-to-send safety ping button.
 * Fully local/demo. Never contacts emergency services.
 * When held for HOLD_MS ms, records a mock "safety ping" to the user's
 * chosen safety contact via the app store.
 */
export function SafetyHalo({ activityLabel }: { activityLabel: string }) {
  const { colors } = useTheme();
  const router = useRouter();
  const { safetyContact, sendSafetyPing, lastSafetyPing } = useAppState();

  const progress = useSharedValue(0);
  const pulse = useSharedValue(1);
  const [state, setState] = useState<"idle" | "holding" | "sent">("idle");
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.15, { duration: 1400, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
    return () => cancelAnimation(pulse);
  }, [pulse]);

  const finish = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    sendSafetyPing();
    setState("sent");
    setConfirmationVisible(true);
    // Reset after a moment.
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setConfirmationVisible(false);
      setState("idle");
      progress.value = 0;
    }, 3200) as unknown as number;
  };

  const start = () => {
    if (!safetyContact) {
      router.push("/safety-contact");
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setState("holding");
    progress.value = withTiming(
      1,
      { duration: HOLD_MS, easing: Easing.linear },
      (finished) => {
        if (finished) runOnJS(finish)();
      },
    );
  };

  const cancel = () => {
    if (state !== "holding") return;
    progress.value = withTiming(0, { duration: 250 });
    setState("idle");
  };

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: C * (1 - progress.value),
  }));
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <View style={{ alignItems: "center" }}>
      <Pressable
        onPressIn={start}
        onPressOut={cancel}
        onLongPress={() => {}}
        delayLongPress={HOLD_MS + 400}
        testID="safety-halo-button"
        style={{
          width: SIZE,
          height: SIZE,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {state === "idle" ? (
          <Animated.View
            style={[
              {
                position: "absolute",
                width: SIZE,
                height: SIZE,
                borderRadius: SIZE / 2,
                borderWidth: 1,
                borderColor: colors.borderStrong,
              },
              pulseStyle,
            ]}
          />
        ) : null}

        <Svg width={SIZE} height={SIZE} style={{ position: "absolute" }}>
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            stroke={colors.surfaceTertiary}
            strokeWidth={STROKE}
            fill="transparent"
          />
          <AnimatedCircle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            stroke={colors.brandPrimary}
            strokeWidth={STROKE}
            fill="transparent"
            strokeDasharray={C}
            animatedProps={animatedProps}
            strokeLinecap="round"
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          />
        </Svg>

        <View
          style={{
            width: SIZE - 20,
            height: SIZE - 20,
            borderRadius: (SIZE - 20) / 2,
            backgroundColor: state === "sent" ? colors.brandPrimary : colors.surfaceSecondary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FeatherIcon
            name={state === "sent" ? "check" : "shield"}
            size={26}
            color={state === "sent" ? colors.onBrandPrimary : colors.brandPrimary}
          />
        </View>
      </Pressable>

      <Text
        style={{
          color: colors.muted,
          fontFamily: fonts.textMedium,
          fontSize: fontSize.xs,
          marginTop: spacing.md,
          letterSpacing: 1.5,
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        {state === "holding"
          ? "Keep holding..."
          : state === "sent"
            ? "Ping sent · demo"
            : "Hold shield · safety halo"}
      </Text>

      {confirmationVisible && lastSafetyPing ? (
        <View
          style={{
            marginTop: spacing.md,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            backgroundColor: colors.surfaceSecondary,
            borderRadius: radius.md,
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.md,
            maxWidth: 320,
          }}
        >
          <FeatherIcon name="shield" size={18} color={colors.brandPrimary} />
          <Text
            style={{
              flex: 1,
              color: colors.onSurface,
              fontFamily: fonts.text,
              fontSize: fontSize.sm,
              lineHeight: 20,
            }}
          >
            Shared {activityLabel.toLowerCase()} status with{" "}
            <Text style={{ color: colors.brandPrimary, fontFamily: fonts.textMedium }}>
              {lastSafetyPing.contactName}
            </Text>
            . Demo mode — no real message sent.
          </Text>
        </View>
      ) : null}
    </View>
  );
}
