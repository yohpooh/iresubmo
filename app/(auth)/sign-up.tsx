import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import { useAuth, useSignUp } from "@clerk/expo";
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

export default function SignUp() {
  const { signUp, fetchStatus, errors } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const { colorScheme, toggleColorScheme } = useColorScheme();

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/[A-Z]/.test(pwd)) {
      return "Password must contain an uppercase letter";
    }
    if (!/[a-z]/.test(pwd)) {
      return "Password must contain a lowercase letter";
    }
    if (!/[0-9]/.test(pwd)) {
      return "Password must contain a number";
    }
    return "";
  };

  const handleSignUp = async () => {
    if (!emailAddress || !password || !confirmPassword) return;

    const pwdError = validatePassword(password);
    if (pwdError) {
      setPasswordError(pwdError);
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordError("");

    try {
      const { error } = await signUp.password({
        emailAddress,
        password,
      });

      if (error) {
        console.error("Sign-up error:", JSON.stringify(error, null, 2));
        return;
      }

      if (!error) {
        await signUp.verifications.sendEmailCode();
        setIsVerifying(true);
      }
    } catch (err) {
      console.error("Sign-up error:", err);
    }
  };

  const handleVerify = async () => {
    if (!code) return;

    try {
      await signUp.verifications.verifyEmailCode({
        code,
      });

      if (signUp.status === "complete") {
        await signUp.finalize({
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
        console.error("Sign-up not complete:", signUp);
      }
    } catch (err) {
      console.error("Verification error:", err);
    }
  };

  if (signUp.status === "complete" || isSignedIn) {
    return null;
  }

  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
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
                  Verify Email
                </StyledText>
                <StyledText className="text-base font-sans-medium text-light-secondary-text dark:text-dark-secondary-text">
                  We sent a code to {emailAddress}
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
                      Verify Email
                    </StyledText>
                  )}
                </StyledPressable>

                <StyledPressable
                  className="rounded-full mt-8 py-3 px-6 bg-light-background dark:bg-dark-background border border-light-border dark:border-dark-border items-center"
                  onPress={() => signUp.verifications.sendEmailCode()}
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
              Create Account
            </StyledText>
            <StyledText className="text-base font-sans-medium text-light-secondary-text dark:text-dark-secondary-text">
              Join us to manage your subscriptions
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
                    borderColor: errors.fields.emailAddress
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
                {errors.fields.emailAddress && (
                  <StyledText className="text-xs font-sans-medium text-light-error dark:text-dark-error">
                    {errors.fields.emailAddress.message}
                  </StyledText>
                )}
              </View>

              <View className="gap-2">
                <StyledText className="text-sm font-sans-semibold text-light-primary-text dark:text-dark-primary-text">
                  Password
                </StyledText>
                <StyledTextInput
                  style={{
                    borderColor:
                      passwordError || errors.fields.password
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
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  placeholderTextColor={
                    colorScheme === "dark"
                      ? colors.darkDisabledText
                      : colors.lightDisabledText
                  }
                  onChangeText={(text) => {
                    setPassword(text);
                    if (passwordError) setPasswordError("");
                  }}
                  secureTextEntry
                  editable={fetchStatus !== "fetching"}
                />
                {(passwordError || errors.fields.password) && (
                  <StyledText className="text-xs font-sans-medium text-light-error dark:text-dark-error">
                    {passwordError || errors.fields.password?.message}
                  </StyledText>
                )}
              </View>

              <View className="gap-2">
                <StyledText className="text-sm font-sans-semibold text-light-primary-text dark:text-dark-primary-text">
                  Confirm Password
                </StyledText>
                <StyledTextInput
                  style={{
                    borderColor: passwordError
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
                  value={confirmPassword}
                  placeholder="Re-enter your password"
                  placeholderTextColor={
                    colorScheme === "dark"
                      ? colors.darkDisabledText
                      : colors.lightDisabledText
                  }
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (passwordError) setPasswordError("");
                  }}
                  secureTextEntry
                  editable={fetchStatus !== "fetching"}
                />
              </View>
            </View>

            <StyledPressable
              className="rounded-full mt-5 py-4 px-6 bg-light-primary-button dark:bg-dark-primary-button items-center"
              onPress={handleSignUp}
              disabled={
                fetchStatus === "fetching" ||
                !emailAddress ||
                !password ||
                !confirmPassword
              }
            >
              {fetchStatus === "fetching" ? (
                <ActivityIndicator
                  color={colors.lightButtonText}
                  size="small"
                />
              ) : (
                <StyledText className="text-base font-sans-bold text-light-button-text dark:text-dark-button-text">
                  Create Account
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
                  Already have an account?
                </StyledText>
                <Link href="/(auth)/sign-in">
                  <StyledText className="text-sm font-sans-bold text-light-primary-button dark:text-dark-primary-button">
                    Sign In
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
