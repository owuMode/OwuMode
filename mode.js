/* =========================================================
   OwuMode - Mode Details Page
   ========================================================= */

let PRODUCTS = [];
let CURRENT_GAME = null;

const DOWNLOAD_COUNTS = {};
let VISITOR_COUNT = 0;

const JSONBIN_BIN_ID = "6ab26f19ffd5d1605322e359";
const JSONBIN_API_KEY = "$2a$10$RLbYDBBgLAt9fbfPwm4ORe5LBvZF82w/VcDM0PcHeLnNwNt02r/gu";
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

/* DOM */
const detailsLoading = document.getElementById("detailsLoading");
const detailsNotFound = document.getElementById("detailsNotFound");
const detailsContent = document.getElementById("detailsContent");

const detailsImage = document.getElementById("detailsImage");
const detailsBadge = document.getElementById("detailsBadge");
const detailsCategory = document.getElementById("detailsCategory");
const detailsTitle = document.getElementById("detailsTitle");
const detailsDescription = document.getElementById("detailsDescription");
const detailsCount = document.getElementById("detailsCount");
const detailsSize = document.getElementById("detailsSize");
const downloadLatestLabel = document.getElementById("downloadLatestLabel");

const tagPlatform = document.getElementById("tagPlatform");
const tagSize = document.getElementById("tagSize");
const tagVersion = document.getElementById("tagVersion");

const specPlatform = document.getElementById("specPlatform");
const specCategory = document.getElementById("specCategory");
const specVersion = document.getElementById("specVersion");
const specSize = document.getElementById("specSize");
const specDate = document.getElementById("specDate");

const detailsDownload = document.getElementById("detailsDownload");
const detailsOriginalLink = document.getElementById("detailsOriginalLink");
const versionDisplay = document.getElementById("versionDisplay");
const versionsList = document.getElementById("versionsList");
const requirementsGrid = document.getElementById("requirementsGrid");

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navMenu = document.getElementById("navMenu");
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");
const visitorCountEl = document.getElementById("visitorCount");


/* =========================================================
   HELPERS
   ========================================================= */

function getSortedVersions(game) {
    if (!game.versions || game.versions.length === 0) return [];
    return [...game.versions].sort((a, b) =>
        new Date(b.date || 0) - new Date(a.date || 0)
    );
}

function getSlugFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("mode");
}

function formatDate(dateStr) {
    if (!dateStr) return "—";
    try {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-GB", {
            day: "2-digit", month: "short", year: "numeric"
        });
    } catch { return dateStr; }
}

function formatDescription(text) {
    if (!text) return "";
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .split("\n")
        .map(line => `<p>${line}</p>`)
        .join("");
}


/* =========================================================
   RENDER REQUIREMENTS
   ========================================================= */

function renderRequirements(game) {

    if (!requirementsGrid) return;

    // Default fallback agar game me requirements na ho
    const req = game.requirements || {
        minimum: [
            "OS: Windows 7 / 8 / 10 / 11",
            "RAM: 2 GB",
            "Storage: 100 MB free"
        ],
        recommended: [
            "OS: Windows 10 / 11 (64-bit)",
            "RAM: 4 GB or more",
            "Storage: 200 MB free"
        ]
    };

    const minList = (req.minimum || []).map(item => `<li>${item}</li>`).join("");
    const recList = (req.recommended || []).map(item => `<li>${item}</li>`).join("");

    requirementsGrid.innerHTML = `
        <div class="req-box">
            <h3>Minimum</h3>
            <ul>${minList}</ul>
        </div>
        <div class="req-box">
            <h3>Recommended</h3>
            <ul>${recList}</ul>
        </div>
    `;
}


/* =========================================================
   RENDER
   ========================================================= */

function renderDetails(game) {

    CURRENT_GAME = game;
    document.title = `${game.name} - OwuMode`;

    if (detailsImage) {
        detailsImage.src = game.image || "";
        detailsImage.alt = game.name || "";
        detailsImage.onerror = () => {
            detailsImage.src = "https://via.placeholder.com/300x300?text=Game";
        };
    }

    if (detailsBadge) {
        if (game.badge && game.badge.trim() !== "") {
            detailsBadge.textContent = game.badge.toUpperCase();
            detailsBadge.style.display = "inline-block";
        } else {
            detailsBadge.style.display = "none";
        }
    }

    if (detailsCategory) detailsCategory.textContent = game.category || "Mod";
    if (detailsTitle) detailsTitle.textContent = game.name || "";
    if (detailsDescription) detailsDescription.innerHTML = formatDescription(game.description || "");
    if (tagPlatform) tagPlatform.textContent =  (game.platform || "Windows");

    const downloadCount = DOWNLOAD_COUNTS[game.id] || 0;
    if (detailsCount) detailsCount.textContent = Number(downloadCount).toLocaleString();

    const sorted = getSortedVersions(game);

    if (sorted.length > 0) {

        const latest = sorted[0];

        if (detailsSize) detailsSize.textContent = latest.size || "";
        if (tagSize) tagSize.textContent =  (latest.size || "—");
        if (tagVersion) tagVersion.textContent = latest.version || "—";
        if (downloadLatestLabel) downloadLatestLabel.textContent = "Latest " + (latest.version || "");

        if (specPlatform) specPlatform.textContent = game.platform || "Windows";
        if (specCategory) specCategory.textContent = game.category || "Mod";
        if (specVersion) specVersion.textContent = latest.version || "—";
        if (specSize) specSize.textContent = latest.size || "—";
        if (specDate) specDate.textContent = formatDate(latest.date);

        if (versionDisplay) {
            versionDisplay.textContent = latest.isLatest
                ? `${latest.version} (Latest)`
                : latest.version;
        }

        if (versionsList) {
            versionsList.innerHTML = sorted.map((v, idx) => `
                <div class="version-card ${v.isLatest ? 'version-card-latest' : ''}">
                    <div class="version-card-top">
                        <span class="version-card-tag">${v.version}</span>
                        ${v.isLatest ? '<span class="version-latest-badge">Latest</span>' : ''}
                    </div>
                    <div class="version-card-meta">
                        <span>${formatDate(v.date)}</span>
                        <span>${v.size}</span>
                    </div>
                    <div class="version-card-file">${v.fileName || ''}</div>
                    <button class="version-card-btn" onclick="downloadVersion(${idx})" type="button">
                        ⬇ Download
                    </button>
                </div>
            `).join("");
        }
    }

    // Requirements render
    renderRequirements(game);

    // Main download button -> latest
    if (detailsDownload) {
        detailsDownload.onclick = () => {
            downloadVersion(0);
        };
    }

    if (detailsOriginalLink) {
        if (game.link && game.link.trim() !== "") {
            detailsOriginalLink.href = game.link;
            detailsOriginalLink.style.display = "flex";
        } else {
            detailsOriginalLink.style.display = "none";
        }
    }
}


function downloadVersion(idx) {
    if (!CURRENT_GAME) return;
    const sorted = getSortedVersions(CURRENT_GAME);
    const sel = sorted[idx];
    if (!sel || !sel.url) {
        showToast("Download not available.");
        return;
    }
    window.open(sel.url, "_blank", "noopener,noreferrer");
    incrementDownloadCount(CURRENT_GAME.id);
    showToast(`Opening ${CURRENT_GAME.name} ${sel.version} in Telegram...`);
}


/* =========================================================
   LOADING
   ========================================================= */

function showLoading() {
    if (detailsLoading) detailsLoading.style.display = "flex";
    if (detailsContent) detailsContent.style.display = "none";
    if (detailsNotFound) detailsNotFound.style.display = "none";
}

function showContent() {
    if (detailsLoading) detailsLoading.style.display = "none";
    if (detailsContent) detailsContent.style.display = "block";
    if (detailsNotFound) detailsNotFound.style.display = "none";
}

function showNotFound() {
    if (detailsLoading) detailsLoading.style.display = "none";
    if (detailsContent) detailsContent.style.display = "none";
    if (detailsNotFound) detailsNotFound.style.display = "block";
}


/* =========================================================
   COUNTS
   ========================================================= */

async function readBin() {
    const r = await fetch(`${JSONBIN_URL}/latest`, {
        method: "GET",
        headers: {
            "X-Master-Key": JSONBIN_API_KEY,
            "X-Bin-Meta": "false"
        }
    });
    if (!r.ok) throw new Error("read fail");
    return await r.json();
}

async function writeBin(data) {
    const r = await fetch(JSONBIN_URL, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-Master-Key": JSONBIN_API_KEY
        },
        body: JSON.stringify(data)
    });
    if (!r.ok) throw new Error("write fail");
    return await r.json();
}

async function initializeCounts() {
    try {
        const data = await readBin();
        const downloads = data.downloads || {};
        PRODUCTS.forEach((game) => {
            DOWNLOAD_COUNTS[game.id] = downloads[game.id] || 0;
        });
        VISITOR_COUNT = data.visitors || 0;
        updateVisitorUI(VISITOR_COUNT);
    } catch (e) {
        console.error("Counts error:", e);
        PRODUCTS.forEach((g) => DOWNLOAD_COUNTS[g.id] = 0);
        updateVisitorUI(0);
    }
}

async function incrementDownloadCount(gameId) {
    DOWNLOAD_COUNTS[gameId] = (DOWNLOAD_COUNTS[gameId] || 0) + 1;
    if (detailsCount) detailsCount.textContent = Number(DOWNLOAD_COUNTS[gameId]).toLocaleString();

    try {
        const data = await readBin();
        if (!data.downloads) data.downloads = {};
        data.downloads[gameId] = (data.downloads[gameId] || 0) + 1;
        const saved = await writeBin(data);
        const serverCount = saved.record.downloads[gameId];
        DOWNLOAD_COUNTS[gameId] = serverCount;
        if (detailsCount) detailsCount.textContent = Number(serverCount).toLocaleString();
    } catch (e) { console.error(e); }
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
        PRODUCTS = [];
        return false;
    }
    PRODUCTS = PRODUCTS_DATA;
    return true;
}


window.downloadVersion = downloadVersion;


/* =========================================================
   INIT
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {
    setupMobileMenu();
    showLoading();
    loadProducts();

    const slug = getSlugFromURL();
    if (!slug) { showNotFound(); return; }

    const game = PRODUCTS.find(
        (item) => item.slug === slug || String(item.id) === String(slug)
    );

    if (!game) { showNotFound(); return; }

    await initializeCounts();
    renderDetails(game);
    showContent();
});
