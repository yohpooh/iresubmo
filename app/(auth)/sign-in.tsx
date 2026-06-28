import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import { useSignIn } from "@clerk/expo";
import { Link, useRouter, type Href } from "expo-router";
import { styled, useColorScheme } from "nativewind";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const StyledSafeArea = styled(SafeAreaView);
const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledTextInput = styled(TextInput);
const StyledPressable = styled(Pressable);
const StyledText = styled(Text);

export default function SignIn() {
  const { signIn, fetchStatus, errors } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const { colorScheme, toggleColorScheme } = useColorScheme();

  const handleSignIn = async () => {
    if (!emailAddress || !password) return;

    try {
      const { error } = await signIn.password({
        emailAddress,
        password,
      });

      if (error) {
        //console.error("Sign-in error:", JSON.stringify(error, null, 2));
        return;
      }

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              console.log("Session task:", session.currentTask);
              return;
            }

            const url = decorateUrl("/(tabs)");
            router.push(url as Href);
          },
        });
      } else if (signIn.status === "needs_client_trust") {
        setIsVerifying(true);
      }
    } catch (err) {
      //console.error("Sign-in error:", err);
    }
  };

  const handleVerify = async () => {
    if (!code) return;

    try {
      await signIn.mfa.verifyEmailCode({ code });

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              console.log("Session task:", session.currentTask);
              return;
            }

            const url = decorateUrl("/(tabs)");
            router.push(url as Href);
          },
        });
      } else {
        //console.error("Sign-in verification not complete:", signIn);
      }
    } catch (err) {
      //console.error("Verification error:", err);
    }
  };

  if (isVerifying) {
    return (
      <StyledSafeArea className="flex-1 bg-light-background dark:bg-dark-background">
        <StyledScrollView
          className="flex-1"
          contentContainerClassName="flex-grow items-center justify-center"
        >
          <View className="flex-0 w-full max-w-md px-5">
            <View className="gap-3">
              <View className="gap-1 flex items-center justify-center mb-4">
                <StyledText className="text-3xl font-sans-bold text-light-primary-text dark:text-dark-primary-text">
                  Verify Account
                </StyledText>
                <StyledText className="text-base font-sans-medium text-light-secondary-text dark:text-dark-secondary-text">
                  We sent a verification code to {emailAddress}
                </StyledText>
              </View>

              <View className="flex-1 bg-light-secondary-surface dark:bg-dark-secondary-surface rounded-2xl border border-light-border dark:border-dark-border p-5">
                <View className="gap-3">
                  <StyledText className="text-sm font-sans-semibold text-light-primary-text dark:text-dark-primary-text">
                    Verification Code
                  </StyledText>
                  <StyledTextInput
                    style={{
                      borderColor:
                        colorScheme === "dark"
                          ? colors.darkBorder
                          : colors.lightBorder,
                      borderWidth: 1,
                      backgroundColor:
                        colorScheme === "dark"
                          ? colors.darkSurface
                          : colors.lightSurface,
                      color:
                        colorScheme === "dark"
                          ? colors.darkPrimaryText
                          : colors.lightPrimaryText,
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      borderRadius: 14,
                      fontSize: 14,
                      fontFamily: "sans-light",
                    }}
                    value={code}
                    placeholder="000000"
                    placeholderTextColor={
                      colorScheme === "dark"
                        ? colors.darkDisabledText
                        : colors.lightDisabledText
                    }
                    onChangeText={setCode}
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                  {errors.fields.code && (
                    <StyledText className="text-xs font-sans-medium text-light-error dark:text-dark-error">
                      {errors.fields.code.message}
                    </StyledText>
                  )}
                </View>

                <StyledPressable
                  className="rounded-full mt-5 py-4 px-6 bg-light-primary-button dark:bg-dark-primary-button items-center"
                  onPress={handleVerify}
                  disabled={fetchStatus === "fetching" || !code}
                >
                  {fetchStatus === "fetching" ? (
                    <ActivityIndicator
                      color={colors.lightButtonText}
                      size="small"
                    />
                  ) : (
                    <StyledText className="text-base font-sans-bold text-light-button-text dark:text-dark-button-text">
                      Verify
                    </StyledText>
                  )}
                </StyledPressable>

                <StyledPressable
                  className="rounded-full mt-8 py-3 px-6 bg-light-background dark:bg-dark-background border border-light-border dark:border-dark-border items-center"
                  onPress={() => signIn.mfa.sendEmailCode()}
                  disabled={fetchStatus === "fetching"}
                >
                  <StyledText className="text-sm font-sans-semibold text-light-primary-button dark:text-dark-primary-button">
                    Send Code Again
                  </StyledText>
                </StyledPressable>

                <StyledPressable
                  className="rounded-full mt-2 py-3 px-6 bg-light-background dark:bg-dark-background border border-light-border dark:border-dark-border items-center"
                  onPress={() => {
                    setIsVerifying(false);
                    setCode("");
                  }}
                  disabled={fetchStatus === "fetching"}
                >
                  <StyledText className="text-sm font-sans-semibold text-light-primary-button dark:text-dark-primary-button">
                    Back
                  </StyledText>
                </StyledPressable>
              </View>
            </View>
          </View>
        </StyledScrollView>
      </StyledSafeArea>
    );
  }

  return (
    <StyledSafeArea className="flex-1 bg-light-background dark:bg-dark-background">
      <StyledScrollView
        className="flex-1"
        contentContainerClassName="flex-grow items-center justify-center"
      >
        <View className="flex-2 flex-row items-center justify-center">
          <Image source={icons.appLogo} className="w-16 h-16 rounded-3xl" />
          <View className="m-3">
            <Text className="text-3xl font-sans-bold text-light-primary-text dark:text-dark-primary-text mt-2">
              WASSUB
            </Text>
            <Text className="text-lg font-sans-medium text-light-secondary-text dark:text-dark-secondary-text">
              SMART BILLING
            </Text>
          </View>
        </View>

        <View className="flex-0 w-full max-w-md px-5">
          <View className="gap-1 flex items-center justify-center mb-4">
            <StyledText className="text-3xl font-sans-bold text-light-primary-text dark:text-dark-primary-text">
              Welcome Back!
            </StyledText>
            <StyledText className="text-base font-sans-medium text-light-secondary-text dark:text-dark-secondary-text">
              Sign in to continue managing your subscriptions.
            </StyledText>
          </View>

          <View className="flex-1 bg-light-secondary-surface dark:bg-dark-secondary-surface rounded-2xl border border-light-border dark:border-dark-border p-5">
            <View className="gap-3">
              <View className="gap-1">
                <StyledText className="text-sm font-sans-semibold text-light-primary-text dark:text-dark-primary-text">
                  Email
                </StyledText>
                <StyledTextInput
                  style={{
                    borderColor: errors.fields.identifier
                      ? colorScheme === "dark"
                        ? colors.darkError
                        : colors.lightError
                      : colorScheme === "dark"
                        ? colors.darkBorder
                        : colors.lightBorder,
                    borderWidth: 1,
                    backgroundColor:
                      colorScheme === "dark"
                        ? colors.darkSurface
                        : colors.lightSurface,
                    color:
                      colorScheme === "dark"
                        ? colors.darkPrimaryText
                        : colors.lightPrimaryText,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    borderRadius: 14,
                    fontSize: 14,
                    fontFamily: "sans-light",
                  }}
                  value={emailAddress}
                  placeholder="Enter your email"
                  placeholderTextColor={
                    colorScheme === "dark"
                      ? colors.darkDisabledText
                      : colors.lightDisabledText
                  }
                  onChangeText={setEmailAddress}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={fetchStatus !== "fetching"}
                />
                {errors.fields.identifier && (
                  <StyledText className="text-xs font-sans-medium text-light-error dark:text-dark-error">
                    {errors.fields.identifier.message}
                  </StyledText>
                )}
              </View>

              <View className="gap-1">
                <StyledText className="text-sm font-sans-semibold text-light-primary-text dark:text-dark-primary-text">
                  Password
                </StyledText>
                <StyledTextInput
                  style={{
                    borderColor: errors.fields.password
                      ? colorScheme === "dark"
                        ? colors.darkError
                        : colors.lightError
                      : colorScheme === "dark"
                        ? colors.darkBorder
                        : colors.lightBorder,
                    borderWidth: 1,
                    backgroundColor:
                      colorScheme === "dark"
                        ? colors.darkSurface
                        : colors.lightSurface,
                    color:
                      colorScheme === "dark"
                        ? colors.darkPrimaryText
                        : colors.lightPrimaryText,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    borderRadius: 14,
                    fontSize: 14,
                    fontFamily: "sans-light",
                  }}
                  value={password}
                  placeholder="Enter your password"
                  placeholderTextColor={
                    colorScheme === "dark"
                      ? colors.darkDisabledText
                      : colors.lightDisabledText
                  }
                  onChangeText={setPassword}
                  secureTextEntry
                  editable={fetchStatus !== "fetching"}
                />
                {errors.fields.password && (
                  <StyledText className="text-xs font-sans-medium text-light-error dark:text-dark-error">
                    {errors.fields.password.message}
                  </StyledText>
                )}
              </View>
            </View>

            <StyledPressable
              className="rounded-full mt-5 py-4 px-6 bg-light-primary-button dark:bg-dark-primary-button items-center"
              onPress={handleSignIn}
              disabled={
                fetchStatus === "fetching" || !emailAddress || !password
              }
            >
              {fetchStatus === "fetching" ? (
                <ActivityIndicator
                  color={colors.lightButtonText}
                  size="small"
                />
              ) : (
                <StyledText className="text-base font-sans-bold text-light-button-text dark:text-dark-button-text">
                  Sign In
                </StyledText>
              )}
            </StyledPressable>

            {errors.global?.[0] && (
              <View className="bg-light-error/10 dark:bg-dark-error/20 rounded-lg p-3 border border-light-error/30 dark:border-dark-error/30">
                <StyledText className="text-sm font-sans-medium text-light-error dark:text-dark-error">
                  {errors.global[0].message ||
                    "An error occurred. Please try again."}
                </StyledText>
              </View>
            )}

            <View className="mt-4 items-center">
              <View className="flex-row gap-1 justify-center">
                <StyledText className="text-sm font-sans-medium text-light-secondary-text dark:text-dark-secondary-text">
                  Create new Wassub?
                </StyledText>
                <Link href="/(auth)/sign-up">
                  <StyledText className="text-sm font-sans-bold text-light-primary-button dark:text-dark-primary-button">
                    Create an Account
                  </StyledText>
                </Link>
              </View>
            </View>
          </View>
        </View>

        <View className="flex-3 items-center justify-center mt-10" />
      </StyledScrollView>
    </StyledSafeArea>
  );
}
