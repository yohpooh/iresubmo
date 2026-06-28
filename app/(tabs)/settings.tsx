import {
  AlertIcon,
  BellIcon,
  CardIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FaceIcon,
  GlobeIcon,
  LangsIcon,
  LockIcon,
  LogoutIcon,
  ShieldIcon,
} from "@/components/settingsIcons";
import { colors } from "@/constants/theme";
import { useLanguage } from "@/context/LanguageContext";
import { useClerk, useUser } from "@clerk/expo";
import clsx from "clsx";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// XHR-based blob reader — works with file:// (iOS) and content:// (Android)
function uriToBlob(uri: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.onload = () => resolve(xhr.response as Blob);
    xhr.onerror = () => reject(new Error("Failed to read image file"));
    xhr.open("GET", uri, true);
    xhr.send();
  });
}

// Derive MIME type from file extension when the picker doesn't supply one
function derivesMime(uri: string): string {
  const ext = uri.split("?")[0].split(".").pop()?.toLowerCase();
  const map: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    heic: "image/heic",
    heif: "image/heif",
  };
  return map[ext ?? ""] ?? "image/jpeg";
}

// ─── Modal shell ──────────────────────────────────────────────────────────────

function ModalShell({
  visible,
  onClose,
  title,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
          onPress={onClose}
        />
        <View className="modal-container">
          <View className="modal-header">
            <Text className="modal-title">{title}</Text>
            <Pressable className="modal-close" onPress={onClose}>
              <Text className="modal-close-text">✕</Text>
            </Pressable>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View className="modal-body">{children}</View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function EditProfileModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { user } = useUser();
  const { colorScheme } = useColorScheme();
  const { t } = useLanguage();
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const placeholderColor =
    colorScheme === "dark" ? colors.darkDisabledText : colors.lightDisabledText;

  // Sync fields with the latest Clerk data each time the modal opens
  useEffect(() => {
    if (visible) {
      setFirstName(user?.firstName ?? "");
      setLastName(user?.lastName ?? "");
    }
  }, [visible, user?.firstName, user?.lastName]);

  const handlePickImage = async () => {
    const { status: existing } =
      await ImagePicker.getMediaLibraryPermissionsAsync();

    let finalStatus = existing;

    if (existing !== "granted") {
      const { status: requested, canAskAgain } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      finalStatus = requested;

      if (requested !== "granted") {
        if (!canAskAgain) {
          Alert.alert(
            "Permission required",
            "Photo library access was denied. Please enable it in your device Settings to change your profile photo.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Open Settings", onPress: () => Linking.openSettings() },
            ],
          );
        } else {
          Alert.alert(
            "Permission required",
            "Allow photo library access to change your profile photo.",
          );
        }
        return;
      }
    }

    if (finalStatus !== "granted") return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1] as [number, number],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      try {
        setUploadingPhoto(true);
        const asset = result.assets[0];
        const mimeType = asset.mimeType ?? derivesMime(asset.uri);
        const rawBlob = await uriToBlob(asset.uri);
        const typedBlob = new Blob([rawBlob], { type: mimeType });
        await user?.setProfileImage({ file: typedBlob });
      } catch (err: any) {
        Alert.alert(
          "Error",
          err?.errors?.[0]?.message ??
            err?.message ??
            "Could not update profile photo. Please try again.",
        );
      } finally {
        setUploadingPhoto(false);
      }
    }
  };

  const handleSave = async () => {
    if (!firstName.trim()) return;
    try {
      setSaving(true);
      await user?.update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      onClose();
    } catch {
      Alert.alert("Error", "Could not update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell visible={visible} onClose={onClose} title={t.editProfileTitle}>
      <View className="items-center mb-2">
        <Pressable onPress={handlePickImage} disabled={uploadingPhoto}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              overflow: "hidden",
            }}
          >
            {user?.imageUrl ? (
              <Image
                source={{ uri: user.imageUrl }}
                style={{ width: 80, height: 80 }}
              />
            ) : (
              <View
                style={{ width: 80, height: 80 }}
                className="bg-light-primary-button dark:bg-dark-primary-button items-center justify-center"
              >
                <Text className="text-2xl font-sans-bold text-white">
                  {(user?.firstName ?? "U")[0].toUpperCase()}
                </Text>
              </View>
            )}
            {uploadingPhoto && (
              <View
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "rgba(0,0,0,0.45)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator color="#fff" size="small" />
              </View>
            )}
          </View>
        </Pressable>
        <Pressable
          className="mt-3"
          onPress={handlePickImage}
          disabled={uploadingPhoto}
        >
          <Text className="text-sm font-sans-semibold text-light-primary-button dark:text-dark-primary-button">
            {uploadingPhoto ? "Uploading…" : t.changePhoto}
          </Text>
        </Pressable>
      </View>

      <View className="auth-field">
        <Text className="auth-label">{t.firstName}</Text>
        <TextInput
          className="auth-input"
          placeholder={t.firstName}
          placeholderTextColor={placeholderColor}
          value={firstName}
          onChangeText={setFirstName}
        />
      </View>

      <View className="auth-field">
        <Text className="auth-label">{t.lastName}</Text>
        <TextInput
          className="auth-input"
          placeholder={t.lastName}
          placeholderTextColor={placeholderColor}
          value={lastName}
          onChangeText={setLastName}
        />
      </View>

      <Pressable
        className={clsx(
          "auth-button",
          (!firstName.trim() || saving) && "auth-button-disabled",
        )}
        onPress={handleSave}
        disabled={!firstName.trim() || saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text className="auth-button-text">{t.save}</Text>
        )}
      </Pressable>
    </ModalShell>
  );
}

// ─── Password Modal ───────────────────────────────────────────────────────────

function PasswordModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { user } = useUser();
  const { colorScheme } = useColorScheme();
  const { t } = useLanguage();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const placeholderColor =
    colorScheme === "dark" ? colors.darkDisabledText : colors.lightDisabledText;
  const mismatch = confirm.length > 0 && next !== confirm;
  const valid = current.length > 0 && next.length >= 8 && next === confirm;

  const handleSave = async () => {
    if (!valid) return;
    try {
      setSaving(true);
      await user?.updatePassword({
        currentPassword: current,
        newPassword: next,
      });
      setCurrent("");
      setNext("");
      setConfirm("");
      onClose();
    } catch (e: any) {
      Alert.alert(
        "Error",
        e?.errors?.[0]?.message ?? "Could not update password.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell visible={visible} onClose={onClose} title={t.changePassword}>
      <View className="auth-field">
        <Text className="auth-label">{t.currentPassword}</Text>
        <TextInput
          className="auth-input"
          placeholder={t.currentPassword}
          placeholderTextColor={placeholderColor}
          secureTextEntry
          value={current}
          onChangeText={setCurrent}
        />
      </View>
      <View className="auth-field">
        <Text className="auth-label">{t.newPassword}</Text>
        <TextInput
          className="auth-input"
          placeholder={t.newPassword}
          placeholderTextColor={placeholderColor}
          secureTextEntry
          value={next}
          onChangeText={setNext}
        />
      </View>
      <View className="auth-field">
        <Text className="auth-label">{t.confirmPassword}</Text>
        <TextInput
          className={clsx("auth-input", mismatch && "auth-input-error")}
          placeholder={t.confirmPassword}
          placeholderTextColor={placeholderColor}
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
        />
        {mismatch && <Text className="auth-error">{t.passwordMismatch}</Text>}
      </View>
      <Pressable
        className={clsx(
          "auth-button",
          (!valid || saving) && "auth-button-disabled",
        )}
        onPress={handleSave}
        disabled={!valid || saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text className="auth-button-text">{t.save}</Text>
        )}
      </Pressable>
    </ModalShell>
  );
}

// ─── Language Modal ───────────────────────────────────────────────────────────

function LanguageModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { t, language, setLanguage } = useLanguage();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const primaryBtn = isDark
    ? colors.darkPrimaryButton
    : colors.lightPrimaryButton;

  const options: { code: "en" | "fil"; label: string }[] = [
    { code: "en", label: t.english },
    { code: "fil", label: t.filipino },
  ];

  return (
    <ModalShell visible={visible} onClose={onClose} title={t.selectLanguage}>
      <View className="gap-3">
        {options.map((opt) => {
          const selected = language === opt.code;
          return (
            <Pressable
              key={opt.code}
              className={clsx(
                "flex-row items-center px-4 py-4 rounded-2xl border",
                selected
                  ? "border-light-primary-button dark:border-dark-primary-button bg-light-secondary-button dark:bg-dark-secondary-button"
                  : "border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background",
              )}
              onPress={() => {
                setLanguage(opt.code);
                onClose();
              }}
            >
              <Text
                className={clsx(
                  "flex-1 text-base font-sans-semibold",
                  selected
                    ? "text-light-primary-button dark:text-dark-primary-button"
                    : "text-light-primary-text dark:text-dark-primary-text",
                )}
              >
                {opt.label}
              </Text>
              {selected && (
                <View
                  style={{ backgroundColor: primaryBtn }}
                  className="size-5 rounded-full items-center justify-center"
                >
                  <CheckIcon color="#fff" />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </ModalShell>
  );
}

// ─── Report Issue Modal ───────────────────────────────────────────────────────

const ISSUE_TYPES = [
  "Bug",
  "Feature Request",
  "Payment Issue",
  "Account Issue",
  "Other",
];

function ReportIssueModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const { colorScheme } = useColorScheme();
  const [issueType, setIssueType] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const placeholderColor =
    colorScheme === "dark" ? colors.darkDisabledText : colors.lightDisabledText;
  const valid = issueType !== null && description.trim().length > 0;

  const handleSubmit = async () => {
    if (!valid) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setIssueType(null);
    setDescription("");
    onClose();
    Alert.alert("Submitted", "Thank you for your report. We'll look into it.");
  };

  return (
    <ModalShell visible={visible} onClose={onClose} title={t.reportIssue}>
      <View className="auth-field">
        <Text className="auth-label">{t.issueType}</Text>
        <View className="category-scroll">
          {ISSUE_TYPES.map((type) => (
            <Pressable
              key={type}
              className={clsx(
                "category-chip",
                issueType === type && "category-chip-active",
              )}
              onPress={() => setIssueType(type)}
            >
              <Text
                className={clsx(
                  "category-chip-text",
                  issueType === type && "category-chip-text-active",
                )}
              >
                {type}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View className="auth-field">
        <Text className="auth-label">{t.describeIssue}</Text>
        <TextInput
          className="auth-input"
          placeholder={t.describeIssue}
          placeholderTextColor={placeholderColor}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={{ minHeight: 100, textAlignVertical: "top" }}
        />
      </View>
      <Pressable
        className={clsx(
          "auth-button",
          (!valid || submitting) && "auth-button-disabled",
        )}
        onPress={handleSubmit}
        disabled={!valid || submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text className="auth-button-text">{t.submit}</Text>
        )}
      </Pressable>
    </ModalShell>
  );
}

// ─── Settings Row ─────────────────────────────────────────────────────────────

function Row({
  icon,
  label,
  right,
  onPress,
  labelColor,
  divider = true,
}: {
  icon: React.ReactNode;
  label: string;
  right?: React.ReactNode;
  onPress?: () => void;
  labelColor?: string;
  divider?: boolean;
}) {
  return (
    <>
      <Pressable
        className="flex-row items-center px-4 py-3.5 gap-3"
        onPress={onPress}
        disabled={!onPress}
      >
        <View className="w-6 items-center">{icon}</View>
        <Text
          className="flex-1 text-base font-sans-medium text-light-primary-text dark:text-dark-primary-text"
          style={labelColor ? { color: labelColor } : undefined}
        >
          {label}
        </Text>
        {right}
      </Pressable>
      {divider && (
        <View className="h-px bg-light-divider dark:bg-dark-divider mx-4" />
      )}
    </>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function Settings() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const { signOut } = useClerk();
  const { user } = useUser();
  const router = useRouter();
  const { t, language } = useLanguage();

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [faceId, setFaceId] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  const isDark = colorScheme === "dark";
  const iconColor = isDark
    ? colors.darkSecondaryText
    : colors.lightSecondaryText;
  const primaryBtn = isDark
    ? colors.darkPrimaryButton
    : colors.lightPrimaryButton;
  const errorColor = isDark ? colors.darkError : colors.lightError;

  const switchColors = {
    trackFalse: isDark ? "#374151" : "#d1d5db",
    trackTrue: primaryBtn,
    thumb: "#ffffff",
  };

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await signOut();
      router.replace("/(auth)/sign-in");
    } catch {
      setSigningOut(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDark
          ? colors.darkBackground
          : colors.lightBackground,
      }}
    >
      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <Pressable
          onPress={() => router.back()}
          className="size-10 items-center justify-center rounded-full bg-light-secondary-surface dark:bg-dark-secondary-surface"
        >
          <ChevronLeftIcon
            color={isDark ? colors.darkPrimaryText : colors.lightPrimaryText}
          />
        </Pressable>
        <Text className="flex-1 text-center text-xl font-sans-bold text-light-primary-text dark:text-dark-primary-text mr-10">
          {t.settings}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Profile */}
        <View className="flex-row items-center px-5 py-4 gap-3">
          {user?.imageUrl ? (
            <Image
              source={{ uri: user.imageUrl }}
              style={{ width: 56, height: 56, borderRadius: 28 }}
            />
          ) : (
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: primaryBtn,
              }}
              className="items-center justify-center"
            >
              <Text className="text-xl font-sans-bold text-white">
                {(user?.firstName ?? "U")[0].toUpperCase()}
              </Text>
            </View>
          )}
          <View className="flex-1">
            <Text className="text-lg font-sans-bold text-light-primary-text dark:text-dark-primary-text">
              {user?.fullName ?? user?.firstName ?? "User"}
            </Text>
            <Text className="text-sm font-sans-medium text-light-secondary-text dark:text-dark-secondary-text">
              {user?.primaryEmailAddress?.emailAddress ?? ""}
            </Text>
          </View>
          <Pressable
            className="px-4 py-2 rounded-full border border-light-border dark:border-dark-border"
            onPress={() => setShowEditProfile(true)}
          >
            <Text className="text-sm font-sans-semibold text-light-primary-text dark:text-dark-primary-text">
              {t.editProfile}
            </Text>
          </Pressable>
        </View>

        {/* Preferences */}
        <Text className="px-5 pt-2 pb-3 text-xl font-sans-bold text-light-primary-text dark:text-dark-primary-text">
          {t.preferences}
        </Text>
        <View className="mx-4 rounded-2xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border overflow-hidden">
          <Row
            icon={<BellIcon color={iconColor} />}
            label={t.notificationsAndSounds}
            right={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{
                  false: switchColors.trackFalse,
                  true: switchColors.trackTrue,
                }}
                thumbColor={switchColors.thumb}
              />
            }
          />
          <Row
            icon={<LangsIcon color={iconColor} />}
            label={t.language}
            onPress={() => setShowLanguage(true)}
            right={
              <View className="flex-row items-center gap-1">
                <Text className="text-sm font-sans-medium text-light-secondary-text dark:text-dark-secondary-text">
                  {language === "en" ? t.english : t.filipino}
                </Text>
                <ChevronRightIcon color={iconColor} />
              </View>
            }
          />
          <Row
            icon={<GlobeIcon color={iconColor} />}
            label={t.theme}
            divider={false}
            right={
              <Switch
                value={isDark}
                onValueChange={toggleColorScheme}
                trackColor={{
                  false: switchColors.trackFalse,
                  true: switchColors.trackTrue,
                }}
                thumbColor={switchColors.thumb}
              />
            }
          />
        </View>

        {/* Account */}
        <Text className="px-5 pt-6 pb-3 text-xl font-sans-bold text-light-primary-text dark:text-dark-primary-text">
          {t.account}
        </Text>
        <View className="mx-4 rounded-2xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border overflow-hidden">
          <Row
            icon={<LockIcon color={iconColor} />}
            label={t.password}
            onPress={() => setShowPassword(true)}
            right={<ChevronRightIcon color={iconColor} />}
          />
          <Row
            icon={<FaceIcon color={iconColor} />}
            label={t.loginWithFaceId}
            right={
              <Switch
                value={faceId}
                onValueChange={setFaceId}
                trackColor={{
                  false: switchColors.trackFalse,
                  true: switchColors.trackTrue,
                }}
                thumbColor={switchColors.thumb}
              />
            }
          />
          <Row
            icon={<CardIcon color={iconColor} />}
            label={t.paymentMethods}
            right={<ChevronRightIcon color={iconColor} />}
          />
          <Row
            icon={<AlertIcon color={iconColor} />}
            label={t.reportAnIssue}
            onPress={() => setShowReport(true)}
            right={<ChevronRightIcon color={iconColor} />}
          />
          <Row
            icon={<ShieldIcon color={iconColor} />}
            label={t.termsAndPrivacyPolicy}
            onPress={() => router.push("/terms-and-policy")}
            right={<ChevronRightIcon color={iconColor} />}
          />
          <Row
            icon={<LogoutIcon color={errorColor} />}
            label={signingOut ? "..." : t.logout}
            labelColor={errorColor}
            divider={false}
            onPress={handleSignOut}
            right={
              signingOut ? (
                <ActivityIndicator color={errorColor} size="small" />
              ) : undefined
            }
          />
        </View>
      </ScrollView>

      <EditProfileModal
        visible={showEditProfile}
        onClose={() => setShowEditProfile(false)}
      />
      <PasswordModal
        visible={showPassword}
        onClose={() => setShowPassword(false)}
      />
      <LanguageModal
        visible={showLanguage}
        onClose={() => setShowLanguage(false)}
      />
      <ReportIssueModal
        visible={showReport}
        onClose={() => setShowReport(false)}
      />
    </SafeAreaView>
  );
}
