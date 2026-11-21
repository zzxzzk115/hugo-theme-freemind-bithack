/*!
 * freemind.bithack: in-page PDF reader (layouts/_partials/pdf-reader.html), on Mozilla PDF.js (Apache-2.0),
 * loaded from a CDN only when a page has a reader.
 * The file is read with range requests and nothing is fetched before the reader comes into view; pages are drawn
 * when they are near the visible area and dropped when far away, so a large PDF opens at once and stays light.
 * Page links: #<reader id>-p<N> opens the reader at that page.
 */
(function () {
  "use strict";
  var cfg = window.__theme || {};
  var i18n = cfg.i18n || {};
  var t = function (k, d) { return i18n[k] || d; };
  var base = (cfg.pdfjs || "https://cdn.jsdelivr.net/npm/pdfjs-dist@6.4.299/").replace(/\/?$/, "/");
  var MAX_PIXELS = 8e6; // per page canvas; very large zooms render a little softer instead of running out of memory
  var KEEP = 4; // pages kept drawn on each side of the visible ones

  var libLoad = null;
  function lib() {
    if (!libLoad) {
      libLoad = import(base + "legacy/build/pdf.min.mjs").then(function (m) {
        m.GlobalWorkerOptions.workerSrc = base + "legacy/build/pdf.worker.min.mjs";
        return m;
      });
    }
    return libLoad;
  }
  function mb(n) { return (n / 1048576).toFixed(n < 10485760 ? 1 : 0) + " MB"; }

  function Reader(root) {
    this.root = root;
    this.id = root.id;
    this.src = root.getAttribute("data-src");
    this.pagesEl = root.querySelector(".pdf-pages");
    this.status = root.querySelector(".pdf-status");
    this.input = root.querySelector(".pdf-pagebox input");
    this.totalEl = root.querySelector(".pdf-total");
    this.zoomEl = root.querySelector(".pdf-zoom");
    this.doc = null;
    this.slots = [];
    this.zoom = 0; // 0 = fit width; otherwise a scale (1 = 100 %)
    this.scale = 1;
    this.current = 1;
    this.started = false;
    this.bind();
  }

  Reader.prototype.bind = function () {
    var self = this;
    this.root.querySelector(".pdf-bar").addEventListener("click", function (e) {
      var b = e.target.closest("button[data-act]");
      if (!b) return;
      var act = b.getAttribute("data-act");
      if (act === "prev") self.go(self.current - 1);
      else if (act === "next") self.go(self.current + 1);
      else if (act === "in") self.setZoom((self.scale || 1) * 1.25);
      else if (act === "out") self.setZoom((self.scale || 1) / 1.25);
      else if (act === "fit") self.setZoom(0);
      else if (act === "full") self.toggleFull();
      else if (act === "link") self.copyLink();
    });
    this.input.addEventListener("change", function () { self.go(parseInt(self.input.value, 10) || self.current); });
    this.input.addEventListener("keydown", function (e) { if (e.key === "Enter") self.input.blur(); });
    this.root.addEventListener("keydown", function (e) {
      if (e.target === self.input) return;
      if (e.key === "Escape" && self.root.classList.contains("pdf-full")) { e.stopPropagation(); self.toggleFull(false); }
    });
    // start when the reader is about to come into view
    var io = new IntersectionObserver(function (es) {
      if (es.some(function (en) { return en.isIntersecting; })) { io.disconnect(); self.start(); }
    }, { rootMargin: "300px 0px" });
    io.observe(this.root);
    var resizeTimer;
    window.addEventListener("resize", function () {
      if (!self.doc || self.zoom) return;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { self.layout(self.current); }, 150);
    });
  };

  Reader.prototype.start = function (page) {
    var self = this;
    if (this.started) { if (page) this.ready.then(function () { self.go(page); }); return this.ready; }
    this.started = true;
    this.ready = lib().then(function (pdfjs) {
      self.pdfjs = pdfjs;
      var task = pdfjs.getDocument({
        url: self.src,
        disableAutoFetch: true, // only the parts that are needed
        disableStream: true,    // by range requests, not one long download
        rangeChunkSize: 262144,
        cMapUrl: base + "cmaps/", cMapPacked: true,
        standardFontDataUrl: base + "standard_fonts/",
        wasmUrl: base + "wasm/"
      });
      task.onProgress = function (p) {
        self.loaded = p.loaded; self.size = p.total || self.size;
        self.showLoaded();
      };
      return task.promise;
    }).then(function (doc) {
      self.doc = doc;
      self.totalEl.textContent = "/ " + doc.numPages;
      return doc.getPage(1);
    }).then(function (first) {
      self.base = first.getViewport({ scale: 1 }); // pages assumed this size until drawn
      self.build();
      self.layout(page || 1);
    }).catch(function (err) {
      self.status.textContent = t("pdfError", "This PDF cannot be shown here.") + " ";
      var a = document.createElement("a");
      a.href = self.src; a.target = "_blank"; a.rel = "noopener"; a.textContent = t("pdfDownload", "Download");
      self.status.appendChild(a);
      if (window.console) console.warn("pdf-reader:", err);
    });
    return this.ready;
  };

  Reader.prototype.showLoaded = function () {
    var txt = t("pdfLoaded", "Loaded {a} of {b}").replace("{a}", mb(this.loaded || 0)).replace("{b}", this.size ? mb(this.size) : "?");
    this.root.setAttribute("data-loaded", txt);
    if (!this.doc) this.status.textContent = t("pdfLoading", "Loading…") + " " + txt;
    var info = this.root.querySelector(".pdf-info");
    if (info) info.textContent = txt;
  };

  Reader.prototype.build = function () {
    var self = this;
    this.pagesEl.textContent = "";
    for (var n = 1; n <= this.doc.numPages; n++) {
      var slot = document.createElement("div");
      slot.className = "pdf-page";
      slot.id = this.id + "-p" + n;
      slot.setAttribute("data-n", n);
      slot.innerHTML = '<span class="pdf-pagenum">' + n + "</span>";
      this.pagesEl.appendChild(slot);
      this.slots.push({ el: slot, n: n, vp: null, drawn: 0, task: null, text: null });
    }
    var info = document.createElement("p");
    info.className = "pdf-info";
    this.pagesEl.appendChild(info);
    this.showLoaded();
    // draw what comes near the visible area, drop what goes far away; track the current page
    this.io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        var s = self.slots[+en.target.getAttribute("data-n") - 1];
        s.visible = en.isIntersecting;
      });
      self.refresh();
    }, { root: this.pagesEl, rootMargin: "50% 0px" });
    this.slots.forEach(function (s) { self.io.observe(s.el); });
    this.pagesEl.addEventListener("scroll", function () {
      if (self.scrollRaf) return;
      self.scrollRaf = requestAnimationFrame(function () { self.scrollRaf = 0; self.track(); });
    });
  };

  // fit-width scale, or the chosen zoom
  Reader.prototype.fitScale = function () {
    var w = this.pagesEl.clientWidth - 16;
    return Math.max(0.1, w / this.base.width);
  };

  Reader.prototype.layout = function (keepPage) {
    var self = this;
    this.scale = this.zoom || this.fitScale();
    this.zoomEl.textContent = Math.round(this.scale * 100) + "%";
    this.slots.forEach(function (s) {
      var w = (s.vp ? s.vp.width : self.base.width) * self.scale, h = (s.vp ? s.vp.height : self.base.height) * self.scale;
      s.el.style.width = Math.floor(w) + "px";
      s.el.style.height = Math.floor(h) + "px";
      if (s.drawn && s.drawn !== self.scale) self.drop(s);
    });
    if (keepPage) this.go(keepPage, true);
    this.refresh();
  };

  Reader.prototype.setZoom = function (z) {
    if (!this.doc) return;
    if (z) z = Math.min(4, Math.max(0.25, z));
    this.zoom = z;
    this.layout(this.current);
  };

  Reader.prototype.refresh = function () {
    var self = this, vis = this.slots.filter(function (s) { return s.visible; }).map(function (s) { return s.n; });
    if (!vis.length) return;
    var lo = Math.min.apply(null, vis) - KEEP, hi = Math.max.apply(null, vis) + KEEP;
    this.slots.forEach(function (s) {
      if (s.visible) self.draw(s);
      else if (s.drawn && (s.n < lo || s.n > hi)) self.drop(s);
    });
  };

  Reader.prototype.draw = function (s) {
    var self = this, scale = this.scale;
    if (s.drawn === scale || s.pending === scale) return;
    s.pending = scale;
    this.doc.getPage(s.n).then(function (page) {
      if (self.scale !== scale) return;
      var vp1 = page.getViewport({ scale: 1 });
      if (!s.vp || s.vp.width !== vp1.width || s.vp.height !== vp1.height) {
        s.vp = vp1;
        s.el.style.width = Math.floor(vp1.width * scale) + "px";
        s.el.style.height = Math.floor(vp1.height * scale) + "px";
      }
      var vp = page.getViewport({ scale: scale });
      var dpr = window.devicePixelRatio || 1;
      if (vp.width * vp.height * dpr * dpr > MAX_PIXELS) dpr = Math.sqrt(MAX_PIXELS / (vp.width * vp.height));
      var canvas = document.createElement("canvas");
      canvas.width = Math.floor(vp.width * dpr);
      canvas.height = Math.floor(vp.height * dpr);
      canvas.style.width = Math.floor(vp.width) + "px";
      canvas.style.height = Math.floor(vp.height) + "px";
      if (s.task) s.task.cancel();
      s.task = page.render({ canvasContext: canvas.getContext("2d"), viewport: vp, transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : null });
      return s.task.promise.then(function () {
        if (self.scale !== scale) return;
        var old = s.el.querySelector("canvas");
        if (old) old.replaceWith(canvas); else s.el.insertBefore(canvas, s.el.firstChild);
        s.drawn = scale;
        // selectable text on top of the picture
        var layer = s.el.querySelector(".textLayer");
        if (layer) layer.remove();
        layer = document.createElement("div");
        layer.className = "textLayer";
        s.el.style.setProperty("--total-scale-factor", scale);
        s.el.appendChild(layer);
        if (s.text) s.text.cancel();
        s.text = new self.pdfjs.TextLayer({ textContentSource: page.streamTextContent(), container: layer, viewport: vp });
        return s.text.render().catch(function () {});
      });
    }).catch(function (err) {
      if (err && err.name === "RenderingCancelledException") return;
      if (window.console) console.warn("pdf-reader: page " + s.n, err);
    }).then(function () { if (s.pending === scale) s.pending = 0; });
  };

  Reader.prototype.drop = function (s) {
    if (s.task) { s.task.cancel(); s.task = null; }
    if (s.text) { s.text.cancel(); s.text = null; }
    var c = s.el.querySelector("canvas");
    if (c) { c.width = c.height = 0; c.remove(); }
    var l = s.el.querySelector(".textLayer");
    if (l) l.remove();
    s.drawn = 0; s.pending = 0;
  };

  // the current page: the one covering the middle of the reading area
  Reader.prototype.track = function () {
    var mid = this.pagesEl.scrollTop + this.pagesEl.clientHeight / 3, n = 1;
    for (var i = 0; i < this.slots.length; i++) {
      if (this.slots[i].el.offsetTop <= mid) n = i + 1; else break;
    }
    if (n !== this.current) { this.current = n; this.input.value = n; }
  };

  Reader.prototype.go = function (n, instant) {
    if (!this.doc) return;
    n = Math.min(this.doc.numPages, Math.max(1, n));
    this.current = n;
    this.input.value = n;
    var el = this.slots[n - 1].el;
    this.pagesEl.scrollTo({ top: el.offsetTop - 8, behavior: instant ? "auto" : "smooth" });
  };

  Reader.prototype.toggleFull = function (on) {
    var full = typeof on === "boolean" ? on : !this.root.classList.contains("pdf-full");
    var keep = this.current;
    this.root.classList.toggle("pdf-full", full);
    document.body.classList.toggle("lb-open", full);
    var b = this.root.querySelector('[data-act="full"] i');
    if (b) b.className = "fa " + (full ? "fa-compress" : "fa-expand");
    if (this.doc) this.layout(keep);
    if (full) this.pagesEl.focus({ preventScroll: true });
  };

  Reader.prototype.copyLink = function () {
    var url = location.href.split("#")[0] + "#" + this.id + "-p" + this.current, self = this;
    var done = function () { // a short note under the toolbar
      self.root.setAttribute("data-flash", t("pdfLinkCopied", "Link to this page copied"));
      clearTimeout(self.flashTimer);
      self.flashTimer = setTimeout(function () { self.root.removeAttribute("data-flash"); }, 1800);
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(url).then(done, function () { window.prompt("", url); });
    else window.prompt("", url);
    history.replaceState(null, "", url);
  };

  var readers = Array.prototype.map.call(document.querySelectorAll(".pdf-reader[data-src]"), function (el) { return new Reader(el); });
  // #<id>-p<N>: open that reader at that page
  function fromHash() {
    var m = location.hash.match(/^#(.+)-p(\d+)$/);
    if (!m) return;
    readers.forEach(function (r) {
      if (r.id !== decodeURIComponent(m[1])) return;
      r.root.scrollIntoView({ block: "start" });
      r.start(+m[2]).then(function () { r.go(+m[2], true); });
    });
  }
  fromHash();
  window.addEventListener("hashchange", fromHash);
})();
