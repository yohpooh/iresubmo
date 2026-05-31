import { styled, useColorScheme } from "nativewind";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <SafeAreaView className="flex-1 bg-light-background dark:bg-dark-background p-5">
      <View className="flex justify-center items-center">
        <Text className="text-lg font-bold text-light-primary-text dark:text-dark-primary-text">
          Settings
        </Text>
        <TouchableOpacity
          className="mt-4 px-4 py-2 bg-blue-500 rounded"
          onPress={toggleColorScheme}
        >
          <Text className="text-white">Change Theme</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
