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
export const dockerRepo = "https://github.com/aelum-dev/docker";
export const hyprlandUrl = "https://hyprland.org/";
export const duxShellUrl = "https://duxlabs.dev/";
export const wailsUrl = "https://wails.io/";
export const goUrl = "https://go.dev/";
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

// System requirements, copied from the installer's own welcome screen
// (installer/frontend/src/translations/*.json → page.welcome.req*). No partition
// scheme is listed: automatic mode erases the disk and writes its own layout.
// The manual mode additionally wants one 512 MB Boot and one 7680 MB System
// partition.
export const requirements = ["UEFI boot", "At least 8 GB of disk space"];

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export const features: Feature[] = [
  {
    icon: "f02da", // nerd-fonts: history
    title: "Snapshots you can go back to",
    description:
      "On a btrfs install, every pacman transaction takes a snapshot before and after it. From the Aelum entry in the rEFInd menu you can start an older state, and snapper rollback makes it the system again.",
  },
  {
    icon: "f03d8", // nerd-fonts: palette
    title: "Colors taken from your wallpaper",
    description:
      "matugen reads your wallpaper and re-themes the shell and your GTK and Qt apps to match it. Dark, light or automatic — choose a wallpaper and the rest of the desktop follows.",
  },
  {
    icon: "eb11", // nerd-fonts: key
    title: "Disk encryption with one passphrase",
    description:
      "If you choose LUKS2 during the install, the only thing you do differently afterwards is type your passphrase into the boot splash.",
  },
  {
    icon: "f0581", // nerd-fonts: volume_off (silent / no noise)
    title: "A branded boot menu and splash",
    description:
      "You get an Aelum rEFInd menu and Plymouth splash instead of boot messages. Each Aelum install on the disk keeps its own boot entry and its own snapshot submenu, so they don't overwrite each other.",
  },
  {
    icon: "f012c", // nerd-fonts: check
    title: "Defaults that are already set",
    description:
      "PipeWire for audio, zram instead of a swap file, and Firefox themed to match the desktop. There is no list of setup steps left for you to do.",
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
    title: "Dux Shell",
    description: "A complete Quickshell-based desktop shell.",
  },
  {
    icon: "f0342", // nerd-fonts: login
    title: "Dux Greeter",
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
    description: "Your apps pick up the current palette without you configuring them.",
  },
  {
    icon: "f120", // nerd-fonts: terminal
    title: "Kitty",
    description: "A fast, GPU-accelerated terminal.",
  },
  {
    icon: "f0239", // nerd-fonts: firefox
    title: "Firefox",
    description: "The browser that ships here, themed to match the desktop.",
  },
  {
    icon: "f02e9", // nerd-fonts: image (branded boot splash)
    title: "Aelum splash",
    description: "The branded Plymouth boot screen, which also asks for your LUKS passphrase.",
  },
];

/** Whole-desktop screenshots the site renders framed — the landing hero and
    the Features page. The subject of these is the desktop itself, so they are
    imported whole (see prepare-sources.py --pair) and keyed desktop-*. */
/** A shot is one or two sets from the manifest. `light` is the primary one — the
    set the document serves before any theme swap — and `dark` the set theme.js
    swaps to in the dark scheme. A subject captured in one theme only has no
    counterpart: its key goes in `light`, the shot carries no swap attributes, and
    both themes show the capture as it was taken (see components/Shot.astro). */
export interface DistroShot {
  light: string;
  /** the dark counterpart, when the subject exists in both themes */
  dark?: string;
  alt: string;
  /** shown as a caption bar under a framed Features shot; the hero renders none */
  caption?: string;
}

export const controlCenterShot: DistroShot = {
  light: "desktop-control-light",
  dark: "desktop-control-dark",
  alt: "The Aelum desktop with the Dux Shell control center open",
};

export const wallpaperSettingsShot: DistroShot = {
  light: "desktop-settings-light",
  dark: "desktop-settings-dark",
  alt: "The Aelum wallpaper and colors settings on the Aelum desktop",
  caption:
    "The wallpaper and colors settings on a fresh install: the wallpaper and its fill mode, light or dark theme mode, and dynamic colors driven by the wallpaper. This is already set up before your first login.",
};

export const lookShots: DistroShot[] = [
  {
    light: "desktop-launcher-light",
    dark: "desktop-launcher-dark",
    alt: "The Aelum app launcher with the apps that ship installed",
    caption:
      "The app launcher: press Super + Space and start typing. A handful of apps come preinstalled — files, browser, editor, media player, terminal.",
  },
  {
    light: "desktop-terminal-light",
    dark: "desktop-terminal-dark",
    alt: "fastfetch output in the kitty terminal on the Aelum desktop",
    caption:
      "fastfetch in kitty: one command that prints what the machine is — OS, kernel, package count, CPU, GPU, memory and disk usage.",
  },
  {
    // Captured in dark only: it is the primary set, so the light theme shows it too.
    light: "desktop-weather-dark",
    alt: "The Dux Shell control center on the Aelum desktop, open on its weather page",
    caption:
      "The control center — one window with tabs for overview, media, wallpapers, weather and digital wellbeing. This one is open on the weather tab.",
  },
  {
    // Captured in dark only, same as the shot above.
    light: "desktop-bar-dark",
    alt: "The Aelum settings window, open on its bar settings",
    caption: "The settings window, where you can customize the look and feel however you want.",
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
// reboot). The copy here states those facts once; the Install and Features
// pages say the same thing in more detail.
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
    title: "Write the ISO to a USB stick",
    description: "Boot it on a UEFI machine. The live session logs in as usual and opens the installer for you.",
  },
  {
    num: "02",
    icon: "f02ca", // nerd-fonts: harddisk
    title: "Answer four questions",
    description:
      "The wizard asks for a language, a user, a disk, and a confirmation. Filesystem, encryption and partitioning are all on the disk screen, and automatic mode erases the whole disk.",
  },
  {
    num: "03",
    icon: "f0379", // nerd-fonts: monitor
    title: "Reboot into the desktop",
    description:
      "The installer writes the system from the ISO itself, which takes about a minute and a half. After a reboot you log in at the Aelum greeter, and the desktop is already themed.",
  },
];

// ---------------------------------------------------------------------------
// The disk question — what gets destroyed
//
// The highest-stakes sentence on an install page, so it is stated once here and
// read by every place it matters: the /install/ disk section, the disk step, the
// dual-boot card. It mirrors the installer's own confirm dialog
// (installer/frontend/src/translations/*.json → dialog.confirm.message and
// .messageManual) and the two code paths: automatic mode runs `sgdisk -Z`,
// which drops the whole partition table before writing a fresh Boot + System
// pair (installer/backend/install/format/format.go); manual mode only touches
// the partitions you assign (installer/backend/install/partition/partition.go)
// and is applied with sgdisk too, so it needs a disk that already carries a GPT
// (or has no table at all) — shared.ValidateManualPartitionTable rejects the rest
// before anything on the disk is written.
// ---------------------------------------------------------------------------

export interface DiskMode {
  icon: string;
  badge: string;
  title: string;
  body: string;
  points: string[];
}

export const diskModesPanel = {
  eyebrow: "The disk step",
  title: "Automatic mode erases the disk; manual mode doesn't",
  sub: "Automatic and manual are the same screen with a switch between them. Only automatic mode destroys data, and it asks you to confirm before anything is written.",
};

export const diskModes: DiskMode[] = [
  {
    icon: "f0029", // nerd-fonts: alert-octagon
    badge: "Automatic mode",
    title: "The whole disk is erased",
    body: "Your whole disk is erased and partitioned from scratch: 512 MB for Boot, the rest for System. Anything that was on it — another OS, your files — is gone.",
    points: ["Use it when the disk is Aelum's alone", "Avoid it on a disk that still holds data you want to keep"],
  },
  {
    icon: "f0498", // nerd-fonts: shield
    badge: "Manual mode",
    title: "Only the partitions you pick are formatted",
    body: "You choose which partitions Aelum uses — one Boot and one System — and only those two are formatted. Everything else on the disk is left as it is, and Aelum writes its own Boot partition instead of reusing another system's.",
    points: [
      "Your other partitions and files are left alone",
      "Needs a 512 MB Boot and a 7680 MB System partition",
      "The disk needs a GPT partition table; on an older MBR disk, use automatic mode",
    ],
  },
];

export const installSteps: Step[] = [
  {
    num: "01",
    icon: "f0ac", // nerd-fonts: globe
    title: "Pick a language",
    description:
      "Choose from 28 languages. The installer and your new system's locale follow that choice, and the installed system gets an Arch mirror list for your region (the worldwide list where Arch has no section for it).",
  },
  {
    num: "02",
    icon: "eb99", // nerd-fonts: account
    title: "Create your user",
    description: "Enter a username and a password. There is nothing else on this screen.",
  },
  {
    num: "03",
    icon: "f02ca", // nerd-fonts: harddisk
    title: "Choose a disk",
    description:
      "Pick the drive, choose ext4 or btrfs, and turn on LUKS2 encryption if you want it. Automatic mode uses the whole drive; switch the same screen to manual mode to keep your other partitions.",
  },
  {
    num: "04",
    icon: "f012c", // nerd-fonts: check
    title: "Confirm",
    description:
      "Check the summary and start the install. In automatic mode the dialog says plainly what is about to happen: all data on this disk will be permanently erased.",
  },
  {
    num: "05",
    icon: "f120", // nerd-fonts: terminal
    title: "The install runs",
    description:
      "Everything the installer needs is on the live ISO, so the install works without internet, and you can follow the eight steps as they run.",
  },
  {
    num: "06",
    icon: "f0379", // nerd-fonts: monitor
    title: "Reboot and log in",
    description: "Reboot, log in at the greeter, and the Hyprland + Dux Shell desktop is there.",
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
