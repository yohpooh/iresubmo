import { colors } from "@/constants/theme";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path, Polyline } from "react-native-svg";

export default function TermsAndPolicy() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const { t } = useLanguage();
  const isDark = colorScheme === "dark";
  const iconColor = isDark ? colors.darkPrimaryText : colors.lightPrimaryText;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDark ? colors.darkBackground : colors.lightBackground,
      }}
    >
      <View className="flex-row items-center px-4 py-3 border-b border-light-divider dark:border-dark-divider">
        <Pressable
          onPress={() => router.back()}
          className="size-10 items-center justify-center rounded-full bg-light-secondary-surface dark:bg-dark-secondary-surface mr-3"
        >
          <Svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            stroke={iconColor}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Polyline points="15 18 9 12 15 6" />
          </Svg>
        </Pressable>
        <Text className="text-xl font-sans-bold text-light-primary-text dark:text-dark-primary-text">
          {t.termsTitle}
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 20 }}
      >
        <Text className="text-2xl font-sans-bold text-light-primary-text dark:text-dark-primary-text mb-1">
          Terms of Service
        </Text>
        <Text className="text-sm font-sans-medium text-light-secondary-text dark:text-dark-secondary-text mb-6">
          Last updated: June 29, 2026
        </Text>

        <SectionHeading title="1. Acceptance of Terms" />
        <BodyText text="By accessing or using iResubmo, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this app." />

        <SectionHeading title="2. Use License" />
        <BodyText text="Permission is granted to temporarily use iResubmo for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title. Under this license you may not modify or copy the materials, use the materials for any commercial purpose, or attempt to reverse engineer any software contained in iResubmo." />

        <SectionHeading title="3. Subscription Data" />
        <BodyText text="iResubmo stores your subscription information to help you track and manage recurring payments. We do not access or store your actual payment credentials. All subscription data is stored securely and will not be shared with third parties without your consent." />

        <SectionHeading title="4. Account Responsibility" />
        <BodyText text="You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account." />

        <Text className="text-2xl font-sans-bold text-light-primary-text dark:text-dark-primary-text mt-8 mb-1">
          Privacy Policy
        </Text>
        <Text className="text-sm font-sans-medium text-light-secondary-text dark:text-dark-secondary-text mb-6">
          Last updated: June 29, 2026
        </Text>

        <SectionHeading title="5. Information Collection" />
        <BodyText text="We collect information you provide directly to us when you create an account or add subscription information. We may also collect information about your use of the app, including the actions you take within it." />

        <SectionHeading title="6. How We Use Your Data" />
        <BodyText text="We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and respond to your comments and questions." />

        <SectionHeading title="7. Data Security" />
        <BodyText text="We implement appropriate technical and organizational security measures to protect your personal information. However, no internet transmission is 100% secure, and we cannot guarantee absolute security." />

        <SectionHeading title="8. Contact Us" />
        <BodyText text="If you have any questions about these Terms and Privacy Policy, please contact us at support@iresubmo.com" />
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <Text className="text-base font-sans-semibold text-light-primary-text dark:text-dark-primary-text mb-2">
      {title}
    </Text>
  );
}

function BodyText({ text }: { text: string }) {
  return (
    <Text className="text-sm font-sans-regular text-light-secondary-text dark:text-dark-secondary-text mb-5 leading-6">
      {text}
    </Text>
  );
}
