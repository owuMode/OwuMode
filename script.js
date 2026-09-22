/* =========================================================
   OwuMode - Main Script
   ========================================================= */

let PRODUCTS = [];


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
const modalVersion = document.getElementById("modalVersion");
const modalSize = document.getElementById("modalSize");
const modalFile = document.getElementById("modalFile");
const modalImage = document.getElementById("modalImage");
const modalDownload = document.getElementById("modalDownload");

const headerSearch = document.getElementById("headerSearch");
const modesSearch = document.getElementById("ModesSearch");

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navMenu = document.getElementById("navMenu");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

const visitorCount = document.getElementById("visitorCount");


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHTML(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   DOWNLOAD URL
   ========================================================= */

function getDownloadURL(game) {
    return `https://drive.google.com/uc?export=download&id=${encodeURIComponent(game.fileId)}`;
}


/* =========================================================
   GAME CARD
   ========================================================= */

function createGameCard(game) {

    const image = game.image
        ? escapeHTML(game.image)
        : "https://via.placeholder.com/600x350?text=Game";

    const hasLink = game.link && game.link.trim() !== "";

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

                <h3 class="game-title">
                    ${escapeHTML(game.name)}
                </h3>

                <div class="game-actions">

                    <button
                        class="details-btn"
                        type="button"
                        onclick="openGameDetails(${game.id})"
                    >
                        View Details
                    </button>

                    <button
                        class="download-btn"
                        type="button"
                        onclick="downloadGame(${game.id})"
                    >
                        Download
                    </button>

                </div>

                ${hasLink ? `
                <div class="game-link-row">
                    <a
                        href="${escapeHTML(game.link)}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="game-link-btn"
                    >
                        Download Orginal Game
                    </a>
                </div>
                ` : ""}

            </div>

        </article>
    `;
}


/* =========================================================
   RENDER
   ========================================================= */

function rendermodes(
    modes,
    container,
    emptyElement = null
) {
    if (!container) {
        return;
    }

    if (modes.length === 0) {

        container.innerHTML = "";

        if (emptyElement) {
            emptyElement.style.display = "block";
        }

        return;
    }

    if (emptyElement) {
        emptyElement.style.display = "none";
    }

    container.innerHTML = modes
        .map(createGameCard)
        .join("");
}


/* =========================================================
   GAME COUNT
   ========================================================= */

function updateGameCount(count) {

    if (!gameCount) {
        return;
    }

    gameCount.textContent = count;
}


/* =========================================================
   HOME SEARCH
   ========================================================= */

function renderHomemodes(searchTerm = "") {

    const term = searchTerm
        .trim()
        .toLowerCase();

    const filteredmodes = PRODUCTS.filter((game) => {

        return game.name
            .toLowerCase()
            .includes(term);

    });

    rendermodes(
        filteredmodes,
        gameGrid,
        nomodes
    );

    updateGameCount(
        filteredmodes.length
    );
}


/* =========================================================
   MODES PAGE SEARCH
   ========================================================= */

function rendermodesPage(searchTerm = "") {

    const term = searchTerm
        .trim()
        .toLowerCase();

    const filteredmodes = PRODUCTS.filter((game) => {

        return game.name
            .toLowerCase()
            .includes(term);

    });

    rendermodes(
        filteredmodes,
        modesPageGrid
    );
}


/* =========================================================
   OPEN DETAILS
   ========================================================= */

function openGameDetails(gameId) {

    const game = PRODUCTS.find(
        (item) => item.id === gameId
    );

    if (!game || !gameModal) {
        return;
    }


    if (modalTitle) {
        modalTitle.textContent = game.name || "";
    }

    if (modalCategory) {
        modalCategory.textContent = game.category || "";
    }

    if (modalPlatform) {
        modalPlatform.textContent = game.platform || "";
    }

    if (modalDescription) {
        modalDescription.textContent = game.description || "";
    }

    if (modalVersion) {
        modalVersion.textContent = game.version || "";
    }

    if (modalSize) {
        modalSize.textContent = game.size || "";
    }

    if (modalFile) {
        modalFile.textContent = game.fileName || "";
    }

    if (modalImage) {
        modalImage.src = game.image || "";
        modalImage.alt = game.name || "";
    }

    if (modalDownload) {
        modalDownload.onclick = () => {
            downloadGame(game.id);
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

    if (!gameModal) {
        return;
    }

    gameModal.classList.remove("active");
    gameModal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("modal-open");
}


/* =========================================================
   DOWNLOAD
   ========================================================= */

function downloadGame(gameId) {

    const game = PRODUCTS.find(
        (item) => item.id === gameId
    );

    if (!game) {
        showToast("Game not found.");
        return;
    }

    if (!game.fileId) {
        showToast("Download file is not available.");
        return;
    }

    const downloadURL = getDownloadURL(game);

    window.open(
        downloadURL,
        "_blank",
        "noopener,noreferrer"
    );

    showToast(`Downloading ${game.name}...`);
}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {

    if (!toast || !toastMessage) {
        return;
    }

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

    if (!gameModal) {
        return;
    }

    const closeButtons = gameModal.querySelectorAll(
        ".modal-close, .modal-overlay"
    );

    closeButtons.forEach((button) => {
        button.addEventListener("click", closeGameDetails);
    });

    gameModal.addEventListener("click", (event) => {
        if (event.target === gameModal) {
            closeGameDetails();
        }
    });
}


/* =========================================================
   MOBILE MENU
   ========================================================= */

function setupMobileMenu() {

    if (!mobileMenuBtn || !navMenu) {
        return;
    }

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

            const homeNav = document.querySelector(
                '.nav-link[href="#home"]'
            );

            if (homeNav) homeNav.classList.add("active");

            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
}


/* =========================================================
   ESCAPE KEY
   ========================================================= */

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeGameDetails();
    }
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

        console.error(
            "❌ data.js not loaded or PRODUCTS_DATA missing."
        );

        PRODUCTS = [];

        return false;
    }

    if (!Array.isArray(PRODUCTS_DATA)) {

        console.error(
            "❌ PRODUCTS_DATA array nahi hai."
        );

        PRODUCTS = [];

        return false;
    }

    PRODUCTS = PRODUCTS_DATA;

    console.log(
        `✅ Loaded ${PRODUCTS.length} product(s)`
    );

    return true;
}


/* =========================================================
   VISITOR COUNTER (CounterAPI.dev - GitHub Pages Ready)

   - Ek user sirf EK BAAR count hoga (localStorage)
   - Same count SAB users ko dikhega
   ========================================================= */

async function loadVisitorCount() {

    if (!visitorCount) {
        return;
    }

    // ⚠️ Apna unique namespace + key yahan daalo
    // Format: https://api.counterapi.dev/v1/{NAMESPACE}/{KEY}/up
    const NAMESPACE = "owumode";
    const KEY = "visitors";

    const STORAGE_KEY = "owumode_has_visited";

    try {

        let endpoint;

        // Agar user pehle visit kar chuka hai → sirf count read karo
        if (localStorage.getItem(STORAGE_KEY)) {

            endpoint =
                `https://api.counterapi.dev/v1/${NAMESPACE}/${KEY}/`;

        } else {

            // Pehli visit → count +1
            endpoint =
                `https://api.counterapi.dev/v1/${NAMESPACE}/${KEY}/up`;

            localStorage.setItem(STORAGE_KEY, "1");
        }

        const response = await fetch(endpoint);

        if (!response.ok) {
            throw new Error("Counter API failed");
        }

        const data = await response.json();

        // CounterAPI.dev response: { count: 123 }
        const count =
            data.count !== undefined
                ? data.count
                : data.value;

        visitorCount.textContent =
            Number(count).toLocaleString();

    } catch (error) {

        console.error(
            "Visitor counter error:",
            error
        );

        // Fallback: localStorage me last saved count dikhao
        const fallback =
            localStorage.getItem("owumode_last_count");

        visitorCount.textContent =
            fallback ? Number(fallback).toLocaleString() : "—";
    }
}

// Success hone pe last count save karo (optional improvement)
const originalFetch = window.fetch;
window.fetch = async function (...args) {
    const response = await originalFetch.apply(this, args);
    if (args[0] && args[0].includes("counterapi.dev")) {
        try {
            const clone = response.clone();
            const data = await clone.json();
            if (data.count !== undefined) {
                localStorage.setItem(
                    "owumode_last_count",
                    data.count
                );
            }
        } catch (e) {}
    }
    return response;
};


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    loadProducts();

    renderHomemodes();

    rendermodesPage();

    setupSearch();

    setupModal();

    setupMobileMenu();

    setupNavigation();

    loadVisitorCount();

});
