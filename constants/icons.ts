import activity from "@/assets/icons/activity.png";
import add from "@/assets/icons/add.png";
import adobeSVG from "@/assets/icons/adobe-2.svg";
import adobe from "@/assets/icons/adobe.png";
import amazonSVG from "@/assets/icons/amazon-prime-video-1.svg";
import back from "@/assets/icons/back.png";
import canva from "@/assets/icons/canva.png";
import claudeSVG from "@/assets/icons/claude-logo.svg";
import claude from "@/assets/icons/claude.png";
import dropbox from "@/assets/icons/dropbox.png";
import figma from "@/assets/icons/figma.png";
import github from "@/assets/icons/github.png";
import home from "@/assets/icons/home.png";
import medium from "@/assets/icons/medium.png";
import menu from "@/assets/icons/menu.png";
import netflixSVG from "@/assets/icons/netflix-logo-icon.svg";
import netflix from "@/assets/icons/netflix.png";
import notion from "@/assets/icons/notion.png";
import openai from "@/assets/icons/openai.png";
import plus from "@/assets/icons/plus.png";
import primeVideo from "@/assets/icons/prime-video.png";
import setting from "@/assets/icons/setting.png";
import spotifySVG from "@/assets/icons/spotify-2.svg";
import spotify from "@/assets/icons/spotify.png";
import wallet from "@/assets/icons/wallet.png";
import youtubeSVG from "@/assets/icons/youtube-icon-8.svg";
import youtube from "@/assets/icons/youtube.png";
import { Image } from "react-native";

export const icons = {
  home,
  wallet,
  setting,
  activity,
  add,
  back,
  menu,
  plus,
  notion,
  dropbox,
  openai,
  adobe,
  medium,
  figma,
  spotify,
  github,
  claude,
  canva,
  adobeSVG,
  amazonSVG,
  claudeSVG,
  netflixSVG,
  spotifySVG,
  youtubeSVG,
  primeVideo,
  youtube,
  netflix,
} as const;

export type IconKey = keyof typeof icons;

function extFromUri(uri: string) {
  const clean = uri.split("?")[0];
  const m = clean.match(/\.([a-zA-Z0-9]+)$/);
  if (!m) return "unknown";
  const ext = m[1].toLowerCase();
  if (ext === "png" || ext === "jpg" || ext === "jpeg" || ext === "svg")
    return ext;
  return ext;
}

export function getIconType(
  icon: any,
): "png" | "jpg" | "jpeg" | "svg" | "svg-component" | "unknown" {
  if (!icon) return "unknown";

  // Packaged asset (require) — number in React Native
  if (typeof icon === "number") {
    try {
      const src = Image.resolveAssetSource(icon);
      if (src && src.uri) return extFromUri(src.uri) as any;
    } catch (e) {
      return "unknown";
    }
  }

  // Expo Asset-like object { uri }
  if (typeof icon === "object" && icon.uri && typeof icon.uri === "string") {
    return extFromUri(icon.uri) as any;
  }

  // Raw uri string
  if (typeof icon === "string") {
    return extFromUri(icon) as any;
  }

  // SVG imports are often React components (functions or objects)
  if (
    typeof icon === "function" ||
    (typeof icon === "object" && icon.$$typeof)
  ) {
    return "svg-component";
  }

  return "unknown";
}
