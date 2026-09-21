import React from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import FeatherIcon from "@react-native-vector-icons/feather";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { fonts, fontSize, makeStyles, radius, spacing, useTheme } from "@/src/theme";
import { STORIES } from "@/src/data/mock";
import { Avatar, Chip, IconButton, ScreenHeading } from "@/src/components/ui";

const { width: SCREEN_W } = Dimensions.get("window");

const useStyles = makeStyles((colors) => ({
  root: { flex: 1, backgroundColor: colors.surface },
  card: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: radius.lg,
    overflow: "hidden",
    height: 480,
    backgroundColor: colors.surfaceSecondary,
  },
  cardImage: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0 },
  cardScrim: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0 },
  cardTop: {
    position: "absolute",
    top: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  authorName: {
    color: "#FFFFFF",
    fontFamily: fonts.textMedium,
    fontSize: fontSize.base,
  },
  location: {
    color: "rgba(255,255,255,0.7)",
    fontFamily: fonts.text,
    fontSize: fontSize.xs,
  },
  cardBottom: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg,
    gap: spacing.md,
  },
  storyTitle: {
    color: "#FFFFFF",
    fontFamily: fonts.display,
    fontSize: 30,
    letterSpacing: -0.6,
    lineHeight: 34,
  },
  reflection: {
    color: "rgba(255,255,255,0.82)",
    fontFamily: fonts.text,
    fontSize: fontSize.base,
    lineHeight: 22,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionText: {
    color: "#FFFFFF",
    fontFamily: fonts.text,
    fontSize: fontSize.sm,
  },
}));

export default function StoriesScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const tabBarHeight = 68 + insets.bottom;

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + spacing.md,
          paddingBottom: tabBarHeight + spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
        testID="stories-scroll"
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "space-between",
            paddingHorizontal: spacing.lg,
            marginBottom: spacing.lg,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: colors.brandPrimary,
                fontFamily: fonts.textMedium,
                fontSize: fontSize.xs,
                letterSpacing: 2.2,
                textTransform: "uppercase",
              }}
            >
              Stories
            </Text>
            <Text
              style={{
                color: colors.onSurface,
                fontFamily: fonts.display,
                fontSize: fontSize.display,
                letterSpacing: -1,
                marginTop: 4,
              }}
            >
              From the trail
            </Text>
          </View>
          <IconButton name="plus" testID="stories-new-button" />
        </View>

        {STORIES.map((s) => (
          <View key={s.id} style={styles.card} testID={`story-${s.id}`}>
            <Image source={{ uri: s.image }} style={styles.cardImage} contentFit="cover" />
            <LinearGradient
              colors={[
                "rgba(10,10,10,0.55)",
                "rgba(10,10,10,0.15)",
                "rgba(10,10,10,0.95)",
              ]}
              locations={[0, 0.35, 1]}
              style={styles.cardScrim}
            />

            <View style={styles.cardTop}>
              <View style={styles.authorRow}>
                <Avatar uri={s.avatar} size={40} />
                <View>
                  <Text style={styles.authorName}>{s.author}</Text>
                  <Text style={styles.location}>{s.location}</Text>
                </View>
              </View>
              <FeatherIcon name="more-horizontal" size={22} color="#FFFFFF" />
            </View>

            <View style={styles.cardBottom}>
              <View style={{ flexDirection: "row", gap: spacing.sm }}>
                <Chip label={s.activityChip} variant="brand" />
              </View>
              <Text style={styles.storyTitle}>{s.title}</Text>
              <Text style={styles.reflection} numberOfLines={2}>
                {s.reflection}
              </Text>
              <View style={styles.actionsRow}>
                <View style={styles.actionItem}>
                  <FeatherIcon name="award" size={16} color={colors.brandPrimary} />
                  <Text style={styles.actionText}>Applaud</Text>
                </View>
                <View style={styles.actionItem}>
                  <FeatherIcon name="message-circle" size={16} color="#FFFFFF" />
                  <Text style={styles.actionText}>Reflect</Text>
                </View>
                <View style={styles.actionItem}>
                  <FeatherIcon name="share-2" size={16} color="#FFFFFF" />
                  <Text style={styles.actionText}>Share</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
