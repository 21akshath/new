// -------------------- Products & Categories --------------------
const products = [
  { id: 1, name: "Cotton T-shirt", category: "Clothing", price: 499, img: "https://source.unsplash.com/300x200/?tshirt", desc:"Comfortable cotton t-shirt." },
  { id: 2, name: "Leather Wallet", category: "Accessories", price: 1299, img: "https://source.unsplash.com/300x200/?wallet", desc:"Premium leather wallet." },
  { id: 3, name: "Smart Watch", category: "Electronics", price: 3499, img: "https://source.unsplash.com/300x200/?smartwatch", desc:"Stylish smart watch." },
  { id: 4, name: "Sports Shoes", category: "Footwear", price: 1999, img: "https://source.unsplash.com/300x200/?shoes", desc:"Durable and comfortable." },
  { id: 5, name: "Yoga Mat", category: "Sports", price: 799, img: "https://source.unsplash.com/300x200/?yoga", desc:"Eco-friendly yoga mat." },
  { id: 6, name: "Perfume", category: "Beauty", price: 2299, img: "https://source.unsplash.com/300x200/?perfume", desc:"Fragrant perfume." },
  { id: 7, name: "Toy Car", category: "Toys", price: 699, img: "https://source.unsplash.com/300x200/?toycar", desc:"Fun toy car." },
  { id: 8, name: "Novel Book", category: "Books", price: 399, img: "https://source.unsplash.com/300x200/?book", desc:"Bestseller novel." },
  { id: 9, name: "Backpack", category: "Accessories", price: 1599, img: "https://source.unsplash.com/300x200/?backpack", desc:"Durable backpack." },
  { id: 10, name: "Wrist Watch", category: "Accessories", price: 3499, img: "https://source.unsplash.com/300x200/?watch", desc:"Elegant wrist watch." },
  { id: 11, name: "Notebook", category: "Books", price: 299, img: "https://source.unsplash.com/300x200/?notebook", desc:"College notebook." },
  { id: 12, name: "Leather Belt", category: "Accessories", price: 899, img: "https://source.unsplash.com/300x200/?belt", desc:"Stylish leather belt." }
];

const categories = ["All","Clothing","Accessories","Electronics","Footwear","Books","Sports","Beauty","Toys"];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// -------------------- DOM Elements --------------------
const productsGrid = document.getElementById("productsGrid");
const categoryList = document.getElementById("categoryList");
const activeCategory = document.getElementById("activeCategory");
const cartBtn = document.getElementById("cartBtn");
const cartModal = document.getElementById("cartModal");
const closeCart = document.getElementById("closeCart");
const cartContents = document.getElementById("cartContents");
const cartSubtotal = document.getElementById("cartSubtotal");
const clearCartBtn = document.getElementById("clearCart");
const cartCount = document.getElementById("cartCount");
const searchInput = document.getElementById("searchInput");
const checkoutBtn = document.getElementById("checkoutBtn");
const cartNotification = document.getElementById("cartNotification");

// -------------------- Render Categories --------------------
function renderCategories() {
  categoryList.innerHTML = "";
  categories.forEach(cat => {
    const li = document.createElement("li");
    li.textContent = cat;
    li.addEventListener("click", () => filterCategory(cat));
    categoryList.appendChild(li);
  });
}

// -------------------- Render Products --------------------
function renderProducts(list) {
  productsGrid.innerHTML = "";
  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img class="product-image" src="${p.img}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
      <div class="card-body">
        <h3 class="product-title">${p.name}</h3>
        <p class="product-category">${p.category}</p>
        <div class="price-row">
          <div class="price">₹${p.price}</div>
          <button class="add-cart">Add to Cart</button>
        </div>
      </div>
    `;
    // Add to cart button
    card.querySelector(".add-cart").addEventListener("click", () => addToCart(p.id));
    productsGrid.appendChild(card);
  });
}

// -------------------- Filter Category --------------------
function filterCategory(cat) {
  activeCategory.textContent = cat === "All" ? "All Products" : cat;
  const filtered = cat === "All" ? products : products.filter(p => p.category === cat);
  renderProducts(filtered);
}

// -------------------- Add to Cart --------------------
function addToCart(id) {
  let item = cart.find(i => i.id === id);
  if(item) item.qty++;
  else cart.push({ id, qty: 1 });
  saveCart();
  showCartNotification();
}

// -------------------- Save Cart --------------------
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}

// -------------------- Update Cart UI --------------------
function updateCartUI() {
  cartCount.textContent = cart.reduce((a, c) => a + c.qty, 0);
  cartContents.innerHTML = "";
  let subtotal = 0;
  cart.forEach(item => {
    const p = products.find(prod => prod.id === item.id);
    subtotal += p.price * item.qty;
    const div = document.createElement("div");
    div.className = "cart-item";
    div.textContent = `${p.name} x${item.qty} - ₹${p.price * item.qty}`;
    cartContents.appendChild(div);
  });
  cartSubtotal.textContent = `₹${subtotal}`;
}

// -------------------- Clear Cart --------------------
clearCartBtn.addEventListener("click", () => {
  cart = [];
  saveCart();
});

// -------------------- Cart Modal --------------------
cartBtn.addEventListener("click", () => {
  cartModal.style.display = "flex";
});
closeCart.addEventListener("click", () => {
  cartModal.style.display = "none";
});

// -------------------- Search Products --------------------
searchInput.addEventListener("input", () => {
  const val = searchInput.value.toLowerCase();
  const filtered = products.filter(p => p.name.toLowerCase().includes(val));
  renderProducts(filtered);
});

// -------------------- Checkout --------------------
checkoutBtn.addEventListener("click", () => {
  if(cart.length === 0) { alert("Cart is empty!"); return; }
  let total = 0;
  cart.forEach(item => {
    const p = products.find(prod => prod.id === item.id);
    total += p.price * item.qty;
  });
  alert(`Checkout successful!\nTotal amount: ₹${total}`);
  cart = [];
  saveCart();
});

// -------------------- Add to Cart Notification --------------------
function showCartNotification() {
  cartNotification.style.display = "block";
  setTimeout(() => cartNotification.style.display = "none", 1500);
}

// -------------------- Init --------------------
renderCategories();
renderProducts(products);
updateCartUI();
