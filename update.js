(function () {
  "use strict";

  if (window.__RAKIB_LICENSE_LOADER_RUNNING__) return;
  window.__RAKIB_LICENSE_LOADER_RUNNING__ = true;

  const OWNER = "raiyanrakib2006-code";
  const REPO = "rakib-license";
  const BRANCH = "main";
  const LOGIN_TITLE = "Rahat License Login";

  const currentScript = document.currentScript;

  const cdnBase =
    currentScript && currentScript.src
      ? currentScript.src.split("?")[0].replace(/update\.js$/i, "")
      : "https://cdn.jsdelivr.net/gh/" +
        OWNER + "/" + REPO + "@" + BRANCH + "/";

  const licenseUrl =
    "https://raw.githubusercontent.com/" +
    OWNER + "/" + REPO + "/" + BRANCH + "/licenses.json";

  function done() {
    window.__RAKIB_LICENSE_LOADER_RUNNING__ = false;
  }

  function loadMainScript() {
    return new Promise(function (resolve, reject) {
      const script = document.createElement("script");
      script.src = cdnBase + "main.js?t=" + Date.now();
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
      throw new Error("Secure license checking is unavailable.");
    }

    const bytes = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest("SHA-256", bytes);

    return Array.from(new Uint8Array(digest))
      .map(function (byte) {
        return byte.toString(16).padStart(2, "0");
      })
      .join("");
  }

  const oldModal = document.getElementById("__rakib_license_overlay__");
  if (oldModal) oldModal.remove();

  const overlay = document.createElement("div");
  overlay.id = "__rakib_license_overlay__";

  overlay.innerHTML = `
    <div class="r-card" role="dialog" aria-modal="true">
      <button class="r-close" type="button" aria-label="Close">×</button>
      <div class="r-badge">LICENSE REQUIRED</div>
      <h2>${LOGIN_TITLE}</h2>
      <p>Enter the complete RAKIB- license key.</p>
      <input
        class="r-input"
        type="text"
        autocomplete="off"
        autocapitalize="characters"
        spellcheck="false"
        placeholder="RAKIB-..."
      >
      <button class="r-submit" type="button">Verify License</button>
      <div class="r-message" aria-live="polite"></div>
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
      font-family: Arial,sans-serif;
    }

    #__rakib_license_overlay__ * {
      box-sizing: border-box;
    }

    #__rakib_license_overlay__ .r-card {
      position: relative;
      width: min(100%,390px);
      padding: 28px;
      border: 1px solid #2d3439;
      border-radius: 18px;
      background: #11161a;
      color: #f5f7f8;
      box-shadow: 0 24px 80px rgba(0,0,0,.55);
    }

    #__rakib_license_overlay__ h2 {
      margin: 8px 0;
      font-size: 26px;
    }

    #__rakib_license_overlay__ p {
      margin: 0 0 18px;
      color: #aab4bb;
    }

    #__rakib_license_overlay__ .r-badge {
      color: #00C853;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: .12em;
    }

    #__rakib_license_overlay__ .r-input,
    #__rakib_license_overlay__ .r-submit {
      width: 100%;
      border-radius: 10px;
      font: inherit;
    }

    #__rakib_license_overlay__ .r-input {
      border: 1px solid #374047;
      padding: 13px 14px;
      background: #0b0f12;
      color: white;
      outline: none;
    }

    #__rakib_license_overlay__ .r-input:focus {
      border-color: #00C853;
      box-shadow: 0 0 0 3px rgba(0,200,83,.15);
    }

    #__rakib_license_overlay__ .r-submit {
      margin-top: 12px;
      border: 0;
      padding: 13px 14px;
      background: #00C853;
      color: #06140b;
      font-weight: 800;
      cursor: pointer;
    }

    #__rakib_license_overlay__ .r-submit:disabled {
      opacity: .6;
      cursor: wait;
    }

    #__rakib_license_overlay__ .r-message {
      min-height: 20px;
      margin-top: 12px;
      font-size: 13px;
      color: #ff9696;
    }

    #__rakib_license_overlay__ .r-close {
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

  const input = overlay.querySelector(".r-input");
  const submit = overlay.querySelector(".r-submit");
  const message = overlay.querySelector(".r-message");
  const close = overlay.querySelector(".r-close");

  close.addEventListener("click", function () {
    overlay.remove();
    done();
  });

  overlay.addEventListener("click", function (event) {
    if (event.target === overlay) {
      overlay.remove();
      done();
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
      const response = await fetch(
        licenseUrl + "?t=" + Date.now(),
        {
          cache: "no-store",
          headers: { Accept: "application/json" }
        }
      );

      if (!response.ok) {
        throw new Error("Online license list could not be loaded.");
      }

      const data = await response.json();
      const keyHash = await sha256(key);

      const license = (data.licenses || []).find(function (item) {
        return (
          item &&
          String(item.sha256 || "").toLowerCase() === keyHash
        );
      });

      if (!license) {
        throw new Error("Invalid license.");
      }

      if (license.active !== true) {
        throw new Error("Inactive license.");
      }

      if (
        license.expires &&
        Date.parse(license.expires) < Date.now()
      ) {
        throw new Error("Expired license.");
      }

      message.style.color = "#58e58d";
      message.textContent = "License verified.";

      await loadMainScript();

      window.setTimeout(function () {
        overlay.remove();
        done();
      }, 300);
    }
    catch (error) {
      message.style.color = "#ff9696";
      message.textContent =
        error && error.message
          ? error.message
          : "License verification failed.";

      submit.disabled = false;
    }
  }

  submit.addEventListener("click", verify);

  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") verify();
  });

  window.setTimeout(function () {
    input.focus();
  }, 50);
})();
