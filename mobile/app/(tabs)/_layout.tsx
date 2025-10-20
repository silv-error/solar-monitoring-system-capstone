import React, { useEffect, useState } from "react";
import { Redirect, Tabs } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import { View, Text, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "../supabase";
import { Session } from "@supabase/supabase-js";

const TabsLayout = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show loading indicator while checking auth state
  if (loading) {
    return (
      <View className="flex-1 bg-slate-900 justify-center items-center">
        <ActivityIndicator size="large" color="#4ADE80" />
        <Text className="text-white mt-4">Loading...</Text>
      </View>
    );
  }

  // If user is not signed in, redirect to auth
  if (!session) {
    return <Redirect href={"/(auth)"} />;
  }

  return (
    <LinearGradient colors={["rgba(0,0,0,0.8)", "rgba(0,0,0,0.4)"]} className="flex-1">
      <View className="flex-1">
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: "#1F2937",
              borderTopWidth: 0,
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: 4,
              borderRadius: 20,
              paddingVertical: 10,
              paddingHorizontal: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.3,
              shadowRadius: 6,
              height: insets.bottom + 50,
            },
            tabBarActiveTintColor: "#9ACD32",
            tabBarInactiveTintColor: "#ffffff",
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Home",
              tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="report"
            options={{
              title: "Reports",
              tabBarIcon: ({ color }) => <Ionicons size={24} name="bar-chart" color={color} />,
            }}
          />
        </Tabs>
      </View>
    </LinearGradient>
  );
};

export default TabsLayout;