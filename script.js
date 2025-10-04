// ===== Global Variables =====
let reviews = JSON.parse(localStorage.getItem("reviews")) || {};
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ===== Products with Unsplash Images =====
let products = [
  { id: 1, name: "Smart Watch", price: 2999, category: "Electronics", image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=600&auto=format&fit=crop&q=80" },
  { id: 2, name: "Headphones", price: 1999, category: "Electronics", image: "https://images.unsplash.com/photo-1518449037760-5f1be8d1e4b7?w=600&auto=format&fit=crop&q=80" },
  { id: 3, name: "Running Shoes", price: 2499, category: "Fashion", image: "https://images.unsplash.com/photo-1528701800489-20be9c1e4a52?w=600&auto=format&fit=crop&q=80" },
  { id: 4, name: "Backpack", price: 1499, category: "Fashion", image: "https://images.unsplash.com/photo-1504280390368-3971edcda2a3?w=600&auto=format&fit=crop&q=80" },
  { id: 5, name: "Sunglasses", price: 799, category: "Fashion", image: "https://images.unsplash.com/photo-1518544889289-9278fdf4b511?w=600&auto=format&fit=crop&q=80" },
  { id: 6, name: "Cotton T-Shirt", price: 1199, category: "Fashion", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&auto=format&fit=crop&q=80" },
  { id: 7, name: "Jeans", price: 1599, category: "Fashion", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80" },
  { id: 8, name: "Leather Wallet", price: 899, category: "Fashion", image: "https://images.unsplash.com/photo-1606813902910-9b54e6dbd7d4?w=600&auto=format&fit=crop&q=80" },
  { id: 9, name: "Novel Book", price: 499, category: "Books", image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&auto=format&fit=crop&q=80" },
  { id: 10, name: "Notebook", price: 199, category: "Books", image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&auto=format&fit=crop&q=80" },
  { id: 11, name: "Gaming Mouse", price: 999, category: "Electronics", image: "https://images.unsplash.com/photo-1587202372775-98908d12596b?w=600&auto=format&fit=crop&q=80" },
  { id: 12, name: "Water Bottle", price: 399, category: "Lifestyle", image: "https://images.unsplash.com/photo-1526401485004-2fda9f4d1c84?w=600&auto=format&fit=crop&q=80" }
];

// ===== Render Products =====
function renderProducts(products) {
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>₹${product.price}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
      <button onclick="viewDetails(${product.id})">View Details</button>
    `;
    productList.appendChild(card);
  });
}

// ===== Add to Cart =====
function addToCart(id) {
  const product = products.find(p => p.id === id);
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// ===== Update Cart Count =====
function updateCartCount() {
  document.getElementById("cartCount").textContent = cart.length;
}

// ===== View Details =====
function viewDetails(id) {
  const product = products.find(p => p.id === id);
  document.getElementById("modalTitle").textContent = product.name;
  document.getElementById("modalImage").src = product.image;
  document.getElementById("modalPrice").textContent = "₹" + product.price;

  document.getElementById("reviewForm").dataset.productId = id;
  renderReviewList(id);

  document.getElementById("productModal").style.display = "block";
}

// ===== Close Modal =====
function closeModal() {
  document.getElementById("productModal").style.display = "none";
}

// ===== Render Reviews =====
function renderReviewList(pid) {
  const reviewList = document.getElementById("reviewList");
  reviewList.innerHTML = "";

  if (!reviews[pid] || reviews[pid].length === 0) {
    reviewList.textContent = "No reviews yet.";
    return;
  }

  reviews[pid].forEach((r, idx) => {
    const div = document.createElement("div");
    div.style.borderBottom = "1px solid #ddd";
    div.style.padding = "0.3rem 0";
    div.innerHTML = `
      <strong>${r.name}</strong> ${"⭐".repeat(r.rating)}<br>${r.text}
      <button class="deleteReview" data-index="${idx}" style="margin-left:10px;color:red">Delete</button>
    `;
    reviewList.appendChild(div);
  });

  reviewList.querySelectorAll(".deleteReview").forEach(btn => {
    btn.addEventListener("click", () => {
      reviews[pid].splice(btn.dataset.index, 1);
      localStorage.setItem("reviews", JSON.stringify(reviews));
      renderReviewList(pid);
      renderProducts(products);
    });
  });
}

// ===== Submit Review =====
document.getElementById("reviewForm").addEventListener("submit", e => {
  e.preventDefault();
  const pid = e.target.dataset.productId;
  const name = document.getElementById("reviewerName").value;
  const rating = parseInt(document.getElementById("reviewRating").value);
  const text = document.getElementById("reviewText").value;

  if (!reviews[pid]) reviews[pid] = [];
  reviews[pid].push({ name, rating, text });
  localStorage.setItem("reviews", JSON.stringify(reviews));

  renderReviewList(pid);
  e.target.reset();
});

// ===== Checkout =====
function checkout() {
  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }
  alert(`You have ${cart.length} items in your cart. Order placed successfully!`);
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// ===== On Page Load =====
document.addEventListener("DOMContentLoaded", () => {
  renderProducts(products);
  updateCartCount();
});


