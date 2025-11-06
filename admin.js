(function () {
  const STORAGE_KEYS = {
    config: "estilos_config",
    products: "estilos_products",
    sales: "estilos_sales"
  };

  const ADMIN_PASSWORD = "admin1506";

  let config = {
    name: "Estilos",
    welcome: "Descubre productos, revisa detalles y haz tu pedido. El pago se realiza solo al recibir el producto.",
    colorPrimary: "#ec4899",
    colorSecondary: "#111827",
    musicUrl: "",
    email: "ventas@ejemplo.com",
    whatsapp: "50400000000",
    currency: "L."
  };

  let products = [];
  let sales = [];

  function loadAll() {
    try {
      const cfg = localStorage.getItem(STORAGE_KEYS.config);
      const prods = localStorage.getItem(STORAGE_KEYS.products);
      const sls = localStorage.getItem(STORAGE_KEYS.sales);
      if (cfg) config = JSON.parse(cfg);
      if (prods) products = JSON.parse(prods);
      if (sls) sales = JSON.parse(sls);
    } catch (e) {
      console.error("Error cargando datos", e);
    }
  }

  function saveConfig() {
    localStorage.setItem(STORAGE_KEYS.config, JSON.stringify(config));
  }

  function saveProducts() {
    localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
  }

  function formatMoney(v) {
    const n = Number(v) || 0;
    return (config.currency || "") + n.toFixed(2);
  }

  function setupLogin() {
    const btn = document.getElementById("btn-login");
    btn.addEventListener("click", () => {
      const pwd = (document.getElementById("admin-password").value || "").trim();
      if (pwd === ADMIN_PASSWORD) {
        document.getElementById("login-panel").classList.remove("active");
        document.getElementById("login-panel").classList.add("hidden");
        document.getElementById("admin-panel").classList.remove("hidden");
        document.getElementById("admin-panel").classList.add("active");
        renderConfig();
        renderProducts();
        renderSales();
      } else {
        alert("Contraseña incorrecta");
      }
    });
  }

  function renderConfig() {
    document.getElementById("cfg-name").value = config.name || "";
    document.getElementById("cfg-welcome").value = config.welcome || "";
    document.getElementById("cfg-color-primary").value = config.colorPrimary || "";
    document.getElementById("cfg-color-secondary").value = config.colorSecondary || "";
    document.getElementById("cfg-music-url").value = config.musicUrl || "";
    document.getElementById("cfg-email").value = config.email || "";
    document.getElementById("cfg-whatsapp").value = config.whatsapp || "";
    document.getElementById("cfg-currency").value = config.currency || "";
  }

  function setupConfigForm() {
    document.getElementById("form-config").addEventListener("submit", e => {
      e.preventDefault();
      config.name = document.getElementById("cfg-name").value.trim() || "Estilos";
      config.welcome = document.getElementById("cfg-welcome").value.trim();
      config.colorPrimary = document.getElementById("cfg-color-primary").value.trim() || "#ec4899";
      config.colorSecondary = document.getElementById("cfg-color-secondary").value.trim() || "#111827";
      config.musicUrl = document.getElementById("cfg-music-url").value.trim();
      config.email = document.getElementById("cfg-email").value.trim();
      config.whatsapp = document.getElementById("cfg-whatsapp").value.trim();
      config.currency = document.getElementById("cfg-currency").value.trim() || "L.";
      saveConfig();
      alert("Configuración guardada. Actualiza la página pública para ver cambios.");
    });
  }

  function renderProducts() {
    const tbody = document.querySelector("#table-products tbody");
    tbody.innerHTML = "";
    products.forEach(p => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.name}</td>
        <td>${formatMoney(p.price)}</td>
        <td>${p.stock ?? 0}</td>
        <td>${p.category || ""}</td>
        <td>${p.discount ? p.discount + "%" : "-"}</td>
      `;
      tr.addEventListener("click", () => loadProductForm(p.id));
      tbody.appendChild(tr);
    });
  }

  function loadProductForm(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    document.getElementById("prod-id").value = p.id;
    document.getElementById("prod-name").value = p.name || "";
    document.getElementById("prod-price").value = p.price ?? "";
    document.getElementById("prod-stock").value = p.stock ?? "";
    document.getElementById("prod-category").value = p.category || "";
    document.getElementById("prod-colors").value = (p.colors || []).join(", ");
    document.getElementById("prod-short").value = p.short || "";
    document.getElementById("prod-long").value = p.long || "";
    document.getElementById("prod-main-img").value = p.mainImage || "";
    document.getElementById("prod-extra-imgs").value = (p.extraImages || []).join(", ");
    document.getElementById("prod-discount").value = p.discount ?? 0;
    document.getElementById("prod-offer-start").value = p.offerStart || "";
    document.getElementById("prod-offer-end").value = p.offerEnd || "";
  }

  function clearProductForm() {
    document.getElementById("prod-id").value = "";
    document.getElementById("form-product").reset();
  }

  function setupProductForm() {
    document.getElementById("form-product").addEventListener("submit", e => {
      e.preventDefault();
      const id = document.getElementById("prod-id").value || ("p" + Date.now());
      const existingIndex = products.findIndex(p => p.id === id);
      const obj = {
        id,
        name: document.getElementById("prod-name").value.trim(),
        price: Number(document.getElementById("prod-price").value) || 0,
        stock: Number(document.getElementById("prod-stock").value) || 0,
        category: document.getElementById("prod-category").value.trim(),
        colors: document.getElementById("prod-colors").value.split(",").map(x => x.trim()).filter(Boolean),
        short: document.getElementById("prod-short").value.trim(),
        long: document.getElementById("prod-long").value.trim(),
        mainImage: document.getElementById("prod-main-img").value.trim(),
        extraImages: document.getElementById("prod-extra-imgs").value.split(",").map(x => x.trim()).filter(Boolean),
        discount: Number(document.getElementById("prod-discount").value) || 0,
        offerStart: document.getElementById("prod-offer-start").value,
        offerEnd: document.getElementById("prod-offer-end").value
      };
      if (!obj.name) {
        alert("Nombre obligatorio");
        return;
      }
      if (existingIndex >= 0) products[existingIndex] = obj;
      else products.push(obj);
      saveProducts();
      renderProducts();
      document.getElementById("prod-id").value = obj.id;
      alert("Producto guardado/actualizado");
    });

    document.getElementById("btn-clear-product").addEventListener("click", () => clearProductForm());

    document.getElementById("btn-delete-product").addEventListener("click", () => {
      const id = document.getElementById("prod-id").value;
      if (!id) {
        alert("Selecciona un producto primero");
        return;
      }
      if (!confirm("¿Eliminar producto?")) return;
      products = products.filter(p => p.id !== id);
      saveProducts();
      renderProducts();
      clearProductForm();
    });
  }

  function renderSales() {
    const tbody = document.querySelector("#table-sales tbody");
    tbody.innerHTML = "";
    sales.sort((a, b) => b.date.localeCompare(a.date));
    sales.forEach(s => {
      const tr = document.createElement("tr");
      const d = new Date(s.date);
      const dateTxt = d.toLocaleString();
      const names = (s.items || []).map(it => {
        const p = products.find(x => x.id === it.productId);
        return (p ? p.name : "?") + " x" + it.qty;
      }).join(", ");
      tr.innerHTML = `
        <td>${dateTxt}</td>
        <td>${s.customer || ""}</td>
        <td>${names}</td>
        <td>${formatMoney(s.total)}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    loadAll();
    setupLogin();
    setupConfigForm();
    setupProductForm();
  });
})();
