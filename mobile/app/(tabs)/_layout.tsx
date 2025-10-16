import React from "react";
import { Redirect, Tabs } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TabsLayout = () => {
  const isSignedIn = false;
  const insets = useSafeAreaInsets();

  // * IF USER IS NOT SIGNED IN, REDIRECT TO AUTH
  // if (!isSignedIn) {
  //   return <Redirect href={"/(auth)"} />;
  // }

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
            tabBarActiveTintColor: "#4ADE80",
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
