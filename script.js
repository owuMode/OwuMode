/* =========================================================
   OwuMode - Home Page Script
   ========================================================= */

let PRODUCTS = [];

const DOWNLOAD_COUNTS = {};
let VISITOR_COUNT = 0;

/* JSONBIN */
const JSONBIN_BIN_ID = "6ab26f19ffd5d1605322e359";
const JSONBIN_API_KEY = "$2a$10$RLbYDBBgLAt9fbfPwm4ORe5LBvZF82w/VcDM0PcHeLnNwNt02r/gu";
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;
const VISITOR_STORAGE_KEY = "owumode_visited";


/* DOM */
const gameGrid = document.getElementById("gameGrid");
const nomodes = document.getElementById("noModes");
const gameCount = document.getElementById("gameCount");
const headerSearch = document.getElementById("headerSearch");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navMenu = document.getElementById("navMenu");
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");
const visitorCountEl = document.getElementById("visitorCount");


/* =========================================================
   HELPERS
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

function getLatestVersion(game) {
    if (!game.versions || game.versions.length === 0) return null;
    let latest = game.versions.find(v => v.isLatest === true);
    if (!latest) {
        latest = [...game.versions].sort((a, b) =>
            new Date(b.date || 0) - new Date(a.date || 0)
        )[0];
    }
    return latest;
}


/* =========================================================
   GAME CARD
   ========================================================= */

function createGameCard(game) {

    const image = game.image ? escapeHTML(game.image) : "https://via.placeholder.com/600x350?text=Game";
    const downloadCount = DOWNLOAD_COUNTS[game.id] || 0;
    const latestVersion = getLatestVersion(game);
    const versionLabel = latestVersion ? latestVersion.version : "N/A";
    const detailsURL = `mode.html?mode=${encodeURIComponent(game.slug || game.id)}`;

    return `
        <article class="game-card">

            <a href="${detailsURL}" class="game-image-wrap">
                <img
                    class="game-image"
                    src="${image}"
                    alt="${escapeHTML(game.name)}"
                    loading="lazy"
                    onerror="this.src='https://via.placeholder.com/600x350?text=Game';"
                >
            </a>

            <div class="game-info">

                <h3 class="game-title">
                    <a href="${detailsURL}">${escapeHTML(game.name)}</a>
                </h3>

                <div class="game-meta-row">
                    <span class="game-version-badge">${escapeHTML(versionLabel)}</span>
                    <span class="download-count-number" id="count-${game.id}">${downloadCount}</span>
                </div>

                <div class="game-actions">

                    <a href="${detailsURL}" class="details-btn">
                        Download Mode
                    </a>

                    ${game.link && game.link.trim() !== "" ? `
                        <a
                            href="${escapeHTML(game.link)}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="game-link-btn"
                        >
                            Original Game
                        </a>
                    ` : `
                        <a href="${detailsURL}" class="download-btn">
                            View
                        </a>
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

function updateGameCount(count) {
    if (!gameCount) return;
    gameCount.textContent = count;
}

function renderHomemodes(searchTerm = "") {
    const term = searchTerm.trim().toLowerCase();
    const filteredmodes = PRODUCTS.filter((game) =>
        game.name.toLowerCase().includes(term)
    );
    rendermodes(filteredmodes, gameGrid, nomodes);
    updateGameCount(filteredmodes.length);
}


/* =========================================================
   COUNTS
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

    } catch (error) {
        console.error("Initialize counts error:", error);
        PRODUCTS.forEach((game) => {
            DOWNLOAD_COUNTS[game.id] = 0;
            updateCountUI(game.id, 0);
        });
        updateVisitorUI(0);
    }
}

function updateCountUI(gameId, count) {
    const homeEl = document.getElementById(`count-${gameId}`);
    if (homeEl) homeEl.textContent = Number(count).toLocaleString();
}

function updateVisitorUI(count) {
    if (visitorCountEl) visitorCountEl.textContent = Number(count).toLocaleString();
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
   SEARCH
   ========================================================= */

function setupSearch() {
    if (headerSearch) {
        headerSearch.addEventListener("input", () => {
            renderHomemodes(headerSearch.value);
        });
    }
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
}


/* =========================================================
   LOAD
   ========================================================= */

function loadProducts() {
    if (typeof PRODUCTS_DATA === "undefined" || !Array.isArray(PRODUCTS_DATA)) {
        console.error("❌ PRODUCTS_DATA missing.");
        PRODUCTS = [];
        return false;
    }
    PRODUCTS = PRODUCTS_DATA;
    console.log(`✅ Loaded ${PRODUCTS.length} product(s)`);
    return true;
}


/* =========================================================
   INIT
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {
    loadProducts();
    renderHomemodes();
    setupSearch();
    setupMobileMenu();
    await initializeCounts();
});
