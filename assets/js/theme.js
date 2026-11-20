/*!
 * freemind.bithack for Hugo — theme.js (no dependencies)
 * Replaces jQuery + Bootstrap JS + fancyBox + the old search.js.
 */
(function () {
  "use strict";

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var cfg = window.__theme || {};
  var i18n = cfg.i18n || {};
  var t = function (k, d) { return i18n[k] || d; };

  /* ------------------------------------------------------------ toast */
  var toastTimer;
  function toast(msg) {
    var el = $("#theme-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "theme-toast";
      el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("show"); }, 1800);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy") ? resolve() : reject(); } catch (e) { reject(e); }
      document.body.removeChild(ta);
    });
  }

  /* ------------------------------------------------------------ collapse / dropdown / tabs */
  document.addEventListener("click", function (e) {
    var acc = e.target.closest(".acc-toggle");
    if (acc) { // a top-level group in the "more" menu: accordion, one open at a time
      e.preventDefault();
      var group = acc.parentNode, show = !group.classList.contains("acc-open");
      $$(":scope > li.acc-open", group.parentNode).forEach(function (g) {
        g.classList.toggle("acc-open", false);
        $(".acc-toggle", g).setAttribute("aria-expanded", "false");
      });
      group.classList.toggle("acc-open", show);
      acc.setAttribute("aria-expanded", show);
      return;
    }
    var sub = e.target.closest(".sub-toggle");
    if (sub) { // foldable group inside a dropdown menu
      e.preventDefault();
      var list = document.getElementById(sub.getAttribute("aria-controls"));
      var opening = sub.getAttribute("aria-expanded") !== "true";
      sub.setAttribute("aria-expanded", opening);
      sub.closest(".dropdown-sub").classList.toggle("open-sub", opening);
      if (list) list.hidden = !opening;
      return;
    }
    var trg = e.target.closest("[data-toggle]");
    var openDropdowns = $$(".dropdown.open");
    if (!trg) {
      openDropdowns.forEach(function (d) { if (!d.contains(e.target)) d.classList.remove("open"); });
      return;
    }
    var kind = trg.getAttribute("data-toggle");
    if (kind === "collapse") {
      e.preventDefault();
      $$(trg.getAttribute("data-target")).forEach(function (el) { el.classList.toggle("in"); });
      trg.classList.toggle("collapsed");
    } else if (kind === "dropdown") {
      // Desktop: hover opens it (CSS); a click on the parent follows the link.
      if (trg.closest(".nav-more .dropdown-menu")) return;
      if (window.matchMedia("(min-width: 768px)").matches && trg.getAttribute("href") && trg.getAttribute("href") !== "#") return;
      e.preventDefault();
      var li = trg.parentNode;
      openDropdowns.forEach(function (d) { if (d !== li) d.classList.remove("open"); });
      li.classList.toggle("open");
      trg.setAttribute("aria-expanded", li.classList.contains("open"));
    } else if (kind === "tab") {
      e.preventDefault();
      var ul = trg.closest(".nav-tabs");
      var pane = $(trg.getAttribute("href"));
      if (!ul || !pane) return;
      $$("li", ul).forEach(function (li) { li.classList.remove("active"); });
      trg.parentNode.classList.add("active");
      $$(".tab-pane", pane.parentNode).forEach(function (p) { p.classList.remove("active", "in"); });
      pane.classList.add("active", "in");
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") $$(".dropdown.open").forEach(function (d) { d.classList.remove("open"); });
  });

  /* ------------------------------------------------------------ priority+ navbar */
  var navUl = $("#nav-items");
  var more = navUl && $(".nav-more", navUl);
  if (navUl && more) {
    var moreList = $(".dropdown-menu", more);
    var items = $$("#nav-items > li:not(.nav-more)");
    items.forEach(function (li, i) { li.setAttribute("data-index", i); });
    var container = navUl.parentNode;
    var brand = $(".navbar-brand", container);
    var fits = function () {
      var cs = getComputedStyle(container);
      var room = container.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      var used = brand.offsetWidth;
      $$(":scope > li", navUl).forEach(function (li) { if (!li.hidden) used += li.offsetWidth; });
      return used <= room - 2;
    };
    var fitNav = function () {
      // everything back in order, then fold the least important until it fits
      items.forEach(function (li) { navUl.insertBefore(li, more); });
      more.hidden = true;
      more.classList.remove("open");
      if (fits()) return;
      more.hidden = false;
      var order = items.slice().sort(function (a, b) {
        return (+b.getAttribute("data-priority")) - (+a.getAttribute("data-priority")) ||
          (+b.getAttribute("data-index")) - (+a.getAttribute("data-index"));
      });
      for (var i = 0; i < order.length && !fits(); i++) moreList.appendChild(order[i]);
      $$(":scope > li", moreList)
        .sort(function (a, b) { return a.getAttribute("data-index") - b.getAttribute("data-index"); })
        .forEach(function (li) { moreList.appendChild(li); });
    };
    // in the more menu, the group holding the current page starts open
    $$(":scope > li.dropdown.active", navUl).slice(0, 1).forEach(function (li) {
      var b = $(".acc-toggle", li);
      if (!b) return;
      li.classList.add("acc-open");
      b.setAttribute("aria-expanded", "true");
    });
    var navTimer;
    fitNav();
    // Only a width change can change what fits; phones also fire resize when the address bar slides in and out,
    // and refitting then would close an open menu.
    var navW = window.innerWidth;
    window.addEventListener("resize", function () {
      if (window.innerWidth === navW) return;
      navW = window.innerWidth;
      clearTimeout(navTimer); navTimer = setTimeout(fitNav, 60);
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitNav);
  }

  /* ------------------------------------------------------------ scroll: back to top, navbar fade, progress */
  var gotop = $("#gotop");
  var navbar = $(".navbar");
  var progress = $("#reading-progress");
  var article = $(".row.post .mypage");
  var navHover = false;
  if (navbar) {
    navbar.addEventListener("mouseenter", function () { navHover = true; navbar.classList.remove("faded"); });
    navbar.addEventListener("mouseleave", function () { navHover = false; onScroll(); });
  }
  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (gotop && gotop.classList.contains("show") !== y > 200) {
      gotop.classList.toggle("show", y > 200);
      if (y > 200) snapPixels(gotop); // its pixel arrow, now that it has a position
    }
    if (navbar && !navHover) navbar.classList.toggle("faded", y > 200 && window.innerWidth >= 1200);
    if (progress && article) {
      var r = article.getBoundingClientRect();
      var total = r.height - window.innerHeight;
      var p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1;
      progress.style.transform = "scaleX(" + p + ")";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (gotop) gotop.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ------------------------------------------------------------ narrow screens: move post meta above content */
  function placeBlocks() {
    var narrow = window.innerWidth < 980;
    var meta = $("#post_meta");
    if (meta) (narrow ? $("#top_meta") : $("#side_meta")).appendChild(meta);
  }
  placeBlocks();
  // On phones the post meta sits above the article: start with the TOC folded so the text comes first.
  if (window.innerWidth < 980) {
    var toc = $("#top_meta #toc");
    if (toc) toc.classList.remove("in");
  }
  window.addEventListener("resize", placeBlocks);

  /* ------------------------------------------------------------ TOC scroll spy */
  var tocLinks = $$("#TableOfContents a");
  if (tocLinks.length && "IntersectionObserver" in window) {
    var byId = {};
    tocLinks.forEach(function (a) { byId[decodeURIComponent(a.getAttribute("href").slice(1))] = a; });
    var heads = Object.keys(byId).map(function (id) { return document.getElementById(id); }).filter(Boolean);
    var visible = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { visible[en.target.id] = en.isIntersecting; });
      var current = null;
      for (var i = 0; i < heads.length; i++) {
        if (visible[heads[i].id]) { current = heads[i]; break; }
        if (heads[i].getBoundingClientRect().top < 80) current = heads[i];
      }
      tocLinks.forEach(function (a) { a.classList.remove("active"); });
      if (current && byId[current.id]) byId[current.id].classList.add("active");
    }, { rootMargin: "-60px 0px -60% 0px" });
    heads.forEach(function (h) { io.observe(h); });
  }

  /* ------------------------------------------------------------ code blocks: Prism.js (loaded only when needed) */
  // <pre><code> without a language (raw HTML, indented Markdown code) still gets the toolbar: plain text.
  $$(".mypage pre > code").forEach(function (code) {
    var pre = code.parentNode;
    if (/\blanguage-/.test(pre.className + " " + code.className)) return;
    pre.classList.add("language-plaintext");
    code.classList.add("language-plaintext");
    if (code.textContent.replace(/\n+$/, "").indexOf("\n") >= 0) pre.classList.add("line-numbers");
  });
  var codeBlocks = $$('pre[class*="language-"]');
  if (codeBlocks.length && cfg.prism) {
    var base = cfg.prism.replace(/\/?$/, "/");
    var css = function (href) {
      var l = document.createElement("link"); l.rel = "stylesheet"; l.href = href; document.head.appendChild(l);
    };
    var script = function (src, manual) {
      return new Promise(function (ok, fail) {
        var s = document.createElement("script");
        s.src = src;
        if (manual) s.setAttribute("data-manual", "");
        s.onload = ok; s.onerror = fail;
        document.head.appendChild(s);
      });
    };
    ["themes/prism-tomorrow.min.css", "plugins/line-numbers/prism-line-numbers.min.css",
     "plugins/toolbar/prism-toolbar.min.css", "plugins/line-highlight/prism-line-highlight.min.css"]
      .forEach(function (f) { css(base + f); });
    var plugins = ["plugins/autoloader/prism-autoloader.min.js", "plugins/line-numbers/prism-line-numbers.min.js",
      "plugins/line-highlight/prism-line-highlight.min.js", "plugins/toolbar/prism-toolbar.min.js",
      "plugins/show-language/prism-show-language.min.js", "plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js"];
    plugins.reduce(function (p, f) { return p.then(function () { return script(base + f); }); },
      script(base + "components/prism-core.min.js", true))
      .then(function () {
        if (window.Prism.plugins.autoloader) window.Prism.plugins.autoloader.languages_path = base + "components/";
        window.Prism.highlightAll();
      })
      .catch(function () { /* offline: the plain <pre> is still readable */ });
  }

  /* ------------------------------------------------------------ copy-on-click links (e.g. WeChat ID) and share "copy link" */
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-copy]");
    if (!a) return;
    e.preventDefault();
    var text = a.getAttribute("data-copy") || location.href;
    copyText(text).then(function () { toast(a.getAttribute("data-copied") || t("copied", "Copied")); },
      function () { toast(text); });
  });

  /* ------------------------------------------------------------ pixel-perfect pixel art ([data-pixels])
     An image whose cells are N pixels across (data-pixels="N") is resized so each cell covers a whole number of
     *device* pixels: at 150 % display scaling a 32-cell avatar at 96 CSS px would get 4.5 screen pixels per cell
     and uneven rows; it is snapped to the nearest whole multiple instead (5 per cell: 106.7 CSS px). */
  // Pixel icons (svg.px-icon, also data-pixels) are then moved by under one device pixel so they start on the
  // pixel grid, wherever centring put them.
  function snapPixels(root) {
    var dpr = window.devicePixelRatio || 1;
    $$("[data-pixels]", root).forEach(function (el) {
      var n = +el.getAttribute("data-pixels"), want = +el.getAttribute("width") || el.offsetWidth;
      if (!n || !want) return;
      var size = Math.max(1, Math.round(want * dpr / n)) * n / dpr + "px";
      el.style.width = size; el.style.height = size;
      if (!el.classList.contains("px-icon") || !el.getClientRects().length) return;
      el.style.position = "relative"; el.style.left = el.style.top = "0px";
      var r = el.getBoundingClientRect();
      el.style.left = (Math.round(r.left * dpr) - r.left * dpr) / dpr + "px";
      el.style.top = (Math.round(r.top * dpr) - r.top * dpr) / dpr + "px";
    });
  }
  snapPixels();
  window.addEventListener("resize", function () { snapPixels(); }); /* browser zoom changes devicePixelRatio and fires resize */

  /* ------------------------------------------------------------ image viewer
     Every content image opens in the viewer, the page's images as one gallery. Close: the close button, Esc, swipe
     down, or the browser's Back (phones). Several images: arrows, ← / →, or swipe. */
  var images = $$(".mypage img").filter(function (img) {
    return !img.classList.contains("nofancybox") && !img.closest("a") && !img.closest(".gallery") && !img.closest(".friend-card");
  });
  if (images.length) (function () { // own scope: theme.js shares one, and `items` / `open` are taken
    // PhotoSwipe (MIT, vendored in assets/js/vendor) does the viewing: pinch / double-tap / wheel zoom, drag, swipe
    // between images, swipe down to close. It is loaded on the first tap. The pixel look is in features.css; the
    // icons below are drawn on a pixel grid.
    // 32 × 32 pixel icons ("#" = a filled pixel), shown at whole screen pixels per icon pixel (about 20 px)
    var px = function (rows) {
      var rects = "";
      rows.forEach(function (row, y) {
        row.replace(/#+/g, function (run, x) { rects += '<rect x="' + x + '" y="' + y + '" width="' + run.length + '" height="1"/>'; });
      });
      return '<svg aria-hidden="true" class="pswp__icn px-icon" data-pixels="32" viewBox="0 0 32 32" width="20" height="20" shape-rendering="crispEdges">' +
        rects + "</svg>";
    };
    var arrow = px(["", "", "", "", "", "", "", "                  ###", "                 ###", "                ###", "               ###",
      "              ###", "             ###", "            ###", "           ###", "          ###", "          ###", "           ###", "            ###",
      "             ###", "              ###", "               ###", "                ###", "                 ###", "                  ###"]);
    var icons = {
      close: px(["", "", "", "", "", "", "", "", "       ###            ###", "        ###          ###", "         ###        ###",
        "          ###      ###", "           ###    ###", "            ###  ###", "             ######", "              ####", "              ####",
        "             ######", "            ###  ###", "           ###    ###", "          ###      ###", "         ###        ###",
        "        ###          ###", "       ###            ###"]),
      zoom: px(["", "", "", "         ########", "       ############", "      ##############", "     ####        ####",
        "    ####          ####", "    ###            ###", "   ###      ##      ###", "   ###      ##      ###", "   ###      ##      ###",
        "   ###   ########   ###", "   ###   ########   ###", "   ###      ##      ###", "   ###      ##      ###", "   ###      ##      ###",
        "    ###            ###", "    ####          ####", "     ####        ####", "      ##############", "       ###############",
        "         ########  ####", "                    ####", "                     ####", "                      ####", "                       ####",
        "                        ####"]),
      prev: arrow,
      next: arrow // PhotoSwipe's CSS mirrors the next arrow
    };
    // sizes: from the page's image when it has loaded, else a guess fixed once the file arrives
    var items = images.map(function (img) {
      return { src: img.currentSrc || img.src, width: img.naturalWidth || 0, height: img.naturalHeight || 0,
        alt: img.alt || "", caption: img.title || img.alt || "", pixel: !!img.closest(".pixel, [data-pixels]") };
    });
    var pswp = null, pushed = false, swallowPop = false, pswpLoad = null;
    var sizeItem = function (i) {
      var it = items[i];
      if (it.width) return;
      it.width = window.innerWidth; it.height = window.innerHeight; // placeholder
      var probe = new Image();
      probe.onload = function () {
        it.width = probe.naturalWidth; it.height = probe.naturalHeight;
        if (pswp) pswp.refreshSlideContent(i);
      };
      probe.src = it.src;
    };
    var open = function (index) {
      if (!cfg.pswp) return;
      pswpLoad = pswpLoad || import(cfg.pswp);
      pswpLoad.then(function (mod) {
        items.forEach(function (it, i) {
          var im = images[i];
          if (!it.width && im.naturalWidth) { it.width = im.naturalWidth; it.height = im.naturalHeight; it.src = im.currentSrc || im.src; }
          if (!it.width) sizeItem(i);
        });
        pswp = new mod.default({
          dataSource: items, index: index, bgOpacity: 1, showHideAnimationType: "fade", wheelToZoom: true,
          padding: { top: 56, bottom: 56, left: 0, right: 0 }, imageClickAction: "zoom", tapAction: "toggle-controls",
          closeTitle: t("close", "Close"), zoomTitle: t("zoom", "Zoom"), arrowPrevTitle: t("prev", "Previous"), arrowNextTitle: t("next", "Next"),
          closeSVG: icons.close, zoomSVG: icons.zoom, arrowPrevSVG: icons.prev, arrowNextSVG: icons.next, errorMsg: "404"
        });
        pswp.on("uiRegister", function () {
          pswp.ui.registerElement({ name: "caption", order: 9, isButton: false, appendTo: "root", html: "",
            onInit: function (el) {
              var set = function () { var c = pswp.currSlide && pswp.currSlide.data.caption; el.textContent = c || ""; el.hidden = !c; };
              pswp.on("change", set); set();
            } });
        });
        pswp.on("contentAppend", function (e) {
          if (e.content.element && e.content.data.pixel) e.content.element.style.imageRendering = "pixelated";
        });
        pswp.on("destroy", function () {
          pswp = null;
          document.body.classList.remove("lb-open");
          if (pushed) { pushed = false; swallowPop = true; history.back(); }
        });
        pswp.init();
        // each icon pixel on a whole number of screen pixels, the icon itself on the pixel grid
        var el = pswp.element;
        snapPixels(el);
        pswp.on("resize", function () { snapPixels(el); });
        document.body.classList.add("lb-open");
        // a history entry, so a phone's Back closes the viewer instead of leaving the page
        if (!pushed) { try { history.pushState({ lightbox: true }, ""); pushed = true; } catch (err) { pushed = false; } }
      });
    };
    window.addEventListener("popstate", function () {
      if (swallowPop) { swallowPop = false; return; }
      if (pswp) { pushed = false; pswp.close(); }
    });
    images.forEach(function (img, i) {
      img.classList.add("zoomable");
      img.addEventListener("click", function () { open(i); });
    });
  })();

  /* ------------------------------------------------------------ {{< gallery >}} slideshow */
  $$(".gallery").forEach(function (g) {
    var photos = $$(".photoset img", g);
    if (!photos.length) return;
    var cur = 0;
    var go = function (n) {
      photos[cur].classList.remove("active");
      cur = (n + photos.length) % photos.length;
      photos[cur].classList.add("active");
    };
    photos[0].classList.add("active");
    var prev = $(".prev", g), next = $(".next", g);
    if (prev) prev.addEventListener("click", function () { go(cur - 1); });
    if (next) next.addEventListener("click", function () { go(cur + 1); });
  });

  /* ------------------------------------------------------------ search (dialog)
     Navbar button, "/" or Ctrl/Cmd+K open it; Esc or a click on the backdrop closes it.
     While open: digital rain behind the panel, a typed prompt, and result titles that "decode".
     Reduced motion: same dialog, no effects. */
  var modal = $("#search-modal");
  var input = $("#local-search-input");
  var results = $("#local-search-result");
  if (modal && input && results && cfg.searchIndex) {
    var calm = cfg.searchFx !== "always" && !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    var index = null, loading = null, active = -1, lastFocus = null;
    var load = function () {
      if (!loading) loading = fetch(cfg.searchIndex).then(function (r) { return r.json(); }).then(function (d) { index = d; return d; });
      return loading;
    };
    var esc = function (s) { return s.replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
    var reEsc = function (s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); };
    var mark = function (text, words) {
      var html = esc(text);
      words.forEach(function (w) { if (w) html = html.replace(new RegExp("(" + reEsc(esc(w)) + ")", "gi"), "<mark>$1</mark>"); });
      return html;
    };

    /* digital rain on the dialog's canvas, ~24 fps, only while open */
    var canvas = $(".search-rain", modal), ctx2d = canvas.getContext("2d"), drops = [], rainTimer = null;
    var GLYPHS = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEFZ:.=*+-<>";
    var FS = 16;
    var sizeRain = function () {
      canvas.width = window.innerWidth; canvas.height = window.innerHeight;
      var cols = Math.ceil(canvas.width / FS);
      drops = []; for (var i = 0; i < cols; i++) drops.push(Math.floor(Math.random() * -40));
    };
    var rainStep = function () {
      ctx2d.fillStyle = "rgba(0, 0, 0, 0.12)";
      ctx2d.fillRect(0, 0, canvas.width, canvas.height);
      ctx2d.font = FS + "px monospace";
      for (var i = 0; i < drops.length; i++) {
        var y = drops[i] * FS;
        if (y > 0) {
          ctx2d.fillStyle = Math.random() < 0.06 ? "#d6ffe9" : "#2bbc8a";
          ctx2d.fillText(GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length)), i * FS, y);
        }
        drops[i] = (y > canvas.height && Math.random() > 0.97) ? 0 : drops[i] + 1;
      }
    };
    var startRain = function () {
      if (rainTimer) return;
      sizeRain();
      if (calm) { for (var k = 0; k < 60; k++) rainStep(); return; } // reduced motion: one still frame
      rainTimer = setInterval(rainStep, 42);
    };
    var stopRain = function () { clearInterval(rainTimer); rainTimer = null; ctx2d.clearRect(0, 0, canvas.width, canvas.height); };

    /* typed prompt */
    var promptEl = $(".search-prompt-text", modal), typeTimer = null;
    var typePrompt = function () {
      var text = t("searchPrompt", "Wake up, Neo… Type to follow the white rabbit.");
      clearInterval(typeTimer);
      if (calm) { promptEl.textContent = text; return; }
      var i = 0; promptEl.textContent = "";
      typeTimer = setInterval(function () {
        promptEl.textContent = text.slice(0, ++i);
        if (i >= text.length) clearInterval(typeTimer);
      }, 38);
    };

    /* result titles decode from random glyphs into the real text */
    var decode = function (el, finalHTML, plain) {
      if (calm) { el.innerHTML = finalHTML; return; }
      var n = 0, steps = 9;
      var timer = setInterval(function () {
        n++;
        if (n >= steps || !el.isConnected) { clearInterval(timer); el.innerHTML = finalHTML; return; }
        var keep = Math.floor(plain.length * n / steps), s = plain.slice(0, keep);
        for (var i = keep; i < plain.length; i++) s += plain.charAt(i) === " " ? " " : GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));
        el.textContent = s;
      }, 28);
    };

    var render = function () {
      var q = input.value.trim().toLowerCase();
      active = -1;
      if (!q) { results.innerHTML = ""; results.classList.remove("open"); return; }
      var words = q.split(/[\s\-]+/).filter(Boolean);
      var hits = [];
      (index || []).forEach(function (p) {
        var title = p.title.toLowerCase(), body = p.content.toLowerCase(), tags = (p.tags || []).join(" ").toLowerCase();
        var score = 0, first = -1;
        for (var i = 0; i < words.length; i++) {
          var w = words[i], inT = title.indexOf(w), inB = body.indexOf(w), inTag = tags.indexOf(w);
          if (inT < 0 && inB < 0 && inTag < 0) return;
          score += (inT >= 0 ? 10 : 0) + (inTag >= 0 ? 5 : 0) + (inB >= 0 ? 1 : 0);
          if (first < 0 && inB >= 0) first = inB;
        }
        var start = Math.max(0, first - 30);
        var snippet = p.content.substr(start, 120);
        hits.push({ p: p, score: score, snippet: (start > 0 ? "…" : "") + snippet + "…" });
      });
      hits.sort(function (a, b) { return b.score - a.score || (b.p.date > a.p.date ? 1 : -1); });
      if (!hits.length) {
        results.innerHTML = '<div class="search-empty">' + esc(t("noResults", "No results")) + "</div>";
      } else {
        hits = hits.slice(0, 20);
        results.innerHTML = '<ul class="search-result-list">' + hits.map(function (h) {
          return '<li><a href="' + h.p.url + '"><span class="search-result-title"></span><span class="search-result-date">' + h.p.date +
            '</span><p class="search-result">' + mark(h.snippet, words) + "</p></a></li>";
        }).join("") + "</ul>";
        $$(".search-result-title", results).forEach(function (el, i) { decode(el, mark(hits[i].p.title, words), hits[i].p.title); });
      }
      results.classList.add("open");
    };
    var move = function (d) {
      var items = $$("li a", results);
      if (!items.length) return;
      active = (active + d + items.length) % items.length;
      items.forEach(function (a, i) { a.classList.toggle("active", i === active); });
      items[active].scrollIntoView({ block: "nearest" });
    };

    var closing = null;
    var open = function () {
      clearTimeout(closing);
      if (!modal.hidden && modal.classList.contains("in")) { input.focus(); return; }
      lastFocus = document.activeElement;
      modal.hidden = false;
      document.body.classList.add("search-lock");
      requestAnimationFrame(function () { requestAnimationFrame(function () { modal.classList.add("in"); }); });
      startRain(); typePrompt(); load();
      setTimeout(function () { input.focus(); input.select(); }, 30);
    };
    var close = function () {
      if (modal.hidden) return;
      modal.classList.remove("in");
      document.body.classList.remove("search-lock");
      stopRain(); clearInterval(typeTimer);
      closing = setTimeout(function () { modal.hidden = true; }, 180);
      if (location.hash === "#search") history.replaceState(null, "", location.pathname + location.search);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };

    $$(".search-open").forEach(function (b) { b.addEventListener("click", function (e) { e.preventDefault(); open(); }); });
    $(".search-close", modal).addEventListener("click", close);
    modal.addEventListener("mousedown", function (e) { if (e.target === modal || e.target === canvas) close(); });
    window.addEventListener("resize", function () { if (rainTimer) sizeRain(); });
    input.addEventListener("input", function () { load().then(render); });
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
      else if (e.key === "Enter") {
        var a = $$("li a", results)[active < 0 ? 0 : active];
        if (a) location.href = a.href;
      }
    });
    document.addEventListener("keydown", function (e) {
      var tag = (e.target.tagName || "").toLowerCase();
      if (e.key === "Escape" && !modal.hidden) { e.preventDefault(); e.stopImmediatePropagation(); close(); return; }
      if ((e.key === "/" && tag !== "input" && tag !== "textarea" && !e.target.isContentEditable) || ((e.ctrlKey || e.metaKey) && (e.key || "").toLowerCase() === "k")) {
        e.preventDefault(); open();
      }
    });
    if (location.hash === "#search") open();
  }

  /* ------------------------------------------------------------ read on your phone (QR code)
     Floating button (wide screens): a dialog with a pixel QR code of this page, pointing at the
     section being read. The QR encoder (qrcode-generator, MIT) loads on first use. */
  var qrBtn = $("#qr-toggle"), qrModal = $("#qr-modal");
  if (qrBtn && qrModal && cfg.qrLib) {
    var qrLib = null, qrLast = null;
    var loadQr = function () {
      if (window.qrcode) return Promise.resolve();
      if (!qrLib) qrLib = new Promise(function (ok, fail) {
        var s = document.createElement("script");
        s.src = cfg.qrLib; s.onload = ok; s.onerror = function () { qrLib = null; fail(); };
        document.head.appendChild(s);
      });
      return qrLib;
    };
    // This page, at the heading the reader has scrolled past (if any).
    var qrTarget = function () {
      var url = location.href.split("#")[0], label = "";
      if (window.scrollY > 200) {
        var hs = $$(".md-content h2[id], .md-content h3[id]"), cur = null;
        for (var i = 0; i < hs.length; i++) { if (hs[i].getBoundingClientRect().top < 90) cur = hs[i]; else break; }
        if (cur) {
          url += "#" + encodeURIComponent(cur.id);
          label = cur.textContent.replace(/#\s*$/, "").trim();
        }
      }
      return { url: url, label: label };
    };
    var qrSvg = function (text) {
      var q = window.qrcode(0, "M");
      q.addData(text);
      q.make();
      var n = q.getModuleCount(), pad = 4, size = n + pad * 2, d = "";
      for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) if (q.isDark(r, c)) d += "M" + (c + pad) + " " + (r + pad) + "h1v1h-1z";
      return '<svg viewBox="0 0 ' + size + " " + size + '" shape-rendering="crispEdges" role="img" aria-label="QR code">' +
        '<rect width="100%" height="100%" fill="#fff"/><path d="' + d + '" fill="#000"/></svg>';
    };
    var qrTitleEl = $(".qr-title", qrModal), qrHintEl = $(".qr-hint", qrModal);
    var qrTitle0 = qrTitleEl.innerHTML, qrHint0 = qrHintEl.textContent;
    // opts (optional): { url, title, hint } - e.g. the share bar's WeChat button; default: this page at the section being read
    var qrOpen = function (opts) {
      opts = opts && opts.url ? opts : null;
      var tgt = opts ? { url: opts.url, label: "" } : qrTarget(), box = $(".qr-code", qrModal);
      qrTitleEl.innerHTML = opts && opts.title ? "&gt; " + opts.title : qrTitle0;
      qrHintEl.textContent = opts && opts.hint ? opts.hint : qrHint0;
      qrLast = document.activeElement;
      $(".qr-url", qrModal).value = tgt.url;
      var sec = $(".qr-section", qrModal);
      sec.textContent = tgt.label ? "§ " + tgt.label : "";
      sec.hidden = !tgt.label;
      box.innerHTML = '<span class="qr-loading">…</span>';
      qrModal.hidden = false;
      requestAnimationFrame(function () { requestAnimationFrame(function () { qrModal.classList.add("in"); }); });
      $(".qr-close", qrModal).focus();
      loadQr().then(function () { box.innerHTML = qrSvg(tgt.url); },
        function () { box.innerHTML = '<span class="qr-loading">' + t("qrFailed", "Could not load the QR encoder.") + "</span>"; });
    };
    var qrClose = function () {
      if (qrModal.hidden) return;
      qrModal.classList.remove("in");
      setTimeout(function () { qrModal.hidden = true; }, 160);
      if (qrLast && qrLast.focus) qrLast.focus();
    };
    qrBtn.addEventListener("click", function () { qrOpen(); });
    window.__qrOpen = qrOpen;  // used by the share bar's WeChat button
    $(".qr-close", qrModal).addEventListener("click", qrClose);
    qrModal.addEventListener("mousedown", function (e) { if (e.target === qrModal) qrClose(); });
    $(".qr-copy", qrModal).addEventListener("click", function () {
      copyText($(".qr-url", qrModal).value).then(function () { toast(t("copied", "Copied")); }, function () { toast(t("copyFailed", "Copy failed")); });
    });
    $(".qr-url", qrModal).addEventListener("focus", function (e) { e.target.select(); });
    // Registered before reader mode's handler, so Esc closes only the dialog.
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !qrModal.hidden) { e.preventDefault(); e.stopImmediatePropagation(); qrClose(); }
    });
  }

  /* ------------------------------------------------------------ share: device share menu ("Share…")
     Touch devices with the Web Share API get a Share… button (hidden otherwise); it shares the title, a one-line
     summary and this page's address at the section being read. On phones the bar then keeps only
     Share… and copy link (CSS: .share-links.native-on); WeChat is in the device menu. */
  var touch = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
  $$(".share-native").forEach(function (a) {
    if (!navigator.share || !touch) return;
    a.hidden = false;
    a.closest(".share-links").classList.add("native-on");
    a.addEventListener("click", function (e) {
      e.preventDefault();
      var url = a.getAttribute("data-url"), cur = null;
      if (window.scrollY > 200) {
        $$(".md-content h2[id], .md-content h3[id]").forEach(function (h) { if (h.getBoundingClientRect().top < 90) cur = h; });
        if (cur) url += "#" + encodeURIComponent(cur.id);
      }
      var data = { title: a.getAttribute("data-title") || document.title, text: a.getAttribute("data-text") || "", url: url };
      navigator.share(data).catch(function () { /* dismissed or not allowed: nothing to do */ });
    });
  });

  /* ------------------------------------------------------------ share: WeChat
     WeChat has no web share URL. Wider screens: the QR dialog with this page's public address, to scan in WeChat
     and share to Moments. Phones: copy the link (WeChat via the system menu is what Share… is for). */
  $$(".share-wechat").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      var url = a.getAttribute("data-url"), title = a.getAttribute("data-title") || document.title;
      var phone = window.matchMedia && window.matchMedia("(max-width: 767px)").matches;
      if (!phone && window.__qrOpen) {
        window.__qrOpen({ url: url, title: t("wechatTitle", "Share on WeChat"), hint: t("wechatHint", "Scan with WeChat, then tap ··· to share to Moments.") });
      } else {
        copyText(url).then(function () { toast(t("wechatCopied", "Link copied: paste it in WeChat")); }, function () { toast(t("copyFailed", "Copy failed")); });
      }
    });
  });

  /* ------------------------------------------------------------ reader mode (articles only) */
  var readerBtn = $("#reader-toggle");
  if (readerBtn) {
    var root = document.documentElement;
    var sync = function () {
      var on = root.classList.contains("reader");
      readerBtn.setAttribute("aria-pressed", on);
      $("span", readerBtn).textContent = on ? t("readerExit", "Exit reader") : t("reader", "Reader");
    };
    var toggleReader = function (force) {
      var on = typeof force === "boolean" ? force : !root.classList.contains("reader");
      root.classList.toggle("reader", on);
      try { localStorage.setItem("reader", on ? "1" : "0"); } catch (err) { /* private mode */ }
      sync();
      placeBlocks();
    };
    readerBtn.addEventListener("click", function () { toggleReader(); });
    document.addEventListener("keydown", function (e) {
      var tag = (e.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "r" || e.key === "R") toggleReader();
      else if (e.key === "Escape" && root.classList.contains("reader")) toggleReader(false);
    });
    sync();
  }

  /* ------------------------------------------------------------ language prompt
     If the visitor's browser prefers another of the site's languages, offer it (never redirect).
     The choice is remembered: "lang-pref" holds the language the visitor picked, either here or
     with the navbar language switch. */
  (function () {
    var texts = cfg.langPrompt;
    if (!texts || document.body.classList.contains("kind-404")) return; // 404: see layouts/404.html
    var PREF = "lang-pref";
    var store = {
      get: function () { try { return localStorage.getItem(PREF); } catch (e) { return null; } },
      set: function (v) { try { localStorage.setItem(PREF, v); } catch (e) { /* private mode */ } }
    };
    var base = function (l) { return (l || "").toLowerCase().split("-")[0]; };
    var pageLang = document.documentElement.lang;
    var links = $$(".lang-switch a[hreflang]");

    // Remember explicit choices made with the navbar switch.
    links.forEach(function (a) { a.addEventListener("click", function () { store.set(a.getAttribute("hreflang")); }); });

    var pref = store.get();
    var wanted = pref ? [pref] : (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language]);
    var target = null;
    for (var i = 0; i < wanted.length && !target; i++) {
      var w = base(wanted[i]);
      if (!w) continue;
      if (w === base(pageLang)) return; // already in a language the visitor reads first
      links.forEach(function (a) { if (!target && base(a.getAttribute("hreflang")) === w) target = a; });
    }
    if (!target) return;

    var lang = target.getAttribute("hreflang");
    var tx = texts[lang] || texts[base(lang)];
    if (!tx) return;
    var translated = target.getAttribute("data-translated") === "true";

    var box = document.createElement("div");
    box.className = "lang-prompt";
    box.setAttribute("role", "dialog");
    box.setAttribute("lang", lang);
    box.innerHTML =
      '<p class="lang-prompt-text"></p>' +
      '<div class="lang-prompt-actions">' +
      '<a class="lang-prompt-switch" href=""></a>' +
      '<button type="button" class="lang-prompt-stay"></button>' +
      "</div>";
    $(".lang-prompt-text", box).textContent = translated ? tx.page : tx.site;
    var sw = $(".lang-prompt-switch", box);
    sw.textContent = "[ " + tx["switch"] + " ]";
    sw.href = target.getAttribute("href");
    sw.setAttribute("hreflang", lang);
    $(".lang-prompt-stay", box).textContent = "[ " + tx.stay + " ]";

    var close = function () { box.classList.remove("in"); setTimeout(function () { box.remove(); }, 200); };
    sw.addEventListener("click", function () { store.set(lang); });
    $(".lang-prompt-stay", box).addEventListener("click", function () { store.set(pageLang); close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && box.isConnected) { store.set(pageLang); close(); } });

    document.body.appendChild(box);
    requestAnimationFrame(function () { box.classList.add("in"); });
  })();

  /* ------------------------------------------------------------ pixel snap (site-wide pixel font) */
  // A bitmap font is sharp only when its glyphs start on whole device pixels. A centred layout puts the content at
  // (viewport - width) / 2, which at 125 % / 150 % zoom or with an odd window width often falls between pixels.
  // Shift each layout block by less than one device pixel (left, never visible) so the edge where its text starts
  // lands on the pixel grid; children follow their block. Re-run on resize, zoom, font loading and reader mode.
  (function () {
    var html = document.documentElement;
    if (!html.classList.contains("px-body")) return;
    var SEL = "#main-nav > .container, body > .container, body > .container-narrow, " +
      ".container > .row > [class*='col-'], #side_meta, .md-content, #sidebar";
    var targets = function () { return $$(SEL).filter(function (e) { return getComputedStyle(e).position !== "fixed"; }); };
    var snap = function () {
      var d = window.devicePixelRatio || 1, els = targets();
      els.forEach(function (e) { e.style.left = ""; });
      els.forEach(function (e) { // document order: outer blocks first, so inner ones measure after their parent moved
        var cs = getComputedStyle(e);
        var x = (e.getBoundingClientRect().left + parseFloat(cs.borderLeftWidth) + parseFloat(cs.paddingLeft)) * d;
        var f = x - Math.round(x);
        if (Math.abs(f) < 0.02) return;
        if (cs.position === "static") e.style.position = "relative";
        e.style.left = (-f / d) + "px";
      });
    };
    var queued = false;
    var later = function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () { queued = false; snap(); });
    };
    snap();
    window.addEventListener("resize", later);
    window.addEventListener("load", later);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(later);
    if (window.ResizeObserver) new ResizeObserver(later).observe(document.body);
    // zoom changes the device pixel ratio, not always the layout size
    var watchDpr = function () {
      if (!window.matchMedia) return;
      var mq = window.matchMedia("(resolution: " + (window.devicePixelRatio || 1) + "dppx)");
      var onChange = function () { later(); watchDpr(); };
      if (mq.addEventListener) mq.addEventListener("change", onChange, { once: true });
      else if (mq.addListener) mq.addListener(onChange);
    };
    watchDpr();
    new MutationObserver(later).observe(html, { attributes: true, attributeFilter: ["class"] }); // reader mode
  })();

  /* ------------------------------------------------------------ external hook */
  document.dispatchEvent(new CustomEvent("theme:ready"));
})();
