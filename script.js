const products = [
  {id:1, name:"Cotton T-shirt", category:"Clothing", price:499, 
    img:"https://images.unsplash.com/photo-1593032465170-56df36f1f7a8?crop=entropy&cs=tinysrgb&fit=max&w=300&h=200", desc:"Comfortable cotton t-shirt."},
  {id:2, name:"Leather Wallet", category:"Accessories", price:1299, 
    img:"https://images.unsplash.com/photo-1580422461601-2ed2c09f4907?crop=entropy&cs=tinysrgb&fit=max&w=300&h=200", desc:"Premium leather wallet."},
  {id:3, name:"Bluetooth Headphones", category:"Electronics", price:2499, 
    img:"https://images.unsplash.com/photo-1518449029125-5dc3c7f27a47?crop=entropy&cs=tinysrgb&fit=max&w=300&h=200", desc:"High-quality sound."},
  {id:4, name:"Sports Shoes", category:"Footwear", price:1999, 
    img:"https://images.unsplash.com/photo-1618354699404-f58602c85db3?crop=entropy&cs=tinysrgb&fit=max&w=300&h=200", desc:"Durable and comfortable."},
  {id:5, name:"Wrist Watch", category:"Accessories", price:3499, 
    img:"https://images.unsplash.com/photo-1519648023493-d82b5f8d7d66?crop=entropy&cs=tinysrgb&fit=max&w=300&h=200", desc:"Elegant wrist watch."},
  {id:6, name:"Cooking Pan", category:"Home & Kitchen", price:1599, 
    img:"https://images.unsplash.com/photo-1607465882228-d41faec7a91f?crop=entropy&cs=tinysrgb&fit=max&w=300&h=200", desc:"Non-stick cooking pan."},
  {id:7, name:"Novel Book", category:"Books", price:399, 
    img:"https://images.unsplash.com/photo-1512820790803-83ca734da794?crop=entropy&cs=tinysrgb&fit=max&w=300&h=200", desc:"Bestseller novel."},
  {id:8, name:"Yoga Mat", category:"Sports", price:799, 
    img:"https://images.unsplash.com/photo-1594737625785-6ad0e9d6bb76?crop=entropy&cs=tinysrgb&fit=max&w=300&h=200", desc:"Eco-friendly yoga mat."},
  {id:9, name:"Perfume", category:"Beauty", price:2299, 
    img:"https://images.unsplash.com/photo-1600180759430-3c70f503d0e7?crop=entropy&cs=tinysrgb&fit=max&w=300&h=200", desc:"Fragrant perfume."},
  {id:10, name:"Toy Car", category:"Toys", price:699, 
    img:"https://images.unsplash.com/photo-1583162906563-2b873fc98e3d?crop=entropy&cs=tinysrgb&fit=max&w=300&h=200", desc:"Fun toy car."}
];

const categories = ["All","Clothing","Accessories","Electronics","Footwear","Home & Kitchen","Books","Sports","Beauty","Toys"];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let reviews = JSON.parse(localStorage.getItem("reviews")) || {}; // productID: [{name,text,rating}]

// Elements
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
const darkModeToggle = document.getElementById("darkModeToggle");

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

// ---------- Category List ----------
categories.forEach(cat=>{
  const li = document.createElement("li");
  li.textContent = cat;
  li.addEventListener("click", ()=>filterCategory(cat));
  categoryList.appendChild(li);
});

// ---------- Render Products ----------
function renderProducts(list){
  productsGrid.innerHTML="";
  list.forEach(p=>{
    const card = productCardTemplate.content.cloneNode(true);
    card.querySelector(".product-title").textContent = p.name;
    card.querySelector(".product-category").textContent = p.category;
    card.querySelector(".price-value").textContent = p.price;
    const img = card.querySelector(".product-image");
    img.src = p.img;
    img.onerror = ()=>{ img.src="https://via.placeholder.com/300x200?text=No+Image"; };
    card.querySelector(".add-cart").addEventListener("click", ()=>addToCart(p.id));
    card.querySelector(".view-details").addEventListener("click", ()=>openDetails(p.id));
    // Average rating
    const ratingDiv = card.querySelector(".rating");
   const avg = getAverageRating(p.id);
if(avg > 0){
  ratingDiv.innerHTML = "⭐".repeat(Math.round(avg)) + "☆".repeat(5-Math.round(avg));
} else {
  ratingDiv.innerHTML = ""; // No stars if no reviews
}
    productsGrid.appendChild(card);
  });
}
const gradients = [
  "linear-gradient(135deg,#d9f7be 0%,#a7f3d0 100%)",
  "linear-gradient(135deg,#fff7bc 0%,#ffe082 100%)",
  "linear-gradient(135deg,#fcd5ce 0%,#f8b4b4 100%)",
  "linear-gradient(135deg,#bae6fd 0%,#7dd3fc 100%)",
];
productsGrid.querySelectorAll(".product-card").forEach((card,i)=>{
  card.style.background = gradients[i % gradients.length];
});

// ---------- Filter Category ----------
function filterCategory(cat){
  activeCategory.textContent = cat==="All" ? "All Products" : cat;
  let list = cat==="All" ? products : products.filter(p=>p.category===cat);
  renderProducts(list);
}

// ---------- Add to Cart ----------
function addToCart(id){
  let item = cart.find(i=>i.id===id);
  if(item){ item.qty++; }
  else{ cart.push({id, qty:1}); }
  saveCart();
}

// ---------- Save Cart ----------
function saveCart(){
  localStorage.setItem("cart",JSON.stringify(cart));
  updateCartUI();
}

// ---------- Update Cart UI ----------
function updateCartUI(){
  cartCount.textContent = cart.reduce((a,c)=>a+c.qty,0);
  cartContents.innerHTML="";
  let subtotal=0;
  cart.forEach(item=>{
    const p = products.find(prod=>prod.id===item.id);
    subtotal+=p.price*item.qty;
    const div = document.createElement("div");
    div.className="cart-item";
    div.innerHTML=`
      <div><strong>${p.name}</strong> x${item.qty}</div>
      <div>₹${p.price*item.qty}</div>
    `;
    cartContents.appendChild(div);
  });
  cartSubtotal.textContent=`₹${subtotal}`;
}

// ---------- Clear Cart ----------
clearCartBtn.addEventListener("click",()=>{
  cart=[];
  saveCart();
});

// ---------- Search ----------
searchInput.addEventListener("input",()=>{
  const val=searchInput.value.toLowerCase();
  const list=products.filter(p=>p.name.toLowerCase().includes(val));
  renderProducts(list);
});

// ---------- Sort ----------
sortSelect.addEventListener("change",()=>{
  let list=[...products];
  switch(sortSelect.value){
    case "low": list.sort((a,b)=>a.price-b.price); break;
    case "high": list.sort((a,b)=>b.price-a.price); break;
    case "alpha": list.sort((a,b)=>a.name.localeCompare(b.name)); break;
  }
  renderProducts(list);
});

// ---------- Cart Modal ----------
cartBtn.addEventListener("click",()=>{ cartModal.style.display="flex"; cartModal.setAttribute("aria-hidden","false"); });
closeCart.addEventListener("click",()=>{ cartModal.style.display="none"; cartModal.setAttribute("aria-hidden","true"); });

// ---------- Reviews ----------
function getAverageRating(pid){
  if(!reviews[pid] || reviews[pid].length===0) return 0;
  const sum = reviews[pid].reduce((a,c)=>a+c.rating,0);
  return sum/reviews[pid].length;
}

// ---------- View Details ----------
function openDetails(pid){
  const p = products.find(x=>x.id===pid);
  detailsContents.innerHTML="";
  const div = document.createElement("div");
  div.innerHTML=`
    <img src="${p.img}" style="width:100%;height:auto"/>
    <h3>${p.name}</h3>
    <p><strong>Category:</strong> ${p.category}</p>
    <p><strong>Price:</strong> ₹${p.price}</p>
    <p>${p.desc}</p>
    <div id="detailsRating">⭐${"⭐".repeat(Math.round(getAverageRating(p.id)))}☆${"☆".repeat(5-Math.round(getAverageRating(p.id)))}</div>
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
    const name=document.getElementById("reviewer").value || "Anonymous";
    const text=document.getElementById("reviewText").value;
    const rating=parseInt(document.getElementById("reviewRating").value);
    if(!reviews[pid]) reviews[pid]=[];
    reviews[pid].push({name,text,rating});
    localStorage.setItem("reviews",JSON.stringify(reviews));
    renderReviewList(pid);
    document.getElementById("reviewText").value="";
    document.getElementById("reviewer").value="";
    renderProducts(products);
  });

  document.getElementById("addCartDetail").addEventListener("click",()=>{
    addToCart(pid);
    detailsModal.style.display="none";
  });

  detailsModal.style.display="flex";
  detailsModal.setAttribute("aria-hidden","false");
}

closeDetails.addEventListener("click",()=>{
  detailsModal.style.display="none";
  detailsModal.setAttribute("aria-hidden","true");
});

function renderReviewList(pid){
  const reviewList=document.getElementById("reviewList");
  reviewList.innerHTML="";
  if(!reviews[pid] || reviews[pid].length===0){
    reviewList.textContent="No reviews yet.";
    return;
  }
  reviews[pid].forEach((r,index)=>{
  const div=document.createElement("div");
  div.style.borderBottom="1px solid #ddd";
  div.style.padding="0.3rem 0";
  div.innerHTML=`
    <strong>${r.name}</strong> ⭐${"⭐".repeat(r.rating)}<br>${r.text}
    <button class="delete-review" style="background:red;color:#fff;border:none;border-radius:4px;padding:2px 4px;margin-left:5px;">Delete</button>
  `;
  div.querySelector(".delete-review").addEventListener("click",()=>{
    reviews[pid].splice(index,1);
    localStorage.setItem("reviews",JSON.stringify(reviews));
    renderReviewList(pid);
    renderProducts(products); // update stars on cards
  });
  reviewList.appendChild(div);
});

// ---------- Checkout ----------
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
  checkoutContents.innerHTML="";
  let total=0;
  cart.forEach(item=>{
    const p=products.find(prod=>prod.id===item.id);
    total+=p.price*item.qty;
    const div=document.createElement("div");
    div.innerHTML=`${p.name} x${item.qty} - ₹${p.price*item.qty}`;
    checkoutContents.appendChild(div);
  });
  const totalDiv=document.createElement("div");
  totalDiv.style.fontWeight="bold";
  totalDiv.style.marginTop="0.5rem";
  totalDiv.textContent=`Total: ₹${total}`;
  checkoutContents.appendChild(totalDiv);

  const form=document.createElement("div");
  form.innerHTML=`
    <h4>Enter Details:</h4>
    <input id="custName" placeholder="Full Name" style="width:100%;margin-bottom:0.5rem"/>
    <input id="custAddr" placeholder="Address" style="width:100%;margin-bottom:0.5rem"/>
    <select id="paymentMethod" style="width:100%;margin-bottom:0.5rem">
      <option value="COD">Cash on Delivery</option>
      <option value="UPI">UPI</option>
      <option value="Card">Card</option>
    </select>
  `;
  checkoutContents.appendChild(form);
}

confirmOrder.addEventListener("click",()=>{
  const name=document.getElementById("custName").value;
  const addr=document.getElementById("custAddr").value;
  const payment=document.getElementById("paymentMethod").value;
  if(!name || !addr){ alert("Please fill details."); return; }
  alert(`Thank you ${name}! Order placed.\nPayment: ${payment}`);
  cart=[];
  saveCart();
  checkoutModal.style.display="none";
});

// ---------- Init ----------
renderProducts(products);
updateCartUI();




