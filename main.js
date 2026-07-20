(function () {
  "use strict";

  const cfg = window.RAKIB_LICENSE_CONFIG || {};
  const DISPLAY_TEXT = cfg.displayText || "Live";
  const GREEN = "#00C853";
  const ICON_HREF = "/profile/images/spritemap.svg#icon-profile-level-standart";

  function customize(root) {
    const scope = root && root.querySelectorAll ? root : document;

    scope.querySelectorAll("*").forEach(function (el) {
      if (
        el.children.length === 0 &&
        el.textContent.trim() === "Demo"
      ) {
        el.textContent = DISPLAY_TEXT;
        el.style.color = GREEN;
        el.style.fontWeight = "700";
        el.style.fontSize = "10px";
        el.style.lineHeight = "10px";
        el.dataset.rakibLocalCustomization = "true";
      }
    });

    scope.querySelectorAll("svg.icon-academic").forEach(function (svg) {
      try {
        svg.className.baseVal = "icon-profile-level-standart";
      } catch (_) {
        svg.setAttribute("class", "icon-profile-level-standart");
      }

      const use = svg.querySelector("use");
      if (use) {
        use.setAttribute("href", ICON_HREF);
        use.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          ICON_HREF
        );
      }

      svg.style.width = "14px";
      svg.style.height = "14px";
      svg.style.minWidth = "14px";
      svg.style.minHeight = "14px";
      svg.style.color = GREEN;
      
      
    });
  }

  customize(document);

  const observer = new MutationObserver(function (mutations) {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          customize(node);
        }
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  setTimeout(function () {
    observer.disconnect();
  }, 120000);
})();


