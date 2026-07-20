(function () {
  "use strict";

  const DISPLAY_TEXT = "Rakib (Demo)";
  const GREEN = "#00C853";
  const ICON_HREF =
    "/profile/images/spritemap.svg#icon-profile-level-standart";

  function applyRakibCustomization(root) {
    const scope =
      root && typeof root.querySelectorAll === "function"
        ? root
        : document;

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
      }
    });

    scope
      .querySelectorAll(
        "svg.icon-academic, svg.icon-profile-level-standart"
      )
      .forEach(function (svg) {
        try {
          svg.className.baseVal =
            "icon-profile-level-standart";
        } catch (error) {
          svg.setAttribute(
            "class",
            "icon-profile-level-standart"
          );
        }

        const use = svg.querySelector("use");

        if (use) {
          use.setAttribute("href", ICON_HREF);
          use.setAttributeNS(
            "http://www.w3.org/1999/xlink",
            "xlink:href",
            ICON_HREF
          );

          use.style.removeProperty("fill");
          use.style.removeProperty("stroke");
        }

        svg.style.width = "14px";
        svg.style.height = "14px";
        svg.style.minWidth = "14px";
        svg.style.minHeight = "14px";
        svg.style.color = GREEN;

        // Preserve the original sprite shape.
        svg.style.removeProperty("fill");
        svg.style.removeProperty("stroke");
      });
  }

  applyRakibCustomization(document);

  let timer;

  const observer = new MutationObserver(function (mutations) {
    clearTimeout(timer);

    timer = setTimeout(function () {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            applyRakibCustomization(node);
          }
        });
      });

      applyRakibCustomization(document);
    }, 60);
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  setTimeout(function () {
    observer.disconnect();
  }, 120000);
})();