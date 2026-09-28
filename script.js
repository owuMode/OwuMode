/* =========================================================
   ChainVerifier — Home Page Logic
   ========================================================= */

const JSONBIN_BIN_ID = "6ab26f19ffd5d1605322e359";
const JSONBIN_API_KEY = "$2a$10$RLbYDBBgLAt9fbfPwm4ORe5LBvZF82w/VcDM0PcHeLnNwNt02r/gu";
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;
const VISITOR_KEY = "cv_visited";

const featuresGrid = document.getElementById("featuresGrid");
const screenshotsGrid = document.getElementById("screenshotsGrid");
const faqGrid = document.getElementById("faqGrid");
const visitorCountEl = document.getElementById("visitorCount");
const headerVersion = document.getElementById("headerVersion");
const heroLabel = document.getElementById("heroLabel");
const statVersion = document.getElementById("statVersion");
const statSize = document.getElementById("statSize");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navMenu = document.getElementById("navMenu");


function escapeHTML(v) {
    if (v === null || v === undefined) return "";
    return String(v)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function getLatest() {
    if (!APP_VERSIONS || !APP_VERSIONS.length) return null;
    return APP_VERSIONS.find(v => v.isLatest) || APP_VERSIONS[0];
}


const FEATURE_ICONS = {
    chain: `<svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
    search: `<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    tools: `<svg viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
    palette: `<svg viewBox="0 0 24 24"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
    zap: `<svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    refresh: `<svg viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`,
    save: `<svg viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`,
    undo: `<svg viewBox="0 0 24 24"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>`,
    export: `<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`
};

function renderFeatures() {
    if (!featuresGrid) return;
    if (typeof APP_FEATURES === "undefined" || !APP_FEATURES.length) return;

    const iconKeys = ["chain", "search", "tools", "palette", "zap", "refresh", "save", "undo", "export"];

    featuresGrid.innerHTML = APP_FEATURES.map((f, i) => `
        <div class="feature-card">
            <div class="feature-icon">${FEATURE_ICONS[iconKeys[i]] || FEATURE_ICONS.chain}</div>
            <h3>${escapeHTML(f.title)}</h3>
            <p>${escapeHTML(f.desc)}</p>
        </div>
    `).join("");
}


function renderScreenshots() {
    if (!screenshotsGrid) return;
    if (typeof APP_INFO === "undefined" || !APP_INFO.screenshots) return;

    screenshotsGrid.innerHTML = APP_INFO.screenshots.map(s => `
        <div class="shot-card">
            <div class="shot-img-wrap">
                <img src="${escapeHTML(s.src)}" alt="${escapeHTML(s.title)}"
                     onerror="this.style.display='none'; this.parentNode.querySelector('.shot-img-fallback').style.display='flex';">
                <div class="shot-img-fallback" style="display:none;">C</div>
            </div>
            <div class="shot-info">
                <h3>${escapeHTML(s.title)}</h3>
                <p>${escapeHTML(s.desc)}</p>
            </div>
        </div>
    `).join("");
}


function renderFaq() {
    if (!faqGrid) return;
    if (typeof APP_FAQ === "undefined" || !APP_FAQ.length) return;

    faqGrid.innerHTML = APP_FAQ.slice(0, 4).map((item, i) => `
        <details class="faq-item" ${i === 0 ? "open" : ""}>
            <summary>${escapeHTML(item.q)}</summary>
            <div class="faq-body">${escapeHTML(item.a)}</div>
        </details>
    `).join("");
}


function updateStats() {
    const latest = getLatest();
    if (!latest) return;
    if (headerVersion) headerVersion.textContent = latest.version;
    if (heroLabel) heroLabel.textContent = latest.version + " — Latest Release";
    if (statVersion) statVersion.textContent = latest.version;
    if (statSize) statSize.textContent = latest.size || "—";
}


function initHeroParticles() {
    if (window._CV_LOW_END) {
        document.body.classList.add("cv-low-end");
        return;
    }
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const container = document.getElementById("heroParticles");
    if (!container) return;

    const COUNT = 12;
    for (let i = 0; i < COUNT; i++) {
        const p = document.createElement("div");
        p.className = "hero-particle";
        p.style.left = Math.random() * 100 + "%";
        p.style.bottom = "-10px";
        p.style.animationDuration = (12 + Math.random() * 10) + "s";
        p.style.animationDelay = (Math.random() * 8) + "s";
        p.style.opacity = 0.3 + Math.random() * 0.5;
        container.appendChild(p);
    }
}


async function readBin() {
    const r = await fetch(`${JSONBIN_URL}/latest`, {
        method: "GET",
        headers: { "X-Master-Key": JSONBIN_API_KEY, "X-Bin-Meta": "false" }
    });
    if (!r.ok) throw new Error("read fail");
    return await r.json();
}

async function writeBin(data) {
    const r = await fetch(JSONBIN_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "X-Master-Key": JSONBIN_API_KEY },
        body: JSON.stringify(data)
    });
    if (!r.ok) throw new Error("write fail");
    return await r.json();
}

async function initializeCounts() {
    try {
        const data = await readBin();

        let visitors = data.visitors || 0;
        if (!localStorage.getItem(VISITOR_KEY)) {
            visitors += 1;
            data.visitors = visitors;
            await writeBin(data);
            localStorage.setItem(VISITOR_KEY, "1");
        }

        if (visitorCountEl) {
            if (typeof window.cvAnimateNumber === "function") {
                window.cvAnimateNumber(visitorCountEl, visitors, 1000);
            } else {
                visitorCountEl.textContent = Number(visitors).toLocaleString();
            }
        }
    } catch (e) {
        console.error("Counts error:", e);
        if (visitorCountEl) visitorCountEl.textContent = "0";
    }
}


function setupMobileMenu() {
    if (!mobileMenuBtn || !navMenu) return;
    mobileMenuBtn.addEventListener("click", () => navMenu.classList.toggle("active"));
}


document.addEventListener("DOMContentLoaded", async () => {
    updateStats();
    renderFeatures();
    renderScreenshots();
    renderFaq();
    initHeroParticles();
    setupMobileMenu();
    await initializeCounts();
});
