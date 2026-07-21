(function () {
  "use strict";

  const LABEL = "Live";
  const GREEN = "#00C853";
  const HREF =
    "/profile/images/spritemap.svg#icon-profile-level-standart";

  function apply(root) {
    const scope =
      root && typeof root.querySelectorAll === "function"
        ? root
        : document;

    scope.querySelectorAll("*").forEach(function (element) {
      if (
        element.children.length === 0 &&
        element.textContent.trim() === "Demo"
      ) {
        element.textContent = LABEL;
        element.style.color = GREEN;
        element.style.fontWeight = "700";
        element.style.fontSize = "10px";
        element.style.lineHeight = "10px";
      }
    });

    scope.querySelectorAll("svg.icon-academic").forEach(function (svg) {
      try {
        svg.className.baseVal = "icon-profile-level-standart";
      }
      catch (error) {
        svg.setAttribute("class", "icon-profile-level-standart");
      }

      const use = svg.querySelector("use");

      if (use) {
        use.setAttribute("href", HREF);
        use.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          HREF
        );
      }

      svg.style.width = "14px";
      svg.style.height = "14px";
      svg.style.minWidth = "14px";
      svg.style.minHeight = "14px";
      svg.style.color = GREEN;
      svg.style.removeProperty("fill");
      svg.style.removeProperty("stroke");
    });
  }

  apply(document);

  let timer;

  const observer = new MutationObserver(function (mutations) {
    clearTimeout(timer);

    timer = setTimeout(function () {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            apply(node);
          }
        });
      });

      apply(document);
    }, 50);
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  setTimeout(function () {
    observer.disconnect();
  }, 120000);
})();
