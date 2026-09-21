/* =========================================================
   HELPY — Interazioni condivise fra le pagine
   ========================================================= */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Scroll progress bar + nav state ---------- */
  const nav = document.getElementById("nav");
  const progress = document.getElementById("scrollProgress");

  function onScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progress) progress.style.width = pct + "%";

    if (nav) nav.classList.toggle("is-scrolled", scrollTop > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  const scrim = document.getElementById("navScrim");

  function closeMenu() {
    if (!links || !toggle) return;
    links.classList.remove("is-open");
    toggle.classList.remove("is-open");
    if (scrim) scrim.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Apri menu");
  }

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      const open = links.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      if (scrim) scrim.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Chiudi menu" : "Apri menu");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
    if (scrim) scrim.addEventListener("click", closeMenu);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- Link di nav corrispondente alla pagina aperta ----------
     Netlify serve /chi-siamo.html anche su /chi-siamo: normalizziamo
     togliendo l'estensione e la barra finale prima di confrontare. */
  function normalizePath(path) {
    return path.replace(/\.html$/, "").replace(/\/+$/, "") || "/";
  }

  const currentPath = normalizePath(window.location.pathname);

  if (links) {
    links.querySelectorAll("a[href]").forEach(function (a) {
      const url = new URL(a.getAttribute("href"), window.location.origin);
      // I link con solo ancora (es. /#servizi) restano gestiti dallo scroll-spy
      if (url.hash && normalizePath(url.pathname) === currentPath) return;
      if (normalizePath(url.pathname) === currentPath) {
        a.classList.add("is-current");
        if (currentPath !== "/") a.setAttribute("aria-current", "page");
      }
    });
  }

  /* ---------- Reveal on scroll (staggered) ---------- */
  const revealEls = Array.from(document.querySelectorAll("[data-reveal]"));

  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    const io = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const siblings = Array.from(el.parentElement.children).filter(function (c) {
            return c.hasAttribute("data-reveal");
          });
          const idx = siblings.indexOf(el);
          const delay = Math.min(idx, 6) * 80;
          el.style.transitionDelay = delay + "ms";
          el.classList.add("is-visible");
          obs.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Animated counters ---------- */
  const counters = Array.from(document.querySelectorAll("[data-count]"));

  function animateCount(el) {
    const target = parseFloat(el.getAttribute("data-count"));
    const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    const prefix = el.getAttribute("data-prefix") || "";
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 1500;

    if (prefersReduced) {
      el.textContent = prefix + target.toFixed(decimals) + suffix;
      return;
    }

    const start = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      const value = target * eased;
      el.textContent = prefix + value.toFixed(decimals) + suffix;
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + target.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(tick);
  }

  if (!("IntersectionObserver" in window)) {
    counters.forEach(animateCount);
  } else {
    const co = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          animateCount(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (el) {
      el.textContent = (el.getAttribute("data-prefix") || "") + "0" + (el.getAttribute("data-suffix") || "");
      co.observe(el);
    });
  }

  /* ---------- Scroll-spy sulle ancore della pagina corrente ---------- */
  const anchorLinks = links
    ? Array.from(links.querySelectorAll('a[href*="#"]')).filter(function (a) {
        const url = new URL(a.getAttribute("href"), window.location.origin);
        return url.hash && normalizePath(url.pathname) === currentPath;
      })
    : [];

  if (anchorLinks.length && "IntersectionObserver" in window) {
    const targets = anchorLinks
      .map(function (a) {
        const id = new URL(a.getAttribute("href"), window.location.origin).hash.slice(1);
        return document.getElementById(id);
      })
      .filter(Boolean);

    if (targets.length) {
      const so = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            const id = entry.target.id;
            anchorLinks.forEach(function (a) {
              const hash = new URL(a.getAttribute("href"), window.location.origin).hash;
              a.classList.toggle("is-active", hash === "#" + id);
            });
          });
        },
        { rootMargin: "-45% 0px -50% 0px" }
      );
      targets.forEach(function (s) { so.observe(s); });
    }
  }

  /* ---------- FAQ: apre una voce per volta ---------- */
  const faqItems = Array.from(document.querySelectorAll(".faq__item"));
  faqItems.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (!item.open) return;
      faqItems.forEach(function (other) {
        if (other !== item) other.open = false;
      });
    });
  });

  /* ---------- Form contatti (Netlify Forms via AJAX) ----------
     Dormiente: il form è stato tolto da contatti.html in attesa del lancio,
     perché raccogliere dati richiede un'informativa privacy pubblicata.
     Questo blocco resta pronto — al lancio basta rimettere il markup del
     form (con id="contactForm") e ricomincia a funzionare da solo. */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  if (form) {
    // Precompila il motivo da ?motivo=... (usato dai link "Candidati" / "Diventa partner")
    const motivo = form.querySelector("#motivo");
    const requested = new URLSearchParams(window.location.search).get("motivo");
    if (motivo && requested) {
      const match = Array.from(motivo.options).some(function (o) { return o.value === requested; });
      if (match) motivo.value = requested;
    }

    // Bottoni interni alla pagina che preselezionano il motivo
    document.querySelectorAll("[data-prefill]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (!motivo) return;
        motivo.value = btn.getAttribute("data-prefill");
        motivo.dispatchEvent(new Event("change", { bubbles: true }));
      });
    });

    form.addEventListener("submit", function (e) {
      // Senza fetch lasciamo il POST nativo: Netlify mostra la sua pagina di conferma
      if (!window.fetch) return;

      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const data = new FormData(form);

      if (status) {
        status.className = "form__status";
        status.textContent = "";
      }
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.6";
      }

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data).toString(),
      })
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          form.reset();
          if (status) {
            status.className = "form__status is-ok";
            status.textContent =
              "Messaggio inviato. Ti rispondiamo entro 24 ore nei giorni lavorativi.";
          }
        })
        .catch(function () {
          if (status) {
            status.className = "form__status is-err";
            status.innerHTML =
              'Invio non riuscito. Scrivici direttamente a ' +
              '<a href="mailto:helpyteam.info@gmail.com">helpyteam.info@gmail.com</a>.';
          }
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.style.opacity = "";
          }
        });
    });
  }
})();
