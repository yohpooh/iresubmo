import { colors } from "@/constants/theme";
import { useClerk, useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import { styled, useColorScheme } from "nativewind";
import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);
const StyledView = styled(View);
const StyledPressable = styled(Pressable);
const StyledText = styled(Text);

const Settings = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const { signOut } = useClerk();
  const { user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut();
      router.replace("/(auth)/sign-in");
    } catch (err) {
      console.error("Sign out error:", err);
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-light-background dark:bg-dark-background p-5">
      <StyledView className="flex-1 gap-6">
        <View className="gap-2">
          <StyledText className="text-2xl font-sans-bold text-light-primary-text dark:text-dark-primary-text">
            Settings
          </StyledText>
          <StyledText className="text-sm font-sans-medium text-light-secondary-text dark:text-dark-secondary-text">
            Manage your account and preferences
          </StyledText>
        </View>

        <View className="gap-4">
          <View className="rounded-lg bg-light-secondary-surface dark:bg-dark-secondary-surface p-4 gap-3">
            <StyledText className="text-xs font-sans-semibold uppercase tracking-wide text-light-secondary-text dark:text-dark-secondary-text">
              Account
            </StyledText>
            <View className="gap-2">
              <StyledText className="text-sm font-sans-medium text-light-secondary-text dark:text-dark-secondary-text">
                Email
              </StyledText>
              <StyledText className="text-base font-sans-semibold text-light-primary-text dark:text-dark-primary-text">
                {user?.emailAddresses[0]?.emailAddress || "Not set"}
              </StyledText>
            </View>
          </View>

          <StyledPressable
            className="px-4 py-3 rounded-lg border border-light-border dark:border-dark-border items-center flex-row justify-center gap-2"
            onPress={toggleColorScheme}
            disabled={isLoading}
          >
            <StyledText className="font-sans-semibold text-light-primary-text dark:text-dark-primary-text">
              {colorScheme === "light" ? "🌙" : "☀️"} Toggle Theme
            </StyledText>
          </StyledPressable>
        </View>

        <StyledPressable
          className="px-4 py-4 rounded-lg bg-light-error dark:bg-dark-error items-center justify-center"
          onPress={handleSignOut}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.lightButtonText} size="small" />
          ) : (
            <StyledText className="text-base font-sans-bold text-light-button-text dark:text-dark-button-text">
              Sign Out
            </StyledText>
          )}
        </StyledPressable>
      </StyledView>
    </SafeAreaView>
  );
};

export default Settings;
