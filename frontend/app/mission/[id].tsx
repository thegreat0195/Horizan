import React, { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import FeatherIcon from "@react-native-vector-icons/feather";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";

import { fonts, fontSize, makeStyles, radius, spacing, useTheme } from "@/src/theme";
import { SQUADS } from "@/src/data/mock";
import { Avatar, IconButton, PrimaryButton, ProgressBar } from "@/src/components/ui";
import { VoiceBubble, VoiceRecorderButton } from "@/src/components/voice";
import { useAppState, ChatMessage } from "@/src/state/store";

const useStyles = makeStyles((colors) => ({
  root: { flex: 1, backgroundColor: colors.surface },
  cover: { height: 240, backgroundColor: colors.surfaceSecondary },
  coverImg: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0 },
  headerActions: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  coverContent: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg,
  },
  eyebrow: {
    color: colors.brandPrimary,
    fontFamily: fonts.textMedium,
    fontSize: fontSize.xs,
    letterSpacing: 2.2,
    textTransform: "uppercase",
  },
  title: {
    color: "#FFFFFF",
    fontFamily: fonts.display,
    fontSize: 36,
    letterSpacing: -0.8,
    marginTop: 4,
  },
  desc: {
    color: colors.onSurfaceSecondary,
    fontFamily: fonts.text,
    fontSize: fontSize.base,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
    lineHeight: 22,
  },
  progressCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    padding: spacing.xl,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
  },
  progressLabel: {
    color: colors.muted,
    fontFamily: fonts.textMedium,
    fontSize: fontSize.xs,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: spacing.sm,
  },
  progressValue: {
    color: colors.brandPrimary,
    fontFamily: fonts.metric,
    fontSize: 56,
    letterSpacing: -2,
  },
  progressTarget: {
    color: colors.muted,
    fontFamily: fonts.text,
    fontSize: fontSize.base,
    marginTop: 2,
  },
  section: {
    color: colors.onSurface,
    fontFamily: fonts.display,
    fontSize: fontSize.xl,
    letterSpacing: -0.3,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  rowMe: { backgroundColor: colors.brandTertiary },
  rank: {
    color: colors.onSurface,
    fontFamily: fonts.metric,
    fontSize: fontSize.xl,
    width: 32,
  },
  rankGold: { color: colors.brandPrimary },
  memberName: {
    color: colors.onSurface,
    fontFamily: fonts.textMedium,
    fontSize: fontSize.base,
  },
  memberKm: {
    color: colors.brandPrimary,
    fontFamily: fonts.metric,
    fontSize: fontSize.lg,
    letterSpacing: -0.3,
  },
  celebration: {
    marginTop: spacing.xl,
    marginHorizontal: spacing.lg,
    padding: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.brandTertiary,
    alignItems: "center",
  },
  celebrationTitle: {
    color: colors.brandPrimary,
    fontFamily: fonts.display,
    fontSize: fontSize.xxl,
    letterSpacing: -0.5,
    marginTop: spacing.md,
    textAlign: "center",
  },
  celebrationText: {
    color: colors.onSurfaceSecondary,
    fontFamily: fonts.text,
    fontSize: fontSize.base,
    marginTop: spacing.sm,
    textAlign: "center",
    lineHeight: 22,
  },
}));

export default function MissionDetailScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string }>();
  const { missions, chats, sendChat } = useAppState();
  const [draft, setDraft] = useState("");

  const mission = missions.find((m) => m.id === params.id) ?? missions[0];
  const squad = SQUADS.find((s) => s.id === mission.squadId) ?? SQUADS[0];
  const totalKm = useMemo(
    () => mission.members.reduce((acc, m) => acc + m.km, 0),
    [mission],
  );
  const progress = Math.min(1, totalKm / mission.targetKm);
  const complete = progress >= 1;
  const sorted = [...mission.members].sort((a, b) => b.km - a.km);

  // Celebration ring pulse
  const pulse = useSharedValue(1);
  useEffect(() => {
    if (complete) {
      pulse.value = withRepeat(withTiming(1.3, { duration: 900, easing: Easing.out(Easing.quad) }), -1, true);
    }
  }, [complete, pulse]);
  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxxl }}
        showsVerticalScrollIndicator={false}
        testID="mission-scroll"
      >
        <View style={styles.cover}>
          <Image
            source={{
              uri: "https://images.pexels.com/photos/18804214/pexels-photo-18804214.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
            }}
            style={styles.coverImg}
            contentFit="cover"
          />
          <LinearGradient
            colors={["rgba(10,10,10,0.4)", "rgba(10,10,10,0.95)"]}
            locations={[0, 1]}
            style={StyleSheet.absoluteFill}
          />
          <View style={[styles.headerActions, { top: insets.top + spacing.md }]}>
            <IconButton
              name="arrow-left"
              onPress={() => router.back()}
              testID="mission-back-button"
            />
            <IconButton name="share-2" testID="mission-share-button" />
          </View>
          <View style={styles.coverContent}>
            <Text style={styles.eyebrow}>
              {squad.name} · Week 21
            </Text>
            <Text style={styles.title}>{mission.title}</Text>
          </View>
        </View>

        <Text style={styles.desc}>{mission.description}</Text>

        {complete ? (
          <View style={styles.celebration}>
            <Animated.View style={pulseStyle}>
              <FeatherIcon name="award" size={48} color={colors.brandPrimary} />
            </Animated.View>
            <Text style={styles.celebrationTitle}>Mission complete</Text>
            <Text style={styles.celebrationText}>
              {squad.name} finished this week&apos;s mission with {totalKm.toFixed(1)} km. Rest up —
              a new mission drops Monday.
            </Text>
          </View>
        ) : (
          <View style={styles.progressCard}>
            <Text style={styles.progressLabel}>Squad progress · ends in {mission.endsIn}</Text>
            <Text style={styles.progressValue}>{totalKm.toFixed(1)}</Text>
            <Text style={styles.progressTarget}>
              of {mission.targetKm} km · {Math.round(progress * 100)}%
            </Text>
            <View style={{ marginTop: spacing.md }}>
              <ProgressBar value={progress} height={8} />
            </View>
          </View>
        )}

        <Text style={styles.section}>Leaderboard</Text>
        {sorted.map((m, idx) => {
          const isMe = m.id === "me";
          const rank = idx + 1;
          return (
            <View
              key={m.id}
              style={[styles.row, isMe && styles.rowMe]}
              testID={`leaderboard-${m.id}`}
            >
              <Text style={[styles.rank, rank === 1 && styles.rankGold]}>{rank}</Text>
              <Avatar uri={m.avatar} size={40} ring={rank === 1} />
              <View style={{ flex: 1 }}>
                <Text style={styles.memberName}>{isMe ? "You" : m.name}</Text>
              </View>
              <Text style={styles.memberKm}>{m.km.toFixed(1)} km</Text>
            </View>
          );
        })}

        {/* Squad Chat */}
        <Text style={styles.section}>Squad chat</Text>
        <View style={{ paddingHorizontal: spacing.lg, gap: spacing.md }}>
          {(chats[mission.id] ?? []).length === 0 ? (
            <Text
              style={{
                color: colors.muted,
                fontFamily: fonts.text,
                fontSize: fontSize.sm,
                lineHeight: 20,
              }}
            >
              No messages yet. Send a cheer to break the ice.
            </Text>
          ) : (
            (chats[mission.id] ?? []).map((m) => (
              <ChatBubble key={m.id} msg={m} />
            ))
          )}
        </View>

        <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.xl }}>
          <PrimaryButton
            label="Log a session"
            icon="play"
            fullWidth
            onPress={() => router.replace("/move")}
            testID="mission-log-session"
          />
        </View>
      </ScrollView>

      {/* Composer */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.sm,
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.md,
            paddingBottom: insets.bottom + spacing.md,
            backgroundColor: colors.surface,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: colors.divider,
          }}
        >
          <Pressable
            onPress={async () => {
              try {
                const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (perm.status !== "granted") return;
                const res = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  quality: 0.7,
                });
                if (!res.canceled && res.assets && res.assets[0]) {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
                  sendChat(mission.id, {
                    kind: "photo",
                    body: "Photo",
                    photoUri: res.assets[0].uri,
                  });
                }
              } catch {}
            }}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: colors.surfaceSecondary,
              alignItems: "center",
              justifyContent: "center",
            }}
            testID="chat-photo-button"
          >
            <FeatherIcon name="image" size={20} color={colors.onSurface} />
          </Pressable>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              sendChat(mission.id, { kind: "cheer", body: "👏 Sending love from the trail" });
            }}
            style={{
              height: 44,
              paddingHorizontal: spacing.md,
              borderRadius: 22,
              backgroundColor: colors.brandTertiary,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              gap: 6,
            }}
            testID="chat-cheer-button"
          >
            <FeatherIcon name="award" size={16} color={colors.brandPrimary} />
            <Text
              style={{
                color: colors.brandPrimary,
                fontFamily: fonts.textMedium,
                fontSize: fontSize.sm,
              }}
            >
              Cheer
            </Text>
          </Pressable>
          <VoiceRecorderButton
            onSend={(uri, durationSec) =>
              sendChat(mission.id, { kind: "voice", voiceUri: uri, voiceDurationSec: durationSec })
            }
          />
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Message the squad"
            placeholderTextColor={colors.muted}
            style={{
              flex: 1,
              height: 44,
              paddingHorizontal: spacing.lg,
              borderRadius: 22,
              backgroundColor: colors.surfaceSecondary,
              color: colors.onSurface,
              fontFamily: fonts.text,
              fontSize: fontSize.base,
            }}
            testID="chat-input"
            returnKeyType="send"
            onSubmitEditing={() => {
              if (!draft.trim()) return;
              sendChat(mission.id, { kind: "text", body: draft.trim() });
              setDraft("");
            }}
          />
          <Pressable
            onPress={() => {
              if (!draft.trim()) return;
              Haptics.selectionAsync().catch(() => {});
              sendChat(mission.id, { kind: "text", body: draft.trim() });
              setDraft("");
            }}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: draft.trim() ? colors.brandPrimary : colors.surfaceSecondary,
              alignItems: "center",
              justifyContent: "center",
            }}
            testID="chat-send-button"
          >
            <FeatherIcon
              name="arrow-up"
              size={20}
              color={draft.trim() ? colors.onBrandPrimary : colors.muted}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function ChatBubble({ msg }: { msg: ChatMessage }) {
  const { colors } = useTheme();
  const isMine = !!msg.mine;
  const time = new Date(msg.createdAt);
  const timeStr = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return (
    <View
      style={{
        flexDirection: isMine ? "row-reverse" : "row",
        alignItems: "flex-end",
        gap: spacing.sm,
      }}
      testID={`chat-msg-${msg.id}`}
    >
      {!isMine ? <Avatar uri={msg.avatar} size={32} /> : null}
      <View
        style={{
          maxWidth: "78%",
          gap: 4,
          alignItems: isMine ? "flex-end" : "flex-start",
        }}
      >
        {!isMine ? (
          <Text
            style={{
              color: colors.muted,
              fontFamily: fonts.textMedium,
              fontSize: fontSize.xs,
              paddingHorizontal: 2,
            }}
          >
            {msg.author} · {timeStr}
          </Text>
        ) : null}
        {msg.kind === "photo" && msg.photoUri ? (
          <View
            style={{
              borderRadius: radius.md,
              overflow: "hidden",
              backgroundColor: colors.surfaceSecondary,
            }}
          >
            <Image
              source={{ uri: msg.photoUri }}
              style={{ width: 220, height: 140 }}
              contentFit="cover"
            />
            {msg.body ? (
              <Text
                style={{
                  color: colors.onSurface,
                  fontFamily: fonts.text,
                  fontSize: fontSize.sm,
                  padding: spacing.sm,
                }}
              >
                {msg.body}
              </Text>
            ) : null}
          </View>
        ) : msg.kind === "voice" && msg.voiceUri ? (
          <VoiceBubble
            uri={msg.voiceUri}
            durationSec={msg.voiceDurationSec ?? 0}
            mine={isMine}
          />
        ) : (
          <View
            style={{
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              borderRadius: radius.md,
              backgroundColor:
                msg.kind === "cheer"
                  ? colors.brandTertiary
                  : isMine
                    ? colors.brandPrimary
                    : colors.surfaceSecondary,
            }}
          >
            <Text
              style={{
                color:
                  msg.kind === "cheer"
                    ? colors.brandPrimary
                    : isMine
                      ? colors.onBrandPrimary
                      : colors.onSurface,
                fontFamily: fonts.text,
                fontSize: fontSize.base,
                lineHeight: 20,
              }}
            >
              {msg.body}
            </Text>
          </View>
        )}
        {isMine ? (
          <Text
            style={{
              color: colors.muted,
              fontFamily: fonts.text,
              fontSize: fontSize.xs,
              paddingHorizontal: 2,
            }}
          >
            {timeStr}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
