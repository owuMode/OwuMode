/* =========================================================
   OwuMode GAME DATA
   ========================================================= */

const PRODUCTS = [
    {
        id: 1,
        name: "Royal Envoy 3 Mode",
        category: "modes",
        description: "You can change your Coins, Woods, Foods and Happiness ",
        version: "v1.0.0",
        size: "38 MB",
        platform: "Windows",
        fileName: "RoyalEnvoy3_ModMenu.exe",
        fileId: "1EvvlLFqoC4COK5wCFKLJ7YzUcYb098QN",
        image: "https://alawarland.com/upload/information_system_1/1/0/5/item_1059/information_items_1059.jpg",
        badge: "New"
    }
];


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const gameGrid = document.getElementById("gameGrid");
const modesPageGrid = document.getElementById("modesPageGrid");
const nomodes = document.getElementById("nomodes");
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
const modesSearch = document.getElementById("modesSearch");

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navMenu = document.getElementById("navMenu");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");


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
   ONLY:
   IMAGE
   NAME
   VIEW DETAILS
   DOWNLOAD
   ========================================================= */

function createGameCard(game) {

    const image = game.image
        ? escapeHTML(game.image)
        : "https://via.placeholder.com/600x350?text=Game";

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

            </div>

        </article>
    `;
}


/* =========================================================
   RENDER modes
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
   HOME GAME SEARCH
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
   modes PAGE SEARCH
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
   OPEN GAME DETAILS
   ========================================================= */

function openGameDetails(gameId) {

    const game = PRODUCTS.find(
        (item) => item.id === gameId
    );

    if (!game || !gameModal) {
        return;
    }


    if (modalTitle) {
        modalTitle.textContent =
            game.name || "";
    }


    if (modalCategory) {
        modalCategory.textContent =
            game.category || "";
    }


    if (modalPlatform) {
        modalPlatform.textContent =
            game.platform || "";
    }


    if (modalDescription) {
        modalDescription.textContent =
            game.description || "";
    }


    if (modalVersion) {
        modalVersion.textContent =
            game.version || "";
    }


    if (modalSize) {
        modalSize.textContent =
            game.size || "";
    }


    if (modalFile) {
        modalFile.textContent =
            game.fileName || "";
    }


    if (modalImage) {

        modalImage.src =
            game.image || "";

        modalImage.alt =
            game.name || "";
    }


    if (modalDownload) {

        modalDownload.onclick = () => {
            downloadGame(game.id);
        };
    }


    gameModal.classList.add("active");

    gameModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "modal-open"
    );
}


/* =========================================================
   CLOSE GAME DETAILS
   ========================================================= */

function closeGameDetails() {

    if (!gameModal) {
        return;
    }

    gameModal.classList.remove("active");

    gameModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "modal-open"
    );
}


/* =========================================================
   DOWNLOAD MODE
   ========================================================= */

function downloadGame(gameId) {

    const game = PRODUCTS.find(
        (item) => item.id === gameId
    );

    if (!game) {

        showToast(
            "Game not found."
        );

        return;
    }


    if (!game.fileId) {

        showToast(
            "Download file is not available."
        );

        return;
    }


    const downloadURL =
        getDownloadURL(game);


    window.open(
        downloadURL,
        "_blank",
        "noopener,noreferrer"
    );


    showToast(
        `Downloading ${game.name}...`
    );
}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {

    if (!toast || !toastMessage) {
        return;
    }

    toastMessage.textContent =
        message;

    toast.classList.add("show");

    clearTimeout(
        showToast.timeout
    );

    showToast.timeout =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 3000);
}


/* =========================================================
   SEARCH
   ========================================================= */

function setupSearch() {

    if (headerSearch) {

        headerSearch.addEventListener(
            "input",
            () => {

                const value =
                    headerSearch.value;

                renderHomemodes(
                    value
                );

            }
        );
    }


    if (modesSearch) {

        modesSearch.addEventListener(
            "input",
            () => {

                const value =
                    modesSearch.value;

                rendermodesPage(
                    value
                );

            }
        );
    }
}


/* =========================================================
   MODAL
   ========================================================= */

function setupModal() {

    if (!gameModal) {
        return;
    }


    const closeButtons =
        gameModal.querySelectorAll(
            ".modal-close, .modal-overlay"
        );


    closeButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                closeGameDetails
            );

        }
    );


    gameModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                gameModal
            ) {
                closeGameDetails();
            }

        }
    );
}


/* =========================================================
   MOBILE MENU
   ========================================================= */

function setupMobileMenu() {

    if (
        !mobileMenuBtn ||
        !navMenu
    ) {
        return;
    }


    mobileMenuBtn.addEventListener(
        "click",
        () => {

            navMenu.classList.toggle(
                "active"
            );

            mobileMenuBtn.classList.toggle(
                "active"
            );

        }
    );


    navMenu
        .querySelectorAll("a")
        .forEach((link) => {

            link.addEventListener(
                "click",
                () => {

                    navMenu.classList.remove(
                        "active"
                    );

                    mobileMenuBtn.classList.remove(
                        "active"
                    );

                }
            );

        });
}


/* =========================================================
   NAVIGATION
   ========================================================= */

function setupNavigation() {

    const navLinks =
        document.querySelectorAll(
            ".nav-link"
        );

    const homeSection =
        document.getElementById(
            "home"
        );

    const modesSection =
        document.getElementById(
            "modes"
        );

    const modesPage =
        document.getElementById(
            "modesPage"
        );


    navLinks.forEach((link) => {

        link.addEventListener(
            "click",
            (event) => {

                const href =
                    link.getAttribute(
                        "href"
                    );


                navLinks.forEach(
                    (item) => {
                        item.classList.remove(
                            "active"
                        );
                    }
                );

                link.classList.add(
                    "active"
                );


                if (href === "#modes") {

                    event.preventDefault();

                    if (homeSection) {
                        homeSection.style.display =
                            "none";
                    }

                    if (modesSection) {
                        modesSection.style.display =
                            "none";
                    }

                    if (modesPage) {
                        modesPage.classList.add(
                            "active"
                        );
                    }

                    rendermodesPage();

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });

                }

                else if (href === "#home") {

                    event.preventDefault();

                    if (modesPage) {
                        modesPage.classList.remove(
                            "active"
                        );
                    }

                    if (homeSection) {
                        homeSection.style.display =
                            "block";
                    }

                    if (modesSection) {
                        modesSection.style.display =
                            "block";
                    }

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });

                }

            }
        );

    });


    const homeLink =
        document.getElementById(
            "homeLink"
        );


    if (homeLink) {

        homeLink.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                if (modesPage) {
                    modesPage.classList.remove(
                        "active"
                    );
                }

                if (homeSection) {
                    homeSection.style.display =
                        "block";
                }

                if (modesSection) {
                    modesSection.style.display =
                        "block";
                }

                navLinks.forEach(
                    (item) => {
                        item.classList.remove(
                            "active"
                        );
                    }
                );

                const homeNav =
                    document.querySelector(
                        '.nav-link[href="#home"]'
                    );

                if (homeNav) {
                    homeNav.classList.add(
                        "active"
                    );
                }

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );
    }
}


/* =========================================================
   ESCAPE KEY
   ========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key ===
            "Escape"
        ) {
            closeGameDetails();
        }

    }
);


/* =========================================================
   GLOBAL FUNCTIONS
   ========================================================= */

window.openGameDetails =
    openGameDetails;

window.closeGameDetails =
    closeGameDetails;

window.downloadGame =
    downloadGame;


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderHomemodes();

        rendermodesPage();

        setupSearch();

        setupModal();

        setupMobileMenu();

        setupNavigation();

    }
);
