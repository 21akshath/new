const products = [
  {id:1, name:"Cotton T-shirt", category:"Clothing", price:499, img:"https://images.unsplash.com/photo-1593032465170-56df36f1f7a8?crop=entropy&cs=tinysrgb&fit=max&w=300&h=200", desc:"Comfortable cotton t-shirt."},
  {id:2, name:"Leather Wallet", category:"Accessories", price:1299, img:"https://images.unsplash.com/photo-1580422461601-2ed2c09f4907?crop=entropy&cs=tinysrgb&fit=max&w=300&h=200", desc:"Premium leather wallet."},
  {id:3, name:"Bluetooth Headphones", category:"Electronics", price:2499, img:"https://images.unsplash.com/photo-1518449029125-5dc3c7f27a47?crop=entropy&cs=tinysrgb&fit=max&w=300&h=200", desc:"High-quality sound."},
  {id:4, name:"Sports Shoes", category:"Footwear", price:1999, img:"https://images.unsplash.com/photo-1618354699404-f58602c85db3?crop=entropy&cs=tinysrgb&fit=max&w=300&h=200", desc:"Durable and comfortable."},
  {id:5, name:"Wrist Watch", category:"Accessories", price:3499, img:"https://images.unsplash.com/photo-1519648023493-d82b5f8d7d66?crop=entropy&cs=tinysrgb&fit=max&w=300&h=200", desc:"Elegant wrist watch."},
  {id:6, name:"Cooking Pan", category:"Home & Kitchen", price:1599, img:"https://images.unsplash.com/photo-1607465882228-d41faec7a91f?crop=entropy&cs=tinysrgb&fit=max&w=300&h=200", desc:"Non-stick cooking pan."},
  {id:7, name:"Novel Book", category:"Books", price:399, img:"https://images.unsplash.com/photo-1512820790803-83ca734da794?crop=entropy&cs=tinysrgb&fit=max&w=300&h=200", desc:"Bestseller novel."},
  {id:8, name:"Yoga Mat", category:"Sports", price:799, img:"https://images.unsplash.com/photo-1594737625785-6ad0e9d6bb76?crop=entropy&cs=tinysrgb&fit=max&w=300&h=200", desc:"Eco-friendly yoga mat."},
  {id:9, name:"Perfume", category:"Beauty", price:2299, img:"https://images.unsplash.com/photo-1600180759430-3c70f503d0e7?crop=entropy&cs=tinysrgb&fit=max&w=300&h=200", desc:"Fragrant perfume."},
  {id:10, name:"Toy Car", category:"Toys", price:699, img:"https://images.unsplash.com/photo-1583162906563-2b873fc98e3d?crop=entropy&cs=tinysrgb&fit=max&w=300&h=200", desc:"Fun toy car."},
  {id:11, name:"Sunglasses", category:"Accessories", price:1599, img:"https://images.unsplash.com/photo-1504198453319-5ce911bafcde?crop=entropy&cs=tinysrgb&fit=max&w=300&h=200", desc:"Stylish UV protection sunglasses."},
  {id:12, name:"Backpack", category:"Bags", price:2199, img:"https://images.unsplash.com/photo-1589571894960-20bbe2828f3e?crop=entropy&cs=tinysrgb&fit=max&w=300&h=200", desc:"Durable travel backpack."}
];

const productsGrid = document.getElementById("productsGrid");
const categoriesList = document.getElementById("categoriesList");
let reviews = JSON.parse(localStorage.getItem("reviews")) || {};
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartBtn = document.getElementById("cartBtn");
const cartModal = document.getElementById("cartModal");
const cartContents = document.getElementById("cartContents");
const cartSummary = document.getElementById("cartSummary");
const checkoutModal = document.getElementById("checkoutModal");
const checkoutContents = document.getElementById("checkoutContents");

// ---------- Categories ----------
const categories = [...new Set(products.map(p=>p.category))];
categories.forEach(cat=>{
  const li=document.createElement("li");
  li.textContent=cat;
  li.style.cursor="pointer";
  li.addEventListener("click",()=>renderProducts(products.filter(p=>p.category===cat)));
  categoriesList.appendChild(li);
});
const allLi=document.createElement("li");
allLi.textContent="All";
allLi.style.cursor="pointer";
allLi.style.fontWeight="700";
allLi.addEventListener("click",()=>renderProducts(products));
categoriesList.prepend(allLi);

// ---------- Render Products ----------
function renderProducts(list){
  productsGrid.innerHTML="";
  const gradients=["#d9f7be","#fff7bc","#fcd5ce","#bae6fd"];
  list.forEach((p,i)=>{
    const card=document.createElement("div");
    card.classList.add("product-card");
    card.style.background=gradients[i%gradients.length];
    card.innerHTML=`
      <img src="${p.img}" alt="${p.name}" class="product-image">
      <div class="card-body">
        <h3>${p.name}</h3>
        <p>${p.category}</p>
        <div class="price-row">₹${p.price}</div>
        <div class="card-actions">
          <button class="btn btn-primary add-to-cart">Add to Cart</button>
          <button class="btn btn-secondary view-details">View Details</button>
        </div>
      </div>`;
    productsGrid.appendChild(card);

    card.querySelector(".add-to-cart").addEventListener("click",()=>addToCart(p.id));
    card.querySelector(".view-details").addEventListener("click",()=>openDetailsModal(p.id));
  });
}
renderProducts(products);

// ---------- View Details & Reviews ----------
function openDetailsModal(id){
  const product = products.find(p=>p.id===id);
  document.getElementById("detailsTitle").textContent=product.name;
  document.getElementById("detailsImage").src=product.img;
  document.getElementById("detailsDesc").textContent=product.desc;
  document.getElementById("detailsPrice").textContent=`₹${product.price}`;

  const reviewList=document.getElementById("reviewList");
  reviewList.innerHTML="";
  const productReviews=reviews[id]||[];
  productReviews.forEach((rev,i)=>{
    const div=document.createElement("div");
    div.innerHTML=`<b>${rev.name}</b> (${rev.rating}⭐)<p>${rev.text}</p>
      <button class="btn btn-secondary delete-review" data-index="${i}">Delete</button>`;
    reviewList.appendChild(div);
    div.querySelector(".delete-review").addEventListener("click",()=>{
      productReviews.splice(i,1);
      reviews[id]=productReviews;
      localStorage.setItem("reviews",JSON.stringify(reviews));
      openDetailsModal(id);
    });
  });

  document.getElementById("addReviewBtn").onclick=()=>{
    const name=document.getElementById("reviewerName").value.trim();
    const rating=parseInt(document.getElementById("reviewRating").value);
    const text=document.getElementById("reviewText").value.trim();
    if(name && rating && text){
      if(!reviews[id]) reviews[id]=[];
      reviews[id].push({name,rating,text});
      localStorage.setItem("reviews",JSON.stringify(reviews));
      document.getElementById("reviewerName").value="";
      document.getElementById("reviewRating").value="";
      document.getElementById("reviewText").value="";
      openDetailsModal(id);
    } else alert("Fill all fields to submit review.");
  };

  document.getElementById("detailsModal").style.display="flex";
}
document.getElementById("closeDetails").onclick=()=>document.getElementById("detailsModal").style.display="none";

// ---------- Add to Cart ----------
function addToCart(id){
  const product=products.find(p=>p.id===id);
  const cartItem=cart.find(c=>c.id===id);
  if(cartItem){cartItem.qty+=1;} else {cart.push({...product,qty:1});}
  localStorage.setItem("cart",JSON.stringify(cart));
  cartBtn.textContent=`Cart (${cart.reduce((a,b)=>a+b.qty,0)})`;
}

// ---------- Cart Modal ----------
cartBtn.onclick=()=>{
  renderCart();
  cartModal.style.display="flex";
};
document.getElementById("closeCart").onclick=()=>cartModal.style.display="none";

function renderCart(){
  cartContents.innerHTML="";
  let total=0;
  cart.forEach((item,i)=>{
    total+=item.price*item.qty;
    const div=document.createElement("div");
    div.style.display="flex";
    div.style.alignItems="center";
    div.style.justifyContent="space-between";
    div.style.marginBottom="0.5rem";
    div.innerHTML=`
      <img src="${item.img}" style="width:50px;height:50px;object-fit:cover;border-radius:6px;">
      <span>${item.name}</span>
      <span>₹${item.price} x ${item.qty}</span>
      <button class="btn btn-secondary remove-item">Remove</button>`;
    div.querySelector(".remove-item").onclick=()=>{
      cart.splice(i,1);
      localStorage.setItem("cart",JSON.stringify(cart));
      renderCart();
      cartBtn.textContent=`Cart (${cart.reduce((a,b)=>a+b.qty,0)})`;
    };
    cartContents.appendChild(div);
  });
  cartSummary.textContent=`Total: ₹${total}`;
}

// ---------- Checkout ----------
document.getElementById("checkoutBtn").onclick=()=>{
  checkoutContents.innerHTML="";
  let total=0;
  cart.forEach(item=>{
    total+=item.price*item.qty;
    const div=document.createElement("div");
    div.style.display="flex";
    div.style.alignItems="center";
    div.style.justifyContent="space-between";
    div.style.marginBottom="0.5rem";
    div.innerHTML=`<img src="${item.img}" style="width:50px;height:50px;object-fit:cover;border-radius:6px;">
      <span>${item.name}</span>
      <span>₹${item.price} x ${item.qty}</span>`;
    checkoutContents.appendChild(div);
  });
  const totalDiv=document.createElement("div");
  totalDiv.style.fontWeight="700";
  totalDiv.style.marginTop="0.5rem";
  totalDiv.textContent=`Total Amount: ₹${total}`;
  checkoutContents.appendChild(totalDiv);
  checkoutModal.style.display="flex";
};

document.getElementById("closeCheckout").onclick=()=>checkoutModal.style.display="none";
document.getElementById("confirmOrder").onclick=()=>{
  if(cart.length===0){alert("Cart is empty!"); return;}
  alert("Order Confirmed! Thank you for shopping.");
  cart=[];
  localStorage.setItem("cart",JSON.stringify(cart));
  checkoutModal.style.display="none";
  cartModal.style.display="none";
  cartBtn.textContent="Cart (0)";
};
