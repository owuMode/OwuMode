/* ============================================================
   ChainVerifier — UI Kit (performance-first)
   Features:
     - Scroll reveal (IntersectionObserver, throttled)
     - Smooth number counters (requestAnimationFrame)
     - Screenshot lightbox
     - Copy-to-clipboard buttons (no duplicates)
     - "What's New" popup
   ============================================================ */

(function () {
    "use strict";

    /* Detect low-end device → disable heavy animations */
    const isLowEnd = (() => {
        const mem = navigator.deviceMemory || 4;
        const cores = navigator.hardwareConcurrency || 4;
        const saveData = navigator.connection && navigator.connection.saveData;
        return saveData || mem <= 2 || cores <= 2;
    })();
    window._CV_LOW_END = isLowEnd;


    /* ═════════════════════════════════════════════════════════
       1. SCROLL REVEAL
       ═════════════════════════════════════════════════════════ */

    function initScrollReveal() {
        if (isLowEnd) return;
        if (!("IntersectionObserver" in window)) return;
        if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const targets = document.querySelectorAll(
            ".feature-card, .how-card, .shot-card, .stat-item, .changelog-item, .faq-item, .cta-card"
        );

        targets.forEach(el => {
            el.style.opacity = "0";
            el.style.transform = "translateY(24px)";
            el.style.transition = "opacity 0.55s ease, transform 0.55s ease";
            el.style.willChange = "opacity, transform";
        });

        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                el.style.opacity = "1";
                el.style.transform = "translateY(0)";
                io.unobserve(el);
                setTimeout(() => { el.style.willChange = "auto"; }, 700);
            });
        }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });

        targets.forEach(el => io.observe(el));
    }


    /* ═════════════════════════════════════════════════════════
       2. SMOOTH NUMBER COUNTERS
       ═════════════════════════════════════════════════════════ */

    function animateNumber(el, target, duration) {
        if (!el) return;

        if (isLowEnd) {
            el.textContent = Number(target).toLocaleString();
            return;
        }

        const start = parseInt(el.textContent.replace(/,/g, "")) || 0;
        if (start === target) {
            el.textContent = Number(target).toLocaleString();
            return;
        }

        const t0 = performance.now();
        const dur = duration || 900;

        function step(t) {
            const p = Math.min((t - t0) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 4);
            const current = Math.floor(start + (target - start) * eased);
            el.textContent = current.toLocaleString();
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = Number(target).toLocaleString();
        }
        requestAnimationFrame(step);
    }

    window.cvAnimateNumber = animateNumber;


    /* ═════════════════════════════════════════════════════════
       3. SCREENSHOT LIGHTBOX
       ═════════════════════════════════════════════════════════ */

    function initLightbox() {
        document.addEventListener("click", (e) => {
            const wrap = e.target.closest(".shot-img-wrap, .hero-shot");
            if (!wrap) return;
            // Skip if click was on a button inside
            if (e.target.closest("button, a")) return;
            const img = wrap.querySelector("img");
            if (!img || !img.src) return;
            if (img.offsetParent === null) return;

            openLightbox(img.src, img.alt);
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") closeLightbox();
        });
    }

    function openLightbox(src, alt) {
        let lb = document.getElementById("cvLightbox");
        if (!lb) {
            lb = document.createElement("div");
            lb.id = "cvLightbox";
            lb.className = "cv-lightbox";
            lb.innerHTML = `
                <button class="cv-lightbox-close" aria-label="Close">×</button>
                <img class="cv-lightbox-img" src="" alt="">
            `;
            lb.addEventListener("click", (e) => {
                if (e.target === lb || e.target.classList.contains("cv-lightbox-close")) {
                    closeLightbox();
                }
            });
            document.body.appendChild(lb);
        }
        const img = lb.querySelector(".cv-lightbox-img");
        img.src = src;
        img.alt = alt || "";
        lb.classList.add("open");
        document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
        const lb = document.getElementById("cvLightbox");
        if (lb) lb.classList.remove("open");
        document.body.style.overflow = "";
    }


    /* ═════════════════════════════════════════════════════════
       4. COPY-TO-CLIPBOARD
       - Buttons only on <pre> blocks
       - Inline <code data-copy> → click to copy (no button)
       - Standalone <button data-copy> → click to copy
       - No MutationObserver → no duplicates
       ═════════════════════════════════════════════════════════ */

    function initCopyButtons() {
        // ─── Case 1: <pre> blocks with code inside ───
        document.querySelectorAll("pre").forEach(pre => {
            if (pre.dataset.copyInit === "1") return;
            pre.dataset.copyInit = "1";

            const code = pre.querySelector("code");
            const text = (code ? code.textContent : pre.textContent) || "";
            if (!text.trim()) return;

            pre.style.position = "relative";

            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "cv-copy-btn";
            btn.textContent = "📋 Copy";
            btn.setAttribute("aria-label", "Copy code to clipboard");

            btn.addEventListener("click", async (e) => {
                e.stopPropagation();
                e.preventDefault();
                const ok = await copyToClipboard(text.trim());
                flashButton(btn, ok);
            });

            pre.appendChild(btn);
        });

        // ─── Case 2: Standalone buttons with data-copy ───
        document.querySelectorAll("button[data-copy]").forEach(btn => {
            if (btn.dataset.copyInit === "1") return;
            btn.dataset.copyInit = "1";

            btn.addEventListener("click", async (e) => {
                e.stopPropagation();
                const text = btn.getAttribute("data-copy") || "";
                const originalText = btn.textContent;
                const ok = await copyToClipboard(text);
                if (ok) {
                    btn.textContent = "✓ Copied";
                    setTimeout(() => btn.textContent = originalText, 1600);
                }
            });
        });

        // ─── Case 3: Inline <code data-copy="..."> → click to copy ───
        document.querySelectorAll("code[data-copy]").forEach(el => {
            if (el.dataset.copyInit === "1") return;
            el.dataset.copyInit = "1";

            el.style.cursor = "pointer";
            el.title = "Click to copy";

            el.addEventListener("click", async (e) => {
                e.stopPropagation();
                const text = el.getAttribute("data-copy") || el.textContent;
                const ok = await copyToClipboard(text);
                if (ok) {
                    const oldBg = el.style.background;
                    const oldColor = el.style.color;
                    el.style.background = "#4caf50";
                    el.style.color = "#fff";
                    setTimeout(() => {
                        el.style.background = oldBg;
                        el.style.color = oldColor;
                    }, 700);
                }
            });
        });
    }

    async function copyToClipboard(text) {
        if (!text) return false;
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return true;
            }
            throw new Error("no clipboard api");
        } catch (err) {
            // Fallback for file:// and older browsers
            try {
                const ta = document.createElement("textarea");
                ta.value = text;
                ta.style.position = "fixed";
                ta.style.top = "0";
                ta.style.left = "0";
                ta.style.opacity = "0";
                ta.setAttribute("readonly", "");
                document.body.appendChild(ta);
                ta.select();
                ta.setSelectionRange(0, text.length);
                const ok = document.execCommand("copy");
                document.body.removeChild(ta);
                return ok;
            } catch (e2) {
                return false;
            }
        }
    }

    function flashButton(btn, ok) {
        const originalText = "📋 Copy";
        btn.textContent = ok ? "✓ Copied" : "✕ Failed";
        btn.classList.toggle("copied", ok);
        setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove("copied");
        }, 1600);
    }


    /* ═════════════════════════════════════════════════════════
       5. "WHAT'S NEW" POPUP
       ═════════════════════════════════════════════════════════ */

    function initWhatsNew() {
        const STORAGE_KEY = "cv_seen_version";
        const SHOW_DELAY_MS = 3500;

        if (typeof APP_VERSIONS === "undefined" || !APP_VERSIONS.length) return;
        const latest = APP_VERSIONS.find(v => v.isLatest) || APP_VERSIONS[0];
        if (!latest) return;

        const seen = localStorage.getItem(STORAGE_KEY);
        if (seen === latest.version) return;

        setTimeout(() => showWhatsNew(latest), SHOW_DELAY_MS);
    }

    function showWhatsNew(version) {
        let dlg = document.getElementById("cvWhatsNew");
        if (dlg) dlg.remove();

        dlg = document.createElement("div");
        dlg.id = "cvWhatsNew";
        dlg.className = "cv-whatsnew-overlay";

        const changes = (version.changelog || []).slice(0, 5);

        dlg.innerHTML = `
            <div class="cv-whatsnew-modal" role="dialog" aria-modal="true">
                <button class="cv-whatsnew-close" aria-label="Close">×</button>

                <div class="cv-whatsnew-badge">What's New</div>
                <h3 class="cv-whatsnew-title">${version.version}</h3>
                <p class="cv-whatsnew-sub">Released ${new Date(version.date).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</p>

                <ul class="cv-whatsnew-list">
                    ${changes.map(c => `<li>${c}</li>`).join("")}
                </ul>

                <div class="cv-whatsnew-actions">
                    <button class="cv-whatsnew-btn-secondary" id="cvWhatsNewLater">Later</button>
                    <a class="cv-whatsnew-btn-primary" href="download.html">⬇ Download</a>
                </div>
            </div>
        `;

        document.body.appendChild(dlg);
        requestAnimationFrame(() => dlg.classList.add("open"));

        const closeWhatsNew = () => {
            dlg.classList.remove("open");
            localStorage.setItem("cv_seen_version", version.version);
            setTimeout(() => dlg.remove(), 300);
        };

        dlg.querySelector(".cv-whatsnew-close").addEventListener("click", closeWhatsNew);
        dlg.querySelector("#cvWhatsNewLater").addEventListener("click", closeWhatsNew);
        dlg.addEventListener("click", (e) => { if (e.target === dlg) closeWhatsNew(); });
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") closeWhatsNew();
        });
    }


    /* ═════════════════════════════════════════════════════════
       INIT
       ═════════════════════════════════════════════════════════ */

    document.addEventListener("DOMContentLoaded", () => {
        initScrollReveal();
        initLightbox();
        initCopyButtons();
        initWhatsNew();
    });

    // Expose public API
    window.cvAttachCopyButton = (el) => {
        if (!el) return;
        el.setAttribute("data-copy", el.getAttribute("data-copy") || el.textContent);
        initCopyButtons();
    };

})();
