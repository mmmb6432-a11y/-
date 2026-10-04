const products = [
  {
    id: 1,
    title: "گوشی موبایل",
    price: 8500,
    location: "زرنج",
    category: "موبایل",
    condition: "نو",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
    description: "گوشی موبایل سالم و تمیز، مناسب استفاده روزمره."
  },
  {
    id: 2,
    title: "لپ‌تاپ",
    price: 18000,
    location: "هرات",
    category: "لپ‌تاپ",
    condition: "کارکرده",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
    description: "لپ‌تاپ سالم برای درس، کار و استفاده روزمره."
  },
  {
    id: 3,
    title: "موتورسیکلت",
    price: 45000,
    location: "کابل",
    category: "وسایل نقلیه",
    condition: "کارکرده",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800",
    description: "موتورسیکلت سالم و آماده استفاده."
  },
  {
    id: 4,
    title: "تلویزیون LED",
    price: 12000,
    location: "قندهار",
    category: "خانه",
    condition: "نو",
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800",
    description: "تلویزیون LED با کیفیت تصویر خوب."
  }
];

let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
let darkMode = localStorage.getItem("darkMode") === "true";

/* ================= START ================= */

document.addEventListener("DOMContentLoaded", () => {
  if (darkMode) {
    document.body.classList.add("dark");
  }

  renderProducts(products);
  setupEvents();
});

/* ================= EVENTS ================= */

function setupEvents() {

  const searchInput = document.getElementById("searchInput");

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      searchProducts(searchInput.value);
    });
  }

  const categoryFilter = document.getElementById("categoryFilter");

  if (categoryFilter) {
    categoryFilter.addEventListener("change", applyFilters);
  }

  const conditionFilter = document.getElementById("conditionFilter");

  if (conditionFilter) {
    conditionFilter.addEventListener("change", applyFilters);
  }

  const productForm = document.getElementById("productForm");

  if (productForm) {
    productForm.addEventListener("submit", addProduct);
  }
}

/* ================= RENDER PRODUCTS ================= */

function renderProducts(list) {

  const container = document.getElementById("products");

  if (!container) return;

  if (!list.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <h3>محصولی پیدا نشد</h3>
        <p>عبارت دیگری را جستجو کنید.</p>
      </div>
    `;

    return;
  }

  container.innerHTML = list.map(product => {

    const isFavorite = favorites.includes(product.id);

    return `
      <div class="product-card">

        <button
          class="favorite-btn ${isFavorite ? "active" : ""}"
          onclick="toggleFavorite(${product.id})">
          ${isFavorite ? "❤️" : "♡"}
        </button>

        <img
          class="product-image"
          src="${product.image}"
          alt="${escapeHTML(product.title)}"
          loading="lazy"
          onerror="this.src='https://via.placeholder.com/600x400?text=No+Image'"
        >

        <div class="product-info">

          <div class="product-title">
            ${escapeHTML(product.title)}
          </div>

          <div class="product-price">
            ${formatPrice(product.price)} افغانی
          </div>

          <div class="product-location">
            📍 ${escapeHTML(product.location)}
          </div>

          <span class="badge ${
            product.condition === "نو"
              ? "badge-new"
              : "badge-used"
          }">
            ${escapeHTML(product.condition)}
          </span>

          <button
            onclick="openProductDetails(${product.id})"
            style="
              width:100%;
              margin-top:12px;
              padding:10px;
              border-radius:9px;
              background:#2563eb;
              color:white;
              font-weight:bold;
            ">
            مشاهده جزئیات
          </button>

        </div>
      </div>
    `;

  }).join("");
}

/* ================= SEARCH ================= */

function searchProducts(value) {

  const text = value.trim().toLowerCase();

  const result = products.filter(product => {

    return (
      product.title.toLowerCase().includes(text) ||
      product.location.toLowerCase().includes(text) ||
      product.category.toLowerCase().includes(text)
    );

  });

  renderProducts(result);
}

/* ================= FILTER ================= */

function applyFilters() {

  const category =
    document.getElementById("categoryFilter")?.value || "";

  const condition =
    document.getElementById("conditionFilter")?.value || "";

  const search =
    document.getElementById("searchInput")?.value
      .trim()
      .toLowerCase() || "";

  const result = products.filter(product => {

    const matchesSearch =
      !search ||
      product.title.toLowerCase().includes(search) ||
      product.location.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search);

    const matchesCategory =
      !category ||
      product.category === category;

    const matchesCondition =
      !condition ||
      product.condition === condition;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesCondition
    );
  });

  renderProducts(result);
}

/* ================= FAVORITES ================= */

function toggleFavorite(id) {

  if (favorites.includes(id)) {

    favorites = favorites.filter(
      favoriteId => favoriteId !== id
    );

    showToast("از علاقه‌مندی‌ها حذف شد");

  } else {

    favorites.push(id);

    showToast("به علاقه‌مندی‌ها اضافه شد");
  }

  localStorage.setItem(
    "favorites",
    JSON.stringify(favorites)
  );

  applyFilters();
}

/* ================= PRODUCT DETAILS ================= */

function openProductDetails(productId) {

  const product = products.find(
    p => Number(p.id) === Number(productId)
  );

  if (!product) return;

  const modal =
    document.getElementById("productModal");

  if (!modal) return;

  modal.innerHTML = `
    <div class="modal-content">

      <button
        class="modal-close"
        onclick="closeModal('productModal')">
        ×
      </button>

      <img
        class="details-image"
        src="${product.image}"
        alt="${escapeHTML(product.title)}"
      >

      <div class="details-title">
        ${escapeHTML(product.title)}
      </div>

      <div class="details-price">
        ${formatPrice(product.price)} افغانی
      </div>

      <div class="details-meta">

        <div class="meta-item">
          <span class="meta-label">دسته‌بندی</span>
          <span class="meta-value">
            ${escapeHTML(product.category)}
          </span>
        </div>

        <div class="meta-item">
          <span class="meta-label">وضعیت</span>
          <span class="meta-value">
            ${escapeHTML(product.condition)}
          </span>
        </div>

        <div class="meta-item">
          <span class="meta-label">موقعیت</span>
          <span class="meta-value">
            ${escapeHTML(product.location)}
          </span>
        </div>

      </div>

      <div class="details-description">
        ${escapeHTML(product.description)}
      </div>

      <button
        onclick="contactSeller(${product.id})"
        style="
          width:100%;
          margin-top:20px;
          padding:13px;
          border-radius:11px;
          background:#16a34a;
          color:white;
          font-weight:bold;
          font-size:15px;
        ">
        📞 تماس با فروشنده
      </button>

    </div>
  `;

  modal.classList.add("show");
}

/* ================= CONTACT ================= */

function contactSeller(id) {

  const product = products.find(
    p => Number(p.id) === Number(id)
  );

  if (!product) return;

  showToast(
    "اطلاعات تماس فروشنده در نسخه بعدی اضافه می‌شود"
  );
}

/* ================= ADD PRODUCT ================= */

function addProduct(event) {

  event.preventDefault();

  const title =
    document.getElementById("productTitle")?.value.trim();

  const price =
    Number(document.getElementById("productPrice")?.value);

  const location =
    document.getElementById("productLocation")?.value.trim();

  const category =
    document.getElementById("productCategory")?.value;

  const condition =
    document.getElementById("productCondition")?.value;

  const description =
    document.getElementById("productDescription")?.value.trim();

  const image =
    document.getElementById("productImage")?.value.trim();

  if (!title || !price || !location || !category) {

    showToast("لطفاً اطلاعات ضروری را وارد کنید");

    return;
  }

  const newProduct = {

    id:
      Date.now(),

    title,

    price,

    location,

    category,

    condition:
      condition || "کارکرده",

    image:
      image ||
      "https://via.placeholder.com/600x400?text=Product",

    description:
      description || "بدون توضیحات"

  };

  products.unshift(newProduct);

  renderProducts(products);

  closeModal("addProductModal");

  event.target.reset();

  showToast("آگهی با موفقیت ثبت شد");
}

/* ================= DARK MODE ================= */

function toggleDarkMode() {

  document.body.classList.toggle("dark");

  darkMode =
    document.body.classList.contains("dark");

  localStorage.setItem(
    "darkMode",
    darkMode
  );
}

/* ================= MODALS ================= */

function openModal(id) {

  const modal =
    document.getElementById(id);

  if (modal) {
    modal.classList.add("show");
  }
}

function closeModal(id) {

  const modal =
    document.getElementById(id);

  if (modal) {
    modal.classList.remove("show");
  }
}

/* ================= CLOSE BY BACKGROUND ================= */

document.addEventListener("click", event => {

  if (
    event.target.classList &&
    event.target.classList.contains("modal")
  ) {

    event.target.classList.remove("show");
  }

});

/* ================= FAVORITES PAGE ================= */

function showFavorites() {

  const favoriteProducts =
    products.filter(product =>
      favorites.includes(product.id)
    );

  renderProducts(favoriteProducts);
}

/* ================= HOME ================= */

function showHome() {

  renderProducts(products);

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

/* ================= PRICE ================= */

function formatPrice(price) {

  return Number(price).toLocaleString("fa-AF");
}

/* ================= TOAST ================= */

let toastTimer;

function showToast(message) {

  let toast =
    document.getElementById("toast");

  if (!toast) {

    toast =
      document.createElement("div");

    toast.id = "toast";

    toast.className = "toast";

    document.body.appendChild(toast);
  }

  toast.textContent = message;

  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer =
    setTimeout(() => {

      toast.classList.remove("show");

    }, 2500);
}

/* ================= ESCAPE HTML ================= */

function escapeHTML(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ================= SORT ================= */

function sortProducts(type) {

  let sorted =
    [...products];

  if (type === "cheap") {

    sorted.sort(
      (a, b) => a.price - b.price
    );

  } else if (type === "expensive") {

    sorted.sort(
      (a, b) => b.price - a.price
    );

  } else if (type === "new") {

    sorted.reverse();
  }

  renderProducts(sorted);
}

/* ================= CATEGORY ================= */

function showCategory(category) {

  const result =
    products.filter(
      product =>
        product.category === category
    );

  renderProducts(result);
}

/* ================= SCROLL ================= */

function scrollToProducts() {

  const section =
    document.getElementById("productsSection");

  if (section) {

    section.scrollIntoView({
      behavior: "smooth"
    });
  }
}