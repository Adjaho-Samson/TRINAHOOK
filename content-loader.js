/* ============================================================
   TRINA HOOK — Moteur du site
   - Chargement du contenu CMS (site.json / creations.json)
   - Galerie : filtres animés, recherche, compteurs
   - Fiche produit (modale) avec commande WhatsApp
   - Menu mobile, en-tête au défilement, parallaxe, révélations
   ============================================================ */

const WHATSAPP_NUMBER = "22944985651";
const categoryLabels = {
  femmes: "Femmes",
  hommes: "Hommes",
  enfants: "Enfants",
  accessoires: "Accessoires",
};
const processIcons = new Set(["lightbulb", "hand-sparkles", "box-open"]);
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function normalize(text) {
  return (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function whatsappLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function orderMessage(title) {
  return `Bonjour Trina Hook, je suis intéressé(e) par « ${title} » vu sur le site.`;
}

/* ---------- Préchargeur ---------- */
function hidePreloader() {
  document.body.classList.add("is-loaded");
}
window.addEventListener("load", hidePreloader);
setTimeout(hidePreloader, 1600);

/* ---------- Année automatique ---------- */
const yearEl = document.querySelector("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- Bandes défilantes : duplication pour boucle parfaite ---------- */
["#announcement-track", "#marquee-track"].forEach((selector) => {
  const track = document.querySelector(selector);
  if (track && track.children.length === 1) {
    track.innerHTML += track.innerHTML;
  }
});

/* ---------- En-tête au défilement ---------- */
const header = document.querySelector("#site-header");
function updateHeader() {
  header?.classList.toggle("is-scrolled", window.scrollY > 40);
}
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

/* ---------- Menu mobile ---------- */
const menuToggle = document.querySelector("#menu-toggle");
const navLinks = document.querySelector("#nav-links");
const navOverlay = document.querySelector("#nav-overlay");

function setMenu(open) {
  navLinks?.classList.toggle("is-open", open);
  menuToggle?.classList.toggle("is-open", open);
  navOverlay?.classList.toggle("is-visible", open);
  menuToggle?.setAttribute("aria-expanded", String(open));
  menuToggle?.setAttribute(
    "aria-label",
    open ? "Fermer le menu" : "Ouvrir le menu",
  );
  document.body.style.overflow = open ? "hidden" : "";
}
menuToggle?.addEventListener("click", () =>
  setMenu(!navLinks.classList.contains("is-open")),
);
navOverlay?.addEventListener("click", () => setMenu(false));
navLinks
  ?.querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", () => setMenu(false)));

/* ---------- Lien de navigation actif ---------- */
const navAnchors = [...document.querySelectorAll(".nav-links a")].filter(
  (a) => a.getAttribute("href")?.startsWith("#"),
);
if (navAnchors.length && "IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navAnchors.forEach((a) =>
          a.classList.toggle(
            "is-active",
            a.getAttribute("href") === `#${entry.target.id}`,
          ),
        );
      });
    },
    { rootMargin: "-40% 0px -55% 0px" },
  );
  navAnchors.forEach((a) => {
    const section = document.querySelector(a.getAttribute("href"));
    if (section) sectionObserver.observe(section);
  });
}

/* ---------- Révélations au défilement ---------- */
function initializeReveal() {
  const targets = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || reducedMotion) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );
  targets.forEach((el) => observer.observe(el));
}

/* ---------- Parallaxe douce du hero ---------- */
function initializeParallax() {
  if (reducedMotion || window.matchMedia("(pointer: coarse)").matches) return;
  const hero = document.querySelector(".hero-section");
  const layers = document.querySelectorAll("[data-parallax]");
  if (!hero || !layers.length) return;

  let raf = null;
  hero.addEventListener("mousemove", (event) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      layers.forEach((layer) => {
        const depth = Number(layer.dataset.parallax) || 10;
        layer.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
      });
      raf = null;
    });
  });
  hero.addEventListener("mouseleave", () => {
    layers.forEach((layer) => (layer.style.transform = ""));
  });
}

/* ============================================================
   RENDU DES CRÉATIONS
   ============================================================ */
function createProductCard(product, showCategory) {
  const article = document.createElement("article");
  article.className = "creation-card";
  article.dataset.category = product.category;

  const imageWrapper = document.createElement("div");
  imageWrapper.className = "creation-image";

  const image = document.createElement("img");
  image.src = product.image.startsWith("/")
    ? product.image
    : `/${product.image}`;
  image.alt = product.alt || product.title;
  image.loading = "lazy";
  image.decoding = "async";
  imageWrapper.append(image);

  const category = document.createElement("span");
  category.className = "category-label";
  category.textContent =
    categoryLabels[product.category] || product.category;
  imageWrapper.append(category);

  const zoom = document.createElement("span");
  zoom.className = "creation-zoom";
  zoom.innerHTML = '<i class="fa-solid fa-magnifying-glass-plus"></i> Voir la pièce';
  imageWrapper.append(zoom);

  const info = document.createElement("div");
  info.className = "creation-info";

  const title = document.createElement("h3");
  title.textContent = product.title;
  info.append(title);

  const description = document.createElement("p");
  description.textContent = product.description || "Création au crochet";
  info.append(description);

  const actions = document.createElement("div");
  actions.className = "creation-actions";

  const note = document.createElement("span");
  note.className = "price-note";
  note.textContent = "Sur mesure";
  actions.append(note);

  const order = document.createElement("a");
  order.className = "order-btn";
  order.href = whatsappLink(orderMessage(product.title));
  order.target = "_blank";
  order.rel = "noopener noreferrer";
  order.innerHTML = '<i class="fa-brands fa-whatsapp"></i> Commander';
  actions.append(order);

  info.append(actions);
  article.append(imageWrapper, info);
  return article;
}

function renderProducts(creations) {
  const featuredGrid = document.querySelector("#featured-creations");
  const gallery = document.querySelector("#creation-gallery");

  if (featuredGrid) {
    const featured = creations.filter((product) => product.featured);
    featuredGrid.replaceChildren(
      ...featured.map((product) => createProductCard(product, false)),
    );
  }

  if (gallery) {
    gallery.replaceChildren(
      ...creations.map((product) => createProductCard(product, true)),
    );
  }

  const stat = document.querySelector('[data-stat="creations"]');
  if (stat) stat.textContent = creations.length;

  updateFilterCounts();
  applyFilters(false);
}

/* ============================================================
   FILTRES + RECHERCHE (galerie)
   ============================================================ */
let activeFilter = "all";
let searchQuery = "";

function getGalleryCards() {
  return [...document.querySelectorAll("#creation-gallery .creation-card")];
}

function cardMatches(card) {
  const matchesCategory =
    activeFilter === "all" || card.dataset.category === activeFilter;
  if (!matchesCategory) return false;
  if (!searchQuery) return true;
  const haystack = normalize(
    `${card.querySelector("h3")?.textContent || ""} ${
      card.querySelector("p")?.textContent || ""
    } ${card.querySelector(".category-label")?.textContent || ""}`,
  );
  return haystack.includes(searchQuery);
}

function applyFilters(animate = true) {
  const cards = getGalleryCards();
  if (!cards.length) return;

  let visibleCount = 0;
  cards.forEach((card, index) => {
    const shouldShow = cardMatches(card);
    const isHidden = card.classList.contains("is-hidden");

    if (shouldShow) {
      visibleCount += 1;
      if (isHidden) {
        card.classList.remove("is-hidden");
        if (animate && !reducedMotion) {
          card.classList.add("is-entering");
          card.style.transitionDelay = `${Math.min(index % 8, 7) * 35}ms`;
          requestAnimationFrame(() =>
            requestAnimationFrame(() => {
              card.classList.remove("is-entering");
              setTimeout(() => (card.style.transitionDelay = ""), 500);
            }),
          );
        }
      }
    } else if (!isHidden) {
      if (animate && !reducedMotion) {
        card.classList.add("is-hiding");
        setTimeout(() => {
          card.classList.add("is-hidden");
          card.classList.remove("is-hiding");
        }, 260);
      } else {
        card.classList.add("is-hidden");
      }
    }
  });

  const countEl = document.querySelector("#results-count");
  if (countEl) {
    countEl.innerHTML = `<strong>${visibleCount}</strong> création${
      visibleCount > 1 ? "s" : ""
    }`;
  }

  document
    .querySelector("#empty-message")
    ?.classList.toggle("show", visibleCount === 0);
}

function updateFilterCounts() {
  const cards = getGalleryCards();
  const counts = { all: cards.length };
  cards.forEach((card) => {
    counts[card.dataset.category] = (counts[card.dataset.category] || 0) + 1;
  });
  document.querySelectorAll("[data-count]").forEach((el) => {
    el.textContent = counts[el.dataset.count] || 0;
  });
}

function setActiveFilter(filter) {
  activeFilter = filter;
  document.querySelectorAll(".category-btn").forEach((btn) =>
    btn.classList.toggle("active", btn.dataset.filter === filter),
  );
  applyFilters();
}

function initializeGalleryFilters() {
  const buttons = document.querySelectorAll(".category-btn");
  if (!buttons.length) return;

  buttons.forEach((button) =>
    button.addEventListener("click", () => setActiveFilter(button.dataset.filter)),
  );

  document
    .querySelector("#gallery-search")
    ?.addEventListener("input", (event) => {
      searchQuery = normalize(event.target.value.trim());
      applyFilters();
    });

  document
    .querySelector("#reset-filters")
    ?.addEventListener("click", () => {
      const search = document.querySelector("#gallery-search");
      if (search) search.value = "";
      searchQuery = "";
      setActiveFilter("all");
    });

  document.querySelectorAll("[data-goto-filter]").forEach((link) =>
    link.addEventListener("click", () => setActiveFilter(link.dataset.gotoFilter)),
  );

  const requested = new URLSearchParams(window.location.search).get("filter");
  if (requested && categoryLabels[requested]) {
    setActiveFilter(requested);
  }
}

/* ============================================================
   FICHE PRODUIT (modale)
   ============================================================ */
const modal = document.querySelector("#product-modal");
const modalImage = document.querySelector("#modal-image");
const modalTitle = document.querySelector("#modal-title");
const modalDescription = document.querySelector("#modal-description");
const modalCategory = document.querySelector("#modal-category");
const modalOrder = document.querySelector("#modal-order");
let lastFocused = null;

function openModal(card) {
  if (!modal || !card) return;
  const img = card.querySelector("img");
  const title = card.querySelector("h3")?.textContent || "Création";
  const description =
    card.querySelector(".creation-info p")?.textContent ||
    "Création au crochet.";
  const category =
    card.querySelector(".category-label")?.textContent || "";

  modalImage.src = img?.src || "";
  modalImage.alt = img?.alt || title;
  modalTitle.textContent = title;
  modalDescription.textContent = description;
  modalCategory.textContent = category;
  modalOrder.href = whatsappLink(orderMessage(title));

  lastFocused = document.activeElement;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modal.querySelector(".modal-close")?.focus();
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  lastFocused?.focus?.();
}

document.addEventListener("click", (event) => {
  const image = event.target.closest(".creation-image");
  if (image) {
    openModal(image.closest(".creation-card"));
    return;
  }
  if (event.target.closest("[data-close-modal]")) closeModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal?.classList.contains("is-open")) {
    closeModal();
  }
});

/* ============================================================
   TEXTES DU CMS
   ============================================================ */
function renderParagraphs(site) {
  document.querySelectorAll("[data-paragraphs]").forEach((container) => {
    const paragraphs = site[container.dataset.paragraphs];
    if (!Array.isArray(paragraphs)) return;
    container.replaceChildren(
      ...paragraphs.map((text) => {
        const paragraph = document.createElement("p");
        paragraph.textContent = text;
        return paragraph;
      }),
    );
  });
}

function renderProcessSteps(steps) {
  const grid = document.querySelector("#process-steps");
  if (!grid || !Array.isArray(steps)) return;

  grid.replaceChildren(
    ...steps.map((step) => {
      const article = document.createElement("article");
      article.className = "process-card reveal is-visible";

      const icon = document.createElement("div");
      icon.className = "process-icon";
      const glyph = document.createElement("i");
      glyph.classList.add(
        "fa-solid",
        `fa-${processIcons.has(step.icon) ? step.icon : "lightbulb"}`,
      );
      icon.append(glyph);

      const title = document.createElement("h3");
      title.textContent = step.title;
      const description = document.createElement("p");
      description.textContent = step.description;

      article.append(icon, title, description);
      return article;
    }),
  );
}

function renderTestimonials(testimonials) {
  const grid = document.querySelector("#testimonials-grid");
  if (!grid || !Array.isArray(testimonials) || !testimonials.length) return;

  grid.replaceChildren(
    ...testimonials.map((item) => {
      const article = document.createElement("article");
      article.className = "testimonial-card reveal is-visible";

      const stars = document.createElement("div");
      stars.className = "testimonial-stars";
      stars.setAttribute("aria-label", "5 étoiles sur 5");
      stars.innerHTML = '<i class="fa-solid fa-star"></i>'.repeat(5);

      const quote = document.createElement("blockquote");
      quote.textContent = item.text;

      const author = document.createElement("div");
      author.className = "testimonial-author";

      const avatar = document.createElement("span");
      avatar.className = "testimonial-avatar";
      avatar.textContent = (item.name || "?").trim().charAt(0).toUpperCase();

      const meta = document.createElement("div");
      const name = document.createElement("strong");
      name.textContent = item.name;
      const role = document.createElement("span");
      role.textContent = item.role || "";
      meta.append(name, role);
      author.append(avatar, meta);

      article.append(stars, quote, author);
      return article;
    }),
  );
}

function applySiteText(site) {
  document.querySelectorAll("[data-content]").forEach((element) => {
    const value = site[element.dataset.content];
    if (typeof value !== "string") return;
    if (element.dataset.content === "announcement") {
      element.innerHTML = value.replaceAll("✦", " <i>✦</i> ");
    } else {
      element.textContent = value;
    }
  });

  renderParagraphs(site);
  renderProcessSteps(site.processSteps);
  renderTestimonials(site.testimonials);
}

/* ============================================================
   CHARGEMENT
   ============================================================ */
async function loadSiteContent() {
  try {
    const [siteResponse, creationsResponse] = await Promise.all([
      fetch("content/site.json"),
      fetch("content/creations.json"),
    ]);
    if (!siteResponse.ok || !creationsResponse.ok) {
      throw new Error("Impossible de charger les contenus du site.");
    }
    const [site, catalog] = await Promise.all([
      siteResponse.json(),
      creationsResponse.json(),
    ]);
    applySiteText(site);
    renderProducts(catalog.creations);
  } catch (error) {
    console.error("Le contenu du CMS n'a pas pu être chargé.", error);
    updateFilterCounts();
  }

  initializeGalleryFilters();
  initializeReveal();
  initializeParallax();
}

loadSiteContent();
