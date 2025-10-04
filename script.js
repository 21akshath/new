// ---------- PRODUCTS ----------
const products = [
  {id:1, name:"Cotton T-shirt", category:"Clothing", price:499, img:"https://source.unsplash.com/300x200/?tshirt", desc:"Comfortable cotton t-shirt."},
  {id:2, name:"Leather Wallet", category:"Accessories", price:1299, img:"https://source.unsplash.com/300x200/?wallet", desc:"Premium leather wallet."},
  {id:3, name:"Smart Watch", category:"Electronics", price:2499, img:"https://source.unsplash.com/300x200/?smartwatch", desc:"Stylish and functional smart watch."},
  {id:4, name:"Sports Shoes", category:"Footwear", price:1999, img:"https://source.unsplash.com/300x200/?shoes", desc:"Durable and comfortable."},
  {id:5, name:"Wireless Earbuds", category:"Electronics", price:1799, img:"https://source.unsplash.com/300x200/?earbuds", desc:"High-quality wireless earbuds."},
  {id:6, name:"Cooking Pan", category:"Home & Kitchen", price:1599, img:"https://source.unsplash.com/300x200/?kitchen", desc:"Non-stick cooking pan."},
  {id:7, name:"Travel Backpack", category:"Accessories", price:1499, img:"https://source.unsplash.com/300x200/?backpack", desc:"Spacious and durable backpack."},
  {id:8, name:"Yoga Mat", category:"Sports", price:799, img:"https://source.unsplash.com/300x200/?yoga", desc:"Eco-friendly yoga mat."},
  {id:9, name:"Perfume", category:"Beauty", price:2299, img:"https://source.unsplash.com/300x200/?perfume", desc:"Fragrant perfume."},
  {id:10, name:"Toy Car", category:"Toys", price:699, img:"https://source.unsplash.com/300x200/?toycar", desc:"Fun toy car."},
  {id:11, name:"Jeans", category:"Clothing", price:999, img:"https://source.unsplash.com/300x200/?jeans", desc:"Comfortable denim jeans."},
  {id:12, name:"Sunglasses", category:"Accessories", price:1299, img:"https://source.unsplash.com/300x200/?sunglasses", desc:"Stylish UV-protected sunglasses."}
];

const categories = ["All","Clothing","Accessories","Electronics","Footwear","Home & Kitchen","Sports","Beauty","Toys"];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let reviews = JSON.parse(localStorage.getItem("reviews")) || {};

// ---------- ELEMENTS ----------
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

const detailsModal = document.getElementById("detailsModal");
const closeDetails = document.getElementById("closeDetails");
const detailsContents = document.getElementById("detailsContents");

const checkoutBtn = document.getElementById("checkoutBtn");

// ---------- CATEGORY LIST ----------
categories.forEach(cat=>{
  const li=document.createElement("li");
  li.textContent=cat;
  li.addEventListener("click", ()=>filterCategory(cat));
  categoryList.appendChild(li);
});

// ---------- RENDER PRODUCTS ----------
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

  // Remove star rating on product cards
card.querySelector(".rating").innerHTML = "";

    productsGrid.appendChild(card);
  });
}

// ---------- FILTER CATEGORY ----------
function filterCategory(cat){
  activeCategory.textContent = cat==="All" ? "All Products" : cat;
  let list = cat==="All" ? products : products.filter(p=>p.category===cat);
  renderProducts(list);
}

// ---------- ADD TO CART ----------
function addToCart(id){
  let item=cart.find(i=>i.id===id);
  if(item){ item.qty++; }
  else{ cart.push({id,qty:1}); }
  saveCart();
}

function saveCart(){
  localStorage.setItem("cart",JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI(){
  cartCount.textContent = cart.reduce((a,c)=>a+c.qty,0);
  cartContents.innerHTML="";
  let subtotal=0;
  cart.forEach(item=>{
    const p=products.find(prod=>prod.id===item.id);
    subtotal+=p.price*item.qty;
    const div=document.createElement("div");
    div.className="cart-item";
    div.innerHTML=`<div><strong>${p.name}</strong> x${item.qty}</div><div>₹${p.price*item.qty}</div>`;
    cartContents.appendChild(div);
  });
  cartSubtotal.textContent=`₹${subtotal}`;
}

clearCartBtn.addEventListener("click",()=>{
  cart=[];
  saveCart();
});

cartBtn.addEventListener("click",()=>{ cartModal.style.display="flex"; cartModal.setAttribute("aria-hidden","false"); });
closeCart.addEventListener("click",()=>{ cartModal.style.display="none"; cartModal.setAttribute("aria-hidden","true"); });

// ---------- SEARCH ----------
searchInput.addEventListener("input",()=>{
  const val=searchInput.value.toLowerCase();
  const list=products.filter(p=>p.name.toLowerCase().includes(val) || p.category.toLowerCase().includes(val));
  renderProducts(list);
});

// ---------- SORT ----------
sortSelect.addEventListener("change",()=>{
  let list=[...products];
  switch(sortSelect.value){
    case "low": list.sort((a,b)=>a.price-b.price); break;
    case "high": list.sort((a,b)=>b.price-a.price); break;
    case "alpha": list.sort((a,b)=>a.name.localeCompare(b.name)); break;
  }
  renderProducts(list);
});

// ---------- REVIEWS ----------
function getAverageRating(pid){
  if(!reviews[pid] || reviews[pid].length===0) return 0;
  const sum = reviews[pid].reduce((a,c)=>a+c.rating,0);
  return sum/reviews[pid].length;
}

function renderReviewList(pid){
  const reviewList=document.getElementById("reviewList");
  reviewList.innerHTML="";
  if(!reviews[pid] || reviews[pid].length===0){ reviewList.textContent="No reviews yet."; return; }
  reviews[pid].forEach((r,idx)=>{
    const div=document.createElement("div");
    div.style.borderBottom="1px solid #ddd";
    div.style.padding="0.3rem 0";
    div.innerHTML=`<strong>${r.name}</strong> ${"⭐".repeat(r.rating)}<br>${r.text}
      <button class="deleteReview" data-index="${idx}" style="margin-left:10px;color:red">Delete</button>`;
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

// ---------- VIEW DETAILS ----------
function openDetails(pid){
  const p=products.find(x=>x.id===pid);
  detailsContents.innerHTML="";
  const div=document.createElement("div");
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

// ---------- INIT ----------
renderProducts(products);
updateCartUI();

