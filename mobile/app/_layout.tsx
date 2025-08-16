import { Stack } from "expo-router";
import "@/global.css";
import { StatusBar } from "react-native";
import { useEffect } from "react";

export default function RootLayout() {
  StatusBar.setHidden(true);
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home", headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ title: "Authentication" }} />
      <Stack.Screen name="(tabs)" options={{ title: "Tabs", headerShown: false }} />
    </Stack>
  );
}
