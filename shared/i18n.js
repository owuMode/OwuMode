/* ============================================================
   ChainVerifier — Multi-language (EN / HI)
   ============================================================ */

(function () {
    "use strict";

    const STORAGE_KEY = "cv_lang";
    const SUPPORTED = ["en", "hi"];

    function getLang() {
        let l = localStorage.getItem(STORAGE_KEY);
        if (l && SUPPORTED.includes(l)) return l;
        const nav = (navigator.language || "en").slice(0, 2).toLowerCase();
        if (SUPPORTED.includes(nav)) return nav;
        return "en";
    }

    function t(key) {
        const lang = getLang();
        const dict = I18N[lang] || I18N.en;
        return dict[key] || (I18N.en[key] || key);
    }

    function applyTranslations() {
        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            const val = t(key);
            if (val) el.textContent = val;
        });
    }

    function setLang(lang) {
        if (!SUPPORTED.includes(lang)) lang = "en";
        localStorage.setItem(STORAGE_KEY, lang);
        applyTranslations();

        document.querySelectorAll(".cv-lang-btn").forEach(b => {
            b.classList.toggle("active", b.dataset.lang === lang);
        });
    }

    function createLangSwitcher() {
        return `
            <div class="cv-lang-switcher" role="group" aria-label="Language">
                <button class="cv-lang-btn" data-lang="en">EN</button>
                <button class="cv-lang-btn" data-lang="hi">HI</button>
            </div>
        `;
    }

    window.cvT = t;
    window.cvSetLang = setLang;

    document.addEventListener("DOMContentLoaded", () => {
        const header = document.querySelector(".header-inner");
        if (header) {
            const wrap = document.createElement("div");
            wrap.innerHTML = createLangSwitcher();
            const switcher = wrap.firstElementChild;

            const counter = header.querySelector(".visitor-counter");
            if (counter) counter.parentNode.insertBefore(switcher, counter);
            else header.appendChild(switcher);

            switcher.addEventListener("click", (e) => {
                const btn = e.target.closest(".cv-lang-btn");
                if (!btn) return;
                setLang(btn.dataset.lang);
            });

            const cur = getLang();
            switcher.querySelectorAll(".cv-lang-btn").forEach(b => {
                b.classList.toggle("active", b.dataset.lang === cur);
            });
        }

        applyTranslations();
    });

})();