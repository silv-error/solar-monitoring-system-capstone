import { View, Text } from "react-native";
import React from "react";
import { Redirect, Stack } from "expo-router";

const AuthLayout = () => {
  const isSignedIn = false;

  if (!isSignedIn) {
    return <Redirect href={"/(tabs)"} />;
  }

  return <Stack />;
};

export default AuthLayout;
