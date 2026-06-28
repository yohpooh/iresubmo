import SubscriptionCard from "@/components/SubscriptionCard";
import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import { useSubscriptions } from "@/context/SubscriptionsContext";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { styled, useColorScheme } from "nativewind";
import { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Subscriptions = () => {
  const { colorScheme } = useColorScheme();
  const { subscriptions } = useSubscriptions();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const navigation = useNavigation();
  const router = useRouter();

  const iconTint =
    colorScheme === "dark" ? colors.darkPrimaryText : colors.lightPrimaryText;

  const filtered = subscriptions.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.category?.toLowerCase().includes(q) ||
      s.plan?.toLowerCase().includes(q)
    );
  });

  return (
    <SafeAreaView className="flex-1 bg-light-background dark:bg-dark-background">
      <View className="px-5">
        <View className="home-header pt-2">
          <Pressable
            className="home-add-icon-container"
            onPress={() => navigation.goBack()}
          >
            <Image
              source={icons.back}
              className="home-add-icon"
              style={{ tintColor: iconTint }}
            />
          </Pressable>
          <Text className="list-title">My Subscriptions</Text>
          <Pressable
            className="home-add-icon-container"
            onPress={() => router.push("/settings")}
          >
            <Image
              source={icons.menu}
              className="home-add-icon"
              style={{ tintColor: iconTint }}
            />
          </Pressable>
        </View>

        <View className="subs-search-bar">
          <TextInput
            className="subs-search-input"
            placeholder="Search subscriptions..."
            placeholderTextColor={
              colorScheme === "dark"
                ? colors.darkSecondaryText
                : colors.lightSecondaryText
            }
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        extraData={expandedId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 80 }}
        ListEmptyComponent={
          <Text className="home-empty-state">No subscriptions found.</Text>
        }
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedId === item.id}
            onPress={() =>
              setExpandedId((id) => (id === item.id ? null : item.id))
            }
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Subscriptions;
