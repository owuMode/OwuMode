/* =========================================================
   ChainVerifier — Docs Page Logic
   ========================================================= */

(function () {
    "use strict";

    const JSONBIN_BIN_ID = "6ab26f19ffd5d1605322e359";
    const JSONBIN_API_KEY = "$2a$10$RLbYDBBgLAt9fbfPwm4ORe5LBvZF82w/VcDM0PcHeLnNwNt02r/gu";
    const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

    /* ─── Mobile menu toggle ─── */
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const navMenu = document.getElementById("navMenu");
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener("click", () => {
            navMenu.classList.toggle("active");
        });
    }

    /* ─── Update header version badge ─── */
    (() => {
        if (typeof APP_VERSIONS === "undefined") return;
        const latest = APP_VERSIONS.find(v => v.isLatest) || APP_VERSIONS[0];
        if (latest && document.getElementById("headerVersion")) {
            document.getElementById("headerVersion").textContent = latest.version;
        }
    })();

    /* ─── Visitor counter ─── */
    (async () => {
        try {
            const r = await fetch(`${JSONBIN_URL}/latest`, {
                headers: {
                    "X-Master-Key": JSONBIN_API_KEY,
                    "X-Bin-Meta": "false"
                }
            });
            const d = await r.json();
            const v = d.visitors || 0;
            const el = document.getElementById("visitorCount");
            if (el && typeof window.cvAnimateNumber === "function") {
                window.cvAnimateNumber(el, v, 900);
            } else if (el) {
                el.textContent = Number(v).toLocaleString();
            }
        } catch (e) {
            // silent fail
        }
    })();

    /* ─── Sidebar active link highlight on scroll ─── */
    function initSidebarScrollSpy() {
        const sidebarLinks = document.querySelectorAll(".docs-sidebar a");
        const sections = document.querySelectorAll(".docs-content section");

        if (!sidebarLinks.length || !sections.length) return;
        if (!("IntersectionObserver" in window)) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const id = entry.target.getAttribute("id");

                sidebarLinks.forEach(link => {
                    const href = link.getAttribute("href") || "";
                    if (href === "#" + id) {
                        link.classList.add("active");
                    } else {
                        link.classList.remove("active");
                    }
                });
            });
        }, {
            rootMargin: "-20% 0px -70% 0px",
            threshold: 0
        });

        sections.forEach(section => observer.observe(section));
    }

    /* ─── Smooth scroll for sidebar links ─── */
    function initSmoothScroll() {
        document.querySelectorAll('.docs-sidebar a[href^="#"]').forEach(link => {
            link.addEventListener("click", (e) => {
                const href = link.getAttribute("href");
                if (!href || href === "#") return;

                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();

                const offset = 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;

                window.scrollTo({
                    top: top,
                    behavior: "smooth"
                });

                // Close mobile menu if open
                if (navMenu) navMenu.classList.remove("active");
            });
        });
    }

    /* ─── Init on DOM ready ─── */
    document.addEventListener("DOMContentLoaded", () => {
        initSidebarScrollSpy();
        initSmoothScroll();
    });

})();