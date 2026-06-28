import { icons } from "@/constants/icons";
import { useAuth } from "@clerk/expo";
import { Redirect, useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { height } = Dimensions.get("window");

export default function Onboarding() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  if (!isLoaded) return null;

  if (isSignedIn) return <Redirect href="/(tabs)" />;

  return (
    <View style={{ flex: 1, backgroundColor: "#2563eb" }}>
      <StatusBar barStyle="light-content" backgroundColor="#2563eb" />

      {/* Blue hero section */}
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 32,
        }}
      >
        <Image
          source={icons.appLogo}
          style={{ width: 120, height: 120 }}
          resizeMode="contain"
        />
      </View>

      {/* White bottom card */}
      <SafeAreaView
        edges={["bottom"]}
        style={{
          backgroundColor: "#f8fafc",
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          paddingHorizontal: 28,
          paddingTop: 36,
          paddingBottom: 16,
          minHeight: height * 0.36,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontFamily: "sans-bold",
            color: "#0f172a",
            lineHeight: 36,
            marginBottom: 10,
          }}
        >
          Achieve a clear understanding of your subscriptions.
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "sans-medium",
            color: "#475569",
            marginBottom: 32,
          }}
        >
          Manage, analyze, and cancel in just a few steps
        </Text>

        <Pressable
          onPress={() => router.replace("/(auth)/sign-in")}
          style={({ pressed }) => ({
            backgroundColor: pressed ? "#1d4ed8" : "#2563eb",
            borderRadius: 100,
            paddingVertical: 16,
            alignItems: "center",
          })}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: "sans-bold",
              color: "#ffffff",
            }}
          >
            Get Started
          </Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}
