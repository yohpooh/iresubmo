import { colors } from "@/constants/theme";
import { useSubscriptions } from "@/context/SubscriptionsContext";
import "@/global.css";
import { formatCurrency } from "@/lib/utils";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { styled, useColorScheme } from "nativewind";
import React, { useMemo } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

function formatYAxisLabel(value: number): string {
  if (value >= 10000) return `${(value / 1000).toFixed(0)}K`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  if (value >= 100) return `${(value / 100).toFixed(0)}H`;
  return `${value}`;
}

function formatAmountShort(value: number): string {
  if (value >= 1000) return `₱${(value / 1000).toFixed(1)}K`;
  return `₱${value.toFixed(0)}`;
}

function wasActiveInMonth(sub: Subscription, month: dayjs.Dayjs): boolean {
  if (!sub.startDate) return true;
  return dayjs(sub.startDate).isBefore(month.endOf("month"));
}

function getMonthTotal(month: dayjs.Dayjs, subs: Subscription[]): number {
  return subs
    .filter((sub) => sub.status !== "cancelled" && wasActiveInMonth(sub, month))
    .reduce((total, sub) => {
      if (sub.billing === "Quarterly") {
        const startMonth = dayjs(sub.startDate).month();
        const diff = (month.month() - startMonth + 12) % 12;
        if (diff % 3 === 0) return total + sub.price;
        return total;
      }
      return total + sub.price;
    }, 0);
}

export default function Insights() {
  const { subscriptions } = useSubscriptions();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const now = dayjs();

  const months = useMemo(
    () => Array.from({ length: 6 }, (_, i) => now.subtract(5 - i, "month")),
    [],
  );

  const monthlyTotals = useMemo(
    () => months.map((month) => getMonthTotal(month, subscriptions)),
    [subscriptions, months],
  );

  const currentMonthTotal = monthlyTotals[monthlyTotals.length - 1];
  const previousMonthTotal = monthlyTotals[monthlyTotals.length - 2];

  const percentageChange =
    previousMonthTotal > 0
      ? ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100
      : 0;

  const isPositiveChange = percentageChange >= 0;

  const maxChartValue = Math.max(...monthlyTotals, 1) * 1.35;

  const activeBarColor = isDark
    ? colors.darkPrimaryButton
    : colors.lightPrimaryButton;
  const inactiveBarColor = isDark ? "#374151" : "#6b7280";

  const chartData = months.map((month, i) => {
    const isCurrent = i === months.length - 1;
    const val = monthlyTotals[i];
    return {
      value: val,
      label: month.format("MMM"),
      frontColor: isCurrent ? activeBarColor : inactiveBarColor,
      topLabelComponent: isCurrent
        ? () => (
            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: -30,
                right: -30,
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <View
                style={{
                  backgroundColor: isDark ? "#1e293b" : "#e0e7ff",
                  borderRadius: 999,
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "700",
                    color: isDark ? "#3b82f6" : "#2563eb",
                  }}
                  numberOfLines={1}
                >
                  {formatAmountShort(val)}
                </Text>
              </View>
            </View>
          )
        : undefined,
    };
  });

  const sortedHistory = useMemo(
    () =>
      [...subscriptions]
        .filter((sub) => sub.status !== "cancelled")
        .sort((a, b) => {
          const da = a.renewalDate ? dayjs(a.renewalDate).valueOf() : 0;
          const db = b.renewalDate ? dayjs(b.renewalDate).valueOf() : 0;
          return db - da;
        }),
    [subscriptions],
  );

  const axisTextStyle = {
    color: isDark ? colors.darkSecondaryText : colors.lightSecondaryText,
    fontSize: 11,
  };

  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-light-background dark:bg-dark-background">
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Page heading */}
        <View className="my-5 items-center">
          <Text className="text-2xl font-sans-bold text-light-primary-text dark:text-dark-primary-text">
            Monthly Insights
          </Text>
        </View>

        {/* Upcoming section header */}
        <View className="list-head">
          <Text className="list-title">Upcoming</Text>
          <TouchableOpacity className="list-action hidden">
            <Text className="list-action-text">View All</Text>
          </TouchableOpacity>
        </View>

        {/* Bar chart */}
        <View className="insights-chart-container">
          <BarChart
            data={chartData}
            barWidth={25}
            barBorderRadius={6}
            yAxisColor="transparent"
            xAxisColor="transparent"
            yAxisTextStyle={axisTextStyle}
            xAxisLabelTextStyle={axisTextStyle}
            noOfSections={4}
            maxValue={maxChartValue}
            rulesColor={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}
            rulesType="dashed"
            dashWidth={3}
            dashGap={5}
            hideYAxisText={false}
            yAxisLabelWidth={42}
            spacing={20}
            initialSpacing={14}
            endSpacing={14}
            height={160}
            disablePress
            formatYLabel={(v) => formatYAxisLabel(Number(v))}
          />
        </View>

        {/* Expenses summary card */}
        <View className="insights-expense-card">
          <View className="flex-row items-start justify-between">
            <View>
              <Text className="insights-expense-label">Expenses</Text>
              <Text className="insights-expense-month">
                {now.format("MMMM YYYY")}
              </Text>
            </View>
            <View className="items-end">
              <Text className="insights-expense-amount">
                {formatCurrency(currentMonthTotal)}
              </Text>
              <Text
                className={
                  isPositiveChange
                    ? "insights-change-positive"
                    : "insights-change-negative"
                }
              >
                {isPositiveChange ? "+" : ""}
                {percentageChange.toFixed(0)}%
              </Text>
            </View>
          </View>
        </View>

        {/* History section header */}
        <View className="list-head mt-4">
          <Text className="list-title">History</Text>
          <TouchableOpacity
            className="list-action"
            onPress={() => router.push("/subscriptions")}
          >
            <Text className="list-action-text">View All</Text>
          </TouchableOpacity>
        </View>

        {/* History list */}
        <View className="gap-3">
          {sortedHistory.length === 0 ? (
            <Text className="home-empty-state">No subscription history.</Text>
          ) : (
            sortedHistory.map((sub) => (
              <View key={sub.id} className="insights-history-card">
                <View className="insights-history-icon-container">
                  <Image
                    source={sub.icon}
                    className="sub-icon"
                    style={{
                      tintColor: isDark
                        ? colors.darkPrimaryText
                        : colors.lightPrimaryText,
                    }}
                  />
                </View>
                <View className="min-w-0 flex-1">
                  <Text className="insights-history-name" numberOfLines={1}>
                    {sub.name.trim()}
                  </Text>
                  <Text className="insights-history-date">
                    {sub.renewalDate
                      ? dayjs(sub.renewalDate).format("MMM D, HH:mm")
                      : "—"}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="insights-history-price">
                    {formatCurrency(sub.price, sub.currency)}
                  </Text>
                  <Text className="insights-history-billing">
                    {sub.billing === "Quarterly" ? "per quarter" : "per month"}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
