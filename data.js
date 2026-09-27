/* ============================================================
   ChainVerifier Website — Data (No Emoji)
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
    telegram: "https://t.me/owumode",
    website: "https://owumode.store",
    author: "OwuMode",
    license: "Free (Proprietary)",

    logo: "logo.png",
    previewImage: "preview.png",
    screenshots: [
        { src: "Screenshot-1.png", title: "Chain Verification", desc: "Resolve pointer chains against any running process" },
        { src: "Screenshot-2.png", title: "AOB Pattern Scan",    desc: "Search memory with wildcards for byte patterns" },
        { src: "Screenshot-3.png", title: "Hex Viewer",          desc: "View and edit raw memory bytes as hex at any address." }
    ]
};


const APP_FEATURES = [
    {
        icon: "chain",
        title: "Chain Verification",
        desc: "Add unlimited pointer chains and resolve them live against any running process. Color-coded match / no-match / error results with per-chain descriptions."
    },
    {
        icon: "search",
        title: "5 Scanning Modes",
        desc: "AOB pattern scan with wildcards, range scan, unknown value scan, string scan (ASCII + UTF-16), and full pointer scan."
    },
    {
        icon: "tools",
        title: "Built-in Tools",
        desc: "Freeze manager with background thread, hex viewer/editor, Cheat Engine pointer map import (auto-detects format)."
    },
    {
        icon: "palette",
        title: "Fully Customizable UI",
        desc: "Dark theme with 6 presets — light, blue, purple, green, custom. Adjust fonts, colors, row height, and panel visibility."
    },
    {
        icon: "zap",
        title: "Auto-Tuned Performance",
        desc: "Detects CPU cores and RAM on launch, auto-configures thread count and buffer size. Or pick Battery Saver / Balanced / Performance / Extreme."
    },
    {
        icon: "refresh",
        title: "Auto-Update",
        desc: "Silent startup check notifies you when a newer version is available — one click to download."
    },
    {
        icon: "save",
        title: "Encrypted Save Files",
        desc: "Chains saved as .owu files with XOR + SHA-256 checksum + zlib compression. Portable and tamper-resistant."
    },
    {
        icon: "undo",
        title: "Undo / Redo",
        desc: "Every chain edit is reversible with Ctrl+Z / Ctrl+Y. 100-step history stack keeps your work safe."
    },
    {
        icon: "export",
        title: "Export Results",
        desc: "Save verification results as CSV, JSON, or plain text with one click."
    }
];


/* ═══════════════════════════════════════════════════════════
   APP VERSIONS
   - sha256: run `certutil -hashfile <file> SHA256` in Windows
   - vtUrl:  upload to virustotal.com → copy "GUI URL"
   ═══════════════════════════════════════════════════════════ */

const APP_VERSIONS = [
    {
        id: 1,
        version: "v1.0.0",
        size: "44 MB",
        fileName: "ChainVerifier-v1.0.0-Windows-x64.zip",
        url: "https://github.com/owuMode/ChainVerifier/releases/download/v1.0.0/ChainVerifier-v1.0.0-Windows-x64.zip",
        releasePageUrl: "https://github.com/owuMode/ChainVerifier/releases/tag/v1.0.0",
        date: "2026-09-23",
        isLatest: true,

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
        a: "Yes — completely free. No ads, no registration, no hidden fees. Download the ZIP, extract, and run."
    },
    {
        q: "Do I need to run it as Administrator?",
        a: "Yes. To attach to other processes and read/write their memory, Windows requires admin privileges. Right-click ChainVerifier.exe and select Run as Administrator."
    },
    {
        q: "Will it work on 32-bit Windows?",
        a: "ChainVerifier is built for 64-bit Windows only (Windows 10 and 11). It can still attach to 32-bit target processes running on a 64-bit system."
    },
    {
        q: "Can antivirus flag it?",
        a: "Some antivirus tools flag any process-memory tool as a PUP or hacktool — this is a false positive. The source code is public on GitHub. Add an exclusion for the ChainVerifier folder if needed."
    },
    {
        q: "How do I update to a new version?",
        a: "ChainVerifier checks GitHub on startup and shows a dialog when an update is available. Click Download Latest to get the new ZIP."
    },
    {
        q: "Where are chain files saved?",
        a: "You choose the location when you save — files use the .owu extension. They are portable and encrypted."
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


/* ═══════════════════════════════════════════════════════════
   i18n STRINGS
   ═══════════════════════════════════════════════════════════ */

const I18N = {
    en: {
        "nav.home": "Home",
        "nav.download": "Download",
        "nav.docs": "Docs",
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
    },
    hi: {
        "nav.home": "होम",
        "nav.download": "डाउनलोड",
        "nav.docs": "डॉक्स",
        "nav.changelog": "चेंजलॉग",
        "nav.faq": "सवाल-जवाब",
        "hero.label": "लेटेस्ट रिलीज़",
        "hero.title.line1": "ढूंढो और वेरिफाई करो",
        "hero.title.line2": "पॉइंटर चेन्स",
        "hero.desc": "Windows के लिए एक आधुनिक पॉइंटर चेन वेरिफायर और मेमोरी स्कैनर। डार्क UI, पांच स्कैन मोड, ऑटो-अपडेट — फ्री, कोई विज्ञापन नहीं।",
        "hero.btn.download": "फ्री डाउनलोड",
        "hero.btn.docs": "डॉक्स देखें",
        "stat.latest": "लेटेस्ट",
        "stat.size": "डाउनलोड साइज़",
        "stat.downloads": "डाउनलोड्स",
        "stat.free": "100% फ्री",
        "stat.noAds": "कोई विज्ञापन नहीं",
        "cta.title": "ट्राई करने के लिए तैयार?",
        "cta.desc": "नया ChainVerifier डाउनलोड करें — फ्री, वायरस-फ्री, कोई रजिस्ट्रेशन नहीं।",
        "cta.download": "अभी डाउनलोड करें",
        "cta.docs": "डॉक्स पढ़ें",
        "common.viewAll": "सभी देखें"
    }
};
