import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

export default function SolarMonitoringApp() {
  const [hours, setHours] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [statsData, setStatsData] = useState({
    batteryCharge: "80%",
    solarCapacity: "5kW",
    rechargeTime: "5 AM",
  });

  const handleSubmit = () => {
    setSubmitted(true);
    setLoadingStats(true);

    setTimeout(() => {
      setLoadingStats(false);
    }, 3000);
  };

  return (
    <View className="flex-1 bg-slate-900">
      <StatusBar style="light" />

      {/* Background Image */}
      <View className="absolute inset-0 bg-slate-800 overflow-hidden">
        <View className="flex-1 bg-[url('https://placehold.co/800x1600')] bg-cover opacity-30" />
      </View>

      <LinearGradient colors={["rgba(0,0,0,0.8)", "rgba(0,0,0,0.4)"]} className="flex-1 p-6 justify-center">
        {/* Header */}
        <View className="items-center mb-8">
          <Text className="text-3xl font-bold text-white mb-1">SolarSync</Text>
          <Text className="text-base text-slate-300">Smart Solar Energy Management</Text>
        </View>

        {/* Card */}
        <View className="bg-white/10 rounded-2xl p-6 mb-8 backdrop-blur-sm border border-white/20 shadow-lg shadow-black/40">
          <Text className="text-xl font-semibold text-white text-center mb-4">Battery Duration Calculator</Text>

          <Text className="text-sm text-slate-300 text-center mb-6 leading-5">
            Optimize your solar system by specifying how many hours you need your battery to last during low sunlight
            periods.
          </Text>

          {/* Input Field */}
          <View className="mb-6">
            <TextInput
              className="bg-white/20 rounded-xl px-4 py-3 text-base placeholder:text-slate-400"
              placeholder="Enter hours (e.g., 12)"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
              value={hours}
              onChangeText={setHours}
            />
            <Text className="text-slate-400 text-xs mt-1 ml-1">Hours needed</Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            className="bg-emerald-500 rounded-xl p-4 items-center active:opacity-80"
            onPress={handleSubmit}
            disabled={loadingStats}
          >
            <Text className="text-white font-semibold text-base">
              {loadingStats ? "Calculating..." : "Calculate Recommendation"}
            </Text>
          </TouchableOpacity>

          {/* Results */}
          {submitted && (
            <View className="mt-6 bg-emerald-500/20 rounded-xl p-4 border border-emerald-500/30">
              <Text className="text-white text-sm text-center">
                Configuring system for {hours} hours of backup power. Battery capacity will be optimized accordingly.
              </Text>
            </View>
          )}
        </View>

        {/* Stats Panel */}
        {loadingStats ? (
          <View className="bg-white/10 rounded-xl p-6 items-center justify-center h-[120px]">
            <ActivityIndicator size="large" color="#4ADE80" className="mb-3" />
            <Text className="text-emerald-500 font-medium">Analyzing solar performance...</Text>
          </View>
        ) : (
          <View className="flex-row justify-between">
            <View className="bg-white/10 rounded-xl p-3 flex-1 mr-2 items-center border border-white/20">
              <Text className="text-xl font-bold text-white">{statsData.batteryCharge}</Text>
              <Text className="text-slate-300 text-xs">Battery Charge</Text>
            </View>

            <View className="bg-white/10 rounded-xl p-3 flex-1 mx-2 items-center border border-white/20">
              <Text className="text-xl font-bold text-white">{statsData.solarCapacity}</Text>
              <Text className="text-slate-300 text-xs">Solar Capacity</Text>
            </View>

            <View className="bg-white/10 rounded-xl p-3 flex-1 ml-2 items-center border border-white/20">
              <Text className="text-xl font-bold text-white">{statsData.rechargeTime}</Text>
              <Text className="text-slate-300 text-xs text-center">Estimated Recharge</Text>
            </View>
          </View>
        )}

        {/* Footer */}
        <Text className="text-slate-500 text-xs text-center mt-8">© 2023 SolarSync - Real-time Solar Analytics</Text>
      </LinearGradient>
    </View>
  );
}
