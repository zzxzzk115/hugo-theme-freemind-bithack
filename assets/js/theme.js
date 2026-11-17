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
      if (window.matchMedia("(min-width: 768px)").matches && trg.getAttribute("href")) return;
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
    if (gotop) gotop.classList.toggle("show", y > 200);
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

  /* ------------------------------------------------------------ narrow screens: move post meta / search above content */
  function placeBlocks() {
    var narrow = window.innerWidth < 980;
    var meta = $("#post_meta"), search = $("#site_search");
    if (meta) (narrow ? $("#top_meta") : $("#side_meta")).appendChild(meta);
    if (search) {
      if (narrow && $("#top_search")) $("#top_search").appendChild(search);
      else if (!narrow && $("#sidebar")) $("#sidebar").insertBefore(search, $("#sidebar").firstChild);
    }
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

  /* ------------------------------------------------------------ code blocks: copy, expand */
  $$(".code-block").forEach(function (block) {
    var btn = $(".code-copy", block);
    if (btn) btn.addEventListener("click", function () {
      var code = $(".lntd:last-child code", block) || $("code", block);
      var text = code ? code.innerText.replace(/\n$/, "") : "";
      copyText(text).then(function () {
        btn.classList.add("done");
        btn.innerHTML = '<i class="fa fa-check"></i> ' + t("copied", "Copied");
        setTimeout(function () { btn.classList.remove("done"); btn.innerHTML = '<i class="fa fa-clone"></i> ' + t("copy", "Copy"); }, 1500);
      }, function () { toast(t("copyFailed", "Copy failed")); });
    });
    var more = $(".code-expand", block);
    if (more) more.addEventListener("click", function () {
      var collapsed = block.classList.toggle("collapsed");
      more.innerHTML = collapsed ? '<i class="fa fa-angle-down"></i> ' + t("expand", "Expand") : '<i class="fa fa-angle-up"></i> ' + t("collapse", "Collapse");
    });
  });

  /* ------------------------------------------------------------ copy-on-click links (e.g. WeChat ID) and share "copy link" */
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-copy]");
    if (!a) return;
    e.preventDefault();
    var text = a.getAttribute("data-copy") || location.href;
    copyText(text).then(function () { toast(a.getAttribute("data-copied") || t("copied", "Copied")); },
      function () { toast(text); });
  });

  /* ------------------------------------------------------------ lightbox */
  var images = $$(".mypage img").filter(function (img) {
    return !img.classList.contains("nofancybox") && !img.closest("a") && !img.closest(".gallery") && !img.closest(".friend-card");
  });
  if (images.length) {
    var box, boxImg, boxCap, idx = 0;
    var build = function () {
      box = document.createElement("div");
      box.className = "lightbox";
      box.innerHTML = '<button class="lb-close" aria-label="Close">&times;</button>' +
        '<button class="lb-prev" aria-label="Previous">&lsaquo;</button><figure><img alt=""><figcaption></figcaption></figure>' +
        '<button class="lb-next" aria-label="Next">&rsaquo;</button>';
      document.body.appendChild(box);
      boxImg = $("img", box);
      boxCap = $("figcaption", box);
      box.addEventListener("click", function (e) {
        if (e.target.closest(".lb-prev")) show(idx - 1);
        else if (e.target.closest(".lb-next")) show(idx + 1);
        else if (e.target !== boxImg) close();
      });
    };
    var show = function (i) {
      idx = (i + images.length) % images.length;
      var img = images[idx];
      boxImg.src = img.currentSrc || img.src;
      boxCap.textContent = img.title || img.alt || "";
      box.classList.toggle("single", images.length < 2);
    };
    var close = function () { box.classList.remove("open"); document.body.classList.remove("lb-open"); };
    images.forEach(function (img, i) {
      img.classList.add("zoomable");
      img.addEventListener("click", function () {
        if (!box) build();
        show(i);
        box.classList.add("open");
        document.body.classList.add("lb-open");
      });
    });
    document.addEventListener("keydown", function (e) {
      if (!box || !box.classList.contains("open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(idx - 1);
      else if (e.key === "ArrowRight") show(idx + 1);
    });
  }

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

  /* ------------------------------------------------------------ search */
  var input = $("#local-search-input");
  var results = $("#local-search-result");
  if (input && results && cfg.searchIndex) {
    var index = null, loading = null, active = -1;
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
        results.innerHTML = '<ul class="search-result-list">' + hits.slice(0, 20).map(function (h) {
          return '<li><a href="' + h.p.url + '"><span class="search-result-title">' + mark(h.p.title, words) +
            '</span><span class="search-result-date">' + h.p.date + '</span><p class="search-result">' + mark(h.snippet, words) + "</p></a></li>";
        }).join("") + "</ul>";
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
    input.addEventListener("focus", load);
    input.addEventListener("input", function () { load().then(render); });
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
      else if (e.key === "Enter") {
        var a = $$("li a", results)[active < 0 ? 0 : active];
        if (a) location.href = a.href;
      } else if (e.key === "Escape") { input.value = ""; render(); input.blur(); }
    });
    document.addEventListener("keydown", function (e) {
      var tag = (e.target.tagName || "").toLowerCase();
      if ((e.key === "/" && tag !== "input" && tag !== "textarea") || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        input.scrollIntoView({ block: "center" });
        input.focus();
      }
    });
  }

  /* ------------------------------------------------------------ external hook */
  document.dispatchEvent(new CustomEvent("theme:ready"));
})();
