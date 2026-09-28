/* ============================================================
   ChainVerifier — Internationalization (English only)
   ============================================================ */

(function () {
    "use strict";

    function t(key) {
        const dict = I18N.en || {};
        return dict[key] || key;
    }

    function applyTranslations() {
        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.getAttribute("data-i18n");
            const val = t(key);
            if (val) el.textContent = val;
        });
    }

    window.cvT = t;

    document.addEventListener("DOMContentLoaded", () => {
        applyTranslations();
    });

})();
