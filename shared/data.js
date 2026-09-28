/* ============================================================
   ChainVerifier Website — Data (English only)
   ============================================================ */

const APP_INFO = {
    name: "ChainVerifier",
    slug: "chainverifier",
    tagline: "Pointer Chain Verifier & Memory Scanner for Windows",
    shortDescription: "A modern pointer chain verifier and memory scanner for Windows — find, verify and manage static pointer chains with a dark, professional interface.",

    repo: "https://github.com/owuMode/ChainVerifier",
    repoApi: "https://api.github.com/repos/owuMode/ChainVerifier",
    releasesApi: "https://api.github.com/repos/owuMode/ChainVerifier/releases",
    releasesUrl: "https://github.com/owuMode/ChainVerifier/releases",
    issuesUrl: "https://github.com/owuMode/ChainVerifier/issues",
    telegram: "https://t.me/owumode_chat",
    website: "https://owumode.store",
    author: "OwuMode",
    license: "Free (Proprietary)",

    logo: "logo.png",
    previewImage: "preview.png",
    screenshots: [
        { src: "assest/Screenshot-1.png", title: "Chain Verification", desc: "Resolve pointer chains against any running process" },
        { src: "assest/Screenshot-2.png", title: "AOB Pattern Scan",    desc: "Search memory with wildcards for byte patterns" },
        { src: "assest/Screenshot-3.png", title: "Hex Viewer",          desc: "View and edit raw memory bytes as hex at any address." }
    ]
};


const APP_FEATURES = [
    {
        icon: "chain",
        title: "Chain Verification",
        desc: "Add unlimited pointer chains and resolve them live against any running process. Batch verify millions of chains in under 1 second with the C++ backend. Color-coded match / no-match / error results with per-chain descriptions."
    },
    {
        icon: "search",
        title: "5 Scanning Modes",
        desc: "AOB pattern scan with wildcards, range scan, unknown value scan, string scan (ASCII + UTF-16), and full pointer scan. Auto-detects 32-bit / 64-bit processes."
    },
    {
        icon: "tools",
        title: "Built-in Tools",
        desc: "Bulk freeze manager with visual indicator, hex viewer/editor, Cheat Engine pointer map import (auto-detects format), and Send-to-Chains shortcut."
    },
    {
        icon: "palette",
        title: "Custom Dark UI",
        desc: "Modern dark theme with splash screen. Customizable fonts, colors, row height, and panel visibility. Real-time value updates with highlight on change."
    },
    {
        icon: "zap",
        title: "C++ Performance",
        desc: "Full C++ backend with multi-threaded parallel scanning, chunked region scanning (1 MB chunks), and adaptive threading. Battery Saver / Balanced / Performance / Extreme modes."
    },
    {
        icon: "refresh",
        title: "Auto-Update",
        desc: "Silent startup check notifies you when a newer version is available — one click to download. Windows native notifications with logo."
    },
    {
        icon: "save",
        title: "Encrypted Save Files",
        desc: "Chains saved as .owu files with XOR + SHA-256 checksum + zlib compression. Portable and tamper-resistant. Auto-save with backups."
    },
    {
        icon: "undo",
        title: "Undo / Redo + Hotkeys",
        desc: "C++ ring buffer undo/redo and global hotkeys (Ctrl+Alt+A / S / F / H) for fast workflow. Threaded file I/O keeps the UI responsive."
    },
    {
        icon: "export",
        title: "Single Portable EXE",
        desc: "One file, zero dependencies. Download the ZIP, extract the single ChainVerifier.exe, and run. No Python, no installer, no _internal folder."
    }
];


const APP_VERSIONS = [
    {
        id: 2,
        version: "v2.0.0",
        size: "42 MB",
        fileName: "ChainVerifier_v2.0.0-Windows-x64.zip",
        url: "https://github.com/owuMode/ChainVerifier/releases/download/v2.0.0/ChainVerifier_v2.0.0-Windows-x64.zip",
        releasePageUrl: "https://github.com/owuMode/ChainVerifier/releases/tag/v2.0.0",
        date: "2026-09-28",
        isLatest: true,

        sha256: "",
        vtUrl:  "",

        changelog: [
            "Full C++ backend for pointer scanning and chain verification",
            "Batch verify — millions of chains in under 1 second",
            "Single portable EXE — no _internal folder required",
            "Custom dark-themed UI with modern design",
            "Bulk freeze with visual indicator",
            "Multi-select chains with bulk delete",
            "Real-time value update with highlight on change",
            "Global hotkeys (Ctrl+Alt+A / S / F / H)",
            "Custom splash screen",
            "Windows native notifications with logo",
            "Auto-save with backups",
            "File logging with rotation",
            "Sound notifications (Windows default)",
            "Taskbar flash on important events",
            "Undo/redo with C++ ring buffer",
            "Threaded file I/O (no UI freeze)",
            "Auto-detect 32-bit / 64-bit processes",
            "Chunked region scanning (1 MB chunks)",
            "Multi-threaded parallel scan",
            "Send to Chains button",
            "Static filter with is_static flag",
            "Fixed UTF-16 string scan false positives",
            "Fixed atomic max_results enforcement",
            "Fixed freeze int64 precision loss",
            "Fixed negative offset UB in follow_chain",
            "Fixed freeze dialog hang on stop",
            "Fixed duplicate hotkey registration",
            "Fixed WNDPROC crash on hotkeys",
            "Fixed notification UI block"
        ]
    },
    {
        id: 1,
        version: "v1.0.0",
        size: "44 MB",
        fileName: "ChainVerifier-v1.0.0-Windows-x64.zip",
        url: "https://github.com/owuMode/ChainVerifier/releases/download/v1.0.0/ChainVerifier-v1.0.0-Windows-x64.zip",
        releasePageUrl: "https://github.com/owuMode/ChainVerifier/releases/tag/v1.0.0",
        date: "2026-09-23",
        isLatest: false,

        sha256: "",
        vtUrl:  "",

        changelog: [
            "Initial public release",
            "Chain verification with live value updates",
            "AOB, Range, Unknown, String, Pointer scans",
            "Freeze manager, Hex viewer/editor",
            "Cheat Engine .sqlite pointer map import",
            "Fully customizable dark UI",
            "Auto-update check from GitHub",
            "Encrypted .owu save files"
        ]
    }
];


const APP_REQUIREMENTS = {
    minimum: [
        "OS: Windows 10 (64-bit)",
        "RAM: 4 GB",
        "Storage: 150 MB free space",
        "Permissions: Administrator (required for attaching)",
        "Display: 1100 x 720 or higher recommended"
    ],
    recommended: [
        "OS: Windows 11 (64-bit)",
        "RAM: 8 GB or more",
        "Storage: 250 MB free space",
        "Permissions: Run as Administrator",
        "Display: 1920 x 1080 full HD"
    ]
};


const APP_FAQ = [
    {
        q: "Is ChainVerifier free?",
        a: "Yes — completely free. No ads, no registration, no hidden fees. Download the ZIP, extract the single EXE, and run."
    },
    {
        q: "Do I need to run it as Administrator?",
        a: "Yes. To attach to other processes and read/write their memory, Windows requires admin privileges. Right-click ChainVerifier.exe and select Run as Administrator."
    },
    {
        q: "Is it a single EXE? Do I need Python?",
        a: "v2.0.0 ships as a single portable EXE. No Python installation, no _internal folder, no dependencies. Just extract the ZIP and run ChainVerifier.exe."
    },
    {
        q: "Will it work on 32-bit Windows?",
        a: "ChainVerifier is built for 64-bit Windows only (Windows 10 and 11). It can still attach to 32-bit target processes running on a 64-bit system."
    },
    {
        q: "Can antivirus flag it?",
        a: "Some antivirus tools flag any process-memory tool as a PUP or hacktool — this is a false positive. The source code is public on GitHub. Add an exclusion for the ChainVerifier folder if needed. Windows SmartScreen may also warn on the unsigned EXE — click More info then Run anyway."
    },
    {
        q: "How do I update to a new version?",
        a: "ChainVerifier checks GitHub on startup and shows a native Windows notification when an update is available. Click Download Latest to get the new ZIP."
    },
    {
        q: "Where are chain files saved?",
        a: "You choose the location when you save — files use the .owu extension. They are portable and encrypted. Auto-save creates timestamped backups automatically."
    },
    {
        q: "Can it attach to any process?",
        a: "Any process your user account can access and that isn't protected by kernel-level anti-cheat. Games with EAC, BattlEye, or Vanguard will block memory access — this is expected."
    },
    {
        q: "Does it work without internet?",
        a: "Yes — all core features work offline. The only feature that needs internet is the auto-update check."
    }
];


const I18N = {
    en: {
        "nav.home": "Home",
        "nav.download": "Download",
        "nav.docs": "Docs",
        "nav.manual": "Manual",
        "nav.changelog": "Changelog",
        "nav.faq": "FAQ",
        "hero.label": "Latest Release",
        "hero.title.line1": "Find & Verify",
        "hero.title.line2": "Pointer Chains",
        "hero.desc": "A modern pointer chain verifier and memory scanner for Windows. Dark UI, five scanning modes, auto-update — free, no ads.",
        "hero.btn.download": "Download Free",
        "hero.btn.docs": "View Docs",
        "stat.latest": "Latest",
        "stat.size": "Download Size",
        "stat.downloads": "Downloads",
        "stat.free": "100% Free",
        "stat.noAds": "No Ads",
        "cta.title": "Ready to try it?",
        "cta.desc": "Download the latest ChainVerifier — free, virus-free, no registration required.",
        "cta.download": "Download Now",
        "cta.docs": "Read Docs",
        "common.viewAll": "View All"
    }
};
