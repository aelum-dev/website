// Shared site data, kept out of the page template so it's easy to review and edit.

// Site navigation. Real routes now — one Astro page per entry (see src/pages/).
// The hrefs carry a trailing slash because astro.config.mjs builds directory
// output (`/download/index.html`), which is what GitHub Pages serves.
export type PageId = "home" | "download" | "install" | "features" | "faq";

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
  { id: "faq", href: "/faq/", label: "FAQ" },
];

export const mainRepo = "https://github.com/aelum-dev/live-iso";
export const githubUrl = "https://github.com/aelum-dev";
export const discordUrl = "https://discord.gg/EURWsba25";
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

// ---------------------------------------------------------------------------
// FAQ page
//
// The questions people actually ask before they boot the ISO, answered from the
// same sources the rest of the site quotes: the installer's own behaviour
// (backend/install/*, backend/shared/config.go), the live ISO profile, and the
// installer's TROUBLESHOOTING.md. Every number here is a constant or a measured
// figure from those repos, not a rounding: 8 GiB is shared.MinDiskSizeBytes,
// 512 MB is shared.EFIPartitionSizeMB, the 3.2 GB / 4.7 GB usage and the
// ~1.5 minute install are what the live ISO's README states, and the snapshot
// commands are the ones the shipped helper and the pacman hooks run.
//
// Answer copy may contain <code> and <strong>; FAQ.astro renders it as HTML
// (the same pattern the Download page's flash steps use).
// ---------------------------------------------------------------------------

export interface FaqLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FaqItem {
  q: string;
  a: string;
  points?: string[];
  commands?: string[];
  links?: FaqLink[];
}

export interface FaqGroup {
  /** anchor id, also the jump link in the page's index row */
  id: string;
  eyebrow: string;
  icon: string;
  title: string;
  blurb: string;
  items: FaqItem[];
}

export const faqGroups: FaqGroup[] = [
  {
    id: "about",
    eyebrow: "About Aelum",
    icon: "f108",
    title: "What Aelum is",
    blurb:
      "An Arch Linux distribution with one unusual property: the installer carries every package it installs. Most of the rest of this page follows from that.",
    items: [
      {
        q: "What is Aelum, exactly?",
        a: "An Arch Linux distribution whose installer needs no network. The ISO carries a complete package mirror, so the install reads only from the USB stick you booted it on. What it writes is a normal Arch desktop — Hyprland with Dux Shell — on a disk layout the installer prepares itself, with its own boot entry and its own boot splash.",
      },
      {
        q: "Is it Arch Linux? A fork of Arch?",
        a: "It installs from Arch's official repositories with pacstrap, and after the install it is an Arch system: the same pacman, the same systemd, the same repositories, the same AUR. Aelum is everything built around that base — the live session, the installer, the desktop configuration, the boot theme. It is an independent project, not an official Arch Linux product and not a fork of Arch.",
      },
      {
        q: "Do I have to reinstall to stay current?",
        a: "No. The ISO is only a starting point, and its version is the date it was built. Once installed, your system moves forward the way any Arch machine does: <code>sudo pacman -Syu</code>. A newer ISO matters only when you want to install on another machine.",
      },
      {
        q: "Why bother with an offline installer?",
        a: "An install that needs no network cannot fail at a mirror, and a machine that has just been wiped — no drivers configured yet, no cable plugged in — still ends up with a complete desktop. It also means the install is reproducible: the packages you got are the packages that were in the image.",
      },
      {
        q: "Is it free and open source?",
        a: "GPL-3.0, in every part of it: the live session, the installer, the pipeline that builds the ISO, and this website. The source is public, and every release is signed so you can check the file you downloaded against the key published on this domain.",
        links: [{ label: "Sources on GitHub", href: githubUrl, external: true }],
      },
      {
        q: "Does Aelum collect anything about me or my machine?",
        a: "Nothing. The install makes no network calls at all, and the installed system ships no account, no telemetry service and no update path that goes through Aelum instead of Arch. We have no way to know you installed it unless you tell us.",
      },
    ],
  },
  {
    id: "hardware",
    eyebrow: "Before you boot",
    icon: "f035b",
    title: "Hardware, firmware and the live session",
    blurb:
      "The installer checks the disk before it writes anything to it. These are the requirements it enforces, and the ones it deliberately leaves alone.",
    items: [
      {
        q: "What machine do I need?",
        a: "The installer enforces the disk size and nothing else. There is no swap partition or swap file to make room for either: the installed system uses zram, compressed swap in RAM, so the space you have left is yours.",
        points: [
          "A 64-bit x86_64 machine.",
          "UEFI firmware.",
          "At least 8 GB free on the disk it installs to — a smaller disk is refused before anything is written.",
          `A USB drive large enough for the ${isoSizeLabel} image.`,
        ],
      },
      {
        q: "Legacy BIOS or UEFI?",
        a: "The image boots either way — syslinux for legacy BIOS, GRUB for UEFI — so you can start the live session on an older machine. Installing wants UEFI: an EFI system partition, rEFInd, and a firmware boot entry are what make the installed system start on its own.",
      },
      {
        q: "What about Secure Boot?",
        a: "The installer does not configure Secure Boot and does not sign the kernel or the boot loader for it. On a machine that enforces it, turn Secure Boot off (or enroll your own keys) before installing.",
      },
      {
        q: "Do I need internet to install?",
        a: "No — that is the point of the ISO. Every package comes from the mirror inside it, and the installer never opens a connection. You need a network afterwards: for updates, and for anything you add yourself.",
      },
      {
        q: "Can I try Aelum without installing it?",
        a: "No. The ISO is installation media. The live session exists to run the installer: it boots, logs in, and opens the installer window.",
        links: [{ label: "Installing from the terminal", href: "/install/#cli" }],
      },
      {
        q: "Does it run in a virtual machine?",
        a: "Yes — with UEFI firmware (OVMF / edk2) and a virtual disk of 8 GB or more. Every install variation Aelum publishes is tested exactly this way: a real virtual disk, a real partition table, a real firmware boot entry, checked after the install.",
      },
      {
        q: "Can I install onto a USB SSD or an external drive?",
        a: "Yes. The installer treats it like any other disk and writes its own firmware boot entry. Some firmware keeps removable devices out of the boot order, so the first boot may need one pick from your firmware's boot menu.",
      },
      {
        q: "Can I boot the ISO from Ventoy?",
        a: "Yes. Ventoy, BalenaEtcher and <code>dd</code> all work; the Download page walks through each one. The Aelum boot theme even ships its own Ventoy and USB glyphs, so a Ventoy stick in the menu is recognisable at a glance.",
        links: [{ label: "Writing the ISO", href: "/download/#install-tools" }],
      },
      {
        q: "Will it work on my GPU?",
        a: "The install ships <code>linux-firmware</code> and the open Vulkan drivers — <code>vulkan-radeon</code>, <code>vulkan-intel</code>, <code>vulkan-nouveau</code> — so AMD and Intel are ready as installed, and NVIDIA works through Nouveau. If you want the proprietary NVIDIA driver, install <code>nvidia</code> with pacman afterwards.",
      },
    ],
  },
  {
    id: "install",
    eyebrow: "The installer",
    icon: "f012c",
    title: "Running the installer",
    blurb:
      "Four questions, eight steps, about a minute and a half. The window and the command line run the same implementation, so they end in the same system.",
    items: [
      {
        q: "What does the installer actually ask?",
        a: "Four things, in this order: a language, a username and password, a disk, and a confirmation. Filesystem, encryption and the partitioning mode are all on the disk screen, so there is no fifth question waiting for you later.",
      },
      {
        q: "How long does an install take?",
        a: "About a minute and a half on a modern disk. Two package-install stages do nearly all of it; partitioning, the boot loader and configuration take the rest. Each step is named in the window as it runs.",
      },
      {
        q: "What happens after I press confirm?",
        a: "Eight steps, in this order:",
        points: [
          "Format the disk",
          "Mount the filesystem",
          "Install the base system",
          "Install the desktop",
          "Create your user",
          "Configure the system",
          "Clear the package cache",
          "Verify the result",
        ],
      },
      {
        q: "What software do I get?",
        a: "A desktop, not a base system you have to assemble yourself:",
        points: [
          "Hyprland, Dux Shell and the Dux Greeter login (greetd)",
          "Kitty, Nautilus, GNOME Text Editor, Firefox, mpv, imv",
          "PipeWire audio with WirePlumber",
          "matugen and the GTK / Qt theming that follows it",
          "btop, fastfetch, brightnessctl, ddcutil",
          "NetworkManager, bluez, power-profiles-daemon, zram, sudo, vim, nano",
          "rEFInd with the Aelum theme, and the Aelum Plymouth splash",
          "On a btrfs install: snapper and btrfs-assistant",
        ],
      },
      {
        q: "Does it set my keyboard layout, timezone and locale?",
        a: "Yes, from the language you choose. Each of the 28 languages maps to a region, and that one choice writes the system locale, the keyboard layout, the timezone, NTP, and a mirror list of Arch mirrors in your region. Change any of it later with <code>localectl</code> or <code>timedatectl</code>.",
        links: [{ label: "The 28 languages", href: "/install/#languages" }],
      },
      {
        q: "Can I run the install from the terminal?",
        a: "The live session ships a headless installer next to the GUI. It runs the same eight steps and ends with the same system, which is what makes an install scriptable. Passwords are read from stdin only, never from a flag, and <code>--dry-run</code> walks the whole flow without touching a disk.",
        commands: [
          "sudo /usr/local/bin/aelum-installer-cli --install /dev/sda",
          "sudo /usr/local/bin/aelum-installer-cli --install /dev/sda --filesystem ext4",
          "sudo /usr/local/bin/aelum-installer-cli --install /dev/sda --luks --lvm",
          "echo 'your password' | sudo /usr/local/bin/aelum-installer-cli --install /dev/sda",
        ],
      },
      {
        q: "The install failed. Where do I look?",
        a: "The live session keeps a log at <code>/var/log/aelum-install-&lt;timestamp&gt;.log</code>, and the window names the step and the command that failed. Open the newest file and search for <code>ERROR:</code>. Then roll the disk back and start again — and attach that log when you report the problem.",
        commands: [
          'tail -50 "$(ls -t /var/log/aelum-install-*.log | head -1)"',
          "sudo /usr/local/bin/aelum-installer-cli --rollback /dev/sda",
        ],
      },
      {
        q: "Can I run the installer again on the same disk?",
        a: "Yes. Automatic mode clears the partition table and starts from nothing; manual mode formats only the two partitions you assign. If an earlier attempt left something half-written, run the rollback first: it releases mounts and volume groups and wipes filesystem signatures.",
      },
    ],
  },
  {
    id: "disk",
    eyebrow: "The disk",
    icon: "f02ca",
    title: "Partitions, filesystems and encryption",
    blurb: "The one decision that can cost you data, and the choices that decide what you can undo later.",
    items: [
      {
        q: "Will automatic mode erase my disk?",
        a: "Yes — completely. It drops the partition table, writes a 512 MB FAT32 Boot partition and one System partition with the rest of the disk, and the confirmation dialog says in plain words that all data on this disk will be permanently erased. Use it on a disk that is Aelum's alone.",
      },
      {
        q: "I have another operating system, or files, on that disk.",
        a: "Switch the same screen to manual mode. You designate one Boot and one System partition, only those two are formatted, and every other partition is left exactly as it was. Two things to know first: the disk needs a GPT partition table (an MBR disk is refused before anything on it is written, and automatic mode would clear it and write a GPT), and Aelum wants its own Boot partition — pointing it at another system's ESP formats that ESP and destroys that system's boot loaders.",
        points: [
          "Aelum mounts only the partitions it owns; mount your old data yourself afterwards.",
          "Manual mode needs a 512 MB Boot and a 7680 MB System partition on top of the 8 GB floor.",
        ],
        links: [{ label: "The two modes, side by side", href: "/install/#disk" }],
      },
      {
        q: "btrfs or ext4?",
        a: "btrfs is the default, and it is the one with the behaviour: subvolumes for <code>@</code>, <code>@home</code>, <code>@srv</code>, <code>@cache</code>, <code>@tmp</code> and <code>@log</code>; the system installed into <code>@/.snapshots/1/snapshot</code>, which is the filesystem's default subvolume; snapper configured for <code>@</code> and <code>@home</code>; a snapshot pair around every pacman transaction; and a snapshot submenu under your boot entry. ext4 is one plain partition — no subvolumes, no snapper, no snapshot menu. Choose ext4 if you want the simplest layout you can inspect by hand; choose btrfs if you want a state you can go back to.",
      },
      {
        q: "How much space does the installed system use?",
        a: "Roughly 3.2 GB on btrfs and 4.7 GB on ext4. The 8 GB floor exists so the system has room to grow: your files, the package cache, and on btrfs the snapshot history.",
      },
      {
        q: "Can I encrypt my disk?",
        a: "Turn on LUKS2 on the disk screen and type a passphrase once. Afterwards the only thing that has changed is that you type that passphrase into the Aelum boot splash. Encryption covers the whole System partition — there is no home-only encryption — and it always sits below LVM when you choose both.",
      },
      {
        q: "Can I add encryption to an install I already made?",
        a: "Not with the installer: it has no re-encryption mode and no in-place LUKS conversion. Make the choice on the disk screen, or install again with encryption on.",
      },
      {
        q: "What does LVM buy me?",
        a: "One physical volume on the System partition, one volume group named after the install, and two logical volumes, <code>root</code> and <code>home</code>, which you can resize or move later. It changes nothing about how the system boots: the fstab and the boot entries reference filesystem UUIDs, never <code>/dev/mapper</code> paths.",
      },
      {
        q: "Swap: partition or file?",
        a: "Neither, on purpose. The installed system uses zram — compressed swap in RAM, configured through zram-generator — so no disk space is reserved for it and no snapshot carries an old swap file with it.",
      },
      {
        q: "Can I install Aelum twice on one disk?",
        a: "Yes, and each install needs its own pair of partitions. Automatic mode clears the partition table before it writes anything, so the second install has to run in manual mode with the first install's partitions left as <strong>Preserve</strong>. Manual mode always formats the Boot and System partitions you pick, so two installs cannot share one Boot partition — the second install would erase the first one's boot loaders.",
        points: [
          "Each install gets its own Boot partition, its own rEFInd on it, and its own firmware boot entry.",
          "Each keeps its kernel and initramfs in <code>aelum/&lt;id&gt;/</code> on its own ESP, bind-mounted at <code>/boot</code>, and its own menu fragment at <code>EFI/refind/aelum/&lt;id&gt;.conf</code>.",
          "Menu entries and firmware entries are titled with the root partition, so the two read as <code>Aelum (sda2)</code> and <code>Aelum (sda3)</code>.",
        ],
      },
      {
        q: "Where is the EFI partition once installed?",
        a: "Mounted at <code>/efi</code>. That install's boot directory is bind-mounted at <code>/boot</code>, which is why <code>pacman</code> and <code>mkinitcpio</code> keep working exactly as usual while the files physically stay in the install's own ESP directory.",
      },
    ],
  },
  {
    id: "boot",
    eyebrow: "Boot & recovery",
    icon: "f02da",
    title: "Boot menu, snapshots and going back",
    blurb:
      "On a btrfs install, every pacman transaction leaves a state behind. This is how you find one, boot it, and make it the system again.",
    items: [
      {
        q: "What bootloader do I get?",
        a: "rEFInd, written into Aelum's Boot partition with the Aelum theme, plus one menu entry per install that boots that install's own kernel by filesystem UUID. rEFInd also scans the other ESPs on the disk, so another operating system usually appears in the same menu.",
      },
      {
        q: "How do I reach the snapshots?",
        a: "On a btrfs install: in the boot menu, select the Aelum entry and press <code>F2</code> — Insert, Tab and <code>+</code> work too. The submenu lists your snapshots, each titled with its number, date and type. Choosing one boots that state read-only as <code>/</code>.",
      },
      {
        q: "How do I make an older state the system again?",
        a: "Boot it. The desktop then asks — in the language your system uses — whether to restore that state. OK runs the restore helper and, once it succeeds, offers the reboot that boots the restored system; CANCEL closes the prompt and changes nothing. A rollback takes an undo snapshot of the state you were in first, so this is reversible.",
        points: [
          'From a terminal, name the number: without one, <code>snapper rollback</code> means "the state I am booted in", which is only the right answer from inside a snapshot.',
          "Your user is in <code>wheel</code> and snapper allows <code>wheel</code>, so this needs no sudo.",
          "<code>/home</code>, <code>/srv</code>, <code>/var/cache</code>, <code>/var/tmp</code> and <code>/var/log</code> are separate subvolumes and stay the live ones: a rollback changes the system, not your files.",
        ],
        commands: ["pkexec /usr/local/bin/aelum-snapshot-restore --reboot", "snapper -c root rollback 7"],
      },
      {
        q: "Which snapshots exist, and where do they come from?",
        a: "Every transaction makes its own pair, and only the states someone chose are kept:",
        points: [
          "A pre and post snapshot around every <code>pacman</code> transaction, so an update's effect can be listed exactly.",
          "A third hook marks that pair important when the transaction touched a kernel, <code>glibc</code>, <code>systemd</code>, <code>btrfs-progs</code>, <code>snapper</code>, <code>refind</code>, <code>mkinitcpio</code>, the firmware or a Mesa / Vulkan driver — the states a rollback is for.",
          "Timed snapshot creation is off: a timer that fired at 03:00 is not a state anyone decided to be able to return to.",
          "Limits are set as ranges, so old ordinary pairs are cleaned up automatically while important ones are kept.",
        ],
      },
      {
        q: "Are snapshots a backup?",
        a: "No. They live in <code>@/.snapshots</code>, on the same disk. They save you from a bad update, not from a dead drive — copy what matters somewhere else.",
      },
      {
        q: "Can I see what an update changed?",
        a: "Yes. Two snapshots of the same transaction are a diff waiting to be read: <code>snapper -c root undochange 7..8</code> lists what changed between them. <code>btrfs-assistant</code> is installed on btrfs systems as the window onto the same history.",
      },
      {
        q: "Booting a snapshot feels different. Is something wrong?",
        a: "The root is read-only, and that is deliberate: it lets you log in, compare and copy before deciding. The installer plans for it — a systemd generator puts tmpfs over the state directories a read-only root cannot write, so a snapshot boot reaches the greeter instead of a text login, and <code>/etc/resolv.conf</code> is a symlink to the running resolver, so a snapshot still resolves names. The desktop prompt tells you which state you are in.",
      },
      {
        q: "There is no Aelum entry in my firmware boot menu.",
        a: "Some firmware — and some virtual machines — refuses the NVRAM write. The installer logs it as a warning and finishes; the system is still bootable. Pick the drive in your firmware's boot menu and choose <code>EFI/refind/refind_x64.efi</code>.",
      },
      {
        q: "Another operating system doesn't appear in the menu.",
        a: "rEFInd scans every readable ESP; Aelum's own config suppresses only duplicate fallback loaders. Check that the other system's loader actually exists on its ESP — <code>EFI/systemd/systemd-bootx64.efi</code>, or a <code>linux*</code> entry under <code>loader/entries</code> — and that <code>refind.conf</code> has no <code>dont_scan_dirs</code> or <code>dont_scan_files</code> line covering it.",
      },
      {
        q: "Can I replace rEFInd with GRUB or systemd-boot?",
        a: "It is Arch — you can. Know what you are removing: the Aelum theme, the per-install entries and the snapshot submenu are rEFInd pieces. Without it you keep your system and lose the boot menu that lists your states.",
      },
      {
        q: "I chose ext4. Where are my snapshots?",
        a: "There are none. An ext4 install has no subvolumes, no snapper and no snapshot submenu — it is a plain filesystem, and going back means your own backup or a reinstall.",
      },
    ],
  },
  {
    id: "desktop",
    eyebrow: "The desktop",
    icon: "f03d8",
    title: "Living on Hyprland + Dux Shell",
    blurb: "The parts that are already configured, and the few things that deliberately are not.",
    items: [
      {
        q: "The colours change when I change the wallpaper. Why?",
        a: "That is matugen. Pick a wallpaper in the control center and the shell, your GTK apps and your Qt apps follow it; light, dark or automatic is a setting in the same place. The point is that you choose a picture, not a palette.",
        links: [{ label: "See the settings", href: "/features/" }],
      },
      {
        q: "How do I start applications?",
        a: "Press Super + Space and start typing. A handful of apps is already installed — files, browser, editor, media player, terminal — and anything else you add from the repositories shows up there too.",
      },
      {
        q: "Is it Wayland only? Will my X11 apps run?",
        a: "Hyprland is a Wayland compositor and the login screen is greetd with Dux Greeter, not an X11 display manager. Older X11 applications run through XWayland.",
      },
      {
        q: "Can I use GNOME, KDE or another compositor instead?",
        a: "Yes — the installed system is Arch. Install another desktop from the repositories and it is there, with its own session. What you would be replacing is Aelum's own configuration: the greeter, the theme, and the snapshot prompt that lives in the shell.",
      },
      {
        q: "Do I need a root password?",
        a: "No. The user you created is in <code>wheel</code> and sudo works with your password. The one privileged action the desktop offers as a button — restoring a snapshot — goes through polkit, so it asks for the same authentication instead of a separate secret.",
      },
      {
        q: "Can I change the language after installing?",
        a: "The system locale is yours to change with <code>localectl</code>. The shell's own translations are not complete in every language yet — the desktop language is a setting in Dux Shell, and the prompt that asks about a booted snapshot follows the system's language at the moment it appears.",
      },
      {
        q: "Is there an ad blocker in Firefox?",
        a: "Firefox ships themed to match the desktop, and a distribution policy installs uBlock Origin on its first launch. That first launch needs internet; after it, nothing is fetched for the add-on.",
      },
      {
        q: "Will it print?",
        a: "Not out of the box: there is no CUPS in the image, so there is no printer queue set up. Install <code>cups</code> and your driver from the repositories if you need one.",
      },
      {
        q: "Bluetooth, brightness, power?",
        a: "Bluetooth is installed and enabled, as is NetworkManager. Screen brightness goes through <code>brightnessctl</code>, external-monitor power through <code>ddcutil</code>, and power profiles through <code>power-profiles-daemon</code> — all of them already wired to the shell's controls.",
      },
    ],
  },
  {
    id: "support",
    eyebrow: "Updates & help",
    icon: "f0965",
    title: "Updates, source and getting help",
    blurb: "After the install, Aelum behaves like Arch. Here is where the Aelum-specific parts stop.",
    items: [
      {
        q: "How do I update the system?",
        a: "<code>sudo pacman -Syu</code>, like any Arch machine. The mirrorlist in your system already points at Arch mirrors in the region you chose. The mirror inside the ISO is used while installing and nothing after that. Your home also starts with three shortcuts in <code>~/.bashrc</code>: <code>app-search</code> (<code>pacman -Ss</code>) to look for a package, <code>app-install</code> (<code>sudo pacman -Syu</code>) to update and install, and <code>app-remove</code> (<code>sudo pacman -Rsn</code>) to drop one along with the dependencies nobody else needs. They are ordinary shell aliases — change or delete them in that file if you would rather type the commands yourself.",
      },
      {
        q: "Is the AUR available?",
        a: "Yes — it is Arch, so install whichever AUR helper you like. Four of the desktop's own pieces (qtengine, dux-greeter-bin, fluent-icon-theme, nautilus-open-any-terminal) are built from the AUR into the ISO, which is why they are already there when you boot.",
      },
      {
        q: "How do I know the ISO I downloaded is genuine?",
        a: "Every release publishes SHA-256 and SHA-512 checksums and a detached GPG signature, and the release key is published on this domain over WKD so <code>gpg</code> can fetch it by email. The three commands are on the Download page.",
        links: [{ label: "Verify the download", href: "/download/" }],
      },
      {
        q: "How often does a new ISO come out?",
        a: "A release is published when there is something to ship, and its version is the date of that build. You never need a new ISO to keep an installed system current.",
      },
      {
        q: "Where do I report a problem?",
        a: "On GitHub, against the installer for anything that happens during or right after an install. Include what you expected, what you got, the disk and filesystem you chose, the ISO version, and the install log — it names the step and the command.",
        links: [{ label: "Installer issues", href: `${installerRepo}/issues`, external: true }],
      },
      {
        q: "Where do I ask questions?",
        a: "Discord is where the project is discussed day to day: install questions, desktop questions, and the parts of the docs that turned out to be unclear.",
        links: [{ label: "Discord", href: discordUrl, external: true }],
      },
      {
        q: "Can I build my own ISO?",
        a: "Yes. The live session profile and the installer are separate public repositories under the same GitHub organisation, both GPL-3.0: the profile is archiso content, and the installer is Go and Svelte with tests you can run without a disk. Building an ISO from them needs an Arch machine, root, and about 25 GB of free space.",
        links: [{ label: "aelum-dev on GitHub", href: githubUrl, external: true }],
      },
    ],
  },
];
