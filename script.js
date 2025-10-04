// -------------------- Products & Categories --------------------
const products = [
  {id:1, name:"Cotton T-shirt", category:"Clothing", price:499, img:"https://source.unsplash.com/300x200/?tshirt", desc:"Comfortable cotton t-shirt."},
  {id:2, name:"Leather Wallet", category:"Accessories", price:1299, img:"https://source.unsplash.com/300x200/?wallet", desc:"Premium leather wallet."},
  {id:3, name:"Smart Watch", category:"Electronics", price:3499, img:"https://source.unsplash.com/300x200/?smartwatch", desc:"Stylish smart watch."},
  {id:4, name:"Sports Shoes", category:"Footwear", price:1999, img:"https://source.unsplash.com/300x200/?shoes", desc:"Durable and comfortable shoes."},
  {id:5, name:"Cooking Pan", category:"Home & Kitchen", price:1599, img:"https://source.unsplash.com/300x200/?kitchen", desc:"Non-stick cooking pan."},
  {id:6, name:"Yoga Mat", category:"Sports", price:799, img:"https://source.unsplash.com/300x200/?yoga", desc:"Eco-friendly yoga mat."},
  {id:7, name:"Perfume", category:"Beauty", price:2299, img:"https://source.unsplash.com/300x200/?perfume", desc:"Fragrant perfume."},
  {id:8, name:"Toy Car", category:"Toys", price:699, img:"https://source.unsplash.com/300x200/?toy", desc:"Fun toy car."},
  {id:9, name:"Backpack", category:"Accessories", price:1599, img:"https://source.unsplash.com/300x200/?backpack", desc:"Durable backpack."},
  {id:10, name:"Notebook", category:"Books", price:299, img:"https://source.unsplash.com/300x200/?notebook", desc:"College notebook."},
  {id:11, name:"Novel Book", category:"Books", price:399, img:"https://source.unsplash.com/300x200/?book", desc:"Bestseller novel."},
  {id:12, name:"Headphones", category:"Electronics", price:2499, img:"https://source.unsplash.com/300x200/?headphones", desc:"High-quality sound headphones."}
];

const categories = ["All","Clothing","Accessories","Electronics","Footwear","Home & Kitchen","Books","Sports","Beauty","Toys"];

// -------------------- Local Storage --------------------
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let reviews = JSON.parse(localStorage.getItem("reviews")) || {};

// -------------------- DOM Elements --------------------
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
const cartNotification = document.getElementById("cartNotification");

// -------------------- Populate Categories --------------------
categories.forEach(cat => {
  const li = document.createElement("li");
  li.textContent = cat;
  li.addEventListener("click", () => filterCategory(cat));
  categoryList.appendChild(li);
});

// -------------------- Render Products --------------------
function renderProducts(list) {
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
    card.querySelector(".add-cart").addEventListener("click", ()=> {
      addToCart(p.id);
      showNotification("Added to cart!");
    });

    // View Details
    card.querySelector(".view-details").addEventListener("click", ()=> openDetails(p.id));

    productsGrid.appendChild(card);
  });
}

// -------------------- Filter Category --------------------
function filterCategory(cat) {
  activeCategory.textContent = cat==="All" ? "All Products" : cat;
  let list = cat==="All" ? products : products.filter(p=>p.category===cat);
  renderProducts(list);
}

// -------------------- Add to Cart --------------------
function addToCart(id){
  let item = cart.find(i=>i.id===id);
  if(item){ item.qty++; } else { cart.push({id, qty:1}); }
  saveCart();
}

// -------------------- Save Cart --------------------
function saveCart(){
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}

// -------------------- Update Cart UI --------------------
function updateCartUI(){
  cartCount.textContent = cart.reduce((a,c)=>a+c.qty,0);
  cartContents.innerHTML="";
  let subtotal = 0;
  cart.forEach(item => {
    const p = products.find(prod=>prod.id===item.id);
    subtotal += p.price*item.qty;
    const div = document.createElement("div");
    div.className="cart-item";
    div.innerHTML=`<div><strong>${p.name}</strong> x${item.qty}</div><div>₹${p.price*item.qty}</div>`;
    cartContents.appendChild(div);
  });
  cartSubtotal.textContent = `₹${subtotal}`;
}

// -------------------- Clear Cart --------------------
clearCartBtn.addEventListener("click", ()=>{
  cart = [];
  saveCart();
});

// -------------------- Search --------------------
searchInput.addEventListener("input", ()=>{
  const val = searchInput.value.toLowerCase();
  const list = products.filter(p=>p.name.toLowerCase().includes(val));
  renderProducts(list);
});

// -------------------- Sort --------------------
sortSelect.addEventListener("change", ()=>{
  let list = [...products];
  switch(sortSelect.value){
    case "low": list.sort((a,b)=>a.price-b.price); break;
    case "high": list.sort((a,b)=>b.price-a.price); break;
    case "alpha": list.sort((a,b)=>a.name.localeCompare(b.name)); break;
  }
  renderProducts(list);
});

// -------------------- Cart Modal --------------------
cartBtn.addEventListener("click", ()=>{
  cartModal.style.display="flex";
  cartModal.setAttribute("aria-hidden","false");
});
closeCart.addEventListener("click", ()=>{
  cartModal.style.display="none";
  cartModal.setAttribute("aria-hidden","true");
});

// -------------------- Cart Notification --------------------
function showNotification(msg){
  cartNotification.textContent = msg;
  cartNotification.style.display = "block";
  setTimeout(()=>{ cartNotification.style.display="none"; }, 1500);
}

// -------------------- View Details Modal --------------------
const detailsModal = document.createElement("div");
detailsModal.id="detailsModal";
detailsModal.style.position="fixed";
detailsModal.style.inset="0";
detailsModal.style.background="rgba(0,0,0,0.6)";
detailsModal.style.display="none";
detailsModal.style.justifyContent="center";
detailsModal.style.alignItems="center";
detailsModal.style.zIndex="2000";
detailsModal.innerHTML=`
  <div style="background:#fff;padding:1rem;border-radius:12px;max-width:400px;width:90%;position:relative;">
    <button id="closeDetails" style="position:absolute;top:5px;right:10px;font-size:18px;border:none;background:none;cursor:pointer;">✕</button>
    <div id="detailsContents"></div>
  </div>
`;
document.body.appendChild(detailsModal);

function openDetails(pid){
  const p = products.find(x=>x.id===pid);
  const contents = detailsModal.querySelector("#detailsContents");
  contents.innerHTML=`
    <img src="${p.img}" style="width:100%;height:auto;margin-bottom:0.5rem"/>
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
  renderReviewList(pid);

  document.getElementById("submitReview").addEventListener("click", ()=>{
    const name = document.getElementById("reviewer").value || "Anonymous";
    const text = document.getElementById("reviewText").value;
    const rating = parseInt(document.getElementById("reviewRating").value);
    if(!reviews[pid]) reviews[pid] = [];
    reviews[pid].push({name,text,rating});
    localStorage.setItem("reviews", JSON.stringify(reviews));
    renderReviewList(pid);
    document.getElementById("reviewText").value="";
    document.getElementById("reviewer").value="";
    renderProducts(products);
  });

  document.getElementById("addCartDetail").addEventListener("click", ()=>{
    addToCart(pid);
    showNotification("Added to cart!");
    detailsModal.style.display="none";
  });

  detailsModal.style.display="flex";
}
document.getElementById("closeDetails")?.addEventListener("click", ()=>{ detailsModal.style.display="none"; });

// -------------------- Render Reviews --------------------
function renderReviewList(pid){
  const reviewList=document.getElementById("reviewList");
  reviewList.innerHTML="";
  if(!reviews[pid] || reviews[pid].length===0){
    reviewList.textContent="No reviews yet.";
    return;
  }
  reviews[pid].forEach((r, idx)=>{
    const div=document.createElement("div");
    div.style.borderBottom="1px solid #ddd";
    div.style.padding="0.3rem 0";
    div.innerHTML=`
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

// -------------------- Checkout --------------------
const checkoutModal = document.createElement("div");
checkoutModal.id="checkoutModal";
checkoutModal.style.position="fixed";
checkoutModal.style.inset="0";
checkoutModal.style.background="rgba(0,0,0,0.6)";
checkoutModal.style.display="none";
checkoutModal.style.justifyContent="center";
checkoutModal.style.alignItems="center";
checkoutModal.style.zIndex="2000";
checkoutModal.innerHTML=`
  <div style="background:#fff;padding:1rem;border-radius:12px;max-width:400px;width:90%;position:relative;">
    <button id="closeCheckout" style="position:absolute;top:5px;right:10px;font-size:18px;border:none;background:none;cursor:pointer;">✕</button>
    <div id="checkoutContents"></div>
    <button id="confirmOrder" class="btn btn-primary" style="margin-top:0.5rem">Confirm Order</button>
  </div>
`;
document.body.appendChild(checkoutModal);

document.getElementById("checkoutBtn").addEventListener("click", ()=>{
  if(cart.length===0){ alert("Cart is empty!"); return; }
  renderCheckout();
  checkoutModal.style.display="flex";
});

document.getElementById("closeCheckout").addEventListener("click", ()=>{
  checkoutModal.style.display="none";
});

document.getElementById("confirmOrder").addEventListener("click", ()=>{
  const name = prompt("Enter your name");
  const addr = prompt("Enter your address");
  if(!name || !addr){ alert("Please enter details"); return; }
  alert(`Thank you ${name}! Order placed.`);
  cart = [];
  saveCart();
  checkoutModal.style.display="none";
});

// Render checkout items
function renderCheckout(){
  const checkoutContents = document.getElementById("checkoutContents");
  checkoutContents.innerHTML="";
  let total=0;
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
}

// -------------------- Init --------------------
renderProducts(products);
updateCartUI();
