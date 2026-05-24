import { icons } from "./icons";

export const tabs: AppTab[] = [
  { name: "index", title: "Home", icon: icons.home },
  { name: "subscriptions", title: "Subscriptions", icon: icons.wallet },
  { name: "insights", title: "Insights", icon: icons.activity },
  { name: "settings", title: "Settings", icon: icons.setting },
];

export const HOME_USER = {
  name: "Ram Belleza",
};

export const HOME_BALANCE = {
  amount: 2489.48,
  nextRenewalDate: "2026-03-18T09:00:00.000Z",
};

export const UPCOMING_SUBSCRIPTIONS: UpcomingSubscription[] = [
  {
    id: "netflix",
    icon: icons.netflix,
    name: "Netflix",
    price: 1100.0,
    currency: "PHP",
    daysLeft: 2,
  },
  {
    id: "youtube",
    icon: icons.youtube,
    name: "Youtube",
    price: 1254.0,
    currency: "PHP",
    daysLeft: 4,
  },
  {
    id: "prime",
    icon: icons.primeVideo,
    name: "Prime Video",
    price: 1599.0,
    currency: "PHP",
    daysLeft: 6,
  },
];

export const HOME_SUBSCRIPTIONS: Subscription[] = [
  {
    id: "adobe-creative-cloud",
    icon: icons.adobe,
    name: "Adobe Creative Cloud",
    plan: "Teams Plan",
    category: "Design",
    paymentMethod: "Visa ending in 8530",
    status: "active",
    startDate: "2025-03-20T10:00:00.000Z",
    price: 7700.49,
    currency: "PHP",
    billing: "Monthly",
    renewalDate: "2026-03-20T10:00:00.000Z",
    color: "",
  },
  {
    id: "github-pro",
    icon: icons.github,
    name: "GitHub Pro",
    plan: "Developer",
    category: "Developer Tools",
    paymentMethod: "Mastercard ending in 2408",
    status: "active",
    startDate: "2024-11-24T10:00:00.000Z",
    price: 900.99,
    currency: "PHP",
    billing: "Monthly",
    renewalDate: "2026-03-24T10:00:00.000Z",
    color: "",
  },
  {
    id: "claude-pro",
    icon: icons.claude,
    name: "Claude Pro",
    plan: "Pro Plan",
    category: "AI Tools",
    paymentMethod: "Amex ending in 1010",
    status: "paused",
    startDate: "2025-06-27T10:00:00.000Z",
    price: 2000.0,
    currency: "PHP",
    billing: "Monthly",
    renewalDate: "2026-03-27T10:00:00.000Z",
    color: "",
  },
  {
    id: "spotify",
    icon: icons.spotify,
    name: "Spotify ",
    plan: "3 Month Access",
    category: "Music",
    paymentMethod: "Visa ending in 7784",
    status: "cancelled",
    startDate: "2024-04-02T10:00:00.000Z",
    price: 1190.99,
    currency: "PHP",
    billing: "Quarterly",
    renewalDate: "2026-04-02T10:00:00.000Z",
    color: "",
  },
];
