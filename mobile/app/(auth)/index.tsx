import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = () => {
    Alert.alert("Login Info", `Email: ${email}\nPassword: ${password}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <LinearGradient colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0.8)"]} className="flex-1 justify-center p-6">
          <TouchableOpacity
            className="absolute top-20 left-6 bg-white/10 p-2 rounded-full border border-white/20"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color="white" />
          </TouchableOpacity>

          {/* Header */}
          <View className="items-center mb-10">
            <Text className="text-4xl font-bold text-white">Solar Flow</Text>
            <Text className="text-base text-slate-300">Login to manage your energy</Text>
          </View>

          {/* Card */}
          <View className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20 shadow-lg shadow-black/40">
            <Text className="text-xl font-semibold text-white text-center mb-6">Welcome Back</Text>

            {/* Email Input */}
            <View className="mb-4">
              <Text className="text-slate-400 text-xs mt-1 ml-1">Email Address</Text>
              <TextInput
                className="bg-white/20 rounded-xl px-4 py-3 text-base text-white"
                placeholder="e.g., johndoe@gmail.com"
                placeholderTextColor="#CBD5E1"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <Text className="text-slate-400 text-xs mt-1 ml-1">Password</Text>
              <TextInput
                className="bg-white/20 rounded-xl px-4 py-3 text-base text-white"
                placeholder="Enter your password"
                placeholderTextColor="#CBD5E1"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {/* Login Button */}
            <TouchableOpacity
              className="bg-emerald-500 rounded-xl p-4 items-center active:opacity-80"
              onPress={handleLogin}
            >
              <Text className="text-white font-semibold text-base">Login</Text>
            </TouchableOpacity>

            {/* Footer / Branding */}
            <Text className="text-slate-500 text-xs text-center mt-8">
              © 2023 SolarSync - Smart Solar Energy Management
            </Text>
          </View>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginForm;
