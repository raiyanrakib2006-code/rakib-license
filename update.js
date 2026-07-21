(function () {
  "use strict";

  if (window.__RAKIB_LICENSE_LOADER_RUNNING__) return;
  window.__RAKIB_LICENSE_LOADER_RUNNING__ = true;

  const OWNER = "raiyanrakib2006-code";
  const REPO = "rakib-license";
  const BRANCH = "main";

  const currentScript = document.currentScript;
  const cdnBase = currentScript && currentScript.src
    ? currentScript.src.split("?")[0].replace(/update\.js$/i, "")
    : `https://cdn.jsdelivr.net/gh/${OWNER}/${REPO}@${BRANCH}/`;

  const licenseUrl =
    `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/licenses.json`;

  function finish() {
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
        reject(new Error("Main script could not be loaded."));
      };
      (document.head || document.documentElement).appendChild(script);
    });
  }

  async function sha256(text) {
    if (!window.crypto || !window.crypto.subtle) {
      throw new Error("Secure license checking is unavailable in this browser.");
    }

    const bytes = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest("SHA-256", bytes);

    return Array.from(new Uint8Array(digest))
      .map(function (byte) {
        return byte.toString(16).padStart(2, "0");
      })
      .join("");
  }

  const old = document.getElementById("__rakib_license_overlay__");
  if (old) old.remove();

  const overlay = document.createElement("div");
  overlay.id = "__rakib_license_overlay__";
  overlay.innerHTML = `
    <div class="rakib-license-card" role="dialog" aria-modal="true">
      <button class="rakib-close" type="button" aria-label="Close">Ã—</button>
      <div class="rakib-badge">LICENSE REQUIRED</div>
      <h2>Live License Login</h2>
      <p>Enter the complete RAKIB- license key.</p>
      <input class="rakib-input" type="text" autocomplete="off"
             autocapitalize="characters" spellcheck="false"
             placeholder="RAKIB-...">
      <button class="rakib-submit" type="button">Verify License</button>
      <div class="rakib-message" aria-live="polite"></div>
    </div>
  `;

  const style = document.createElement("style");
  style.textContent = `
    #__rakib_license_overlay__ {
      position: fixed; inset: 0; z-index: 2147483647;
      display: grid; place-items: center; padding: 20px;
      background: rgba(0,0,0,.78); font-family: Arial,sans-serif;
    }
    #__rakib_license_overlay__ * { box-sizing: border-box; }
    #__rakib_license_overlay__ .rakib-license-card {
      position: relative; width: min(100%,390px); padding: 28px;
      border: 1px solid #2d3439; border-radius: 18px;
      background: #11161a; color: #f5f7f8;
      box-shadow: 0 24px 80px rgba(0,0,0,.55);
    }
    #__rakib_license_overlay__ h2 { margin: 8px 0; font-size: 26px; }
    #__rakib_license_overlay__ p { margin: 0 0 18px; color: #aab4bb; }
    #__rakib_license_overlay__ .rakib-badge {
      color: #00C853; font-size: 11px; font-weight: 800;
      letter-spacing: .12em;
    }
    #__rakib_license_overlay__ .rakib-input,
    #__rakib_license_overlay__ .rakib-submit {
      width: 100%; border-radius: 10px; font: inherit;
    }
    #__rakib_license_overlay__ .rakib-input {
      border: 1px solid #374047; padding: 13px 14px;
      background: #0b0f12; color: white; outline: none;
    }
    #__rakib_license_overlay__ .rakib-input:focus {
      border-color: #00C853;
      box-shadow: 0 0 0 3px rgba(0,200,83,.15);
    }
    #__rakib_license_overlay__ .rakib-submit {
      margin-top: 12px; border: 0; padding: 13px 14px;
      background: #00C853; color: #06140b;
      font-weight: 800; cursor: pointer;
    }
    #__rakib_license_overlay__ .rakib-submit:disabled {
      opacity: .6; cursor: wait;
    }
    #__rakib_license_overlay__ .rakib-message {
      min-height: 20px; margin-top: 12px;
      font-size: 13px; color: #ff9696;
    }
    #__rakib_license_overlay__ .rakib-close {
      position: absolute; top: 10px; right: 12px;
      border: 0; background: transparent;
      color: #9aa6ad; font-size: 28px; cursor: pointer;
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
    finish();
  });

  overlay.addEventListener("click", function (event) {
    if (event.target === overlay) {
      overlay.remove();
      finish();
    }
  });

  async function verify() {
    const key = input.value.trim().toUpperCase();

    if (!key) {
      message.textContent = "Enter the complete license key.";
      return;
    }

    if (!key.startsWith("RAKIB-")) {
      message.textContent = "The license must begin with RAKIB-.";
      return;
    }

    submit.disabled = true;
    message.style.color = "#aab4bb";
    message.textContent = "Checking license...";

    try {
      const response = await fetch(licenseUrl + "?t=" + Date.now(), {
        cache: "no-store",
        headers: { Accept: "application/json" }
      });

      if (!response.ok) {
        throw new Error("Online license list could not be loaded.");
      }

      const data = await response.json();
      const keyHash = await sha256(key);
      const license = (data.licenses || []).find(function (item) {
        return item &&
          String(item.sha256 || "").toLowerCase() === keyHash;
      });

      if (!license) throw new Error("Invalid license.");
      if (license.active !== true) throw new Error("Inactive license.");

      if (license.expires && Date.parse(license.expires) < Date.now()) {
        throw new Error("Expired license.");
      }

      message.style.color = "#58e58d";
      message.textContent = "License verified.";

      await loadScript(cdnBase + "main.js?t=" + Date.now());

      setTimeout(function () {
        overlay.remove();
        finish();
      }, 300);
    } catch (error) {
      message.style.color = "#ff9696";
      message.textContent =
        error && error.message ? error.message : "License check failed.";
      submit.disabled = false;
    }
  }

  submit.addEventListener("click", verify);
  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") verify();
  });

  setTimeout(function () {
    input.focus();
  }, 50);
})();
