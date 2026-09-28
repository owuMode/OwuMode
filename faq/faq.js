/* =========================================================
   ChainVerifier — FAQ Page Logic
   ========================================================= */

(function () {
    "use strict";

    const JSONBIN_BIN_ID = "6ab26f19ffd5d1605322e359";
    const JSONBIN_API_KEY = "$2a$10$RLbYDBBgLAt9fbfPwm4ORe5LBvZF82w/VcDM0PcHeLnNwNt02r/gu";
    const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

    document.addEventListener("DOMContentLoaded", () => {
        const el = document.getElementById("faqGrid");
        const latest = APP_VERSIONS.find(v => v.isLatest);
        if (latest && document.getElementById("headerVersion")) {
            document.getElementById("headerVersion").textContent = latest.version;
        }

        if (el) {
            el.innerHTML = APP_FAQ.map((item, i) => `
                <details class="faq-item" ${i === 0 ? "open" : ""}>
                    <summary>${item.q}</summary>
                    <div class="faq-body">${item.a}</div>
                </details>
            `).join("");
        }
    });

    document.getElementById("mobileMenuBtn").addEventListener("click", () => {
        document.getElementById("navMenu").classList.toggle("active");
    });

    (async () => {
        try {
            const r = await fetch(`${JSONBIN_URL}/latest`, {
                headers: { "X-Master-Key": JSONBIN_API_KEY, "X-Bin-Meta": "false" }
            });
            const d = await r.json();
            const v = d.visitors || 0;
            const el = document.getElementById("visitorCount");
            if (el && typeof window.cvAnimateNumber === "function") {
                window.cvAnimateNumber(el, v, 900);
            } else if (el) {
                el.textContent = Number(v).toLocaleString();
            }
        } catch (e) {}
    })();

})();