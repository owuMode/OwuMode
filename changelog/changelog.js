/* ============================================================
   ChainVerifier — Changelog (GitHub auto-fetch + fallback)
   ============================================================ */

(function () {
    "use strict";

    const CACHE_KEY = "cv_gh_releases";
    const CACHE_TTL_MS = 1000 * 60 * 30;
    const FETCH_TIMEOUT_MS = 8000;

    function escapeHtml(s) {
        if (s == null) return "";
        return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
            .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    function formatDate(d) {
        if (!d) return "—";
        try {
            return new Date(d).toLocaleDateString("en-GB", {
                day: "2-digit", month: "long", year: "numeric"
            });
        } catch { return d; }
    }

    function isNewerVersion(a, b) {
        const parse = v => (v || "").replace(/^v/i, "").split(".").map(n => parseInt(n) || 0);
        const av = parse(a), bv = parse(b);
        for (let i = 0; i < Math.max(av.length, bv.length); i++) {
            const x = av[i] || 0, y = bv[i] || 0;
            if (x > y) return true;
            if (x < y) return false;
        }
        return false;
    }

    function parseGitHubRelease(rel) {
        const lines = (rel.body || "").split("\n")
            .map(l => l.trim())
            .filter(l => l.startsWith("-") || l.startsWith("*"))
            .map(l => l.replace(/^[-*]\s*/, "").replace(/^\[.*?\]\s*/, ""))
            .filter(Boolean);

        let size = "", fileName = "", url = "";
        for (const asset of (rel.assets || [])) {
            const n = (asset.name || "").toLowerCase();
            if (n.endsWith(".zip")) {
                fileName = asset.name;
                size = Math.round((asset.size || 0) / (1024 * 1024)) + " MB";
                url = asset.browser_download_url;
                break;
            }
        }

        return {
            id: rel.id,
            version: rel.tag_name,
            date: (rel.published_at || "").split("T")[0],
            size,
            fileName,
            url,
            releasePageUrl: rel.html_url,
            isLatest: false,
            changelog: lines.length ? lines : ["Release " + rel.tag_name]
        };
    }

    async function fetchGitHubReleases() {
        if (location.protocol === "file:") {
            console.log("[changelog] file:// protocol — using local data");
            return [];
        }

        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                const parsed = JSON.parse(cached);
                if (Date.now() - parsed.ts < CACHE_TTL_MS) {
                    console.log("[changelog] using cached releases");
                    return parsed.data;
                }
            }
        } catch (e) {}

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

        let r;
        try {
            r = await fetch(APP_INFO.releasesApi, {
                headers: { "Accept": "application/vnd.github+json" },
                signal: controller.signal
            });
        } catch (err) {
            clearTimeout(timeoutId);
            console.warn("[changelog] fetch error:", err.message);
            throw err;
        }
        clearTimeout(timeoutId);

        if (!r.ok) throw new Error("GitHub fetch failed: " + r.status);

        const releases = await r.json();
        if (!Array.isArray(releases)) return [];

        const parsed = releases.map(parseGitHubRelease);

        if (parsed.length) {
            let latestIdx = 0;
            for (let i = 1; i < parsed.length; i++) {
                if (isNewerVersion(parsed[i].version, parsed[latestIdx].version)) {
                    latestIdx = i;
                }
            }
            parsed.forEach((r, i) => r.isLatest = (i === latestIdx));
        }

        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                ts: Date.now(),
                data: parsed
            }));
        } catch (e) {}

        return parsed;
    }

    function renderChangelogItem(v) {
        return `
            <div class="changelog-item">
                <div class="changelog-head">
                    <span class="changelog-version">${escapeHtml(v.version)}</span>
                    ${v.isLatest ? '<span class="version-latest-badge">LATEST</span>' : ""}
                    <span class="changelog-date">${formatDate(v.date)}</span>
                    <span class="changelog-date" style="margin-left:auto;">${escapeHtml(v.size || "")}</span>
                </div>
                <ul class="changelog-list-items">
                    ${(v.changelog || []).map(item => `<li>${escapeHtml(item)}</li>`).join("")}
                </ul>
                ${v.url ? `
                    <div class="changelog-actions">
                        <a href="${escapeHtml(v.url)}" target="_blank" rel="noopener" class="changelog-download">
                            ⬇ Download ${escapeHtml(v.version)}
                        </a>
                    </div>
                ` : ""}
            </div>
        `;
    }

    async function loadChangelog() {
        const el = document.getElementById("changelogList");
        const loading = document.getElementById("changelogLoading");
        if (!el) return;

        let versions = [];

        try {
            versions = await fetchGitHubReleases();
        } catch (e) {
            console.warn("[changelog] GitHub fetch failed, using local data:", e.message);
        }

        if (loading) loading.style.display = "none";

        const localMap = new Map();
        (APP_VERSIONS || []).forEach(v => localMap.set(v.version, v));

        const merged = versions.map(gh => {
            const local = localMap.get(gh.version);
            return local ? { ...gh, ...local, isLatest: gh.isLatest || local.isLatest } : gh;
        });

        (APP_VERSIONS || []).forEach(local => {
            if (!merged.find(m => m.version === local.version)) {
                merged.push(local);
            }
        });

        merged.sort((a, b) => new Date(b.date) - new Date(a.date));

        if (merged.length === 0) {
            el.innerHTML = `
                <div style="padding: 60px 20px; text-align: center; color: var(--muted);">
                    <h3 style="color: var(--black); margin-bottom: 8px;">No releases yet</h3>
                    <p>Version history will appear here once releases are published.</p>
                </div>
            `;
        } else {
            el.innerHTML = merged.map(renderChangelogItem).join("");
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        loadChangelog();

        const v = (window.APP_VERSIONS && APP_VERSIONS.find(x => x.isLatest));
        if (v && document.getElementById("headerVersion")) {
            document.getElementById("headerVersion").textContent = v.version;
        }
    });

})();