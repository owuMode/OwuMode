/* =========================================================
   ChainVerifier — Download Page Logic (with Agreement Modal)
   ========================================================= */

const JSONBIN_BIN_ID = "6ab26f19ffd5d1605322e359";
const JSONBIN_API_KEY = "$2a$10$RLbYDBBgLAt9fbfPwm4ORe5LBvZF82w/VcDM0PcHeLnNwNt02r/gu";
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

const latestCard = document.getElementById("latestCard");
const versionsList = document.getElementById("versionsList");
const requirementsGrid = document.getElementById("requirementsGrid");
const shareRow = document.getElementById("shareRow");
const visitorCountEl = document.getElementById("visitorCount");
const headerVersion = document.getElementById("headerVersion");
const heroVersion = document.getElementById("heroVersion");
const heroDate = document.getElementById("heroDate");
const versionCount = document.getElementById("versionCount");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navMenu = document.getElementById("navMenu");

/* ─── Modal elements ─── */
const dlModalOverlay = document.getElementById("dlModalOverlay");
const dlModalClose = document.getElementById("dlModalClose");
const dlModalCancel = document.getElementById("dlModalCancel");
const dlModalProceed = document.getElementById("dlModalProceed");
const dlModalAgree = document.getElementById("dlModalAgree");
const dlModalFileName = document.getElementById("dlModalFileName");
const dlModalFileVersion = document.getElementById("dlModalFileVersion");
const dlModalFileSize = document.getElementById("dlModalFileSize");

/* ─── Pending download ─── */
let pendingDownloadUrl = "";
let pendingDownloadName = "";


function escapeHTML(v) {
    if (v === null || v === undefined) return "";
    return String(v).replace(/&/g,"&amp;").replace(/</g,"&lt;")
        .replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
}

function formatDate(d) {
    if (!d) return "—";
    try { return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }); }
    catch { return d; }
}

function formatDateLong(d) {
    if (!d) return "—";
    try { return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }); }
    catch { return d; }
}


/* ═════════════════════════════════════════════════════════
   MODAL LOGIC
   ═════════════════════════════════════════════════════════ */

function openDownloadModal(url, fileName, version, size) {
    if (!dlModalOverlay) {
        window.open(url, "_blank", "noopener");
        return;
    }

    pendingDownloadUrl = url;
    pendingDownloadName = fileName;

    if (dlModalFileName) dlModalFileName.textContent = fileName;
    if (dlModalFileVersion) dlModalFileVersion.textContent = version;
    if (dlModalFileSize) dlModalFileSize.textContent = size;

    if (dlModalAgree) dlModalAgree.checked = false;
    if (dlModalProceed) dlModalProceed.disabled = true;

    dlModalOverlay.classList.add("open");
    document.body.style.overflow = "hidden";

    setTimeout(() => {
        if (dlModalClose) dlModalClose.focus();
    }, 100);
}

function closeDownloadModal() {
    if (!dlModalOverlay) return;
    dlModalOverlay.classList.remove("open");
    document.body.style.overflow = "";
    pendingDownloadUrl = "";
    pendingDownloadName = "";
}

function proceedDownload() {
    if (!pendingDownloadUrl) return;
    if (!dlModalAgree || !dlModalAgree.checked) return;

    const url = pendingDownloadUrl;
    const name = pendingDownloadName;

    closeDownloadModal();

    setTimeout(() => {
        const a = document.createElement("a");
        a.href = url;
        a.download = name || "";
        a.rel = "noopener";
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }, 250);
}

function setupModal() {
    if (!dlModalOverlay) return;

    if (dlModalClose) dlModalClose.addEventListener("click", closeDownloadModal);
    if (dlModalCancel) dlModalCancel.addEventListener("click", closeDownloadModal);

    if (dlModalProceed) dlModalProceed.addEventListener("click", proceedDownload);

    if (dlModalAgree) {
        dlModalAgree.addEventListener("change", () => {
            if (dlModalProceed) {
                dlModalProceed.disabled = !dlModalAgree.checked;
            }
        });
    }

    dlModalOverlay.addEventListener("click", (e) => {
        if (e.target === dlModalOverlay) closeDownloadModal();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && dlModalOverlay.classList.contains("open")) {
            closeDownloadModal();
        }
    });
}


/* ═════════════════════════════════════════════════════════
   LATEST CARD
   ═════════════════════════════════════════════════════════ */

function renderLatestCard() {
    if (!latestCard) return;
    const latest = APP_VERSIONS.find(v => v.isLatest) || APP_VERSIONS[0];
    if (!latest) return;

    if (headerVersion) headerVersion.textContent = latest.version;
    if (heroVersion) heroVersion.textContent = latest.version;
    if (heroDate) heroDate.textContent = formatDateLong(latest.date);

    const hasChecksum = latest.sha256 && latest.sha256.trim() !== "";

    latestCard.innerHTML = `
        <div class="dl-latest-card">
            <div class="dl-latest-left">
                <div class="dl-latest-badge">
                    <span>Latest Version</span>
                </div>
                <h2 class="dl-latest-version">${escapeHTML(latest.version)}</h2>
                <div class="dl-latest-info-row">
                    <span class="dl-info-item">${formatDateLong(latest.date)}</span>
                    <span class="dl-info-dot">·</span>
                    <span class="dl-info-item">${escapeHTML(latest.size)}</span>
                    <span class="dl-info-dot">·</span>
                    <span class="dl-info-item">Windows x64</span>
                </div>
                <div class="dl-latest-file">
                    <code data-copy="${escapeHTML(latest.fileName)}">${escapeHTML(latest.fileName)}</code>
                </div>
                ${hasChecksum ? `
                    <div class="dl-checksum">
                        <div class="dl-checksum-head">
                            <span class="dl-checksum-label">SHA-256</span>
                            <button class="dl-checksum-copy" data-copy="${escapeHTML(latest.sha256)}" type="button">Copy</button>
                        </div>
                        <div class="dl-checksum-value">${escapeHTML(latest.sha256)}</div>
                    </div>
                ` : ""}
            </div>

            <div class="dl-latest-right">
                <button type="button"
                        class="dl-btn-primary"
                        data-download-url="${escapeHTML(latest.url)}"
                        data-download-name="${escapeHTML(latest.fileName)}"
                        data-download-version="${escapeHTML(latest.version)}"
                        data-download-size="${escapeHTML(latest.size)}">
                    <span class="dl-btn-icon">
                        <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    </span>
                    <span class="dl-btn-text">
                        <span class="dl-btn-main">Download ZIP</span>
                        <span class="dl-btn-sub">${escapeHTML(latest.size)} · Free</span>
                    </span>
                </button>
                ${latest.vtUrl ? `
                    <a href="${escapeHTML(latest.vtUrl)}" target="_blank" rel="noopener noreferrer" class="dl-btn-secondary">
                        <span>VirusTotal Scan</span>
                    </a>
                ` : `
                    <div class="dl-btn-secondary dl-btn-secondary-static">
                        <span>Virus-Free</span>
                    </div>
                `}
                <div class="dl-latest-trust">
                    <span>No ads</span>
                    <span>No registration</span>
                    <span>Free forever</span>
                </div>
            </div>
        </div>
    `;
}


/* ═════════════════════════════════════════════════════════
   ALL VERSIONS
   ═════════════════════════════════════════════════════════ */

function renderAllVersions() {
    if (!versionsList) return;

    if (versionCount) {
        versionCount.textContent = APP_VERSIONS.length + " version" + (APP_VERSIONS.length === 1 ? "" : "s");
    }

    versionsList.innerHTML = APP_VERSIONS.map(v => {
        const hasChecksum = v.sha256 && v.sha256.trim() !== "";
        return `
            <div class="dl-version-item">
                <div class="dl-version-main">
                    <div class="dl-version-left">
                        <span class="dl-version-tag">${escapeHTML(v.version)}</span>
                        ${v.isLatest ? `<span class="dl-version-latest">LATEST</span>` : ""}
                    </div>
                    <div class="dl-version-meta">
                        <span class="dl-meta-item">${formatDate(v.date)}</span>
                        <span class="dl-meta-item">${escapeHTML(v.size)}</span>
                    </div>
                    <div class="dl-version-file">
                        <code data-copy="${escapeHTML(v.fileName)}">${escapeHTML(v.fileName)}</code>
                    </div>
                </div>
                <div class="dl-version-actions">
                    <button type="button"
                            class="dl-version-btn"
                            data-download-url="${escapeHTML(v.url)}"
                            data-download-name="${escapeHTML(v.fileName)}"
                            data-download-version="${escapeHTML(v.version)}"
                            data-download-size="${escapeHTML(v.size)}">
                        Download
                    </button>
                    ${v.vtUrl ? `
                        <a href="${escapeHTML(v.vtUrl)}" target="_blank" rel="noopener noreferrer" class="dl-version-vt" title="VirusTotal report">VT</a>
                    ` : ""}
                </div>
                ${hasChecksum ? `
                    <div class="dl-version-checksum">
                        <span class="dl-checksum-label">SHA-256:</span>
                        <code data-copy="${escapeHTML(v.sha256)}">${escapeHTML(v.sha256)}</code>
                    </div>
                ` : ""}
            </div>
        `;
    }).join("");
}


/* ═════════════════════════════════════════════════════════
   REQUIREMENTS
   ═════════════════════════════════════════════════════════ */

function renderRequirements() {
    if (!requirementsGrid) return;
    const req = APP_REQUIREMENTS;
    const minList = req.minimum.map(i => `<li>${escapeHTML(i)}</li>`).join("");
    const recList = req.recommended.map(i => `<li>${escapeHTML(i)}</li>`).join("");

    requirementsGrid.innerHTML = `
        <div class="dl-req-block">
            <div class="dl-req-title">
                <span class="dl-req-dot" style="background: #f59e0b;"></span>
                Minimum
            </div>
            <ul class="dl-req-list">${minList}</ul>
        </div>
        <div class="dl-req-block">
            <div class="dl-req-title">
                <span class="dl-req-dot" style="background: #4caf50;"></span>
                Recommended
            </div>
            <ul class="dl-req-list">${recList}</ul>
        </div>
    `;
}


/* ═════════════════════════════════════════════════════════
   SHARE ROW
   ═════════════════════════════════════════════════════════ */

function renderShareRow() {
    if (!shareRow) return;
    const pageUrl = window.location.href;
    const text = "Check out ChainVerifier — a free pointer chain verifier for Windows!";
    const enc = encodeURIComponent;

    const ICONS = {
        x: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
        telegram: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>`,
        reddit: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485l-2.286 2.286C.775 23.225 1.097 24 1.738 24H12c6.627 0 12-5.373 12-12S18.627 0 12 0zm4.388 11.128c.065.182.101.376.101.578 0 1.98-2.596 3.585-5.797 3.585s-5.797-1.605-5.797-3.585c0-.203.036-.396.101-.579a1.5 1.5 0 0 1-.288-2.977 1.5 1.5 0 0 1 1.845-1.06c1.135-.79 2.658-1.288 4.339-1.32l.837-3.94 2.746.583a1.05 1.05 0 1 1 .1.421l-2.341-.497-.71 3.343c1.63.042 3.108.53 4.21 1.298a1.5 1.5 0 1 1 1.554 2.13zm-7.388 1.128c-.564 0-1.02.457-1.02 1.02s.457 1.02 1.02 1.02 1.02-.457 1.02-1.02-.457-1.02-1.02-1.02zm6 0c-.564 0-1.02.457-1.02 1.02s.457 1.02 1.02 1.02 1.02-.457 1.02-1.02-.457-1.02-1.02-1.02zm-3 3.337c-1.017 0-1.943.06-2.693.164-.323.045-.66-.09-.852-.343l-.852-1.128c-.222-.293-.19-.71.086-.947l.498-.427a.42.42 0 0 1 .595.05c.206.255.135.639-.138.782l-.36.184.605.802c.642-.071 1.386-.114 2.11-.114.725 0 1.47.043 2.111.114l.605-.802-.36-.184c-.273-.143-.344-.527-.138-.782a.42.42 0 0 1 .595-.05l.498.427c.276.237.308.654.086.947l-.852 1.128c-.192.253-.528.388-.851.343-.751-.104-1.677-.164-2.694-.164z"/></svg>`,
        whatsapp: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>`,
        link: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`
    };

    shareRow.innerHTML = `
        <div class="dl-share-grid">
            <a class="dl-share-btn dl-share-twitter" href="https://twitter.com/intent/tweet?url=${enc(pageUrl)}&text=${enc(text)}" target="_blank" rel="noopener" title="Share on X" aria-label="Share on X">${ICONS.x}</a>
            <a class="dl-share-btn dl-share-telegram" href="https://t.me/share/url?url=${enc(pageUrl)}&text=${enc(text)}" target="_blank" rel="noopener" title="Share on Telegram" aria-label="Share on Telegram">${ICONS.telegram}</a>
            <a class="dl-share-btn dl-share-reddit" href="https://reddit.com/submit?url=${enc(pageUrl)}&title=${enc(text)}" target="_blank" rel="noopener" title="Share on Reddit" aria-label="Share on Reddit">${ICONS.reddit}</a>
            <a class="dl-share-btn dl-share-whatsapp" href="https://wa.me/?text=${enc(text + ' ' + pageUrl)}" target="_blank" rel="noopener" title="Share on WhatsApp" aria-label="Share on WhatsApp">${ICONS.whatsapp}</a>
            <button class="dl-share-btn dl-share-copy" type="button" data-copy="${escapeHTML(pageUrl)}" title="Copy link" aria-label="Copy link">${ICONS.link}</button>
        </div>
    `;
}


/* ═════════════════════════════════════════════════════════
   VISITOR COUNTER
   ═════════════════════════════════════════════════════════ */

async function initializeCounts() {
    try {
        const r = await fetch(`${JSONBIN_URL}/latest`, {
            method: "GET",
            headers: { "X-Master-Key": JSONBIN_API_KEY, "X-Bin-Meta": "false" }
        });
        if (!r.ok) throw new Error("read fail");
        const data = await r.json();
        const v = data.visitors || 0;
        if (visitorCountEl) {
            if (typeof window.cvAnimateNumber === "function") {
                window.cvAnimateNumber(visitorCountEl, v, 900);
            } else {
                visitorCountEl.textContent = Number(v).toLocaleString();
            }
        }
    } catch (e) {
        console.error("[counts]", e);
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
   DOWNLOAD BUTTON LISTENER (delegation)
   ═════════════════════════════════════════════════════════ */

function setupDownloadListeners() {
    document.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-download-url]");
        if (!btn) return;
        e.preventDefault();

        const url = btn.getAttribute("data-download-url");
        const name = btn.getAttribute("data-download-name") || "";
        const version = btn.getAttribute("data-download-version") || "";
        const size = btn.getAttribute("data-download-size") || "";

        if (!url) return;

        openDownloadModal(url, name, version, size);
    });
}


/* ═════════════════════════════════════════════════════════
   INIT
   ═════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", async () => {
    renderLatestCard();
    renderAllVersions();
    renderRequirements();
    renderShareRow();
    setupMobileMenu();
    setupModal();
    setupDownloadListeners();
    await initializeCounts();
});