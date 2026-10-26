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
    icon: "f05aa", // nerd-fonts: wifi-off
    title: "Fully offline install",
    description:
      "Every package is baked into the ISO and served from an embedded local mirror. The install never touches the network.",
  },
  {
    icon: "f06a9", // nerd-fonts: robot
    title: "Starts on its own",
    description:
      "On the live ISO, greetd logs in as the live user and starts a minimal Hyprland, and that session launches the installer. No terminal, no commands.",
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
      "Automatic mode erases the whole disk. Manual mode formats only the Boot and System partitions you assign; every other partition is left as it is, and Aelum writes its own Boot partition instead of reusing another OS's ESP.",
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
      "The boot entries carry quiet splash loglevel=3, so the Aelum Plymouth splash covers the boot — including the passphrase prompt on encrypted installs.",
  },
  {
    icon: "f037a", // nerd-fonts: monitor-multiple
    title: "Auto monitor scaling",
    description:
      "The live session reads each connected monitor and sets a Hyprland scale for it (1.0 / 1.33 / 2.0 for 1080p / 1440p / 4K). The installed desktop uses Hyprland's own automatic scale.",
  },
  {
    icon: "f051b", // nerd-fonts: timer
    title: "About a minute and a half",
    description:
      "Nothing is downloaded during install. Partitioning, both package runs, the bootloader and verification take under 95 seconds end to end in our QEMU test installs (20 GB virtual disk). The finished system uses about 3.2 GB on btrfs (compressed) or 4.7 GB on ext4.",
  },
  {
    icon: "f120", // nerd-fonts: terminal
    title: "GUI or CLI",
    description:
      "Use the graphical wizard, or run a headless install with the aelum-installer-cli binary that ships in the same ISO. Passwords are read from stdin, never from a flag.",
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
    description: "The shipped browser, themed to match the desktop.",
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
      "Write the ISO to a USB drive and boot it on a UEFI machine. The live session logs itself in and opens the installer.",
  },
  {
    num: "02",
    icon: "f02ca", // nerd-fonts: harddisk
    title: "Answer four questions",
    description:
      "Language, user, disk, confirm. Filesystem, encryption and partitioning are all inside the disk question — and automatic mode erases the whole disk.",
  },
  {
    num: "03",
    icon: "f0379", // nerd-fonts: monitor
    title: "Reboot into your desktop",
    description:
      "The installer writes the system from the ISO in about a minute and a half. Reboot, log in at the Aelum greeter, and the desktop is already themed.",
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
    caption: "The summary before it starts. Everything above it is already decided.",
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
    note: "Language, user, disk, confirm. Manual partitioning is on the disk page, not an extra step.",
  },
  {
    kind: "shot",
    span: "wide",
    light: "installer-step-7-light",
    dark: "installer-step-7-dark",
    alt: "Aelum installer finishing the installation",
    caption: "Reboot, log in, and the desktop is there.",
  },
  {
    kind: "feature",
    span: "",
    icon: "f0581", // nerd-fonts: volume_off (silent boot)
    title: "A splash, not console spam",
    description: "A branded Plymouth boot screen — with the passphrase prompt built into it on encrypted installs.",
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
  eyebrow: "Disk selection step",
  title: "Automatic erases the disk. Manual doesn't.",
  sub: "Automatic and Manual are a switch on the disk screen, not a separate step, and only one of the two destroys data. The installer says the same thing on its own confirm dialog before anything is written.",
};

export const diskModes: DiskMode[] = [
  {
    icon: "f0029", // nerd-fonts: alert-octagon
    badge: "Automatic mode",
    title: "Erases the whole disk",
    body: "Automatic wipes the disk's partition table and writes a new layout from scratch: one 512 MB Boot partition and one System partition using the rest of the drive. Every partition that was on that disk — another OS, your files — is gone, and the installer says so in those words before it starts.",
    points: ["Right when the disk is Aelum's alone", "Not right on a disk that still holds data you want"],
  },
  {
    icon: "f0498", // nerd-fonts: shield
    badge: "Manual mode",
    title: "Formats only what you assign",
    body: "Manual lists the partitions already on the disk and formats only the two you mark — one Boot, one System. Everything else stays exactly as it is, and Aelum writes its own Boot partition rather than reusing another OS's ESP.",
    points: [
      "Other partitions and their data are left untouched",
      "Needs a 512 MB Boot and a 7680 MB System partition",
      "Needs a GPT partition table — automatic mode rewrites an older MBR one",
    ],
  },
];

export const installSteps: Step[] = [
  {
    num: "01",
    icon: "f0ac", // nerd-fonts: globe
    title: "Pick a language",
    description:
      "Choose from 28 languages. This sets the installer UI and your system locale, and writes a regional Arch mirror list for the installed system (worldwide mirrors where Arch lists none).",
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
      "Pick the drive, ext4 or btrfs, and optionally LUKS2 encryption. Automatic mode wipes the disk's partition table and takes the whole drive; switch the same screen to Manual to keep your other partitions.",
  },
  {
    num: "04",
    icon: "f012c", // nerd-fonts: check
    title: "Confirm",
    description:
      "Review the summary, then hit install. On automatic mode the dialog spells out what it is about to do: all data on this disk will be permanently erased.",
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
    description: "Reboot, log in at the greeter, and the Hyprland + DankMaterialShell desktop is ready.",
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
