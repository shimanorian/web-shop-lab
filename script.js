const items = [
  { id: "ginger-window", name: "Рыжий кот на подоконнике", price: 1400 },
  { id: "black-hat", name: "Чёрная кошка среди цветов", price: 1600 },
  { id: "kitten-yarn", name: "Котёнок с клубком ниток", price: 1200 },
  { id: "siamese", name: "Сиамская кошка", price: 1800 },
  { id: "maine-coon", name: "Кошка королева Бастет", price: 2200 },
  { id: "space-cat", name: "Кот-новогодний", price: 1700 },
  { id: "flower-cat", name: "Неоновый леопард", price: 1900 },
  { id: "three-kittens", name: "Белый тигр", price: 2000 },
];

const productGrid = document.getElementById("productGrid");

function renderProducts() {
  let html = "";
  for (const item of items) {
    html += `
      <div class="product-card">
        <h3>${item.name}</h3>
        <p>${item.price} ₽</p>
        <button data-add="${item.id}">Добавить в корзину</button>
      </div>
    `;
  }
  productGrid.innerHTML = html;
}

renderProducts();