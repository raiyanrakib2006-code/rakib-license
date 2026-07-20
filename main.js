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




/* __RAHAT_CUSTOM_PLANE_ICON__ */
(function(){
  const CUSTOM_PLANE = `
<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 24 24"
     width="14"
     height="14"
     aria-hidden="true"
     style="width:14px;height:14px;min-width:14px;min-height:14px;display:inline-block;vertical-align:middle;color:#00C853;fill:currentColor;">
  <path fill-rule="evenodd" d="M2.35 10.8 21.2 3.25c.48-.19.96.27.8.77l-6.06 16.6c-.17.46-.78.58-1.11.22l-4.36-4.76-2.68 1.9c-.43.3-1.03-.07-.95-.59l.55-3.53-4.78-1.57c-.61-.2-.64-1.04-.06-1.27Zm4.08-.11 3.25 1.08 6.56-4.7-5.35 6.18 3.53 3.86 4.2-11.51-12.19 4.09Z"/>
</svg>`;

  function replacePlaneIcons(){
    document.querySelectorAll('svg.icon-academic, svg.icon-profile-level-standart, svg[class*="icon-profile-level-standart"]').forEach(function(svg){
      if (svg.dataset.rahatPlaneDone === '1') return;

      const wrap = document.createElement('span');
      wrap.className = 'rahat-plane-icon-wrap';
      wrap.style.display = 'inline-flex';
      wrap.style.alignItems = 'center';
      wrap.style.justifyContent = 'center';
      wrap.style.width = '14px';
      wrap.style.height = '14px';
      wrap.style.minWidth = '14px';
      wrap.style.minHeight = '14px';
      wrap.innerHTML = CUSTOM_PLANE;

      svg.dataset.rahatPlaneDone = '1';
      svg.replaceWith(wrap);
    });
  }

  replacePlaneIcons();

  const timer = setInterval(replacePlaneIcons, 1200);
  setTimeout(function(){
    clearInterval(timer);
  }, 30000);
})();