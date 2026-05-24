import { colors } from "@/constants/theme";
import { formatCurrency } from "@/lib/utils";
import { useColorScheme } from "nativewind";
import React from "react";
import { Image, Text, View } from "react-native";

const UpcomingSubscriptionCard = ({
  name,
  price,
  daysLeft,
  icon,
  currency,
}: UpcomingSubscription) => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  return (
    <View className="upcoming-card">
      <View className="upcoming-row">
        <View className="upcoming-icon-container">
          <Image
            source={icon}
            className="upcoming-icon"
            style={{
              tintColor:
                colorScheme === "dark"
                  ? colors.darkPrimaryText
                  : colors.lightPrimaryText,
            }}
          />
        </View>
        <View>
          <Text className="upcoming-price">
            {formatCurrency(price, currency)}
          </Text>

          <Text className="upcoming-meta" numberOfLines={1}>
            {daysLeft > 1 ? `${daysLeft} days left` : "Last day"}
          </Text>
        </View>
      </View>
      <Text className="upcoming-name" numberOfLines={1}>
        {name}
      </Text>
    </View>
  );
};

export default UpcomingSubscriptionCard;
