import { icons } from "@/constants/icons";
import clsx from "clsx";
import dayjs from "dayjs";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import {
  ImageSourcePropType,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

type Frequency = "Monthly" | "Yearly";

type Category =
  | "Entertainment"
  | "AI Tools"
  | "Developer Tools"
  | "Design"
  | "Productivity"
  | "Cloud"
  | "Music"
  | "Other";

const CATEGORIES: Category[] = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Cloud",
  "Music",
  "Other",
];

// Maps service name keywords to existing bundled icons
const SERVICE_ICON_MAP: { keywords: string[]; icon: ImageSourcePropType }[] = [
  { keywords: ["netflix"], icon: icons.netflix },
  { keywords: ["youtube"], icon: icons.youtube },
  { keywords: ["spotify"], icon: icons.spotify },
  { keywords: ["adobe", "photoshop", "illustrator", "premiere", "creative cloud"], icon: icons.adobe },
  { keywords: ["github"], icon: icons.github },
  { keywords: ["claude", "anthropic"], icon: icons.claude },
  { keywords: ["notion"], icon: icons.notion },
  { keywords: ["figma"], icon: icons.figma },
  { keywords: ["dropbox"], icon: icons.dropbox },
  { keywords: ["openai", "chatgpt", "gpt"], icon: icons.openai },
  { keywords: ["canva"], icon: icons.canva },
  { keywords: ["medium"], icon: icons.medium },
  { keywords: ["prime", "amazon"], icon: icons.primeVideo },
];

function getIconForName(name: string): ImageSourcePropType {
  const lower = name.toLowerCase();
  for (const entry of SERVICE_ICON_MAP) {
    if (entry.keywords.some((k) => lower.includes(k))) return entry.icon;
  }
  return icons.wallet;
}

interface CreateSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (subscription: Subscription) => void;
}

const CreateSubscriptionModal = ({
  visible,
  onClose,
  onSubmit,
}: CreateSubscriptionModalProps) => {
  const { colorScheme } = useColorScheme();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("Monthly");
  const [category, setCategory] = useState<Category | null>(null);

  const parsedPrice = parseFloat(price);
  const isValid =
    name.trim().length > 0 && !isNaN(parsedPrice) && parsedPrice > 0;

  const handleSubmit = () => {
    if (!isValid) return;
    Keyboard.dismiss();
    const startDate = dayjs().toISOString();
    const renewalDate = dayjs()
      .add(frequency === "Monthly" ? 1 : 12, "month")
      .toISOString();
    const selectedCategory: Category = category ?? "Other";
    const subscription: Subscription = {
      id: `${Date.now()}-${name.trim().toLowerCase().replace(/\s+/g, "-")}`,
      name: name.trim(),
      price: parsedPrice,
      billing: frequency,
      icon: getIconForName(name),
      status: "active",
      startDate,
      renewalDate,
      category: selectedCategory,
      color: "",
    };
    onSubmit(subscription);
    setName("");
    setPrice("");
    setFrequency("Monthly");
    setCategory(null);
    onClose();
  };

  const handleClose = () => {
    Keyboard.dismiss();
    onClose();
  };

  const placeholderColor = colorScheme === "dark" ? "#64748b" : "#94a3b8";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
          onPress={handleClose}
        />
        <View className="modal-container">
          <View className="modal-header">
            <Text className="modal-title">New Subscription</Text>
            <Pressable className="modal-close" onPress={handleClose}>
              <Text className="modal-close-text">✕</Text>
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View className="modal-body">
              <View className="auth-field">
                <Text className="auth-label">Name</Text>
                <TextInput
                  className="auth-input"
                  placeholder="e.g. Netflix, Spotify…"
                  placeholderTextColor={placeholderColor}
                  value={name}
                  onChangeText={setName}
                  returnKeyType="next"
                />
              </View>

              <View className="auth-field">
                <Text className="auth-label">Price</Text>
                <TextInput
                  className="auth-input"
                  placeholder="0.00"
                  placeholderTextColor={placeholderColor}
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
                  returnKeyType="done"
                />
              </View>

              <View className="auth-field">
                <Text className="auth-label">Frequency</Text>
                <View className="picker-row">
                  {(["Monthly", "Yearly"] as Frequency[]).map((f) => (
                    <Pressable
                      key={f}
                      className={clsx(
                        "picker-option",
                        frequency === f && "picker-option-active",
                      )}
                      onPress={() => setFrequency(f)}
                    >
                      <Text
                        className={clsx(
                          "picker-option-text",
                          frequency === f && "picker-option-text-active",
                        )}
                      >
                        {f}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View className="auth-field">
                <Text className="auth-label">Category</Text>
                <View className="category-scroll">
                  {CATEGORIES.map((c) => (
                    <Pressable
                      key={c}
                      className={clsx(
                        "category-chip",
                        category === c && "category-chip-active",
                      )}
                      onPress={() =>
                        setCategory((prev) => (prev === c ? null : c))
                      }
                    >
                      <Text
                        className={clsx(
                          "category-chip-text",
                          category === c && "category-chip-text-active",
                        )}
                      >
                        {c}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <Pressable
                className={clsx(
                  "auth-button",
                  !isValid && "auth-button-disabled",
                )}
                onPress={handleSubmit}
                disabled={!isValid}
              >
                <Text className="auth-button-text">Add Subscription</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CreateSubscriptionModal;
