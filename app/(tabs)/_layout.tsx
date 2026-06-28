import { tabs } from "@/constants/data";
import { colors, components } from "@/constants/theme";
import { SubscriptionsProvider } from "@/context/SubscriptionsContext";
import { useAuth } from "@clerk/expo";
import clsx from "clsx";
import { Redirect, Tabs } from "expo-router";
import { useColorScheme } from "nativewind";
import { Image, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const tabBar = components.tabBar;

const TabLayout = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  const TabIcon = ({ focused, icon }: TabIconProps) => {
    return (
      <View className="tabs-icon bg-light-surface dark:bg-dark-surface">
        <View className={clsx("tabs-pill", focused && "tabs-active")}>
          <Image
            source={icon}
            className="tabs-glyph"
            tintColor={
              focused
                ? colorScheme === "light"
                  ? colors.lightSurface
                  : colors.darkSurface
                : colorScheme === "light"
                  ? colors.lightIcon
                  : colors.darkIcon
            }
          />
        </View>
      </View>
    );
  };

  return (
    <SubscriptionsProvider>
    <Tabs
      backBehavior="history"
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: Math.max(insets.bottom, tabBar.horizontalInset),
          height: tabBar.height,
          marginHorizontal: tabBar.horizontalInset,
          borderRadius: tabBar.radius,
          backgroundColor:
            colorScheme === "light" ? colors.lightSurface : colors.darkSurface,
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarItemStyle: {
          paddingVertical: tabBar.height / 2 - tabBar.iconFrame / 1.6,
        },
        tabBarIconStyle: {
          width: tabBar.iconFrame,
          height: tabBar.iconFrame,
          alignItems: "center",
        },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={tab.icon} />
            ),
          }}
        />
      ))}
    </Tabs>
    </SubscriptionsProvider>
  );
};

export default TabLayout;
