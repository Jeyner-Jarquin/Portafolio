(function () {
  "use strict";

  var WHATSAPP_NUMBER = "50557183200";

  var LEAD_FORM_ENDPOINT = "";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function initNav() {
    var toggle = $(".nav-toggle");
    var nav = $("#nav-menu");
    if (!toggle || !nav) return;

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      nav.classList.toggle("is-open", open);
    }

    setOpen(false);

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    $$("a", nav).forEach(function (link) {
      link.addEventListener("click", function () { setOpen(false); });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });

    document.addEventListener("click", function (e) {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 820) setOpen(false);
    });
  }

  function initReveal() {
    var items = $$(".reveal");
    if (!items.length) return;

    if (prefersReduced || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

    items.forEach(function (el) { io.observe(el); });
  }

  function initScrollSpy() {
    var links = $$(".nav-list a");
    if (!links.length) return;

    var targets = links
      .map(function (link) {
        var id = link.getAttribute("href");
        return id && id.charAt(0) === "#" ? document.querySelector(id) : null;
      })
      .filter(Boolean);

    if (!targets.length) return;

    function update() {
      var line = window.innerHeight * 0.35;
      var currentId = null;

      targets.forEach(function (section) {
        if (section.getBoundingClientRect().top <= line) currentId = section.id;
      });

      links.forEach(function (link) {
        var id = link.getAttribute("href").slice(1);
        link.classList.toggle("is-active", id === currentId);
      });
    }

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        update();
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  function initFaq() {
    var items = $$(".faq-item");
    if (!items.length) return;

    items.forEach(function (item) {
      item.addEventListener("toggle", function () {
        if (!item.open) return;
        items.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      });
    });
  }

  function buildWhatsAppUrl(text) {
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);
  }

  function initLeadForm() {
    var form = $("#lead-form");
    var note = $("#form-note");
    if (!form) return;

    if (LEAD_FORM_ENDPOINT) form.setAttribute("action", LEAD_FORM_ENDPOINT);

    var campos = {
      nombre: $("#lead-nombre"),
      proyecto: $("#lead-proyecto"),
      mensaje: $("#lead-mensaje"),
      bot: $("#lead-bot")
    };

    function limpiarErrores() {
      Object.keys(campos).forEach(function (key) {
        if (campos[key]) campos[key].classList.remove("is-invalid");
      });
    }

    function avisar(texto, tipo) {
      if (!note) return;
      note.textContent = texto;
      note.classList.remove("is-ok", "is-error");
      if (tipo) note.classList.add(tipo);
    }

    Object.keys(campos).forEach(function (key) {
      var el = campos[key];
      if (!el || key === "bot") return;
      el.addEventListener("input", function () {
        el.classList.remove("is-invalid");
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      limpiarErrores();

      if (campos.bot && campos.bot.value !== "") return;

      var faltan = [];
      ["nombre", "proyecto", "mensaje"].forEach(function (key) {
        var el = campos[key];
        if (!el || el.value.trim() === "") {
          faltan.push(el);
          if (el) el.classList.add("is-invalid");
        }
      });

      if (faltan.length) {
        avisar("Completa los campos marcados para continuar.", "is-error");
        faltan[0].focus();
        return;
      }

      var texto =
        "Hola Jeyner, soy " + campos.nombre.value.trim() + ".\n" +
        "Necesito: " + campos.proyecto.value + ".\n" +
        campos.mensaje.value.trim();

      window.open(buildWhatsAppUrl(texto), "_blank", "noopener");

      if (!LEAD_FORM_ENDPOINT) {
        avisar("Te abrí WhatsApp con tu mensaje. Si no se abrió, escríbeme a +505 5718 3200.", "is-ok");
        form.reset();
        return;
      }

      avisar("Enviando copia a mi correo...", null);

      fetch(LEAD_FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          nombre: campos.nombre.value.trim(),
          proyecto: campos.proyecto.value,
          mensaje: campos.mensaje.value.trim(),
          _gotcha: ""
        }),
        keepalive: true
      })
        .then(function () {
          avisar("Listo: te abrí WhatsApp y te envié una copia al correo.", "is-ok");
          form.reset();
        })
        .catch(function () {
          avisar("Te abrí WhatsApp. El correo no se pudo enviar, escríbeme por ahí.", "is-error");
        });
    });
  }

  function initYear() {
    var el = $("[data-year]");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  function init() {
    initNav();
    initReveal();
    initScrollSpy();
    initFaq();
    initLeadForm();
    initYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();