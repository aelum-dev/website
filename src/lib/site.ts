// Shared site data, kept out of the page template so it's easy to review and edit.

// Site navigation. Real routes now — one Astro page per entry (see src/pages/).
// The hrefs carry a trailing slash because astro.config.mjs builds directory
// output (`/download/index.html`), which is what GitHub Pages serves.
export type PageId = "home" | "download" | "install" | "features";

export interface NavLink {
  id: PageId;
  href: string;
  label: string;
}

export const navLinks: NavLink[] = [
  { id: "home", href: "/", label: "Home" },
  { id: "download", href: "/download/", label: "Download" },
  { id: "install", href: "/install/", label: "Install" },
  { id: "features", href: "/features/", label: "Features" },
];

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
    title: "ext4 or btrfs",
    description:
      "Pick ext4 or btrfs — btrfs gets an automatic subvolume layout so every subvolume shares one free-space pool.",
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

// ---------------------------------------------------------------------------
// Home page
//
// The landing page tells the whole story in three moves (boot → answer →
// reboot) and then shows what that looks like. Both are data like every other
// section. The numbers here are the same facts the Install and Features pages
// state; the ISO size is derived from release.ts so it can never drift from the
// file actually published.
// ---------------------------------------------------------------------------

export interface FlowStep {
  num: string;
  icon: string;
  title: string;
  description: string;
}

export const flow: FlowStep[] = [
  {
    num: "01",
    icon: "ede9", // nerd-fonts: USB stick
    title: "Flash it and boot it",
    description:
      "Write the ISO to a USB drive and boot from it. The live session starts a bare Hyprland that opens the installer on its own.",
  },
  {
    num: "02",
    icon: "f02ca", // nerd-fonts: harddisk
    title: "Answer four questions",
    description:
      "Language, user, disk, confirm. Filesystem, encryption and partitioning are all inside the disk question.",
  },
  {
    num: "03",
    icon: "f0379", // nerd-fonts: monitor
    title: "Reboot into your desktop",
    description:
      "The installer writes the system from the ISO in about a minute. Reboot and you are already logged in.",
  },
];

/** One tile of the landing-page showcase grid. `span: "wide"` takes the wider
    column of the bento row; the grid itself is laid out in home.css. */
export type ShowcaseTile =
  | {
      kind: "shot";
      span: "wide" | "";
      light: string;
      dark: string;
      alt: string;
      caption: string;
    }
  | {
      kind: "stat";
      span: "";
      value: string;
      unit: string;
      label: string;
      note: string;
    }
  | {
      kind: "feature";
      span: "wide" | "";
      icon: string;
      title: string;
      description: string;
    };

export const showcase: ShowcaseTile[] = [
  {
    kind: "shot",
    span: "wide",
    light: "installer-step-5-light",
    dark: "installer-step-5-dark",
    alt: "Aelum installer confirming the installation",
    caption: "The last screen. Everything above it is already decided.",
  },
  {
    kind: "stat",
    span: "",
    value: "0",
    unit: "fetches",
    label: "Network calls during install",
    note: "The package mirror lives inside the ISO, so the installer never asks for a connection.",
  },
  {
    kind: "feature",
    span: "",
    icon: "eb11", // nerd-fonts: key
    title: "Encrypted if you want it",
    description: "LUKS2 under the root filesystem, unlocked with a passphrase on the boot splash.",
  },
  {
    kind: "feature",
    span: "",
    icon: "f0570", // nerd-fonts: view_grid
    title: "btrfs layout, ready made",
    description: "@home, @srv, @cache, @tmp and @log on one free-space pool — or plain ext4.",
  },
  {
    kind: "stat",
    span: "",
    value: "4",
    unit: "questions",
    label: "What the wizard asks",
    note: "Language, user, disk, confirm. Nothing else stands between you and a reboot.",
  },
  {
    kind: "shot",
    span: "wide",
    light: "installer-step-7-light",
    dark: "installer-step-7-dark",
    alt: "Aelum installer finishing the installation",
    caption: "Reboot, and the desktop is already waiting for you.",
  },
  {
    kind: "feature",
    span: "",
    icon: "f0581", // nerd-fonts: volume_off (silent boot)
    title: "A splash, not console spam",
    description: "A branded Plymouth boot screen — with the passphrase prompt built into it on encrypted installs.",
  },
];

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
      "Pick the drive, ext4 or btrfs, and optionally LUKS2 encryption — or partition manually for dual-boot.",
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

// The ISO size as the site states it. One formatter so the Download card and the
// landing-page stats can never print two different numbers for one file.
export const isoSizeLabel = `${(release.sizeBytes / 1e9).toFixed(2)} GB`;

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
