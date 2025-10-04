// ==================== PRODUCTS ====================
const products = [
  { id: 1, name: "Smart Watch", price: 2999, category: "Electronics", img: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=600&auto=format&fit=crop&q=80", desc:"Smart watch with multiple features." },
  { id: 2, name: "Headphones", price: 1999, category: "Electronics", img: "https://images.unsplash.com/photo-1518449037760-5f1be8d1e4b7?w=600&auto=format&fit=crop&q=80", desc:"High-quality wireless headphones." },
  { id: 3, name: "Running Shoes", price: 2499, category: "Fashion", img: "https://images.unsplash.com/photo-1528701800489-20be9c1e4a52?w=600&auto=format&fit=crop&q=80", desc:"Comfortable running shoes." },
  { id: 4, name: "Backpack", price: 1499, category: "Fashion", img: "https://images.unsplash.com/photo-1504280390368-3971edcda2a3?w=600&auto=format&fit=crop&q=80", desc:"Stylish backpack for everyday use." },
  { id: 5, name: "Sunglasses", price: 799, category: "Fashion", img: "https://images.unsplash.com/photo-1518544889289-9278fdf4b511?w=600&auto=format&fit=crop&q=80", desc:"Trendy sunglasses." },
  { id: 6, name: "Cotton T-Shirt", price: 1199, category: "Fashion", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&auto=format&fit=crop&q=80", desc:"Comfortable cotton t-shirt." },
  { id: 7, name: "Jeans", price: 1599, category: "Fashion", img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80", desc:"Classic blue jeans." },
  { id: 8, name: "Leather Wallet", price: 899, category: "Fashion", img: "https://images.unsplash.com/photo-1606813902910-9b54e6dbd7d4?w=600&auto=format&fit=crop&q=80", desc:"Premium leather wallet." },
  { id: 9, name: "Novel Book", price: 499, category: "Books", img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&auto=format&fit=crop&q=80", desc:"Bestselling novel book." },
  { id: 10, name: "Notebook", price: 199, category: "Books", img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&auto=format&fit=crop&q=80", desc:"Notebook for daily notes." },
  { id: 11, name: "Gaming Mouse", price: 999, category: "Electronics", img: "https://images.unsplash.com/photo-1587202372775-98908d12596b?w=600&auto=format&fit=crop&q=80", desc:"High precision gaming mouse." },
  { id: 12, name: "Water Bottle", price: 399, category: "Lifestyle", img: "https://images.unsplash.com/photo-1526401485004-2fda9f4d1c84?w=600&auto=format&fit=crop&q=80", desc:"Eco-friendly water bottle." }
];

const categories = ["All","Electronics","Fashion","Books","Lifestyle"];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let reviews = JSON.parse(localStorage.getItem("reviews")) || {}; // productID: [{name,text,rating}]

// ==================== ELEMENTS ====================
const productsGrid = document.getElementById("productsGrid");
const productCardTemplate = document.getElementById("productCardTemplate");
const categoryList = document.getElementById("categoryList");
const activeCategory = document.getElementById("activeCategory");
const cartBtn = document.getElementById("cartBtn");
const cartModal = document.getElementById("cartModal");
const closeCart = document.getElementById("closeCart");
const cartCount = document.getElementById("cartCount");
const cartContents = document.getElementById("cartContents");
const cartSubtotal = document.getElementById("cartSubtotal");
const clearCartBtn = document.getElementById("clearCart");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

// Details modal
const detailsModal = document.getElementById("detailsModal");
const closeDetails = document.getElementById("closeDetails");
const detailsContents = document.getElementById("detailsContents");

// Checkout modal
const checkoutModal = document.getElementById("checkoutModal");
const closeCheckout = document.getElementById("closeCheckout");
const checkoutContents = document.getElementById("checkoutContents");
const checkoutBtn = document.getElementById("checkoutBtn");
const confirmOrder = document.getElementById("confirmOrder");

// ==================== CATEGORY LIST ====================
categories.forEach(cat=>{
  const li = document.createElement("li");
  li.textContent = cat;
  li.addEventListener("click", ()=>filterCategory(cat));
  categoryList.appendChild(li);
});

// ==================== RENDER PRODUCTS ====================
function renderProducts(list){
  productsGrid.innerHTML = "";
  list.forEach(p => {
    const card = productCardTemplate.content.cloneNode(true);
    card.querySelector(".product-title").textContent = p.name;
    card.querySelector(".product-category").textContent = p.category;
    card.querySelector(".price-value").textContent = p.price;
    const img = card.querySelector(".product-image");
    img.src = p.img;
    img.onerror = ()=>{ img.src="https://via.placeholder.com/300x200?text=No+Image"; };

    // Add to Cart
    card.querySelector(".add-cart").addEventListener("click", ()=>addToCart(p.id));

    // View Details
    const viewBtn = document.createElement("button");
    viewBtn.className="view-details btn-small";
    viewBtn.textContent="View Details";
    viewBtn.addEventListener("click", ()=>openDetails(p.id));
    card.querySelector(".card-body").appendChild(viewBtn);

    productsGrid.appendChild(card);
  });
}

// ==================== FILTER CATEGORY ====================
function filterCategory(cat){
  activeCategory.textContent = cat==="All" ? "All Products" : cat;
  let list = cat==="All" ? products : products.filter(p=>p.category===cat);
  renderProducts(list);
}

// ==================== CART FUNCTIONS ====================
function addToCart(id){
  let item = cart.find(i=>i.id===id);
  if(item){ item.qty++; } else { cart.push({id, qty:1}); }
  saveCart();
}

function saveCart(){
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI(){
  cartCount.textContent = cart.reduce((a,c)=>a+c.qty,0);
  cartContents.innerHTML = "";
  let subtotal = 0;
  cart.forEach(item=>{
    const p = products.find(prod=>prod.id===item.id);
    subtotal += p.price*item.qty;
    const div = document.createElement("div");
    div.className="cart-item";
    div.innerHTML = `<div><strong>${p.name}</strong> x${item.qty}</div><div>₹${p.price*item.qty}</div>`;
    cartContents.appendChild(div);
  });
  cartSubtotal.textContent = `₹${subtotal}`;
}

clearCartBtn.addEventListener("click", ()=>{
  cart=[];
  saveCart();
});

// ==================== SEARCH & SORT ====================
searchInput.addEventListener("input", ()=>{
  const val = searchInput.value.toLowerCase();
  const list = products.filter(p => p.name.toLowerCase().includes(val));
  renderProducts(list);
});

sortSelect.addEventListener("change", ()=>{
  let list = [...products];
  switch(sortSelect.value){
    case "low": list.sort((a,b)=>a.price-b.price); break;
    case "high": list.sort((a,b)=>b.price-a.price); break;
    case "alpha": list.sort((a,b)=>a.name.localeCompare(b.name)); break;
  }
  renderProducts(list);
});

// ==================== CART MODAL ====================
cartBtn.addEventListener("click", ()=>{ cartModal.style.display="flex"; cartModal.setAttribute("aria-hidden","false"); });
closeCart.addEventListener("click", ()=>{ cartModal.style.display="none"; cartModal.setAttribute("aria-hidden","true"); });

// ==================== DETAILS MODAL ====================
function openDetails(pid){
  const p = products.find(x=>x.id===pid);
  detailsContents.innerHTML="";
  const div = document.createElement("div");
  div.innerHTML = `
    <img src="${p.img}" style="width:100%;height:auto;margin-bottom:10px"/>
    <h3>${p.name}</h3>
    <p><strong>Category:</strong> ${p.category}</p>
    <p><strong>Price:</strong> ₹${p.price}</p>
    <p>${p.desc}</p>
    <h4>Reviews:</h4>
    <div id="reviewList"></div>
    <h4>Add Review:</h4>
    <input id="reviewer" placeholder="Your name" style="width:100%;margin-bottom:0.5rem"/>
    <textarea id="reviewText" placeholder="Your review" style="width:100%;margin-bottom:0.5rem"></textarea>
    <label>Rating:</label>
    <select id="reviewRating">
      <option value="5">5⭐</option>
      <option value="4">4⭐</option>
      <option value="3">3⭐</option>
      <option value="2">2⭐</option>
      <option value="1">1⭐</option>
    </select>
    <button id="submitReview" class="btn btn-primary" style="margin-top:0.5rem">Submit Review</button>
    <button id="addCartDetail" class="btn btn-outline" style="margin-top:0.5rem">Add to Cart</button>
  `;
  detailsContents.appendChild(div);
  renderReviewList(pid);

  document.getElementById("submitReview").addEventListener("click", ()=>{
    const name = document.getElementById("reviewer").value || "Anonymous";
    const text = document.getElementById("reviewText").value;
    const rating = parseInt(document.getElementById("reviewRating").value);
    if(!reviews[pid]) reviews[pid] = [];
    reviews[pid].push({name,text,rating});
    localStorage.setItem("reviews", JSON.stringify(reviews));
    renderReviewList(pid);
    document.getElementById("reviewText").value = "";
    document.getElementById("reviewer").value = "";
    renderProducts(products);
  });

  document.getElementById("addCartDetail").addEventListener("click", ()=>{
    addToCart(pid);
    detailsModal.style.display="none";
  });

  detailsModal.style.display="flex";
  detailsModal.setAttribute("aria-hidden","false");
}

closeDetails.addEventListener("click", ()=>{
  detailsModal.style.display="none";
  detailsModal.setAttribute("aria-hidden","true");
});

// ==================== RENDER REVIEW LIST ====================
function renderReviewList(pid){
  const reviewList = document.getElementById("reviewList");
  reviewList.innerHTML = "";
  if(!reviews[pid] || reviews[pid].length===0){
    reviewList.textContent = "No reviews yet.";
    return;
  }
  reviews[pid].forEach((r,idx)=>{
    const div = document.createElement("div");
    div.style.borderBottom="1px solid #ddd";
    div.style.padding="0.3rem 0";
    div.innerHTML = `
      <strong>${r.name}</strong> ${"⭐".repeat(r.rating)}<br>${r.text}
      <button class="deleteReview" data-index="${idx}" style="margin-left:10px;color:red">Delete</button>
    `;
    reviewList.appendChild(div);
  });

  reviewList.querySelectorAll(".deleteReview").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      reviews[pid].splice(btn.dataset.index,1);
      localStorage.setItem("reviews",JSON.stringify(reviews));
      renderReviewList(pid);
      renderProducts(products);
    });
  });
}

// ==================== CHECKOUT ====================
checkoutBtn.addEventListener("click", ()=>{
  if(cart.length===0){ alert("Cart is empty!"); return; }
  renderCheckout();
  checkoutModal.style.display="flex";
  checkoutModal.setAttribute("aria-hidden","false");
});
closeCheckout.addEventListener("click", ()=>{
  checkoutModal.style.display="none";
  checkoutModal.setAttribute("aria-hidden","true");
});

function renderCheckout(){
  checkoutContents.innerHTML = "";
  let total = 0;
  cart.forEach(item=>{
    const p = products.find(prod=>prod.id===item.id);
    total += p.price*item.qty;
    const div = document.createElement("div");
    div.textContent = `${p.name} x${item.qty} - ₹${p.price*item.qty}`;
    checkoutContents.appendChild(div);
  });
  const totalDiv = document.createElement("div");
  totalDiv.style.fontWeight="bold";
  totalDiv.style.marginTop="0.5rem";
  totalDiv.textContent = `Total: ₹${total}`;
  checkoutContents.appendChild(totalDiv);

  const form = document.createElement("div");
  form.innerHTML = `
    <h4>Enter Details:</h4>
    <input id="custName" placeholder="Full Name" style="width:100%;margin-bottom:0.5rem"/>
    <input id="custAddr" placeholder="Address" style="width:100%;margin-bottom:0.5rem"/>
    <select id="paymentMethod" style="width:100%;margin-bottom:0.5rem">
      <option value="COD">Cash on Delivery</option>
      <option value="UPI">UPI</option>
      <option value="Card">Card</option>
    </select>
    <button id="confirmOrder" class="btn btn-primary" style="margin-top:0.5rem">Confirm Order</button>
  `;
  checkoutContents.appendChild(form);

  document.getElementById("confirmOrder").addEventListener("click", ()=>{
    const name = document.getElementById("custName").value;
    const addr = document.getElementById("custAddr").value;
    const payment = document.getElementById("paymentMethod").value;
    if(!name || !addr){ alert("Please fill details."); return; }
    alert(`Thank you ${name}! Order placed.\nPayment: ${payment}`);
    cart=[];
    saveCart();
    checkoutModal.style.display="none";
  });
}

// ==================== INIT ====================
renderProducts(products);
updateCartUI();
