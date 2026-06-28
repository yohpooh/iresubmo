import CreateSubscriptionModal from "@/components/CreateSubscriptionModal";
import ListHeading from "@/components/ListHeading";
import SubscriptionCard from "@/components/SubscriptionCard";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import { HOME_BALANCE, UPCOMING_SUBSCRIPTIONS } from "@/constants/data";
import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import { useSubscriptions } from "@/context/SubscriptionsContext";
import "@/global.css";
import { formatCurrency } from "@/lib/utils";
import { useUser } from "@clerk/expo";
import dayjs from "dayjs";
import { Redirect, useRouter } from "expo-router";
import { styled, useColorScheme } from "nativewind";
import { useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  console.log("Current theme:", colorScheme);
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >();
  const { subscriptions, addSubscription } = useSubscriptions();
  const [modalVisible, setModalVisible] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();

  const router = useRouter();

  const handleAllSubscriptionsPress = () => {
    router.push("/subscriptions");
  };

  const handleSubscriptionCreate = (subscription: Subscription) => {
    addSubscription(subscription);
  };

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <SafeAreaView className="flex-1 bg-light-background dark:bg-dark-background p-5">
      <FlatList
        ListHeaderComponent={() => (
          <>
            <View className="home-header">
              <View className="home-user">
                <Image
                  source={{ uri: user.imageUrl }}
                  className="home-avatar"
                />
                <Text className="home-user-name">{user.fullName}</Text>
              </View>

              <Pressable
                className="home-add-icon-container"
                onPress={() => setModalVisible(true)}
              >
                <Image
                  source={icons.add}
                  className="home-add-icon"
                  style={{
                    tintColor:
                      colorScheme === "dark"
                        ? colors.darkPrimaryText
                        : colors.lightPrimaryText,
                  }}
                />
              </Pressable>
            </View>

            <View className="home-balance-card">
              <Text className="home-balance-label">Balance</Text>

              <View className="home-balance-row">
                <Text className="home-balance-amount">
                  {formatCurrency(HOME_BALANCE.amount)}
                </Text>
                <Text className="home-balance-date">
                  {dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")}
                </Text>
              </View>
            </View>

            <View className="mb-5">
              <ListHeading
                title="Upcoming"
                onPress={() => console.log("View all upcoming subscriptions")}
              />
              <FlatList
                data={UPCOMING_SUBSCRIPTIONS}
                renderItem={({ item }) => (
                  <UpcomingSubscriptionCard {...item} />
                )}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                  <Text className="home-empty-state">
                    No upcoming subscriptions.
                  </Text>
                }
              />
            </View>

            <ListHeading
              title="All Subscriptions"
              onPress={handleAllSubscriptionsPress}
            />
          </>
        )}
        data={subscriptions}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() =>
              setExpandedSubscriptionId((currentId) =>
                currentId === item.id ? null : item.id,
              )
            }
          />
        )}
        keyExtractor={(item) => item.id}
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text className="home-empty-state">No subscriptions found.</Text>
        }
        contentContainerStyle={{ paddingBottom: 80 }}
      />
      <CreateSubscriptionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubscriptionCreate}
      />
    </SafeAreaView>
  );
}
