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
const statDownloads = document.getElementById("statDownloads");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navMenu = document.getElementById("navMenu");


function escapeHTML(v) {
    if (v === null || v === undefined) return "";
    return String(v).replace(/&/g,"&amp;").replace(/</g,"&lt;")
        .replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
}

function getLatest() {
    if (!APP_VERSIONS || !APP_VERSIONS.length) return null;
    return APP_VERSIONS.find(v => v.isLatest) || APP_VERSIONS[0];
}


/* ═════════════════════════════════════════════════════════
   FEATURES
   ═════════════════════════════════════════════════════════ */
function renderFeatures() {
    if (!featuresGrid) return;
    featuresGrid.innerHTML = APP_FEATURES.map(f => `
        <div class="feature-card">
            <div class="feature-icon">${f.icon}</div>
            <h3>${escapeHTML(f.title)}</h3>
            <p>${escapeHTML(f.desc)}</p>
        </div>
    `).join("");
}


/* ═════════════════════════════════════════════════════════
   SCREENSHOTS (clickable for lightbox)
   ═════════════════════════════════════════════════════════ */
function renderScreenshots() {
    if (!screenshotsGrid) return;
    screenshotsGrid.innerHTML = APP_INFO.screenshots.map(s => `
        <div class="shot-card">
            <div class="shot-img-wrap">
                <img src="${escapeHTML(s.src)}" alt="${escapeHTML(s.title)}"
                     onerror="this.style.display='none'; this.parentNode.querySelector('.shot-img-fallback').style.display='flex';">
                <div class="shot-img-fallback" style="display:none;">${escapeHTML(APP_INFO.name.charAt(0))}</div>
            </div>
            <div class="shot-info">
                <h3>${escapeHTML(s.title)}</h3>
                <p>${escapeHTML(s.desc)}</p>
            </div>
        </div>
    `).join("");
}


/* ═════════════════════════════════════════════════════════
   FAQ PREVIEW (first 4)
   ═════════════════════════════════════════════════════════ */
function renderFaq() {
    if (!faqGrid) return;
    faqGrid.innerHTML = APP_FAQ.slice(0, 4).map((item, i) => `
        <details class="faq-item" ${i === 0 ? "open" : ""}>
            <summary>${escapeHTML(item.q)}</summary>
            <div class="faq-body">${escapeHTML(item.a)}</div>
        </details>
    `).join("");
}


/* ═════════════════════════════════════════════════════════
   STATS
   ═════════════════════════════════════════════════════════ */
function updateStats() {
    const latest = getLatest();
    if (!latest) return;
    if (headerVersion) headerVersion.textContent = latest.version;
    if (heroLabel) heroLabel.textContent = latest.version + " — Latest Release";
    if (statVersion) statVersion.textContent = latest.version;
    if (statSize) statSize.textContent = latest.size || "—";
}


/* ═════════════════════════════════════════════════════════
   HERO PARTICLES (lightweight canvas-free DOM version)
   ═════════════════════════════════════════════════════════ */
function initHeroParticles() {
    if (window._CV_LOW_END) {
        document.body.classList.add("cv-low-end");
        return;
    }
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const container = document.getElementById("heroParticles");
    if (!container) return;

    // 12 subtle particles (DOM-based, GPU-accelerated, cheap)
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


/* ═════════════════════════════════════════════════════════
   JSONBIN COUNTERS
   ═════════════════════════════════════════════════════════ */
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
        const downloads = data.downloads || {};
        const appDownloads = downloads.chainverifier || 0;

        // Animate download count
        if (statDownloads && typeof window.cvAnimateNumber === "function") {
            window.cvAnimateNumber(statDownloads, appDownloads, 1200);
        } else if (statDownloads) {
            statDownloads.textContent = Number(appDownloads).toLocaleString();
        }

        let visitors = data.visitors || 0;
        if (!localStorage.getItem(VISITOR_KEY)) {
            visitors += 1;
            data.visitors = visitors;
            await writeBin(data);
            localStorage.setItem(VISITOR_KEY, "1");
        }

        if (visitorCountEl && typeof window.cvAnimateNumber === "function") {
            window.cvAnimateNumber(visitorCountEl, visitors, 1000);
        } else if (visitorCountEl) {
            visitorCountEl.textContent = Number(visitors).toLocaleString();
        }
    } catch (e) {
        console.error("Counts error:", e);
        if (statDownloads) statDownloads.textContent = "0";
        if (visitorCountEl) visitorCountEl.textContent = "0";
    }
}


/* ═════════════════════════════════════════════════════════
   MOBILE MENU
   ═════════════════════════════════════════════════════════ */
function setupMobileMenu() {
    if (!mobileMenuBtn || !navMenu) return;
    mobileMenuBtn.addEventListener("click", () => navMenu.classList.toggle("active"));
}


/* ═════════════════════════════════════════════════════════
   INIT
   ═════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", async () => {
    updateStats();
    renderFeatures();
    renderScreenshots();
    renderFaq();
    initHeroParticles();
    setupMobileMenu();
    await initializeCounts();
});
