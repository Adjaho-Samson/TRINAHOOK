const categoryLabels = {
  femmes: "Femmes",
  hommes: "Hommes",
  enfants: "Enfants",
  accessoires: "Accessoires",
};

const processIcons = new Set(["lightbulb", "hand-sparkles", "box-open"]);

function createProductCard(product, showCategory) {
  const article = document.createElement("article");
  article.className = "creation-card";
  article.dataset.category = product.category;

  const imageWrapper = document.createElement("div");
  imageWrapper.className = showCategory ? "image-wrapper" : "creation-image";

  const image = document.createElement("img");
  image.src = product.image.startsWith("/")
    ? product.image
    : `/${product.image}`;
  image.alt = product.alt || product.title;
  image.loading = "lazy";
  imageWrapper.append(image);

  if (showCategory) {
    const category = document.createElement("span");
    category.className = "category-label";
    category.textContent = categoryLabels[product.category] || product.category;
    imageWrapper.append(category);
  }

  const info = document.createElement("div");
  info.className = "creation-info";

  const title = document.createElement("h3");
  title.textContent = product.title;
  info.append(title);

  if (showCategory) {
    const description = document.createElement("p");
    description.textContent = product.description;
    info.append(description);
  }

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
}

function renderList(container, items, createItem) {
  if (!container || !Array.isArray(items)) return;
  container.replaceChildren(...items.map(createItem));
}

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

  renderList(grid, steps, (step) => {
    const article = document.createElement("article");
    article.className = "know-how-card";

    const icon = document.createElement("div");
    icon.className = "know-how-icon";
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
  });
}

function applySiteText(site) {
  document.querySelectorAll("[data-content]").forEach((element) => {
    const value = site[element.dataset.content];
    if (typeof value === "string") element.textContent = value;
  });

  renderParagraphs(site);
  renderProcessSteps(site.processSteps);
}

function initializeGalleryFilters() {
  const buttons = document.querySelectorAll(".category-btn");
  const gallery = document.querySelector("#creation-gallery");
  const emptyMessage = document.querySelector("#empty-message");
  if (!gallery) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      let visibleCount = 0;
      gallery.querySelectorAll(".creation-card").forEach((card) => {
        const isVisible =
          button.dataset.filter === "all" ||
          card.dataset.category === button.dataset.filter;
        card.classList.toggle("hidden", !isVisible);
        if (isVisible) visibleCount += 1;
      });

      emptyMessage?.classList.toggle("show", visibleCount === 0);
    });
  });
}

function initializeScrollReveal() {
  if (
    !("IntersectionObserver" in window) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  const revealTargets = document.querySelectorAll(
    ".hero-content, .hero-text, .hero-image, .section-heading, .creations-grid, .creation-card, .story-container, .know-how-card, .category-buttons, .gallery-heading, .gallery-grid, .about-container, .craft-section, .collection-cta, .footer-box",
  );
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -35px 0px" },
  );

  revealTargets.forEach((element, index) => {
    element.classList.add("scroll-reveal");
    element.style.transitionDelay = `${(index % 4) * 70}ms`;
    observer.observe(element);
  });
}

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
  }

  initializeGalleryFilters();
  initializeScrollReveal();
}

loadSiteContent();
