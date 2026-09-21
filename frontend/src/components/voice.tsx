import React, { useEffect, useRef, useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import FeatherIcon from "@react-native-vector-icons/feather";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import {
  AudioModule,
  RecordingPresets,
  useAudioRecorder,
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";

import { fonts, fontSize, radius, spacing, useTheme } from "@/src/theme";

const MAX_SECONDS = 15;

/**
 * Hold-to-record voice recorder for Squad Chat.
 * Uses expo-audio. Web has no recorder support in expo-audio, so the button
 * shows a subtle disabled state on web instead of blocking anything.
 */
export function VoiceRecorderButton({
  onSend,
}: {
  onSend: (uri: string, durationSec: number) => void;
}) {
  const { colors } = useTheme();
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [permDenied, setPermDenied] = useState(false);
  const tickRef = useRef<number | null>(null);
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.25, { duration: 800, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
    return () => cancelAnimation(pulse);
  }, [pulse]);

  useEffect(() => () => {
    if (tickRef.current) clearInterval(tickRef.current);
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: recording ? pulse.value : 1 }],
  }));

  const stopAndSend = async () => {
    if (!recording) return;
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    setRecording(false);
    try {
      await recorder.stop();
      const uri = recorder.uri;
      const dur = Math.max(1, seconds);
      setSeconds(0);
      if (uri) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        onSend(uri, dur);
      }
    } catch {
      setSeconds(0);
    }
  };

  const startRecording = async () => {
    if (Platform.OS === "web") return;
    try {
      const perm = await AudioModule.requestRecordingPermissionsAsync();
      if (!perm.granted) {
        setPermDenied(true);
        return;
      }
      await recorder.prepareToRecordAsync();
      recorder.record();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      setRecording(true);
      setSeconds(0);
      tickRef.current = setInterval(() => {
        setSeconds((s) => {
          const next = s + 1;
          if (next >= MAX_SECONDS) {
            // Auto-stop at 15s
            stopAndSend();
          }
          return next;
        });
      }, 1000) as unknown as number;
    } catch {
      setPermDenied(true);
    }
  };

  const disabled = Platform.OS === "web";

  return (
    <View style={{ alignItems: "center", gap: 4 }}>
      <Pressable
        onPressIn={startRecording}
        onPressOut={stopAndSend}
        disabled={disabled}
        testID="chat-voice-button"
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: recording
            ? colors.error
            : disabled
              ? colors.surfaceSecondary
              : colors.surfaceSecondary,
          alignItems: "center",
          justifyContent: "center",
          opacity: disabled ? 0.4 : 1,
        }}
      >
        {recording ? (
          <Animated.View
            style={[
              {
                position: "absolute",
                width: 44,
                height: 44,
                borderRadius: 22,
                borderWidth: 2,
                borderColor: colors.error,
              },
              pulseStyle,
            ]}
          />
        ) : null}
        <FeatherIcon
          name={recording ? "square" : "mic"}
          size={20}
          color={recording ? "#FFFFFF" : colors.onSurface}
        />
      </Pressable>
      {recording ? (
        <Text
          style={{
            color: colors.error,
            fontFamily: fonts.metric,
            fontSize: fontSize.xs,
          }}
        >
          {`0:${seconds.toString().padStart(2, "0")}`}
        </Text>
      ) : permDenied ? (
        <Text style={{ color: colors.muted, fontFamily: fonts.text, fontSize: 10 }}>
          Mic denied
        </Text>
      ) : null}
    </View>
  );
}

/**
 * Voice message playback bubble.
 * Tap to play/pause. Shows a waveform-like bar row that fills with playback.
 */
export function VoiceBubble({
  uri,
  durationSec,
  mine,
}: {
  uri: string;
  durationSec: number;
  mine?: boolean;
}) {
  const { colors } = useTheme();
  const player = useAudioPlayer({ uri });
  const status = useAudioPlayerStatus(player);
  const playing = status.playing;
  const positionSec = Math.floor((status.currentTime ?? 0));
  const total = durationSec || Math.max(1, Math.floor((status.duration ?? 1)));

  const toggle = () => {
    Haptics.selectionAsync().catch(() => {});
    if (playing) {
      player.pause();
    } else {
      if (positionSec >= total - 0.2) {
        player.seekTo(0);
      }
      player.play();
    }
  };

  // Waveform bars — deterministic heights per position.
  const bars = React.useMemo(() => {
    return Array.from({ length: 22 }, (_, i) => 6 + ((i * 131) % 16));
  }, []);
  const progressFrac = Math.min(1, positionSec / total);

  const bg = mine ? colors.brandPrimary : colors.surfaceSecondary;
  const fg = mine ? colors.onBrandPrimary : colors.onSurface;
  const activeBar = mine ? colors.onBrandPrimary : colors.brandPrimary;
  const inactiveBar = mine ? "rgba(0,0,0,0.28)" : colors.surfaceTertiary;

  return (
    <View
      style={{
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radius.md,
        backgroundColor: bg,
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
      }}
    >
      <Pressable onPress={toggle} testID="voice-bubble-toggle">
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: mine ? "rgba(0,0,0,0.15)" : colors.brandTertiary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FeatherIcon name={playing ? "pause" : "play"} size={14} color={fg} />
        </View>
      </Pressable>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 3, height: 24 }}>
        {bars.map((h, i) => (
          <View
            key={i}
            style={{
              width: 2,
              height: h,
              borderRadius: 1,
              backgroundColor: i / bars.length <= progressFrac ? activeBar : inactiveBar,
            }}
          />
        ))}
      </View>
      <Text
        style={{
          color: fg,
          fontFamily: fonts.metric,
          fontSize: fontSize.xs,
          marginLeft: 4,
        }}
      >
        0:{Math.floor(total).toString().padStart(2, "0")}
      </Text>
    </View>
  );
}
