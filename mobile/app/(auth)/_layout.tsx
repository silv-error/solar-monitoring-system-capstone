import { View, Text } from "react-native";
import React from "react";
import { Redirect, Stack } from "expo-router";

const AuthLayout = () => {
  const isSignedIn = true;

  // * IF USER IS SIGNED IN, REDIRECT TO TABS
  // if (!isSignedIn) {
  //   return <Redirect href={"/(tabs)"} />;
  // }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
};

export default AuthLayout;
