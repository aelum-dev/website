// Shared site data, kept out of the page template so it's easy to review and edit.

export const mainRepo = "https://gitlab.com/aelum/live-iso";
export const installerRepo = "https://gitlab.com/aelum/installer";
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
  "简体中文",
  "繁體中文",
  "日本語",
  "한국어",
  "Tiếng Việt",
  "Polski",
  "Nederlands",
  "Svenska",
  "Norsk",
  "Magyar",
  "Ελληνικά",
  "Türkçe",
  "עברית",
  "فارسی",
  "العربية",
  "Български",
  "Català",
  "Esperanto",
  "Suomi",
  "Bahasa Indonesia",
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
    icon: "f05aa", // nerd-fonts: wifi-off
    title: "Fully offline installer",
    description:
      "Every package is embedded in the ISO and served from an embedded local mirror. Zero network dependency during install.",
  },
  {
    color: "#ff7ac6",
    icon: "f06a9", // nerd-fonts: robot
    title: "Zero-touch boot",
    description:
      "Greetd launches a barebones Hyprland that starts the installer automatically on first boot. No manual commands, no thinking about it.",
  },
  {
    color: "#6fd0ff",
    icon: "f0581", // nerd-fonts: volume_off (silent / no noise)
    title: "Silent boot",
    description:
      "A clean UEFI splash with the Plymouth BGRT theme shows your OEM logo — no console spam, no boot-time noise.",
  },
  {
    color: "#63e6a0",
    icon: "f037a", // nerd-fonts: monitor-multiple
    title: "Auto monitor scaling",
    description:
      "Live ISO detects the connected monitor and applies the right Hyprland scale automatically, so the installer is crisp on 1080p, 1440p, or 4K.",
  },
  {
    color: "#9b7ff2",
    icon: "f051b", // nerd-fonts: timer
    title: "~1 minute install",
    description:
      "Because every package is already included, install takes about a minute and the complete OS uses roughly 4.7 GB after install.",
  },
  {
    color: "#63e6a0",
    icon: "ede9", // nerd-fonts: compact_disc (live ISO media)
    title: "Minimal live ISO",
    description:
      "The live ISO is intentionally barebones — its only job is to boot and launch the installer. No extra tools, no clutter to clean up.",
  },
];

export interface Software {
  color: string;
  icon: string;
  title: string;
  description: string;
}

export const software: Software[] = [
  {
    color: "#6fd0ff",
    icon: "f0570", // nerd-fonts: view_grid (tiling)
    title: "Hyprland",
    description: "Dynamic tiling window manager.",
  },
  {
    color: "#ff7ac6",
    icon: "f108", // nerd-fonts: desktop
    title: "DankMaterialShell",
    description: "A complete desktop shell for Wayland compositors.",
  },
  {
    color: "#9b7ff2",
    icon: "f0342", // nerd-fonts: login
    title: "DMS Greeter",
    description: "A fast login screen that matches the desktop theme.",
  },
  {
    color: "#5ad1c4",
    icon: "ee26", // nerd-fonts: brush
    title: "GTK + Qt theming",
    description: "Matugen-themed automatically — no manual theming.",
  },
  {
    color: "#ffc153",
    icon: "f03d8", // nerd-fonts: palette
    title: "Matugen",
    description: "Generates matching color schemes from your wallpaper.",
  },
  {
    color: "#ff8a54",
    icon: "f0239", // nerd-fonts: firefox
    title: "Firefox",
    description: "The browser, pre-configured and themed to match.",
  },
  {
    color: "#63e6a0",
    icon: "f02e9", // nerd-fonts: image (OEM logo splash)
    title: "Plymouth BGRT",
    description: "Silent boot splash reading your OEM logo from UEFI.",
  },
  {
    color: "#ff6b89",
    icon: "f035b", // nerd-fonts: memory
    title: "ZRAM swap",
    description: "Compressed RAM swap instead of a swap file.",
  },
];

export interface Step {
  num: string;
  icon: string;
  title: string;
  description: string;
}

export const installSteps: Step[] = [
  {
    num: "01",
    icon: "f0ac", // nerd-fonts: globe
    title: "Pick a language",
    description:
      "Choose from 28 languages. This sets the installer UI, your system locale, and the mirror country.",
  },
  {
    num: "02",
    icon: "eb99", // nerd-fonts: account
    title: "Create your user",
    description: "Set up your username and password in a couple of fields.",
  },
  {
    num: "03",
    icon: "f02ca", // nerd-fonts: harddisk
    title: "Choose a disk",
    description: "Select the target drive and pick between ext4 or btrfs.",
  },
  {
    num: "04",
    icon: "f012c", // nerd-fonts: check
    title: "Confirm",
    description: "Review the summary, then hit install. That's it.",
  },
  {
    num: "05",
    icon: "f120", // nerd-fonts: terminal
    title: "Watch it go",
    description:
      "The installer runs entirely from the live ISO — no internet needed.",
  },
  {
    num: "06",
    icon: "f0379", // nerd-fonts: monitor
    title: "Boot into it",
    description: "Reboot into a finished Hyprland + DankMaterialShell desktop.",
  },
];
