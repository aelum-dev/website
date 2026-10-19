// Shared site data, kept out of the page template so it's easy to review and edit.

export const mainRepo = "https://github.com/aelum-dev/live-iso";
export const githubUrl = "https://github.com/aelum-dev";
export const installerRepo = "https://github.com/aelum-dev/installer";
export const hyprlandUrl = "https://hyprland.org/";
export const dmsUrl = "https://github.com/AvengeMedia/DankMaterialShell";
export const wailsUrl = "https://wails.io/";
export const ventoyUrl = "https://www.ventoy.net/en/download.html";
export const balenaEtcherUrl = "https://etcher.balena.io/#download-etcher";

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
  icon: string;
  title: string;
  description: string;
}

export const features: Feature[] = [
  {
    icon: "f05aa", // nerd-fonts: wifi-off
    title: "Fully offline install",
    description:
      "Every package is baked into the ISO and served from an embedded local mirror. The install never touches the network.",
  },
  {
    icon: "f06a9", // nerd-fonts: robot
    title: "Zero-touch installer",
    description: "greetd starts a barebones Hyprland that opens the installer on its own. No terminal, no commands.",
  },
  {
    icon: "eb11", // nerd-fonts: key
    title: "Optional LUKS2 encryption",
    description: "Encrypt the root partition with LUKS2 and unlock it with a passphrase at boot.",
  },
  {
    icon: "f02ca", // nerd-fonts: harddisk
    title: "Dual-boot safe",
    description:
      "Manual mode only touches the Boot and Root partitions you pick — mark the rest Preserve to keep another OS and your files.",
  },
  {
    icon: "f0570", // nerd-fonts: view_grid
    title: "ext4, btrfs, or LVM",
    description:
      "Pick ext4 or btrfs — btrfs gets an automatic subvolume layout — optionally on top of LVM logical volumes.",
  },
  {
    icon: "f0581", // nerd-fonts: volume_off (silent / no noise)
    title: "Silent boot",
    description:
      "A branded Aelum Plymouth splash — with passphrase unlock on encrypted installs — instead of console spam.",
  },
  {
    icon: "f037a", // nerd-fonts: monitor-multiple
    title: "Auto monitor scaling",
    description: "Each connected monitor gets the right Hyprland scale automatically — crisp at 1080p, 1440p, and 4K.",
  },
  {
    icon: "f051b", // nerd-fonts: timer
    title: "~1 minute install",
    description:
      "Nothing is downloaded during install, so a full system lands on disk in about a minute — roughly 3.2 GB on btrfs (compression) or 4.7 GB on ext4.",
  },
  {
    icon: "f120", // nerd-fonts: terminal
    title: "GUI or CLI",
    description: "Use the graphical wizard, or script a headless install with the aelum-installer-cli binary.",
  },
];

export interface Software {
  icon: string;
  title: string;
  description: string;
}

export const software: Software[] = [
  {
    icon: "f0570", // nerd-fonts: view_grid (tiling)
    title: "Hyprland",
    description: "Dynamic tiling Wayland compositor.",
  },
  {
    icon: "f108", // nerd-fonts: desktop
    title: "DankMaterialShell",
    description: "A complete Quickshell-based desktop shell.",
  },
  {
    icon: "f0342", // nerd-fonts: login
    title: "DMS Greeter",
    description: "A fast login screen that matches the desktop theme.",
  },
  {
    icon: "f03d8", // nerd-fonts: palette
    title: "Matugen",
    description: "Generates matching GTK, Qt, and shell colors from your wallpaper.",
  },
  {
    icon: "ee26", // nerd-fonts: brush
    title: "GTK + Qt theming",
    description: "Apps are re-themed automatically — no manual theming.",
  },
  {
    icon: "f120", // nerd-fonts: terminal
    title: "Kitty",
    description: "A fast, GPU-accelerated terminal.",
  },
  {
    icon: "f0239", // nerd-fonts: firefox
    title: "Firefox",
    description: "Themed to match, and shipped with uBlock Origin.",
  },
  {
    icon: "f02e9", // nerd-fonts: image (branded boot splash)
    title: "Aelum splash",
    description: "Branded Plymouth boot screen with LUKS passphrase unlock.",
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
    description: "Choose from 28 languages. This sets the installer UI, your system locale, and the mirror country.",
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
    description:
      "Pick the drive, ext4 or btrfs, and optionally LUKS2 encryption or LVM — or partition manually for dual-boot.",
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
    description: "The installer runs entirely from the live ISO — no internet needed.",
  },
  {
    num: "06",
    icon: "f0379", // nerd-fonts: monitor
    title: "Boot into it",
    description: "Reboot into a finished Hyprland + DankMaterialShell desktop.",
  },
];

// ---------------------------------------------------------------------------
// Download / release metadata
//
// All of the values below are derived from src/lib/release.ts, which is
// AUTO-GENERATED on every release by docker/scripts/gen-release-metadata.sh
// (and committed to this repo, or overwritten in CI by scripts/fetch-release.mjs).
// This keeps the website's download links in lockstep
// with the files actually published to Cloudflare R2 — no manual editing.
//
// The committed release.ts doubles as an offline baseline, so the site builds
// fine without network access (the deployed site itself makes no network calls).
// ---------------------------------------------------------------------------
import { release } from "./release";

export const releaseVersion = release.version;
export const releaseArch = release.arch;
export const isoFilename = release.filename;
export const releaseSizeBytes = release.sizeBytes;
export const releasePublishedAt = release.publishedAt;

// Direct download URLs for the ISO and its published sidecars. The checksum,
// signature, and signing key files are all downloadable, so the verification
// section can link straight to them.
export const downloadUrl = {
  iso: release.urls.iso,
  sha256: release.urls.sha256,
  sha512: release.urls.sha512,
  signature: release.urls.signature,
} as const;

// Verification data, shown in the Download section. Kept in one place so the
// component never reaches into the generated release.ts directly.
export const checksums = {
  sha256: release.sha256,
  sha512: release.sha512,
} as const;

export const signingKey = release.signingKey;

// ---------------------------------------------------------------------------
// Signing key distribution + verification commands
// ---------------------------------------------------------------------------
// The release key is also published over WKD (Web Key Directory), so `gpg` can
// fetch it straight from aelum.dev by email — no keyserver and no manual import.
//
// The `hu/<hash>` path is z-base-32(SHA-1(local-part)), derived from the signing
// email, so it changes if that email ever changes. Keep it in sync with
// website/public/.well-known/openpgpkey/ (generated by docker/scripts/export-wkd.sh).
export const signingEmail = signingKey.uid.match(/<([^>]+)>/)?.[1] ?? "";
export const wkdBaseUrl = "https://aelum.dev/.well-known/openpgpkey";
export const wkdKeyUrl = `${wkdBaseUrl}/hu/y84sdmnksfqswe7fxf5mzjg53tbdz8f5?l=release`;

// The exact commands shown on the site, single-sourced so the page (and any
// docs) can never drift from the real filenames/email.
export const verifyCommands = {
  fetchKey: `gpg --auto-key-locate clear,wkd --locate-key ${signingEmail}`,
  checksum: `sha256sum -c ${release.filename}.sha256`,
  signature: `gpg --verify ${release.filename}.asc ${release.filename}`,
} as const;
