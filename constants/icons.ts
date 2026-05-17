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
import notion from "@/assets/icons/notion.png";
import openai from "@/assets/icons/openai.png";
import plus from "@/assets/icons/plus.png";
import setting from "@/assets/icons/setting.png";
import spotifySVG from "@/assets/icons/spotify-2.svg";
import spotify from "@/assets/icons/spotify.png";
import wallet from "@/assets/icons/wallet.png";
import youtubeSVG from "@/assets/icons/youtube-icon-8.svg";

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
} as const;

export type IconKey = keyof typeof icons;
