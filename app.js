const starterVehicles = [
  { id: "passenger-cng", name: "Passenger auto · CNG", type: "Passenger", price: 325000, stock: 5, year: "Sample", specs: "CNG · Passenger · Three-wheeler", tag: "Passenger", image: "assets/images/auto-rickshaw-india.jpg", photoCredit: "Clément Bardot · CC BY-SA 4.0", photoUrl: "https://commons.wikimedia.org/wiki/File:Auto_rickshaw_in_India.jpg" },
  { id: "passenger-diesel", name: "Passenger auto · Diesel", type: "Passenger", price: 345000, stock: 3, year: "Sample", specs: "Diesel · Passenger · Three-wheeler", tag: "Passenger", image: "assets/images/auto-rickshaw-ahmedabad.jpg", photoCredit: "Bernard Gagnon · CC BY-SA 3.0", photoUrl: "https://commons.wikimedia.org/wiki/File:Auto_rickshaw_in_Ahmedabad.jpg" },
  { id: "new-tempo-cargo", name: "New Tempo · Cargo Auto", type: "Cargo", price: 425000, stock: 3, year: "Sample", specs: "Cargo · Three-wheeler · Confirm exact model", tag: "New arrival", image: "assets/images/cargo-rickshaw.jpg", photoCredit: "Cargo reference · Killy95 · CC BY-SA 4.0", photoUrl: "https://commons.wikimedia.org/wiki/File:Bajaji_Guta....._sokoni.jpg" },
  { id: "e-rickshaw-lead", name: "Passenger e-rickshaw", type: "Electric", price: 155000, stock: 8, year: "Sample", specs: "Electric · Passenger · Three-wheeler", tag: "Electric", image: "assets/images/electric-rickshaw-meerut.jpg", photoCredit: "Libreravi · CC BY-SA 4.0", photoUrl: "https://commons.wikimedia.org/wiki/File:Electric_rickshaw_in_Meerut,_Uttar_Pradesh,_India.jpg" },
  { id: "cargo-cng", name: "Cargo auto · CNG", type: "Cargo", price: 365000, stock: 2, year: "Sample", specs: "CNG · Cargo · Three-wheeler", tag: "Cargo", image: "assets/images/cargo-rickshaw.jpg", photoCredit: "Killy95 · CC BY-SA 4.0", photoUrl: "https://commons.wikimedia.org/wiki/File:Bajaji_Guta....._sokoni.jpg" },
  { id: "cargo-diesel", name: "Cargo auto · Diesel", type: "Cargo", price: 385000, stock: 4, year: "Sample", specs: "Diesel · Cargo · Three-wheeler", tag: "Cargo", image: "assets/images/cargo-rickshaw.jpg", photoCredit: "Killy95 · CC BY-SA 4.0", photoUrl: "https://commons.wikimedia.org/wiki/File:Bajaji_Guta....._sokoni.jpg" },
  { id: "electric-passenger", name: "Electric passenger auto", type: "Electric", price: 295000, stock: 0, year: "Sample", specs: "Electric · Passenger · Three-wheeler", tag: "Electric", image: "assets/images/electric-rickshaw-meerut.jpg", photoCredit: "Libreravi · CC BY-SA 4.0", photoUrl: "https://commons.wikimedia.org/wiki/File:Electric_rickshaw_in_Meerut,_Uttar_Pradesh,_India.jpg" },
  { id: "electric-cargo", name: "Electric cargo loader", type: "Electric", price: 245000, stock: 2, year: "Sample", specs: "Electric · Cargo · Three-wheeler", tag: "Electric", image: "assets/images/cargo-rickshaw.jpg", photoCredit: "Killy95 · CC BY-SA 4.0", photoUrl: "https://commons.wikimedia.org/wiki/File:Bajaji_Guta....._sokoni.jpg" },
  { id: "e-rickshaw-lithium", name: "Passenger e-rickshaw · Lithium", type: "Passenger", price: 185000, stock: 1, year: "Sample", specs: "Electric · Passenger · Three-wheeler", tag: "Passenger", image: "assets/images/electric-rickshaw-meerut.jpg", photoCredit: "Libreravi · CC BY-SA 4.0", photoUrl: "https://commons.wikimedia.org/wiki/File:Electric_rickshaw_in_Meerut,_Uttar_Pradesh,_India.jpg" }
];
const defaultPhotos = {
  Passenger: { image: "assets/images/auto-rickshaw-india.jpg", credit: "Clément Bardot · CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Auto_rickshaw_in_India.jpg" },
  Cargo: { image: "assets/images/cargo-rickshaw.jpg", credit: "Killy95 · CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Bajaji_Guta....._sokoni.jpg" },
  Electric: { image: "assets/images/electric-rickshaw-meerut.jpg", credit: "Libreravi · CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Electric_rickshaw_in_Meerut,_Uttar_Pradesh,_India.jpg" }
};
const STORAGE_KEY = "vihaan-automobiles-inventory-v3";
const CART_KEY = "vihaan-automobiles-cart-v3";
const ORDER_KEY = "vihaan-automobiles-enquiries-v1";
const REVIEW_KEY = "vihaan-automobiles-reviews-v1";
let vehicles = loadVehicles();
let cart = loadCart();
let orders = loadRecords(ORDER_KEY, "customer enquiries");
let reviews = loadRecords(REVIEW_KEY, "customer reviews");
let activeCategory = "All";
let favoriteIds = new Set();
let priceUpdates = 0;
let toastTimer;
const money = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
const el = (id) => document.getElementById(id);

function loadVehicles() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return starterVehicles.map((vehicle) => ({ ...vehicle }));
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : starterVehicles.map((vehicle) => ({ ...vehicle }));
  } catch (error) {
    console.error("Could not load saved vehicle inventory.", error);
    return starterVehicles.map((vehicle) => ({ ...vehicle }));
  }
}
function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(saved)
      ? saved.map((item) => typeof item === "string" ? { id: item, quantity: 1 } : item)
        .filter((item) => item && typeof item.id === "string" && Number.isInteger(item.quantity) && item.quantity > 0)
      : [];
  } catch (error) {
    console.error("Could not load the saved cart.", error);
    return [];
  }
}
function loadRecords(key, recordName) {
  try {
    const saved = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    console.error(`Could not load saved ${recordName}.`, error);
    return [];
  }
}
function persistVehicles() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
    return true;
  } catch (error) {
    console.error("Could not save vehicle inventory.", error);
    notify("Could not save changes in this browser.");
    return false;
  }
}
function persistShortlist() {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Could not save the cart.", error);
    notify("Could not save the cart in this browser.");
  }
}
function persistRecords(key, records, recordName) {
  try {
    localStorage.setItem(key, JSON.stringify(records));
    return true;
  } catch (error) {
    console.error(`Could not save ${recordName}.`, error);
    notify(`Could not save ${recordName} in this browser.`);
    return false;
  }
}
function safeText(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}
function notify(message) {
  const toast = el("toast");
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2600);
}
function vehiclePrice(price) { return `₹${money.format(Number(price) || 0)}`; }
function vehicleImage(vehicle) {
  return vehicle.image || defaultPhotos[vehicle.type]?.image || defaultPhotos.Passenger.image;
}
function vehiclePhotoCredit(vehicle) {
  const photo = defaultPhotos[vehicle.type] || defaultPhotos.Passenger;
  return {
    credit: vehicle.photoCredit || photo.credit,
    url: vehicle.photoUrl === undefined ? photo.url : vehicle.photoUrl
  };
}
function photoCreditMarkup(vehicle) {
  const { credit, url } = vehiclePhotoCredit(vehicle);
  return url
    ? `<a class="image-credit" href="${safeText(url)}" target="_blank" rel="noreferrer">Photo: ${safeText(credit)}</a>`
    : `<span class="image-credit">${safeText(credit)}</span>`;
}
function availability(vehicle) {
  const stock = Math.max(0, Number(vehicle.stock) || 0);
  if (stock === 0) return { text: "Currently unavailable", className: "out" };
  if (stock <= 3) return { text: "Limited availability", className: "low" };
  return { text: "Available to enquire", className: "available" };
}
function cartVehicleLines() {
  return cart.map((line) => ({ vehicle: vehicles.find((item) => item.id === line.id), quantity: line.quantity }))
    .filter((line) => line.vehicle);
}
function updateEnquiryCartSummary() {
  const items = cartVehicleLines();
  el("enquiryCartSummary").textContent = items.length
    ? items.map(({ vehicle, quantity }) => `${vehicle.name} × ${quantity}`).join(" · ")
    : "No vehicles selected yet.";
}
function compressVehiclePhoto(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      try {
        const scale = Math.min(1, 1400 / image.naturalWidth, 1000 / image.naturalHeight);
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Your browser could not process this photo.");
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        let photo = canvas.toDataURL("image/webp", 0.82);
        if (!photo.startsWith("data:image/webp")) photo = canvas.toDataURL("image/png");
        if (photo.length > 2500000) throw new Error("This photo is still too large. Choose a smaller image.");
        resolve(photo);
      } catch (error) {
        reject(error);
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("This image could not be opened. Try another PNG, JPG or WebP file."));
    };
    image.src = objectUrl;
  });
}
function renderVehicles() {
  const query = el("searchInput").value.trim().toLowerCase();
  const sort = el("sortSelect").value;
  const minimum = el("priceMin").value === "" ? 0 : Number(el("priceMin").value);
  const maximum = el("priceMax").value === "" ? Number.POSITIVE_INFINITY : Number(el("priceMax").value);
  let visible = vehicles.filter((vehicle) => {
    const matchesCategory = activeCategory === "All" || vehicle.type === activeCategory;
    const matchesPrice = Number(vehicle.price) >= minimum && Number(vehicle.price) <= maximum;
    return matchesCategory && matchesPrice && `${vehicle.name} ${vehicle.type} ${vehicle.specs}`.toLowerCase().includes(query);
  });
  if (sort === "low") visible.sort((a, b) => a.price - b.price);
  if (sort === "high") visible.sort((a, b) => b.price - a.price);
  el("allCount").textContent = vehicles.length;
  el("productGrid").innerHTML = visible.map((vehicle) => {
    const stock = availability(vehicle);
    return `<article class="product-card">
      <div class="product-image-wrap"><img class="product-image" src="${safeText(vehicleImage(vehicle))}" alt="Reference photo for ${safeText(vehicle.name)}; exact model not confirmed" loading="lazy" /><span class="product-label">${safeText(vehicle.tag || vehicle.type)}</span><button class="favorite-button ${favoriteIds.has(vehicle.id) ? "favorited" : ""}" type="button" data-favorite="${safeText(vehicle.id)}" aria-label="Save ${safeText(vehicle.name)} as a favourite">${favoriteIds.has(vehicle.id) ? "♥" : "♡"}</button>${photoCreditMarkup(vehicle)}</div>
      <div class="product-info"><div class="product-type">${safeText(vehicle.type)} three-wheeler</div><div class="product-name-row"><h3 class="product-name">${safeText(vehicle.name)}</h3><span class="product-year">${safeText(vehicle.year || "")}</span></div><p class="product-specs">${safeText(vehicle.specs || "")}</p><div class="product-availability ${stock.className}">${stock.text}</div><div class="product-price-line"><span><small class="product-price-label">Illustrative sample price</small><strong class="product-price">${vehiclePrice(vehicle.price)}</strong></span><button class="add-button" type="button" data-add="${safeText(vehicle.id)}" aria-label="Add ${safeText(vehicle.name)} to cart" ${Number(vehicle.stock) <= 0 ? "disabled" : ""}>+</button></div><button class="details-button" type="button" data-details="${safeText(vehicle.id)}">View details <span>↗</span></button></div>
    </article>`;
  }).join("");
  el("emptyState").classList.toggle("hidden", visible.length > 0);
}
function renderCart() {
  const items = cartVehicleLines();
  const quantity = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + Number(item.vehicle.price) * item.quantity, 0);
  el("cartCount").textContent = quantity;
  el("cartEmpty").classList.toggle("hidden", items.length > 0);
  el("drawerBottom").classList.toggle("hidden", items.length === 0);
  el("cartTotal").classList.toggle("hidden", items.length === 0);
  el("cartSubtotal").textContent = vehiclePrice(subtotal);
  el("cartItems").innerHTML = items.map(({ vehicle, quantity: count }) => `<div class="cart-item"><img src="${safeText(vehicleImage(vehicle))}" alt="" /><span class="cart-item-copy"><strong>${safeText(vehicle.name)}</strong><small>${vehiclePrice(vehicle.price)} each · illustrative</small><span class="quantity-control"><button type="button" data-quantity-down="${safeText(vehicle.id)}" aria-label="Decrease ${safeText(vehicle.name)} quantity">−</button><b>${count}</b><button type="button" data-quantity-up="${safeText(vehicle.id)}" aria-label="Increase ${safeText(vehicle.name)} quantity">+</button><button class="remove-item" type="button" data-remove="${safeText(vehicle.id)}" aria-label="Remove ${safeText(vehicle.name)} from cart">Remove</button></span></span></div>`).join("");
  updateEnquiryCartSummary();
}
function renderOrders() {
  el("statEnquiries").textContent = orders.length;
  el("ordersEmpty").classList.toggle("hidden", orders.length > 0);
  el("ordersTable").innerHTML = [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map((order) => {
    const items = Array.isArray(order.items) ? order.items.map((item) => `${safeText(item.name)} × ${Number(item.quantity) || 1}`).join(", ") : "General enquiry";
    const date = new Date(order.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
    const statuses = ["New", "Contacted", "Booked", "Closed"];
    return `<tr><td>${safeText(order.reference)}</td><td><strong>${safeText(order.name)}</strong><small class="order-phone">${safeText(order.phone)}</small></td><td>${items || "General enquiry"}</td><td>${safeText(order.message || "—")}</td><td><select class="order-status" data-order-status="${safeText(order.reference)}" aria-label="Enquiry status for ${safeText(order.reference)}">${statuses.map((status) => `<option ${status === order.status ? "selected" : ""}>${status}</option>`).join("")}</select></td><td>${safeText(date)}</td></tr>`;
  }).join("");
}
function renderReviews() {
  const count = reviews.length;
  const average = count ? reviews.reduce((sum, review) => sum + Number(review.rating), 0) / count : 0;
  el("reviewAverage").textContent = count ? `${average.toFixed(1)} / 5` : "—";
  el("reviewCount").textContent = count ? `${count} customer ${count === 1 ? "review" : "reviews"}` : "No reviews yet";
  el("reviewList").innerHTML = count ? [...reviews].reverse().map((review) => `<article class="review-card"><div class="review-stars" aria-label="${Number(review.rating)} out of 5 stars">${"★".repeat(Number(review.rating))}${"☆".repeat(5 - Number(review.rating))}</div><p>“${safeText(review.text)}”</p><strong>${safeText(review.name)}</strong></article>`).join("") : `<div class="review-empty"><span>✳</span><strong>No reviews yet</strong><p>Be the first customer to share an honest experience.</p></div>`;
}
function renderOffice() {
  el("statVehicles").textContent = vehicles.length;
  el("statStock").textContent = vehicles.reduce((total, vehicle) => total + Math.max(0, Number(vehicle.stock) || 0), 0);
  el("statLowStock").textContent = vehicles.filter((vehicle) => Number(vehicle.stock) <= 3).length;
  el("statUpdates").textContent = priceUpdates;
  renderOrders();
  const query = el("officeSearch").value.trim().toLowerCase();
  const rows = vehicles.filter((vehicle) => `${vehicle.name} ${vehicle.type}`.toLowerCase().includes(query));
  el("inventoryTable").innerHTML = rows.map((vehicle) => {
    const stock = Number(vehicle.stock) || 0;
    return `<tr><td><div class="table-vehicle"><img src="${safeText(vehicleImage(vehicle))}" alt="" /><span><strong>${safeText(vehicle.name)}</strong><small>${safeText(vehicle.year || "")}</small></span></div></td><td><label class="photo-upload-button">Change photo<input class="photo-file-input" type="file" accept="image/png,image/jpeg,image/webp" aria-label="Choose a new PNG, JPG or WebP photo for ${safeText(vehicle.name)}" data-image="${safeText(vehicle.id)}" /></label></td><td>${safeText(vehicle.type)} three-wheeler</td><td><input class="table-input" type="number" min="0" step="500" value="${Number(vehicle.price) || 0}" aria-label="Indicative price for ${safeText(vehicle.name)}" data-price="${safeText(vehicle.id)}" /></td><td><input class="table-input stock-input" type="number" min="0" step="1" value="${stock}" aria-label="Stock count for ${safeText(vehicle.name)}" data-stock="${safeText(vehicle.id)}" /></td><td><span class="stock-badge ${stock <= 3 ? "low" : ""}">${stock === 0 ? "Out of stock" : stock <= 3 ? "Low stock" : "In stock"}</span></td><td><div class="row-actions"><button class="save-row" type="button" data-save="${safeText(vehicle.id)}">Save</button><button class="remove-row" type="button" data-remove-vehicle="${safeText(vehicle.id)}">Remove</button></div></td></tr>`;
  }).join("");
}
function setOfficeMode(isOffice) {
  el("storefront").classList.toggle("hidden", isOffice);
  el("officeView").classList.toggle("hidden", !isOffice);
  el("switchLabel").textContent = isOffice ? "Customer store" : "Office tools";
  el("officeSwitch").setAttribute("aria-label", isOffice ? "Return to customer store" : "Open office demo");
  if (isOffice) renderOffice();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function openCart() {
  el("drawerBackdrop").classList.remove("hidden");
  el("cartDrawer").classList.add("open");
  el("cartDrawer").setAttribute("aria-hidden", "false");
}
function closeCart() {
  el("drawerBackdrop").classList.add("hidden");
  el("cartDrawer").classList.remove("open");
  el("cartDrawer").setAttribute("aria-hidden", "true");
}
function addToCart(id) {
  const vehicle = vehicles.find((item) => item.id === id);
  if (!vehicle) return;
  const line = cart.find((item) => item.id === id);
  const quantity = line ? line.quantity : 0;
  if (quantity >= Number(vehicle.stock)) {
    notify("This vehicle is not currently available in that quantity.");
    return;
  }
  if (line) line.quantity += 1;
  else cart.push({ id, quantity: 1 });
  persistShortlist();
  renderCart();
  notify(`${vehicle.name} added to cart.`);
}
function showVehicleDetails(id) {
  const vehicle = vehicles.find((item) => item.id === id);
  if (!vehicle || document.getElementById("vehicleDetailModal")) return;
  const stock = availability(vehicle);
  const layer = document.createElement("div");
  layer.className = "modal-layer";
  layer.id = "vehicleDetailModal";
  layer.innerHTML = `<section class="vehicle-detail-modal" role="dialog" aria-modal="true" aria-labelledby="detailTitle"><button class="close-button detail-close" type="button" aria-label="Close vehicle details">×</button><div class="detail-image-wrap"><img class="detail-image" src="${safeText(vehicleImage(vehicle))}" alt="Reference photo for ${safeText(vehicle.name)}; exact model not confirmed" />${photoCreditMarkup(vehicle)}</div><div class="detail-copy"><div class="eyebrow"><span class="eyebrow-line"></span> ${safeText(vehicle.type)} THREE-WHEELER</div><h2 id="detailTitle">${safeText(vehicle.name)}</h2><p>${safeText(vehicle.specs || "Ask the showroom for model specifications.")}</p><div class="product-availability ${stock.className}">${stock.text} · sample stock: ${Number(vehicle.stock) || 0}</div><div class="detail-price"><small>Illustrative sample price</small><strong>${vehiclePrice(vehicle.price)}</strong></div><p class="detail-disclaimer">Reference photo and indicative sample data only. Confirm exact model, specifications, availability and on-road price with the showroom.</p><button class="button button-dark" type="button" data-detail-add="${safeText(vehicle.id)}" ${Number(vehicle.stock) <= 0 ? "disabled" : ""}>Add to cart <span>＋</span></button></div></section>`;
  document.body.appendChild(layer);
  layer.querySelector(".detail-close").addEventListener("click", () => layer.remove());
  layer.addEventListener("click", (event) => { if (event.target === layer) layer.remove(); });
  layer.querySelector("[data-detail-add]").addEventListener("click", () => {
    addToCart(vehicle.id);
    layer.remove();
  });
}
function addVehicleForm() {
  if (document.getElementById("vehicleModal")) return;
  const layer = document.createElement("div");
  layer.className = "modal-layer";
  layer.id = "vehicleModal";
  layer.innerHTML = `<section class="vehicle-modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle"><div class="vehicle-modal-head"><h2 id="modalTitle">Add a three-wheeler</h2><button class="close-button" type="button" data-close-modal aria-label="Close">×</button></div><form id="newVehicleForm"><div class="form-field full"><label for="newName">Vehicle name</label><input id="newName" name="name" required maxlength="60" placeholder="e.g. Passenger auto · CNG" /></div><div class="form-field"><label for="newType">Three-wheeler type</label><select id="newType" name="type"><option>Passenger</option><option>Cargo</option><option>Electric</option></select></div><div class="form-field"><label for="newYear">Model year / label</label><input id="newYear" name="year" maxlength="20" value="Sample" required /></div><div class="form-field"><label for="newPrice">Sample price (₹)</label><input id="newPrice" name="price" type="number" min="0" step="500" required placeholder="250000" /></div><div class="form-field"><label for="newStock">Stock count</label><input id="newStock" name="stock" type="number" min="0" step="1" value="0" required /></div><button class="button button-dark" type="submit">Add to inventory <span>↗</span></button></form></section>`;
  document.body.appendChild(layer);
  layer.querySelector("[data-close-modal]").addEventListener("click", () => layer.remove());
  layer.addEventListener("click", (event) => { if (event.target === layer) layer.remove(); });
  layer.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name")).trim();
    if (!name) return;
    const type = String(form.get("type"));
    const photo = defaultPhotos[type] || defaultPhotos.Passenger;
    vehicles.unshift({ id: `vehicle-${Date.now()}`, name, type, year: String(form.get("year")), price: Math.max(0, Number(form.get("price"))), stock: Math.max(0, Number(form.get("stock"))), specs: `${type} · Three-wheeler`, tag: type, image: photo.image, photoCredit: photo.credit, photoUrl: photo.url });
    if (!persistVehicles()) {
      vehicles.shift();
      return;
    }
    renderVehicles();
    renderOffice();
    layer.remove();
    notify(`${name} added to inventory.`);
  });
  layer.querySelector("#newName").focus();
}

el("year").textContent = new Date().getFullYear();
document.querySelectorAll(".footer-year").forEach((item) => { item.textContent = new Date().getFullYear(); });
renderVehicles();
renderCart();
renderReviews();
document.querySelectorAll(".category-tab").forEach((button) => button.addEventListener("click", () => {
  activeCategory = button.dataset.category;
  document.querySelectorAll(".category-tab").forEach((tab) => tab.classList.toggle("selected", tab === button));
  renderVehicles();
}));
el("searchInput").addEventListener("input", renderVehicles);
el("priceMin").addEventListener("input", renderVehicles);
el("priceMax").addEventListener("input", renderVehicles);
el("sortSelect").addEventListener("change", renderVehicles);
el("productGrid").addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const favoriteButton = event.target.closest("[data-favorite]");
  const detailsButton = event.target.closest("[data-details]");
  if (addButton) {
    addToCart(addButton.dataset.add);
  }
  if (detailsButton) {
    showVehicleDetails(detailsButton.dataset.details);
  }
  if (favoriteButton) {
    const id = favoriteButton.dataset.favorite;
    favoriteIds.has(id) ? favoriteIds.delete(id) : favoriteIds.add(id);
    renderVehicles();
  }
});
el("cartItems").addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove]");
  const decreaseButton = event.target.closest("[data-quantity-down]");
  const increaseButton = event.target.closest("[data-quantity-up]");
  const id = removeButton?.dataset.remove || decreaseButton?.dataset.quantityDown || increaseButton?.dataset.quantityUp;
  if (!id) return;
  const lineIndex = cart.findIndex((item) => item.id === id);
  if (lineIndex < 0) return;
  if (removeButton || (decreaseButton && cart[lineIndex].quantity === 1)) cart.splice(lineIndex, 1);
  else if (decreaseButton) cart[lineIndex].quantity -= 1;
  else {
    const vehicle = vehicles.find((item) => item.id === id);
    if (!vehicle || cart[lineIndex].quantity >= Number(vehicle.stock)) {
      notify("That is the available stock count.");
      return;
    }
    cart[lineIndex].quantity += 1;
  }
  persistShortlist();
  renderCart();
});
el("enquireButton").addEventListener("click", () => {
  closeCart();
  updateEnquiryCartSummary();
  el("enquiry").scrollIntoView({ behavior: "smooth" });
  el("enquiryName").focus({ preventScroll: true });
});
el("enquiryForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const order = {
    reference: `SV-${Date.now().toString(36).toUpperCase()}`,
    name: String(form.get("name")).trim(),
    phone: String(form.get("phone")).trim(),
    message: String(form.get("message")).trim(),
    items: cartVehicleLines().map(({ vehicle, quantity }) => ({ name: vehicle.name, quantity })),
    status: "New",
    createdAt: new Date().toISOString()
  };
  orders.unshift(order);
  if (!persistRecords(ORDER_KEY, orders, "the enquiry")) {
    orders.shift();
    return;
  }
  cart = [];
  persistShortlist();
  renderCart();
  renderOrders();
  event.currentTarget.reset();
  notify(`Enquiry ${order.reference} saved on this browser.`);
});
el("reviewForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  reviews.push({
    name: String(form.get("name")).trim(),
    rating: Number(form.get("rating")),
    text: String(form.get("text")).trim(),
    createdAt: new Date().toISOString()
  });
  if (!persistRecords(REVIEW_KEY, reviews, "the review")) {
    reviews.pop();
    return;
  }
  renderReviews();
  event.currentTarget.reset();
  notify("Thank you for sharing your review.");
});
el("ordersTable").addEventListener("change", (event) => {
  const select = event.target.closest("[data-order-status]");
  if (!select) return;
  const order = orders.find((item) => item.reference === select.dataset.orderStatus);
  if (!order) return;
  const previousStatus = order.status;
  order.status = select.value;
  if (!persistRecords(ORDER_KEY, orders, "the enquiry status")) {
    order.status = previousStatus;
    renderOrders();
    return;
  }
  notify(`Enquiry ${order.reference} marked ${order.status.toLowerCase()}.`);
});
el("officeSwitch").addEventListener("click", () => setOfficeMode(el("officeView").classList.contains("hidden")));
el("backToStore").addEventListener("click", () => setOfficeMode(false));
el("officeSearch").addEventListener("input", renderOffice);
el("inventoryTable").addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove-vehicle]");
  if (removeButton) {
    const index = vehicles.findIndex((vehicle) => vehicle.id === removeButton.dataset.removeVehicle);
    if (index < 0) return;
    const [vehicle] = vehicles.splice(index, 1);
    if (!window.confirm(`Remove "${vehicle.name}" from this inventory and the customer list?`)) {
      vehicles.splice(index, 0, vehicle);
      return;
    }
    if (!persistVehicles()) {
      vehicles.splice(index, 0, vehicle);
      renderOffice();
      return;
    }
    cart = cart.filter((item) => item.id !== vehicle.id);
    persistShortlist();
    favoriteIds.delete(vehicle.id);
    renderVehicles();
    renderCart();
    renderOffice();
    notify(`${vehicle.name} removed from this browser's inventory.`);
    return;
  }
  const button = event.target.closest("[data-save]");
  if (!button) return;
  const vehicle = vehicles.find((item) => item.id === button.dataset.save);
  if (!vehicle) return;
  const priceInput = el("inventoryTable").querySelector(`[data-price="${CSS.escape(vehicle.id)}"]`);
  const stockInput = el("inventoryTable").querySelector(`[data-stock="${CSS.escape(vehicle.id)}"]`);
  const price = Number(priceInput.value);
  const stock = Number(stockInput.value);
  if (!Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
    notify("Enter a valid non-negative price and whole-number stock count.");
    return;
  }
  const previousPrice = vehicle.price;
  const previousStock = vehicle.stock;
  if (vehicle.price !== price) priceUpdates += 1;
  vehicle.price = price;
  vehicle.stock = stock;
  if (!persistVehicles()) {
    vehicle.price = previousPrice;
    vehicle.stock = previousStock;
    if (vehicle.price !== price) priceUpdates -= 1;
    renderOffice();
    return;
  }
  renderVehicles();
  renderOffice();
  notify(`${vehicle.name} updated.`);
});
el("inventoryTable").addEventListener("change", async (event) => {
  const input = event.target.closest("[data-image]");
  const file = input?.files?.[0];
  if (!input || !file) return;
  const vehicle = vehicles.find((item) => item.id === input.dataset.image);
  if (!vehicle) return;
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
  input.value = "";
  notify("Choose a PNG, JPG or WebP image.");
  return;
  }
  if (file.size > 12582912) {
  input.value = "";
  notify("Choose an image smaller than 12 MB.");
  return;
  }
  input.disabled = true;
  const previousPhoto = { image: vehicle.image, photoCredit: vehicle.photoCredit, photoUrl: vehicle.photoUrl };
  try {
  vehicle.image = await compressVehiclePhoto(file);
  vehicle.photoCredit = "Custom photo uploaded locally";
  vehicle.photoUrl = "";
  if (!persistVehicles()) {
    Object.assign(vehicle, previousPhoto);
    renderOffice();
    return;
  }
  renderVehicles();
  renderOffice();
  notify(`${vehicle.name} photo updated on this device.`);
  } catch (error) {
  console.error("Could not update vehicle photo.", error);
  input.value = "";
  input.disabled = false;
  notify(error instanceof Error ? error.message : "Could not update this photo.");
  }
});
el("addVehicleButton").addEventListener("click", addVehicleForm);
el("cartButton").addEventListener("click", openCart);
el("closeCart").addEventListener("click", closeCart);
el("drawerBackdrop").addEventListener("click", closeCart);
document.addEventListener("keydown", (event) => { if (event.key === "Escape") { closeCart(); document.getElementById("vehicleModal")?.remove(); document.getElementById("vehicleDetailModal")?.remove(); } });
