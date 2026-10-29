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
export const duxShellUrl = "https://github.com/duxlabs-dev/dux-shell";
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
      "Every package the installer needs is inside the ISO, served from a mirror embedded in it. Nothing is downloaded during the install.",
  },
  {
    icon: "f06a9", // nerd-fonts: robot
    title: "Starts on its own",
    description:
      "Boot the ISO and the installer is already opening — the live session logs in and starts it for you. You never touch a terminal.",
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
      "Automatic mode erases the whole disk, so use it only on a disk that's Aelum's alone. Next to another OS, use Manual: it formats only the Boot and System partitions you assign, leaves everything else alone, and Aelum writes its own Boot partition instead of reusing another OS's.",
  },
  {
    icon: "f0570", // nerd-fonts: view_grid
    title: "ext4 or btrfs",
    description:
      "Pick ext4 or btrfs. With btrfs, the subvolume layout is set up for you and every subvolume shares one free-space pool.",
  },
  {
    icon: "f0581", // nerd-fonts: volume_off (silent / no noise)
    title: "Silent boot",
    description:
      "Boot entries carry quiet splash loglevel=3, so you see the Aelum splash instead of boot logs — on encrypted installs, even the passphrase prompt is part of the splash.",
  },
  {
    icon: "f037a", // nerd-fonts: monitor-multiple
    title: "Auto monitor scaling",
    description:
      "Plug a monitor into the live session and it picks a scale for it (1.0 / 1.33 / 2.0 for 1080p / 1440p / 4K). The installed desktop leaves scaling to Hyprland itself.",
  },
  {
    icon: "f051b", // nerd-fonts: timer
    title: "About a minute and a half",
    description:
      "Nothing is downloaded, so the whole install — partitioning, package runs, bootloader, verification — takes under 95 seconds end to end in our QEMU test installs (20 GB virtual disk). The finished system uses about 3.2 GB on btrfs (compressed) or 4.7 GB on ext4.",
  },
  {
    icon: "f120", // nerd-fonts: terminal
    title: "GUI or CLI",
    description:
      "Use the graphical wizard, or run the install headless with aelum-installer-cli, which ships in the same ISO. Passwords are read from stdin, never from a flag.",
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
    title: "Flash it and boot it",
    description:
      "Write the ISO to a USB stick and boot it on a UEFI machine. The live session logs in and opens the installer for you.",
  },
  {
    num: "02",
    icon: "f02ca", // nerd-fonts: harddisk
    title: "Answer four questions",
    description:
      "Language, user, disk, confirm — that's the whole wizard. Filesystem, encryption and partitioning are all on the disk screen, and automatic mode erases the whole disk.",
  },
  {
    num: "03",
    icon: "f0379", // nerd-fonts: monitor
    title: "Reboot into your desktop",
    description:
      "The installer writes the system from the ISO in about a minute and a half. Reboot, log in at the Aelum greeter, and the desktop is already themed.",
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
  sub: "Automatic and Manual are the same screen with a switch between them. Only Automatic destroys data, and you're asked to confirm before anything is written.",
};

export const diskModes: DiskMode[] = [
  {
    icon: "f0029", // nerd-fonts: alert-octagon
    badge: "Automatic mode",
    title: "Erases the whole disk",
    body: "Your whole disk is erased and partitioned from scratch: 512 MB for Boot, the rest for System. Anything that was on it — another OS, your files — is gone.",
    points: ["Best when the disk is Aelum's alone", "Avoid it on a disk that still has data you want"],
  },
  {
    icon: "f0498", // nerd-fonts: shield
    badge: "Manual mode",
    title: "Formats only what you assign",
    body: "You choose which partitions Aelum uses — one Boot, one System — and only those two are formatted. Everything else on the disk stays untouched, and Aelum makes its own Boot partition instead of reusing another OS's.",
    points: [
      "Your other partitions and files are left alone",
      "Needs a 512 MB Boot and a 7680 MB System partition",
      "The disk needs a GPT partition table; on an older MBR disk, use Automatic",
    ],
  },
];

export const installSteps: Step[] = [
  {
    num: "01",
    icon: "f0ac", // nerd-fonts: globe
    title: "Pick a language",
    description:
      "Pick from 28 languages. The installer UI and your system locale follow your choice, and the installed system gets a regional Arch mirror list (worldwide mirrors where Arch lists none).",
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
      "Pick the drive, ext4 or btrfs, and LUKS2 encryption if you want it. Automatic mode takes the whole drive; flip the same screen to Manual to keep your other partitions.",
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
    description: "Reboot, log in at the greeter, and the Hyprland + Dux Shell desktop is ready.",
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
