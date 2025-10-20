import React, { useEffect, useState, useRef, use } from "react";
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
  Animated,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { PieChart } from "react-native-chart-kit";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "../supabase";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function SolarMonitoringApp() {
  const [hours, setHours] = useState("");
  const [currentWorkingHours, setCurrentWorkingHours] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [stats, setStats] = useState({ remaining_s: "0", mode: "IDLE", remaining_percent: 0});
  const [modeColor, setModeColor] = useState("bg-lime-500");

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

  const tempFeedback = async () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
    }, 5000)
  }

  const handleSubmit = async () => {
    tempFeedback()
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
    tempFeedback()
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

        console.log(data)
        setStats({ remaining_s: data.remaining_s, mode: data.mode, remaining_percent: data.remaining_percent });

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

  const [solarKw, setSolarKw] = useState(0);
  const [maxKw, setMaxKw] = useState(0);
  useEffect(() => {
    const useFetchSolar = async () => {
      try {
        const res = await fetch("http://192.168.100.187/solar")
        const data = await res.json();
        console.log("kW Data:", data)
        setSolarKw(data.start_w);
        setMaxKw(data.value_w);
      } catch (error) {
        console.error("Error fetching kW stats:", error);
      }
    }
    setInterval(() => {
      useFetchSolar();
    }, 2000)
  }, [])

  // Mode color update
  useEffect(() => {
    if (stats.mode === "GO" || stats.mode === "IDLE") setModeColor("bg-lime-500/40");
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
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let pulse: any;

    if (modalVisible) {
      pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.3,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
    }

    return () => {
      if (pulse) pulse.stop();
    };
  }, [modalVisible]);

  // 1️⃣ Create the animated value once
const animatedWidth = useRef(new Animated.Value(0)).current;

  // Animate solar bar width — matches solarKw max, shrinks based on remaining_percent
  useEffect(() => {
    if (typeof solarKw === "number" && typeof stats.remaining_percent === "number") {
      // 1️⃣ Normalize solar output (solarKw = 100%)
      const maxOutputPercent = Math.min((solarKw / 400) * 100, 100);

      // 2️⃣ Shrink proportionally to remaining battery
      const adjustedPercent = (maxOutputPercent * stats.remaining_percent) / 100;

      // 3️⃣ Smooth animation
      Animated.timing(animatedWidth, {
        toValue: adjustedPercent,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }).start();
    }
  }, [solarKw, stats.remaining_percent]);


  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1 bg-black">
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
                <Animated.View style={{ transform: [{ scale }] }}>
      <Ionicons
        name={isWarning ? "warning-outline" : "alert-circle-outline"}
        size={40}
        color={isWarning ? "#F59E0B" : "#EF4444"}
      />
    </Animated.View>
              </View>

              {/* Title */}
              <Text
                className={`text-xl font-bold mb-2 ${
                  isWarning ? "text-amber-400" : "text-rose-400"
                }`}
              >
                {isWarning ? "Warning" : "Low Battery"}
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

        <Modal
  animationType="fade"
  transparent={true}
  visible={stats.mode === "EMERGENCY"}
  onRequestClose={() => setModalVisible(false)}
>
  <View className="flex-1 justify-center items-center bg-black/80">
    <View className="bg-red-900 rounded-3xl p-8 items-center border-2 border-red-600 w-[85%] shadow-2xl shadow-red-900/70">
      {/* Emergency Icon with pulse */}
      <Animated.View
        style={{ transform: [{ scale }], marginBottom: 20 }}
      >
        <Ionicons
          name="alert-circle"
          size={60}
          color="#FF4C4C"
        />
      </Animated.View>

      {/* Title */}
      <Text className="text-2xl font-extrabold text-red-400 mb-4 text-center">
        EMERGENCY
      </Text>

      {/* Message */}
      <Text className="text-center text-red-200 text-base mb-8 leading-relaxed font-semibold">
        Critical solar energy drop detected.{"\n"}
        Please take immediate action!
      </Text>

      {/* Action Button */}
      <Pressable
        onPress={() => {}}
        className="bg-red-600 px-8 py-3 rounded-full active:opacity-80"
      >
        <Text className="text-white font-bold text-lg">Understood</Text>
      </Pressable>
    </View>
  </View>
</Modal>


        {/* -------- MAIN CONTENT -------- */}
        <StatusBar style="light" />
        <LinearGradient
          colors={["rgba(0,0,0,0.9)","rgba(0,0,0,0.9)",`${stats.mode === "GO" ? "rgba(34,197,94,0.6)" : stats.mode === "IDLE" ? "rgba(34,197,94,0.6)" : stats.mode === "WARN" ? "rgba(234,179,8,0.6)" : "rgba(239,68,68,0.6)"  }`]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1.4 }}
          className="flex-1 h-screen p-6 justify-center"
        >
          {/* Header */}
          <View className="items-left pt-10 mt-20">
            <TouchableOpacity
              onPress={handleLogout}
              className="rounded-xl px-4 py-2 mt-4 absolute -top-16 -right-4"
            >
              <Ionicons name="log-out-outline" size={20} color="red" />
            </TouchableOpacity>
            <Text className="text-4xl font-bold text-white">
              Good Morning!
            </Text>
            <Text className="text-base text-slate-300">
              Manage your solar energy wisely
            </Text>
          </View>

          {/* Input Card */}
          <View className="bg-white/15 rounded-2xl mt-20 p-6 mb-8 backdrop-blur-sm border border-white/20 shadow-lg shadow-black/40">
            <Text className="text-2xl font-semibold text-white text-center mb-4">
              Battery Duration Calculator
            </Text>
            <Text className="text-xs text-slate-300 text-center pb-2 mb-6 leading-5">
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

            <View className="flex-row items-center gap-3 w-full">
              {/* Button */}
            <TouchableOpacity
              className="bg-lime-600 w-10/12 justify-center rounded-xl p-4 items-center flex-row active:opacity-80"
              onPress={() => {
                handleSubmit();
                setCurrentWorkingHours(hours);
              }}
              disabled={loadingStats}
            >
              <Text className="text-white text-center font-semibold text-base">
                {loadingStats ? "Calculating..." : "Calculate"}
              </Text>
              {/* Floating Reset Button */}
            </TouchableOpacity>
            <TouchableOpacity
                onPress={handleReset}
                className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center "
              >
                <MaterialCommunityIcons name="restart" size={20} color="white" />
              </TouchableOpacity>
            </View>

            {/* Result */}
            {submitted && (
              <View className="mt-6 bg-lime-500/20 rounded-xl p-4 border border-lime-500/30">
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
              <Text className="text-lime-500 font-medium mt-2">
                Analyzing solar performance...
              </Text>
            </View>
          ) : (
            <View className="mb-8">
              <View className="flex-row justify-between">
                <View className="bg-white/10 rounded-xl p-3 flex-1 mr-2 items-center border border-white/20">
                  <Text className="text-xl font-bold text-white">
                    {stats.remaining_s}s
                  </Text>
                  <Text className="text-slate-300 text-xs">
                    Remaining Time
                  </Text>
                </View>

                <View className="bg-white/10 rounded-xl p-3 flex-1 mr-2 items-center border border-white/20">
                  <Text className="text-xl font-bold text-white">
                    {stats.remaining_percent === 0 ? "10" : stats.remaining_percent }%
                  </Text>
                  <Text className="text-slate-300 text-xs">
                    Battery
                  </Text>
                </View>

                <View
                  className={`${modeColor} rounded-xl p-3 flex-1 mr-2 items-center border border-white/20`}
                >
                  <Text className="text-sm text-center font-bold text-white">
                    {stats.mode === "GO" || stats.mode === "IDLE`" ? "Healthy" : stats.mode === "WARN" ? "System Alert" : "Low"}
                  </Text>
                  <Text className="text-slate-300 text-xs">Mode</Text>
                </View>
              </View>
            </View>
          )}

          {/* Solar Power Output Bar */}
          <View className="bg-white/10 mb-8 rounded-xl p-4 border border-white/20">
            <Text className="text-white text-sm mb-2 font-semibold">
              Solar Power Output
            </Text>

            {/* Power Bar */}
            <View className="h-4 w-full bg-white/10 rounded-full overflow-hidden">
              <Animated.View
                style={{
                  width: animatedWidth.interpolate({
                    inputRange: [0, 100],
                    outputRange: ["0%", "100%"],
                  }),
                  backgroundColor:
                    stats.mode === "GO" || stats.mode === "IDLE"
                      ? "#9ACD32" // Green: Optimal power flow
                      : stats.mode === "WARN"
                      ? "#EAB308" // Yellow: Unstable
                      : "#EF4444", // Red: Low / Empty
                }}
                className="h-full rounded-full"
              />
            </View>

            {/* Value & Description */}
            <View className="flex-row justify-between mt-2">
              <Text className="text-slate-300 text-xs">
                {/* {(solarKw / 1000).toFixed(2)} kW */}
                {maxKw} kW
              </Text>
              <Text
                className={`text-xs font-semibold ${
                  stats.mode === "GO" || stats.mode === "IDLE"
                    ? "text-lime-400"
                    : stats.mode === "WARN"
                    ? "text-amber-400"
                    : "text-rose-400"
                }`}
              >
                {stats.mode === "GO" || stats.mode === "IDLE"
                  ? "Optimal"
                  : stats.mode === "WARN"
                  ? "Fluctuating"
                  : "Low Power"}
              </Text>
            </View>
          </View>

          {/* Footer */}
          <Text
            className="text-slate-500 text-xs text-center"
            style={{ paddingBottom: insets.bottom + 50 }}
          >
            © 2023 Solar Flow - Real-time Solar Analytics
          </Text>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}