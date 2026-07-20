(function () {
  "use strict";

  if (window.__RAKIB_LICENSE_LOADER_RUNNING__) return;
  window.__RAKIB_LICENSE_LOADER_RUNNING__ = true;

  const currentScript = document.currentScript;
  const fallbackBase = "https://cdn.jsdelivr.net/gh/raiyanrakib2006-code/rakib-license@main/";
  const baseUrl = currentScript && currentScript.src
    ? currentScript.src.split("?")[0].replace(/update\.js$/i, "")
    : fallbackBase;

  const configUrl = baseUrl + "config.js?t=" + Date.now();

  function cleanupRunningFlag() {
    window.__RAKIB_LICENSE_LOADER_RUNNING__ = false;
  }

  function loadScript(url) {
    return new Promise(function (resolve, reject) {
      const script = document.createElement("script");
      script.src = url;
      script.async = true;
      script.onload = function () {
        script.remove();
        resolve();
      };
      script.onerror = function () {
        script.remove();
        reject(new Error("Could not load " + url));
      };
      (document.head || document.documentElement).appendChild(script);
    });
  }

  async function sha256(text) {
    if (!window.crypto || !window.crypto.subtle) {
      throw new Error("This browser does not support secure license hashing.");
    }

    const bytes = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest("SHA-256", bytes);

    return Array.from(new Uint8Array(digest))
      .map(function (b) { return b.toString(16).padStart(2, "0"); })
      .join("");
  }

  function removeExistingModal() {
    const old = document.getElementById("__rakib_license_overlay__");
    if (old) old.remove();
  }

  function makeModal(config) {
    removeExistingModal();

    const overlay = document.createElement("div");
    overlay.id = "__rakib_license_overlay__";
    overlay.innerHTML = `
      <div class="rakib-license-card" role="dialog" aria-modal="true">
        <button class="rakib-close" type="button" aria-label="Close">Ã—</button>
        <div class="rakib-badge">LICENSE REQUIRED</div>
        <h2>${escapeHtml(config.title || "Rakib License Login")}</h2>
        <p>Enter your license key to continue.</p>
        <input class="rakib-input" type="password" autocomplete="off" placeholder="License key">
        <button class="rakib-submit" type="button">Verify License</button>
        <div class="rakib-message" aria-live="polite"></div>
      </div>
    `;

    const style = document.createElement("style");
    style.textContent = `
      #__rakib_license_overlay__ {
        position: fixed;
        inset: 0;
        z-index: 2147483647;
        display: grid;
        place-items: center;
        padding: 20px;
        background: rgba(0,0,0,.78);
        font-family: Arial, sans-serif;
      }
      #__rakib_license_overlay__ * { box-sizing: border-box; }
      #__rakib_license_overlay__ .rakib-license-card {
        position: relative;
        width: min(100%, 390px);
        padding: 28px;
        border: 1px solid #2d3439;
        border-radius: 18px;
        background: #11161a;
        color: #f5f7f8;
        box-shadow: 0 24px 80px rgba(0,0,0,.55);
      }
      #__rakib_license_overlay__ h2 {
        margin: 8px 0 8px;
        font-size: 26px;
      }
      #__rakib_license_overlay__ p {
        margin: 0 0 18px;
        color: #aab4bb;
      }
      #__rakib_license_overlay__ .rakib-badge {
        color: #00C853;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: .12em;
      }
      #__rakib_license_overlay__ .rakib-input,
      #__rakib_license_overlay__ .rakib-submit {
        width: 100%;
        border-radius: 10px;
        font: inherit;
      }
      #__rakib_license_overlay__ .rakib-input {
        border: 1px solid #374047;
        padding: 13px 14px;
        background: #0b0f12;
        color: white;
        outline: none;
      }
      #__rakib_license_overlay__ .rakib-input:focus {
        border-color: #00C853;
        box-shadow: 0 0 0 3px rgba(0,200,83,.15);
      }
      #__rakib_license_overlay__ .rakib-submit {
        margin-top: 12px;
        border: 0;
        padding: 13px 14px;
        background: #00C853;
        color: #06140b;
        font-weight: 800;
        cursor: pointer;
      }
      #__rakib_license_overlay__ .rakib-submit:disabled {
        opacity: .6;
        cursor: wait;
      }
      #__rakib_license_overlay__ .rakib-message {
        min-height: 20px;
        margin-top: 12px;
        font-size: 13px;
        color: #ff9696;
      }
      #__rakib_license_overlay__ .rakib-close {
        position: absolute;
        top: 10px;
        right: 12px;
        border: 0;
        background: transparent;
        color: #9aa6ad;
        font-size: 28px;
        cursor: pointer;
      }
    `;

    overlay.appendChild(style);
    document.documentElement.appendChild(overlay);

    const input = overlay.querySelector(".rakib-input");
    const submit = overlay.querySelector(".rakib-submit");
    const message = overlay.querySelector(".rakib-message");
    const close = overlay.querySelector(".rakib-close");

    close.addEventListener("click", function () {
      overlay.remove();
      cleanupRunningFlag();
    });

    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) {
        overlay.remove();
        cleanupRunningFlag();
      }
    });

    async function verify() {
      const key = input.value.trim();
      if (!key) {
        message.textContent = "Enter a license key.";
        return;
      }

      submit.disabled = true;
      message.style.color = "#aab4bb";
      message.textContent = "Checking license...";

      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/raiyanrakib2006-code/rakib-license/main/licenses.json?t=" + Date.now(),
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error("License list could not be loaded.");
        }

        const data = await response.json();
        const keyHash = await sha256(key);
        const now = Date.now();

        const match = (data.licenses || []).find(function (license) {
          if (!license || license.active !== true) return false;
          if (String(license.sha256 || "").toLowerCase() !== keyHash) return false;
          if (license.expires && Date.parse(license.expires) < now) return false;
          return true;
        });

        if (!match) {
          throw new Error("Invalid, inactive, or expired license.");
        }

        const minutes = Math.max(1, Number(config.sessionMinutes || 60));
        sessionStorage.setItem(
          "__rakib_license_session__",
          String(now + minutes * 60 * 1000)
        );

        message.style.color = "#58e58d";
        message.textContent = "License verified.";

        await loadScript(
          baseUrl + (config.mainScript || "main.js") + "?t=" + Date.now()
        );

        setTimeout(function () {
          overlay.remove();
          cleanupRunningFlag();
        }, 350);
      } catch (error) {
        message.style.color = "#ff9696";
        message.textContent = error && error.message
          ? error.message
          : "License verification failed.";
        submit.disabled = false;
      }
    }

    submit.addEventListener("click", verify);
    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") verify();
    });

    setTimeout(function () { input.focus(); }, 50);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  async function start() {
    try {
      await loadScript(configUrl);
      const config = window.RAKIB_LICENSE_CONFIG || {};

      const validUntil = Number(
        sessionStorage.getItem("__rakib_license_session__") || 0
      );

      if (validUntil > Date.now()) {
        await loadScript(
          baseUrl + (config.mainScript || "main.js") + "?t=" + Date.now()
        );
        cleanupRunningFlag();
        return;
      }

      makeModal(config);
    } catch (error) {
      cleanupRunningFlag();
      alert("Loader error: " + (error && error.message ? error.message : error));
    }
  }

  start();
})();



