// ===== Global Variables =====
let reviews = JSON.parse(localStorage.getItem("reviews")) || {};
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ===== Products with Unsplash Images =====
let products = [
  { id: 1, name: "Smart Watch", price: 2999, category: "Electronics", image: "https://source.unsplash.com/300x200/?smartwatch" },
  { id: 2, name: "Headphones", price: 1999, category: "Electronics", image: "https://source.unsplash.com/300x200/?headphones" },
  { id: 3, name: "Running Shoes", price: 2499, category: "Fashion", image: "https://source.unsplash.com/300x200/?shoes" },
  { id: 4, name: "Backpack", price: 1499, category: "Fashion", image: "https://source.unsplash.com/300x200/?backpack" },
  { id: 5, name: "Sunglasses", price: 799, category: "Fashion", image: "https://source.unsplash.com/300x200/?sunglasses" },
  { id: 6, name: "Formal Shirt", price: 1199, category: "Fashion", image: "https://source.unsplash.com/300x200/?shirt" },
  { id: 7, name: "Jeans", price: 1599, category: "Fashion", image: "https://source.unsplash.com/300x200/?jeans" },
  { id: 8, name: "Novel Book", price: 499, category: "Books", image: "https://source.unsplash.com/300x200/?book" },
  { id: 9, name: "Notebook", price: 199, category: "Books", image: "https://source.unsplash.com/300x200/?notebook" },
  { id: 10, name: "Gaming Mouse", price: 999, category: "Electronics", image: "https://source.unsplash.com/300x200/?mouse" },
  { id: 11, name: "Bluetooth Speaker", price: 1799, category: "Electronics", image: "https://source.unsplash.com/300x200/?speaker" },
  { id: 12, name: "Water Bottle", price: 399, category: "Lifestyle", image: "https://source.unsplash.com/300x200/?bottle" }
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
