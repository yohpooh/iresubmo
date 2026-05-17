import "@/global.css";
import { Link } from "expo-router";
import { styled, useColorScheme } from "nativewind";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  console.log("Current theme:", colorScheme);

  return (
    <SafeAreaView className="flex-1 bg-light-background dark:bg-dark-background">
      <View>
        <Text className="text-xl font-bold text-blue-500">
          Welcome to Nativewind!
        </Text>
        <Text className="text-xl font-bold text-blue-500">
          Welcome to Nativewind!
        </Text>
        <Link href="/onboarding" className="mt-4 text-lg text-blue-500 p-4">
          Go to Onboarding
        </Link>
        <Link href="/(auth)/sign-in" className="mt-4 text-lg text-blue-500 p-4">
          Go to Sign In
        </Link>
        <Link href="/(auth)/sign-up" className="mt-4 text-lg text-blue-500 p-4">
          Go to Sign Up
        </Link>

        <Link href="/subscriptions/spotify">Spotify Subs</Link>

        <TouchableOpacity>
          <Text
            className="mt-4 text-lg text-blue-500 p-4"
            onPress={toggleColorScheme}
          >
            Theme
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
