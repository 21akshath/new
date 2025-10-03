// -------- Products --------
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

// -------- Containers --------
const productsGrid = document.getElementById("productsGrid");
const categoriesList = document.getElementById("categoriesList");

// -------- Reviews & Cart --------
let reviews = JSON.parse(localStorage.getItem("reviews")) || {};
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// -------- Categories --------
const categories = [...new Set(products.map(p=>p.category))];
categories.forEach(cat=>{
  const li = document.createElement("li");
  li.textContent = cat;
  li.style.cursor = "pointer";
  li.addEventListener("click", ()=>{
    const filtered = products.filter(p=>p.category===cat);
    renderProducts(filtered);
  });
  categoriesList.appendChild(li);
});

// "All" option
const allLi = document.createElement("li");
allLi.textContent = "All";
allLi.style.cursor = "pointer";
allLi.style.fontWeight = "700";
allLi.addEventListener("click", ()=> renderProducts(products));
categoriesList.prepend(allLi);

// -------- Render Products --------
function renderProducts(list){
  productsGrid.innerHTML="";
  const gradients = [
    "linear-gradient(135deg,#d9f7be 0%,#a7f3d0 100%)",
    "linear-gradient(135deg,#fff7bc 0%,#ffe082 100%)",
    "linear-gradient(135deg,#fcd5ce 0%,#f8b4b4 100%)",
    "linear-gradient(135deg,#bae6fd 0%,#7dd3fc 100%)",
  ];

  list.forEach((p,i)=>{
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.style.background = gradients[i % gradients.length];
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}" class="product-image"/>
      <div class="card-body">
        <h3 class="product-title">${p.name}</h3>
        <p class="product-category">${p.category}</p>
        <div class="price-row">
          <span class="price-value">₹${p.price}</span>
          <button class="btn btn-primary add-to-cart">Add</button>
        </div>
        <div class="rating" id="rating-${p.id}"></div>
      </div>
    `;
    productsGrid.appendChild(card);
    card.querySelector(".add-to-cart").addEventListener("click",()=>addToCart(p.id));
  });
}

// -------- Initial render --------
renderProducts(products);







