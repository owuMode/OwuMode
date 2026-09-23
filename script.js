/* =========================================================
   OwuMode - Main Script
   ========================================================= */

let PRODUCTS = [];

// Cache
const DOWNLOAD_COUNTS = {};
let VISITOR_COUNT = 0;


/* =========================================================
   JSONBIN SETTINGS
   ========================================================= */

const JSONBIN_BIN_ID = "6ab26f19ffd5d1605322e359";
const JSONBIN_API_KEY = "$2a$10$RLbYDBBgLAt9fbfPwm4ORe5LBvZF82w/VcDM0PcHeLnNwNt02r/gu";

const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

const VISITOR_STORAGE_KEY = "owumode_visited";


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const gameGrid = document.getElementById("gameGrid");
const modesPageGrid = document.getElementById("modesPageGrid");
const nomodes = document.getElementById("noModes");
const gameCount = document.getElementById("gameCount");

const gameModal = document.getElementById("gameModal");

const modalTitle = document.getElementById("modalTitle");
const modalCategory = document.getElementById("modalCategory");
const modalPlatform = document.getElementById("modalPlatform");
const modalDescription = document.getElementById("modalDescription");
const modalFile = document.getElementById("modalFile");
const modalImage = document.getElementById("modalImage");
const modalDownload = document.getElementById("modalDownload");
const versionSelect = document.getElementById("versionSelect");

const headerSearch = document.getElementById("headerSearch");
const modesSearch = document.getElementById("ModesSearch");

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navMenu = document.getElementById("navMenu");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

const visitorCountEl = document.getElementById("visitorCount");


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHTML(value) {
    if (value === null || value === undefined) return "";

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   GET LATEST VERSION
   ========================================================= */

function getLatestVersion(game) {
    if (!game.versions || game.versions.length === 0) {
        return null;
    }

    let latest = game.versions.find(v => v.isLatest === true);

    if (!latest) {
        latest = [...game.versions].sort((a, b) =>
            new Date(b.date || 0) - new Date(a.date || 0)
        )[0];
    }

    return latest;
}


/* =========================================================
   GET SORTED VERSIONS (latest pehle)
   ========================================================= */

function getSortedVersions(game) {
    if (!game.versions || game.versions.length === 0) return [];

    return [...game.versions].sort((a, b) =>
        new Date(b.date || 0) - new Date(a.date || 0)
    );
}


/* =========================================================
   DOWNLOAD URL
   ========================================================= */

function getDownloadURL(fileId) {
    return `https://drive.google.com/uc?export=download&id=${encodeURIComponent(fileId)}`;
}


/* =========================================================
   GAME CARD
   ========================================================= */

function createGameCard(game) {

    const image = game.image
        ? escapeHTML(game.image)
        : "https://via.placeholder.com/600x350?text=Game";

    const hasLink = game.link && game.link.trim() !== "";

    const downloadCount = DOWNLOAD_COUNTS[game.id] || 0;

    const latestVersion = getLatestVersion(game);
    const versionLabel = latestVersion ? latestVersion.version : "N/A";

    return `
        <article class="game-card">

            <div class="game-image-wrap">
                <img
                    class="game-image"
                    src="${image}"
                    alt="${escapeHTML(game.name)}"
                    loading="lazy"
                    onerror="this.src='https://via.placeholder.com/600x350?text=Game';"
                >
            </div>

            <div class="game-info">

                <h3 class="game-title">${escapeHTML(game.name)}</h3>

                <div class="game-meta-row">
                    <span class="game-version-badge">${escapeHTML(versionLabel)}</span>
                    <span class="download-count-number" id="count-${game.id}">${downloadCount}</span>
                </div>

                <div class="game-actions">

                    <button
                        class="details-btn"
                        type="button"
                        onclick="openGameDetails(${game.id})"
                    >
                        Download Mode
                    </button>

                    ${hasLink ? `
                        <a
                            href="${escapeHTML(game.link)}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="game-link-btn"
                        >
                            Original Game
                        </a>
                    ` : `
                        <button
                            class="download-btn"
                            type="button"
                            onclick="downloadGame(${game.id})"
                        >
                            Download
                        </button>
                    `}

                </div>

            </div>

        </article>
    `;
}


/* =========================================================
   RENDER
   ========================================================= */

function rendermodes(modes, container, emptyElement = null) {

    if (!container) return;

    if (modes.length === 0) {
        container.innerHTML = "";
        if (emptyElement) emptyElement.style.display = "block";
        return;
    }

    if (emptyElement) emptyElement.style.display = "none";

    container.innerHTML = modes.map(createGameCard).join("");
}


/* =========================================================
   GAME COUNT
   ========================================================= */

function updateGameCount(count) {
    if (!gameCount) return;
    gameCount.textContent = count;
}


/* =========================================================
   HOME SEARCH
   ========================================================= */

function renderHomemodes(searchTerm = "") {
    const term = searchTerm.trim().toLowerCase();

    const filteredmodes = PRODUCTS.filter((game) =>
        game.name.toLowerCase().includes(term)
    );

    rendermodes(filteredmodes, gameGrid, nomodes);
    updateGameCount(filteredmodes.length);
}


/* =========================================================
   MODES PAGE SEARCH
   ========================================================= */

function rendermodesPage(searchTerm = "") {
    const term = searchTerm.trim().toLowerCase();

    const filteredmodes = PRODUCTS.filter((game) =>
        game.name.toLowerCase().includes(term)
    );

    rendermodes(filteredmodes, modesPageGrid);
}


/* =========================================================
   OPEN DETAILS
   ========================================================= */

function openGameDetails(gameId) {

    const game = PRODUCTS.find((item) => item.id === gameId);

    if (!game || !gameModal) return;

    if (modalTitle) modalTitle.textContent = game.name || "";
    if (modalCategory) modalCategory.textContent = game.category || "";
    if (modalPlatform) modalPlatform.textContent = game.platform || "";
    if (modalDescription) modalDescription.textContent = game.description || "";

    if (modalImage) {
        modalImage.src = game.image || "";
        modalImage.alt = game.name || "";
    }

    // ⭐ Version dropdown populate
    if (versionSelect && game.versions && game.versions.length > 0) {

        versionSelect.innerHTML = "";

        const sorted = getSortedVersions(game);

        sorted.forEach((v, idx) => {
            const option = document.createElement("option");
            option.value = idx;

            const label = v.isLatest
                ? `${v.version} (Latest) — ${v.size}`
                : `${v.version} — ${v.size}`;

            option.textContent = label;
            versionSelect.appendChild(option);
        });

        versionSelect.selectedIndex = 0;

        // Default file name dikhado
        if (modalFile && sorted[0]) {
            modalFile.textContent = sorted[0].fileName || "";
        }

        // Dropdown change par file name update
        versionSelect.onchange = () => {
            const idx = parseInt(versionSelect.value, 10);
            const sel = sorted[idx];
            if (sel && modalFile) {
                modalFile.textContent = sel.fileName || "";
            }
        };
    } else {
        if (versionSelect) versionSelect.innerHTML = "";
        if (modalFile) modalFile.textContent = "";
    }

    if (modalDownload) {
        modalDownload.onclick = () => {
            const idx = versionSelect ? parseInt(versionSelect.value, 10) : 0;
            const sorted = getSortedVersions(game);
            const sel = sorted[idx];

            if (!sel) {
                showToast("No version available.");
                return;
            }

            downloadGameVersion(game.id, sel.version);
        };
    }

    gameModal.classList.add("active");
    gameModal.setAttribute("aria-hidden", "false");

    document.body.classList.add("modal-open");
}


/* =========================================================
   CLOSE DETAILS
   ========================================================= */

function closeGameDetails() {
    if (!gameModal) return;

    gameModal.classList.remove("active");
    gameModal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("modal-open");
}


/* =========================================================
   DOWNLOAD SPECIFIC VERSION
   ========================================================= */

function downloadGameVersion(gameId, versionNumber) {

    const game = PRODUCTS.find((item) => item.id === gameId);

    if (!game) {
        showToast("Game not found.");
        return;
    }

    const version = (game.versions || []).find(v => v.version === versionNumber);

    if (!version || !version.fileId) {
        showToast("Download file is not available.");
        return;
    }

    const downloadURL = getDownloadURL(version.fileId);

    window.open(downloadURL, "_blank", "noopener,noreferrer");

    incrementDownloadCount(gameId);

    showToast(`Downloading ${game.name} ${version.version}...`);
}


/* =========================================================
   DOWNLOAD (Latest version - card ke liye)
   ========================================================= */

function downloadGame(gameId) {
    const game = PRODUCTS.find(item => item.id === gameId);
    if (!game) return;

    const latest = getLatestVersion(game);
    if (!latest) {
        showToast("No version available.");
        return;
    }

    downloadGameVersion(gameId, latest.version);
}


/* =========================================================
   JSONBIN READ/WRITE
   ========================================================= */

async function readBin() {
    const response = await fetch(`${JSONBIN_URL}/latest`, {
        method: "GET",
        headers: {
            "X-Master-Key": JSONBIN_API_KEY,
            "X-Bin-Meta": "false"
        }
    });

    if (!response.ok) throw new Error("Failed to read bin");
    return await response.json();
}

async function writeBin(data) {
    const response = await fetch(JSONBIN_URL, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-Master-Key": JSONBIN_API_KEY
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error("Failed to write bin");
    return await response.json();
}


/* =========================================================
   INITIALIZE COUNTS
   ========================================================= */

async function initializeCounts() {

    try {
        const data = await readBin();
        const downloads = data.downloads || {};

        PRODUCTS.forEach((game) => {
            DOWNLOAD_COUNTS[game.id] = downloads[game.id] || 0;
            updateCountUI(game.id, DOWNLOAD_COUNTS[game.id]);
        });

        let visitors = data.visitors || 0;
        const hasVisited = localStorage.getItem(VISITOR_STORAGE_KEY);

        if (!hasVisited) {
            visitors += 1;
            data.visitors = visitors;
            await writeBin(data);
            localStorage.setItem(VISITOR_STORAGE_KEY, "1");
        }

        VISITOR_COUNT = visitors;
        updateVisitorUI(VISITOR_COUNT);

        console.log("✅ Counts loaded:", {
            downloads: DOWNLOAD_COUNTS,
            visitors: VISITOR_COUNT
        });

    } catch (error) {
        console.error("Initialize counts error:", error);

        PRODUCTS.forEach((game) => {
            DOWNLOAD_COUNTS[game.id] = 0;
            updateCountUI(game.id, 0);
        });

        updateVisitorUI(0);
    }
}


/* =========================================================
   INCREMENT DOWNLOAD COUNT
   ========================================================= */

async function incrementDownloadCount(gameId) {

    DOWNLOAD_COUNTS[gameId] = (DOWNLOAD_COUNTS[gameId] || 0) + 1;
    updateCountUI(gameId, DOWNLOAD_COUNTS[gameId]);

    try {
        const data = await readBin();

        if (!data.downloads) data.downloads = {};

        data.downloads[gameId] = (data.downloads[gameId] || 0) + 1;

        const saved = await writeBin(data);
        const serverCount = saved.record.downloads[gameId];

        DOWNLOAD_COUNTS[gameId] = serverCount;
        updateCountUI(gameId, serverCount);

        console.log(`✅ Download count saved for game ${gameId}: ${serverCount}`);

    } catch (error) {
        console.error("Increment download error:", error);
    }
}


/* =========================================================
   UPDATE UI
   ========================================================= */

function updateCountUI(gameId, count) {

    const homeEl = document.getElementById(`count-${gameId}`);
    if (homeEl) homeEl.textContent = Number(count).toLocaleString();

    const modesPageEl = document.querySelector(`#ModesPageGrid #count-${gameId}`);
    if (modesPageEl) modesPageEl.textContent = Number(count).toLocaleString();
}

function updateVisitorUI(count) {
    if (visitorCountEl) {
        visitorCountEl.textContent = Number(count).toLocaleString();
    }
}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast.timeout);

    showToast.timeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}


/* =========================================================
   SEARCH SETUP
   ========================================================= */

function setupSearch() {
    if (headerSearch) {
        headerSearch.addEventListener("input", () => {
            renderHomemodes(headerSearch.value);
        });
    }

    if (modesSearch) {
        modesSearch.addEventListener("input", () => {
            rendermodesPage(modesSearch.value);
        });
    }
}


/* =========================================================
   MODAL SETUP
   ========================================================= */

function setupModal() {
    if (!gameModal) return;

    const closeButtons = gameModal.querySelectorAll(".modal-close, .modal-overlay");

    closeButtons.forEach((button) => {
        button.addEventListener("click", closeGameDetails);
    });

    gameModal.addEventListener("click", (event) => {
        if (event.target === gameModal) closeGameDetails();
    });
}


/* =========================================================
   MOBILE MENU
   ========================================================= */

function setupMobileMenu() {
    if (!mobileMenuBtn || !navMenu) return;

    mobileMenuBtn.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        mobileMenuBtn.classList.toggle("active");
    });

    navMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
            mobileMenuBtn.classList.remove("active");
        });
    });
}


/* =========================================================
   NAVIGATION
   ========================================================= */

function setupNavigation() {

    const navLinks = document.querySelectorAll(".nav-link");

    const homeSection = document.getElementById("home");
    const modesSection = document.getElementById("Modes");
    const modesPage = document.getElementById("ModesPage");

    navLinks.forEach((link) => {
        link.addEventListener("click", (event) => {

            const href = link.getAttribute("href");

            navLinks.forEach((item) => item.classList.remove("active"));
            link.classList.add("active");

            if (href === "#Modes") {
                event.preventDefault();

                if (homeSection) homeSection.style.display = "none";
                if (modesSection) modesSection.style.display = "none";
                if (modesPage) modesPage.classList.add("active");

                rendermodesPage();

                PRODUCTS.forEach((game) => {
                    updateCountUI(game.id, DOWNLOAD_COUNTS[game.id] || 0);
                });

                window.scrollTo({ top: 0, behavior: "smooth" });

            } else if (href === "#home") {
                event.preventDefault();

                if (modesPage) modesPage.classList.remove("active");
                if (homeSection) homeSection.style.display = "block";
                if (modesSection) modesSection.style.display = "block";

                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        });
    });

    const homeLink = document.getElementById("homeLink");

    if (homeLink) {
        homeLink.addEventListener("click", (event) => {
            event.preventDefault();

            if (modesPage) modesPage.classList.remove("active");
            if (homeSection) homeSection.style.display = "block";
            if (modesSection) modesSection.style.display = "block";

            navLinks.forEach((item) => item.classList.remove("active"));

            const homeNav = document.querySelector('.nav-link[href="#home"]');
            if (homeNav) homeNav.classList.add("active");

            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
}


/* =========================================================
   ESCAPE KEY
   ========================================================= */

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeGameDetails();
});


/* =========================================================
   GLOBAL FUNCTIONS
   ========================================================= */

window.openGameDetails = openGameDetails;
window.closeGameDetails = closeGameDetails;
window.downloadGame = downloadGame;


/* =========================================================
   LOAD DATA FROM data.js
   ========================================================= */

function loadProducts() {

    if (typeof PRODUCTS_DATA === "undefined") {
        console.error("❌ data.js not loaded or PRODUCTS_DATA missing.");
        PRODUCTS = [];
        return false;
    }

    if (!Array.isArray(PRODUCTS_DATA)) {
        console.error("❌ PRODUCTS_DATA array nahi hai.");
        PRODUCTS = [];
        return false;
    }

    PRODUCTS = PRODUCTS_DATA;

    console.log(`✅ Loaded ${PRODUCTS.length} product(s)`);
    return true;
}


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    loadProducts();
    renderHomemodes();
    rendermodesPage();
    setupSearch();
    setupModal();
    setupMobileMenu();
    setupNavigation();

    await initializeCounts();
});
