const products = [
  {id:1,name:"Cotton T-shirt",category:"Clothing",price:499,img:"https://images.unsplash.com/photo-1520974697291-34a3e84b7e5b?auto=format&fit=crop&w=300&q=80",desc:"Comfortable cotton t-shirt."},
  {id:2,name:"Leather Wallet",category:"Accessories",price:1299,img:"https://images.unsplash.com/photo-1606813903903-9bfc1e2fcdb1?auto=format&fit=crop&w=300&q=80",desc:"Premium leather wallet."},
  {id:3,name:"Bluetooth Headphones",category:"Electronics",price:2499,img:"https://images.unsplash.com/photo-1580910051075-6c9eb8cc4fdf?auto=format&fit=crop&w=300&q=80",desc:"High-quality sound."},
  {id:4,name:"Novel Book",category:"Books",price:399,img:"https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=300&q=80",desc:"Bestselling novel book."},
  {id:5,name:"Sneakers",category:"Clothing",price:1999,img:"https://images.unsplash.com/photo-1595950651913-18a4c1fa6228?auto=format&fit=crop&w=300&q=80",desc:"Comfortable sneakers for daily wear."},
  {id:6,name:"Sunglasses",category:"Accessories",price:799,img:"https://images.unsplash.com/photo-1512069772994-66b5e9d2f4e8?auto=format&fit=crop&w=300&q=80",desc:"Stylish UV-protection sunglasses."},
  {id:7,name:"Smartphone",category:"Electronics",price:29999,img:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80",desc:"Latest smartphone with great features."},
  {id:8,name:"Wrist Watch",category:"Accessories",price:3499,img:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80",desc:"Elegant wrist watch for all occasions."},
  {id:9,name:"Jeans",category:"Clothing",price:1499,img:"https://images.unsplash.com/photo-1589987608885-61d845ceab05?auto=format&fit=crop&w=300&q=80",desc:"Comfortable blue jeans."},
  {id:10,name:"Laptop",category:"Electronics",price:49999,img:"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=300&q=80",desc:"High-performance laptop for work and gaming."},
  {id:11,name:"Backpack",category:"Accessories",price:1199,img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80",desc:"Spacious backpack for travel and college."},
  {id:12,name:"Headphones",category:"Electronics",price:1999,img:"https://images.unsplash.com/photo-1590608897129-79c2bfa4e5b4?auto=format&fit=crop&w=300&q=80",desc:"Wireless headphones with noise cancellation."}
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


