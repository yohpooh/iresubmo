import { colors } from "@/constants/theme";
import {
  formatCurrency,
  formatStatusLabel,
  formatSubscriptionDateTime,
} from "@/lib/utils";
import clsx from "clsx";
import { useColorScheme } from "nativewind";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

const SubscriptionCard = ({
  name,
  price,
  currency,
  icon,
  billing,
  color,
  category,
  plan,
  renewalDate,
  onPress,
  expanded,
  paymentMethod,
  startDate,
  status,
  onCancelPress,
  isCancelling,
}: SubscriptionCardProps) => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  return (
    <Pressable
      onPress={onPress}
      className={clsx(
        "sub-card",
        expanded
          ? "sub-card-expanded"
          : "bg-light-secondary-button dark:bg-dark-secondary-button",
      )}
      style={!expanded && color ? { backgroundColor: color } : undefined}
    >
      <View className="sub-head">
        <View className="sub-main">
          <View
            className={
              expanded ? "sub-icon-container-expanded" : "sub-icon-container"
            }
          >
            <Image
              source={icon}
              className="sub-icon"
              style={{
                tintColor: expanded
                  ? colorScheme === "dark"
                    ? colors.darkPrimaryButton
                    : colors.lightPrimaryButton
                  : colorScheme === "dark"
                    ? colors.darkPrimaryText
                    : colors.lightPrimaryText,
              }}
            />
          </View>
          <View className="sub-copy">
            <Text className="sub-title" numberOfLines={1}>
              {name}
            </Text>
            <Text numberOfLines={1} ellipsizeMode="tail" className="sub-meta">
              {category?.trim() ||
                plan?.trim() ||
                (renewalDate ? formatSubscriptionDateTime(renewalDate) : "")}
            </Text>
          </View>
        </View>

        <View className="sub-price-box">
          <Text className="sub-price">{formatCurrency(price, currency)}</Text>
          <Text className="sub-billing">{billing}</Text>
        </View>
      </View>
      {expanded && (
        <View className="sub-body">
          <View className="sub-details">
            <View className="sub-row">
              <View className="sub-row-copy">
                <Text className="sub-label">Payment info:</Text>
                <Text
                  className="sub-value"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {paymentMethod?.trim() || "Not specified"}
                </Text>
              </View>
              <Pressable className="sub-action-btn">
                <Text className="sub-action-btn-text">Manage</Text>
              </Pressable>
            </View>
            <View className="sub-row">
              <View className="sub-row-copy">
                <Text className="sub-label">Plan details:</Text>
                <Text
                  className="sub-value"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {plan?.trim() || category?.trim() || "Not specified"}
                </Text>
              </View>
              <Pressable className="sub-action-btn">
                <Text className="sub-action-btn-text">Change</Text>
              </Pressable>
            </View>
          </View>
          <Pressable
            className={clsx(
              "sub-cancel",
              (status === "cancelled" || isCancelling) && "sub-cancel-disabled",
            )}
            disabled={status === "cancelled" || isCancelling}
            onPress={onCancelPress}
          >
            <Text className="sub-cancel-text">
              {status === "cancelled"
                ? "Subscription Cancelled"
                : "Cancel Subscription"}
            </Text>
          </Pressable>
        </View>
      )}
    </Pressable>
  );
};

export default SubscriptionCard;
