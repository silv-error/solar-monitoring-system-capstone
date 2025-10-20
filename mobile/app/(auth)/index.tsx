import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../supabase";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (error) {
        Alert.alert("Login Failed", error.message);
        return;
      }

      if (data.user) {
        // Navigate to the dashboard in tabs folder
        navigation.navigate('(tabs)' as never);
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address first");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Success", "Password reset instructions sent to your email!");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={['top']}>
      <StatusBar style="light" />
      
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <LinearGradient colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0.8)"]} className="flex-1 justify-center p-6">
          {/*  */}

          {/* Header */}
          <View className="items-left mb-10">
            <Text className="text-5xl font-bold pb-4 text-white">SolarFlow</Text>
            <Text className="text-base text-slate-300">Login to manage your energy</Text>
          </View>

          {/* Card */}
          <View className="mt-6 backdrop-blur-sm shadow-lg shadow-black/40">
            {/* <Text className="text-xl font-semibold text-white text-center mb-6">Welcome Back</Text> */}

            {/* Email Input */}
            <View className="mb-4">
              <Text className="text-slate-400 text-xs pb-2 ml-1">Email Address</Text>
              <TextInput
                className="bg-white/20 rounded-xl px-4 py-4 mb-4 text-sm text-white border border-white/10"
                placeholder="e.g., johndoe@gmail.com"
                placeholderTextColor="#CBD5E1"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
              />
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <Text className="text-slate-400 text-xs mb-1 ml-1">Password</Text>
              <TextInput
                className="bg-white/20 rounded-xl px-4 py-3 mb-4 text-sm text-white border border-white/10"
                placeholder="Enter your password"
                placeholderTextColor="#CBD5E1"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>

            {/* Login Button */}
            <TouchableOpacity
              className="bg-lime-600 rounded-xl p-3 items-center active:opacity-80 mb-4"
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold text-xl">LOGIN</Text>
              )}
            </TouchableOpacity>



              
            {/* Admin Note */}
            <View className="mt-6 p-3 ">
              <Text className="text-slate-400 text-xs text-center">
                Don't have an account? Contact administrator for access.
              </Text>
            </View>

            {/* Footer / Branding */}
           
          </View>
           <Text className="text-slate-500 pt-4 text-xs text-center mt-8">
              © 2023 SolarSync - Smart Solar Energy Management
            </Text>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginForm;