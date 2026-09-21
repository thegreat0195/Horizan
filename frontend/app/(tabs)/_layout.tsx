import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Tabs } from "expo-router";
import { BlurView } from "expo-blur";
import FeatherIcon from "@react-native-vector-icons/feather";

import { useTheme } from "@/src/theme";

const TAB_ICONS: Record<string, string> = {
  index: "home",
  move: "play-circle",
  explore: "compass",
  stories: "book-open",
  connect: "users",
};

const TAB_TITLES: Record<string, string> = {
  index: "Home",
  move: "Move",
  explore: "Explore",
  stories: "Stories",
  connect: "Connect",
};

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.brandPrimary,
        tabBarInactiveTintColor: colors.muted,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontFamily: "Geist-Medium",
          fontSize: 10,
          letterSpacing: 0.5,
          marginTop: 2,
        },
        tabBarItemStyle: { alignSelf: "center", paddingTop: 8 },
        tabBarStyle: {
          position: "absolute",
          borderTopWidth: 0.5,
          borderTopColor: colors.divider,
          backgroundColor:
            Platform.OS === "web" ? colors.surface : "rgba(10,10,10,0.85)",
          elevation: 0,
          ...(Platform.OS === "web" ? { height: 68 } : {}),
        },
        tabBarBackground:
          Platform.OS === "web"
            ? undefined
            : () => (
                <BlurView
                  intensity={40}
                  tint="dark"
                  style={StyleSheet.absoluteFill}
                />
              ),
        tabBarIcon: ({ color, focused }) => (
          <View
            style={{
              width: 44,
              height: 30,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FeatherIcon
              name={TAB_ICONS[route.name] as any}
              size={22}
              color={color}
            />
            {focused ? (
              <View
                style={{
                  position: "absolute",
                  bottom: -6,
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: colors.brandPrimary,
                }}
              />
            ) : null}
          </View>
        ),
        tabBarAccessibilityLabel: TAB_TITLES[route.name],
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="move" options={{ title: "Move" }} />
      <Tabs.Screen name="explore" options={{ title: "Explore" }} />
      <Tabs.Screen name="stories" options={{ title: "Stories" }} />
      <Tabs.Screen name="connect" options={{ title: "Connect" }} />
    </Tabs>
  );
}
