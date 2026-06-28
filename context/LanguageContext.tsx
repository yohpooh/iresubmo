import React, { createContext, useContext, useState } from "react";

type Language = "en" | "fil";

const en = {
  settings: "Settings",
  editProfile: "Edit Profile",
  preferences: "Preferences",
  notificationsAndSounds: "Notifications and sounds",
  language: "Language",
  english: "English",
  filipino: "Filipino",
  theme: "Theme",
  account: "Account",
  password: "Password",
  loginWithFaceId: "Login with Face ID",
  paymentMethods: "Payment methods",
  reportAnIssue: "Report an issue",
  termsAndPrivacyPolicy: "Terms and Privacy Policy",
  logout: "Logout",
  editProfileTitle: "Edit Profile",
  firstName: "First Name",
  lastName: "Last Name",
  changePhoto: "Change Photo",
  save: "Save",
  cancel: "Cancel",
  changePassword: "Change Password",
  currentPassword: "Current Password",
  newPassword: "New Password",
  confirmPassword: "Confirm Password",
  passwordMismatch: "Passwords do not match",
  reportIssue: "Report an Issue",
  issueType: "Issue Type",
  describeIssue: "Describe your issue",
  submit: "Submit",
  selectLanguage: "Select Language",
  termsTitle: "Terms and Privacy Policy",
} as const;

const fil: typeof en = {
  settings: "Mga Setting",
  editProfile: "I-edit ang Profile",
  preferences: "Mga Kagustuhan",
  notificationsAndSounds: "Mga Abiso at Tunog",
  language: "Wika",
  english: "Ingles",
  filipino: "Filipino",
  theme: "Tema",
  account: "Account",
  password: "Password",
  loginWithFaceId: "Mag-login gamit ang Face ID",
  paymentMethods: "Mga Paraan ng Bayad",
  reportAnIssue: "Mag-ulat ng Isyu",
  termsAndPrivacyPolicy: "Mga Tuntunin at Patakaran",
  logout: "Mag-logout",
  editProfileTitle: "I-edit ang Profile",
  firstName: "Unang Pangalan",
  lastName: "Apelyido",
  changePhoto: "Palitan ang Larawan",
  save: "I-save",
  cancel: "Kanselahin",
  changePassword: "Baguhin ang Password",
  currentPassword: "Kasalukuyang Password",
  newPassword: "Bagong Password",
  confirmPassword: "Kumpirmahin ang Password",
  passwordMismatch: "Hindi magkatugma ang mga password",
  reportIssue: "Mag-ulat ng Isyu",
  issueType: "Uri ng Isyu",
  describeIssue: "Ilarawan ang iyong isyu",
  submit: "Isumite",
  selectLanguage: "Piliin ang Wika",
  termsTitle: "Mga Tuntunin at Patakaran sa Privacy",
};

const translations = { en, fil };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof en;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t: translations[language] }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
