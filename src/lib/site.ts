// Shared site data, kept out of the page template so it's easy to review and edit.

export const ghRepo = "https://github.com/KornienkoDev/AestheticOS-Installer";
export const isoRepo = "https://github.com/KornienkoDev/AestheticOS";
export const hyprlandUrl = "https://hyprland.org/";
export const dmsUrl = "https://github.com/AvengeMedia/DankMaterialShell";
export const wailsUrl = "https://wails.io/";
export const ventoyUrl = "https://www.ventoy.io/";

// The 28 languages the installer UI supports.
export const languages = [
  "English",
  "Deutsch",
  "Français",
  "Español",
  "Italiano",
  "Português",
  "Русский",
  "Українська",
  "中文",
  "日本語",
  "한국어",
  "Tiếng Việt",
  "Polski",
  "Nederlands",
  "Svenska",
  "Norsk",
  "Čeština",
  "Magyar",
  "Română",
  "Ελληνικά",
  "Türkçe",
  "עברית",
  "हिन्दी",
  "বাংলা",
  "தமிழ்",
  "ไทย",
  "पर्सी",
  "فارسی",
];

export interface Feature {
  color: string;
  icon: string;
  title: string;
  description: string;
}

export const features: Feature[] = [
  {
    color: "#9b7ff2",
    icon: "faa9", // nerd-fonts: wifi-off
    title: "Fully offline installer",
    description:
      "Every package is embedded in the ISO and served from an embedded local mirror. Zero network dependency during install.",
  },
  {
    color: "#ff7ac6",
    icon: "fba7", // nerd-fonts: robot
    title: "Zero-touch boot",
    description:
      "Greetd launches a barebones Hyprland that starts the installer automatically on first boot. No manual commands, no thinking about it.",
  },
  {
    color: "#6fd0ff",
    icon: "fa80", // nerd-fonts: volume-off
    title: "Silent boot",
    description:
      "A clean UEFI splash with the Plymouth BGRT theme shows your OEM logo — no console spam, no boot-time noise.",
  },
  {
    color: "#63e6a0",
    icon: "f879", // nerd-fonts: monitor-multiple
    title: "Auto monitor scaling",
    description:
      "Live ISO detects the connected monitor and applies the right Hyprland scale automatically, so the installer is crisp on 1080p, 1440p, or 4K.",
  },
  {
    color: "#9b7ff2",
    icon: "fa1a", // nerd-fonts: timer
    title: "~1 minute install",
    description:
      "Because every package is already included, install takes about a minute and the complete OS uses roughly 4.7 GB after install.",
  },
  {
    color: "#63e6a0",
    icon: "f108", // nerd-fonts: feather
    title: "Minimal live ISO",
    description:
      "The live ISO is intentionally barebones — its only job is to boot and launch the installer. No extra tools, no clutter to clean up.",
  },
];

export interface Software {
  title: string;
  description: string;
}

export const software: Software[] = [
  {
    title: "Hyprland",
    description:
      "Dynamic tiling window manager with DankMaterialShell for a clean, modern look.",
  },
  {
    title: "DMS Greeter",
    description: "A fast login screen that matches the desktop theme.",
  },
  {
    title: "matugen",
    description:
      "Generates matching color schemes from your wallpaper automatically.",
  },
  { title: "Alacritty", description: "A fast, GPU-accelerated terminal." },
  {
    title: "Firefox",
    description: "Firefox browser, pre-configured and themed to match.",
  },
  { title: "PipeWire", description: "Modern audio handling, ready to go." },
  {
    title: "Plymouth BGRT",
    description: "Silent boot splash reading your OEM logo from UEFI.",
  },
  {
    title: "GTK + Qt theming",
    description: "Matugen-themed automatically — no manual theming.",
  },
  {
    title: "ZRAM swap",
    description:
      "Compressed RAM swap instead of a swap file — fast, responsive, and no disk space reserved for a swap file.",
  },
];

export interface Step {
  num: string;
  title: string;
  description: string;
}

export const installSteps: Step[] = [
  {
    num: "01",
    title: "Pick a language",
    description:
      "Choose from 28 languages. This sets the installer UI, your system locale, and the mirror country.",
  },
  {
    num: "02",
    title: "Create your user",
    description: "Set up your username and password in a couple of fields.",
  },
  {
    num: "03",
    title: "Choose a disk",
    description: "Select the target drive and pick between ext4 or btrfs.",
  },
  {
    num: "04",
    title: "Confirm",
    description: "Review the summary, then hit install. That's it.",
  },
  {
    num: "05",
    title: "Watch it go",
    description:
      "The installer runs entirely from the live ISO — no internet needed.",
  },
  {
    num: "06",
    title: "Boot into it",
    description: "Reboot into a finished Hyprland + DankMaterialShell desktop.",
  },
];
