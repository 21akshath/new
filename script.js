const products = [
  {id:1, name:"Cotton T-shirt", category:"Clothing", price:499, img:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80", desc:"Comfortable cotton t-shirt."},
  {id:2, name:"Leather Wallet", category:"Accessories", price:1299, img:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80", desc:"Premium leather wallet."},
  {id:3, name:"Bluetooth Headphones", category:"Electronics", price:2499, img:"https://images.unsplash.com/photo-1585386959984-a4155224a1a1?auto=format&fit=crop&w=400&q=80", desc:"High-quality sound."},
  {id:4, name:"Sports Shoes", category:"Footwear", price:1999, img:"https://images.unsplash.com/photo-1528701800489-20be09b0a48d?auto=format&fit=crop&w=400&q=80", desc:"Durable and comfortable."},
  {id:5, name:"Wrist Watch", category:"Accessories", price:3499, img:"https://images.unsplash.com/photo-1516728778615-2d590ea1855e?auto=format&fit=crop&w=400&q=80", desc:"Elegant wrist watch."},
  {id:6, name:"Cooking Pan", category:"Home & Kitchen", price:1599, img:"https://images.unsplash.com/photo-1617196035302-3b456a1c71e1?auto=format&fit=crop&w=400&q=80", desc:"Non-stick cooking pan."},
  {id:7, name:"Novel Book", category:"Books", price:399, img:"https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=400&q=80", desc:"Bestseller novel."},
  {id:8, name:"Yoga Mat", category:"Sports", price:799, img:"https://images.unsplash.com/photo-1599058917212-d750089bc43d?auto=format&fit=crop&w=400&q=80", desc:"Eco-friendly yoga mat."},
  {id:9, name:"Perfume", category:"Beauty", price:2299, img:"https://images.unsplash.com/photo-1589187155478-0c14bda7b6e8?auto=format&fit=crop&w=400&q=80", desc:"Fragrant perfume."},
  {id:10, name:"Toy Car", category:"Toys", price:699, img:"https://images.unsplash.com/photo-1606813903128-1c6b6ef5e9e5?auto=format&fit=crop&w=400&q=80", desc:"Fun toy car."},
  {id:11, name:"Jeans", category:"Clothing", price:1499, img:"https://images.unsplash.com/photo-1618354690058-58f5ca9015bf?auto=format&fit=crop&w=400&q=80", desc:"Stylish denim jeans."},
  {id:12, name:"Backpack", category:"Accessories", price:1799, img:"https://images.unsplash.com/photo-1504280390368-397bfc706c7c?auto=format&fit=crop&w=400&q=80", desc:"Durable travel backpack."}
];

const categories = ["All","Clothing","Accessories","Electronics","Footwear","Home & Kitchen","Books","Sports","Beauty","Toys"];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

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

// Render category list
categories.forEach(cat=>{
  const li = document.createElement("li");
  li.textContent = cat;
  li.addEventListener("click", ()=>filterCategory(cat));
  categoryList.appendChild(li);
});

// Render products
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
    productsGrid.appendChild(card);
  });
}

// Filter by category
function filterCategory(cat){
  activeCategory.textContent = cat==="All" ? "All Products" : cat;
  let list = cat==="All" ? products : products.filter(p=>p.category===cat);
  renderProducts(list);
}

// Add to cart
function addToCart(id){
  let item = cart.find(i=>i.id===id);
  if(item){ item.qty++; }
  else{ cart.push({id, qty:1}); }
  saveCart();
}

// Save + update cart
function saveCart(){
  localStorage.setItem("cart",JSON.stringify(cart));
  updateCartUI();
}

// Update cart UI
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

// Clear cart
clearCartBtn.addEventListener("click",()=>{
  cart=[];
  saveCart();
});

// Search
searchInput.addEventListener("input",()=>{
  const val=searchInput.value.toLowerCase();
  const list=products.filter(p=>p.name.toLowerCase().includes(val));
  renderProducts(list);
});

// Sort
sortSelect.addEventListener("change",()=>{
  let list=[...products];
  switch(sortSelect.value){
    case "low": list.sort((a,b)=>a.price-b.price); break;
    case "high": list.sort((a,b)=>b.price-a.price); break;
    case "alpha": list.sort((a,b)=>a.name.localeCompare(b.name)); break;
  }
  renderProducts(list);
});

// Cart modal
cartBtn.addEventListener("click",()=>{ cartModal.style.display="flex"; cartModal.setAttribute("aria-hidden","false"); });
closeCart.addEventListener("click",()=>{ cartModal.style.display="none"; cartModal.setAttribute("aria-hidden","true"); });

// Init
renderProducts(products);
updateCartUI();

