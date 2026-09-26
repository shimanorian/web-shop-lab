const items = [
  { id: "ginger-window", name: "Рыжий кот на подоконнике", price: 1400, image: "img/img0.png" },
  { id: "black-hat", name: "Чёрная кошка среди цветов", price: 1600, image: "img/img2.png" },
  { id: "kitten-yarn", name: "Котёнок с клубком ниток", price: 1200, image: "img/img3.png" },
  { id: "siamese", name: "Сиамская кошка", price: 1800, image: "img/img4.png" },
  { id: "maine-coon", name: "Кошка королева Бастет", price: 2200, image: "img/img5.png" },
  { id: "space-cat", name: "Кот-новогодний", price: 1700, image: "img/img6.png" },
  { id: "flower-cat", name: "Неоновый леопард", price: 1900, image: "img/img7.png" },
  { id: "three-kittens", name: "Белый тигр", price: 2000, image: "img/img8.png" },
];
const productGrid = document.getElementById("productGrid");

function renderProducts() {
  let html = "";
  for (const item of items) {
    html += `
      <div class="product-card">
        <img src="${item.image}" alt="${item.name}">
        <h3>${item.name}</h3>
        <p>${item.price} ₽</p>
        <button data-add="${item.id}">Добавить в корзину</button>
      </div>
    `;
  }
  productGrid.innerHTML = html;
}

renderProducts();
const STORAGE_KEY = "murrart-basket";

function loadBasket() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveBasket() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(basket));
  } catch (e) {
    // если localStorage недоступен, просто ничего не сохраняем
  }
}

let basket = loadBasket();

const cartPanel = document.getElementById("cartPanel");
const cartItemsEl = document.getElementById("cartItems");
const cartEmptyEl = document.getElementById("cartEmpty");
const cartTotalEl = document.getElementById("cartTotal");
const cartCountEl = document.getElementById("cartCount");
const checkoutBtn = document.getElementById("checkoutBtn");
const cartToggle = document.getElementById("cartToggle");
const cartClose = document.getElementById("cartClose");
const overlay = document.getElementById("overlay");

function addItem(id) {
  if (basket[id]) {
    basket[id] = basket[id] + 1;
  } else {
    basket[id] = 1;
  }
  saveBasket();
  updateCartView();
  openCart();
}

function getTotalPrice() {
  let total = 0;
  for (const id in basket) {
    const product = items.find(p => p.id === id);
    if (product) {
      total = total + product.price * basket[id];
    }
  }
  return total;
}

function getTotalCount() {
  let count = 0;
  for (const id in basket) {
    count = count + basket[id];
  }
  return count;
}

function updateCartView() {
  const ids = Object.keys(basket);

  cartCountEl.textContent = getTotalCount();
  cartTotalEl.textContent = getTotalPrice() + " ₽";
  checkoutBtn.disabled = ids.length === 0;
  cartEmptyEl.hidden = ids.length > 0;

  let html = "";
  for (const id of ids) {
    const product = items.find(p => p.id === id);
    if (!product) continue;
    const qty = basket[id];
    html += `
      <li>
        <span>${product.name}</span>
        <div class="qty-block">
          <button data-dec="${id}">−</button>
          <span>${qty}</span>
          <button data-inc="${id}">+</button>
        </div>
        <button data-remove="${id}">Удалить</button>
      </li>
    `;
  }
  cartItemsEl.innerHTML = html;

  cartItemsEl.querySelectorAll("[data-remove]").forEach(btn => {
    btn.addEventListener("click", () => {
      delete basket[btn.dataset.remove];
      saveBasket();
      updateCartView();
    });
  });

  cartItemsEl.querySelectorAll("[data-inc]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.inc;
      basket[id] = basket[id] + 1;
      saveBasket();
      updateCartView();
    });
  });

  cartItemsEl.querySelectorAll("[data-dec]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.dec;
      basket[id] = basket[id] - 1;
      if (basket[id] <= 0) {
        delete basket[id];
      }
      saveBasket();
      updateCartView();
    });
  });
}

function openCart() {
  cartPanel.hidden = false;
  overlay.hidden = false;
}

function closeCart() {
  cartPanel.hidden = true;
  overlay.hidden = true;
}

productGrid.addEventListener("click", (e) => {
  if (e.target.dataset.add) {
    addItem(e.target.dataset.add);
  }
});

cartToggle.addEventListener("click", () => {
  if (cartPanel.hidden) {
    openCart();
  } else {
    closeCart();
  }
});

cartClose.addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
const orderModal = document.getElementById("orderModal");
const orderClose = document.getElementById("orderClose");
const orderForm = document.getElementById("orderForm");
const orderSuccess = document.getElementById("orderSuccess");
const orderSuccessClose = document.getElementById("orderSuccessClose");

function openOrderModal() {
  cartPanel.hidden = true;
  orderModal.hidden = false;
  overlay.hidden = false;
  orderForm.hidden = false;
  orderSuccess.hidden = true;
}

function closeOrderModal() {
  orderModal.hidden = true;
  overlay.hidden = true;
}

checkoutBtn.addEventListener("click", openOrderModal);
orderClose.addEventListener("click", closeOrderModal);
orderSuccessClose.addEventListener("click", closeOrderModal);

orderForm.addEventListener("submit", (e) => {
  e.preventDefault();

  basket = {};
  saveBasket();
  updateCartView();

  orderForm.hidden = true;
  orderSuccess.hidden = false;
  orderForm.reset();
});
updateCartView();