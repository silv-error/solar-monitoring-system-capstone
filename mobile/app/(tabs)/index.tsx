import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  SafeAreaView,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { PieChart } from "react-native-chart-kit";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "../supabase";
import { Ionicons } from "@expo/vector-icons";

export default function SolarMonitoringApp() {
  const [hours, setHours] = useState("");
  const [currentWorkingHours, setCurrentWorkingHours] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [stats, setStats] = useState({ remaining_s: "0", mode: "Go" });
  const [modeColor, setModeColor] = useState("bg-emerald-500");

  // Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [alertType, setAlertType] = useState("warning"); // "warning" | "empty"
  const isWarning = alertType === "warning";

  // Track last shown alert type
  const lastAlertTypeRef = useRef(null); // "warning" | "empty" | null

  const handleShowModal = (type) => {
    setAlertType(type);
    setModalVisible(true);
    lastAlertTypeRef.current = type; // remember last shown modal
  };

  const handleCloseModal = () => setModalVisible(false);

  const [statsData, setStatsData] = useState([
    {
      name: "Remaining Status",
      population: 80,
      symbol: "s",
      color: "#4ADE80",
      legendFontColor: "#E2E8F0",
    },
    {
      name: "Solar Power",
      population: 5,
      symbol: "kW",
      color: "#F59E0B",
      legendFontColor: "#E2E8F0",
    },
    {
      name: "Duration",
      population: 5,
      symbol: "PM",
      color: "#6366F1",
      legendFontColor: "#E2E8F0",
    },
  ]);

  const handleSubmit = async () => {
    setSubmitted(true);
    setLoadingStats(true);

    try {
      const res = await fetch("http://192.168.100.187/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hours: Number(hours) }),
      });
      await res.json();
      setHours("");
    } catch (error) {
      console.error("Error submitting:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleReset = async () => {

    try {
      const res = await fetch("http://192.168.100.187/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hours: Number(currentWorkingHours) }),
      });
      await res.json();
      // setCurrentWorkingHours(null);
    } catch (error) {
      console.error("Error submitting:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  // Fetch stats continuously
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://192.168.100.187/status");
        const data = await res.json();

        setStats({ remaining_s: data.remaining_s, mode: data.mode });

        // Only show modal once per new alternating alert
        if (data.mode === "WARN") {
          if (lastAlertTypeRef.current !== "warning") {
            handleShowModal("warning");
          }
        } else if (data.mode === "EMPTY") {
          if (lastAlertTypeRef.current !== "empty") {
            handleShowModal("empty");
          }
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats(); // initial fetch
    const interval = setInterval(fetchStats, 2000);

    return () => clearInterval(interval);
  }, []);

  // Mode color update
  useEffect(() => {
    if (stats.mode === "Go") setModeColor("bg-emerald-500/40");
    else if (stats.mode === "WARN") setModeColor("bg-yellow-500/40");
    else setModeColor("bg-red-500/40");
  }, [stats.mode]);

  useEffect(() => {
    if(stats.remaining_s === 0) {
      setHours("");
    }
  }, [stats.remaining_s])

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) Alert.alert("Logout Error", error.message);
    } catch (error) {
      Alert.alert("Error", "Failed to logout");
    }
  };

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1 bg-slate-900">
        {/* -------- Modal -------- */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/60">
            <View className="bg-slate-900 rounded-2xl p-6 items-center border border-white/10 w-[80%] shadow-2xl shadow-black/60">
              {/* Icon */}
              <View
                className={`w-16 h-16 rounded-full items-center justify-center mb-4 ${
                  isWarning ? "bg-amber-500/20" : "bg-rose-500/20"
                }`}
              >
                <Ionicons
                  name={
                    isWarning ? "warning-outline" : "alert-circle-outline"
                  }
                  size={32}
                  color={isWarning ? "#F59E0B" : "#EF4444"}
                />
              </View>

              {/* Title */}
              <Text
                className={`text-xl font-bold mb-2 ${
                  isWarning ? "text-amber-400" : "text-rose-400"
                }`}
              >
                {isWarning ? "Warning" : "Empty Field"}
              </Text>

              {/* Message */}
              <Text className="text-center text-slate-300 text-sm mb-6 leading-5">
                {isWarning
                  ? "Please check your solar configuration before proceeding. Some parameters might be outside the safe operating range."
                  : "You left a required field empty. Please fill in all necessary details before continuing."}
              </Text>

              {/* Button */}
              <Pressable
                onPress={handleCloseModal}
                className={`px-6 py-3 rounded-xl ${
                  isWarning ? "bg-amber-500" : "bg-rose-500"
                } active:opacity-80`}
              >
                <Text className="text-white font-semibold">Got it</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* -------- MAIN CONTENT -------- */}
        <StatusBar style="light" />
        <LinearGradient
          colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0.8)"]}
          className="flex-1 p-6 justify-center"
        >
          {/* Header */}
          <View className="items-center mt-20 mb-4">
            <TouchableOpacity
              onPress={handleLogout}
              className="rounded-xl px-4 py-2 mt-4 absolute -top-16 -right-4"
            >
              <Ionicons name="log-out-outline" size={20} color="red" />
            </TouchableOpacity>
            <Text className="text-3xl font-bold text-white mb-1">
              Solar Flow
            </Text>
            <Text className="text-base text-slate-300">
              Smart Solar Energy Management
            </Text>
          </View>

          {/* Input Card */}
          <View className="bg-white/10 rounded-2xl mt-10 p-6 mb-8 backdrop-blur-sm border border-white/20 shadow-lg shadow-black/40">
            <Text className="text-xl font-semibold text-white text-center mb-4">
              Battery Duration Calculator
            </Text>
            <Text className="text-sm text-slate-300 text-center mb-6 leading-5">
              Optimize your solar system by specifying how many hours you need
              your battery to last during low sunlight periods.
            </Text>

            {/* Input */}
            <View className="mb-6">
              <TextInput
                className="bg-white/20 rounded-xl px-4 py-3 text-base text-white border border-white/10"
                placeholder="Enter hours (e.g., 12)"
                placeholderTextColor="#CBD5E1"
                keyboardType="numeric"
                value={hours}
                onChangeText={setHours}
              />
              <Text className="text-slate-400 text-xs mt-1 ml-1">
                Hours needed
              </Text>
            </View>

            {/* Button */}
            <TouchableOpacity
              className="bg-emerald-500 rounded-xl p-4 items-center active:opacity-80"
              onPress={() => {
                handleSubmit();
                setCurrentWorkingHours(hours);
              }}
              disabled={loadingStats}
            >
              <Text className="text-white font-semibold text-base">
                {loadingStats ? "Calculating..." : "Calculate Recommendation"}
              </Text>
            </TouchableOpacity>

            {/* Result */}
            {submitted && (
              <View className="mt-6 bg-emerald-500/20 rounded-xl p-4 border border-emerald-500/30">
                <Text className="text-white text-sm text-center">
                  Configuring system for {currentWorkingHours} hours of backup power. Battery
                  capacity will be optimized accordingly.
                </Text>
              </View>
            )}
          </View>

          {/* Stats */}
          {loadingStats ? (
            <View className="bg-white/10 rounded-xl p-6 items-center justify-center h-[120px]">
              <ActivityIndicator size="large" color="#4ADE80" />
              <Text className="text-emerald-500 font-medium mt-2">
                Analyzing solar performance...
              </Text>
            </View>
          ) : (
            <View>
              <View className="flex-row justify-between">
                <View className="bg-white/10 rounded-xl p-3 flex-1 mr-2 items-center border border-white/20">
                  <Text className="text-xl font-bold text-white">
                    {stats.remaining_s}s
                  </Text>
                  <Text className="text-slate-300 text-xs">
                    Remaining Time
                  </Text>
                </View>

                <View
                  className={`${modeColor} rounded-xl p-3 flex-1 mr-2 items-center border border-white/20`}
                >
                  <Text className="text-lg font-bold text-white">
                    {stats.mode === "Go" ? "Healthy" : stats.mode === "WARN" ? "System Alert" : "Battery Depleted"}
                  </Text>
                  <Text className="text-slate-300 text-xs">Mode</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleReset}
                className="bg-blue-500 rounded-xl p-4 items-center mt-4 active:opacity-80"
              >
                <Text className="text-white font-semibold text-base">
                  Reset System
                </Text>
              </TouchableOpacity>

              <View className="bg-white/10 mt-8 rounded-2xl p-4 border border-white/20">
                <Text className="text-white font-medium text-center mb-3">
                  Energy Distribution
                </Text>
                <PieChart
                  data={statsData}
                  width={Dimensions.get("window").width - 40}
                  height={150}
                  chartConfig={{
                    color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
                    labelColor: (opacity = 1) =>
                      `rgba(255,255,255,${opacity})`,
                  }}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                />
              </View>
            </View>
          )}

          {/* Footer */}
          <Text
            className="text-slate-500 text-xs text-center mt-8"
            style={{ paddingBottom: insets.bottom + 50 }}
          >
            © 2023 Solar Flow - Real-time Solar Analytics
          </Text>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}
