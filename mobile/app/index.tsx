import { Button, ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // or from 'react-native-linear-gradient'
import { images } from "@/constants/images"; // Ensure this path is correct
import { useRouter } from "expo-router";

export default function Index() {
  const route = useRouter();

  return (
    <View className="flex-1 h-screen relative">
      <ImageBackground source={images.solarBg} className="h-full justify-end">
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.6)", "rgba(0,0,0,0.9)"]}
          style={{ height: 500, width: "100%", position: "absolute", bottom: 0 }}
        />

        <View className="p-4 z-10 gap-2">
          {/* HEADER AND DESCRIPTION */}
          <Text className="text-4xl text-white">
            Powering <Text className="font-bold">Tomorrow</Text> With
            <Text className="font-bold text-emerald-500"> Sunlight</Text>
          </Text>
          <Text className="text-slate-300">
            Elevate your solar experience with real-time data, smart controls, and seamless integration.
          </Text>

          {/* BUTTON */}
          <View className="my-12">
            <TouchableOpacity
              onPress={() => route.push("/(tabs)")}
              className="bg-emerald-500 p-4 rounded-xl active:opacity-80"
            >
              <Text className="text-white text-center text-lg font-semibold">Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}
