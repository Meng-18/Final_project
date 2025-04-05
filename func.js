// Slider
const swiper = new Swiper(".slider-container", {
  effect: "slide",
  speed: 1000,
  autoplay: { delay: 2000 },
});

// Change items (for viewitem.html)
function show0() {
  let img = document.getElementById("img-site2");
  let thumbnail = document.getElementById("img0");
  if (img && thumbnail) {
    img.src = thumbnail.src;
  }
}
function show1() {
  let img = document.getElementById("img-site2");
  let thumbnail = document.getElementById("img1");
  if (img && thumbnail) {
    img.src = thumbnail.src;
  }
}
function show2() {
  let img = document.getElementById("img-site2");
  let thumbnail = document.getElementById("img2");
  if (img && thumbnail) {
    img.src = thumbnail.src;
  }
}
function show3() {
  let img = document.getElementById("img-site2");
  let thumbnail = document.getElementById("img3");
  if (img && thumbnail) {
    img.src = thumbnail.src;
  }
}

// Quantity ViewItems
let qty = document.querySelector(".qtyview");

function increaseQty() {
  qty.value = parseInt(qty.value) + 1;
}
function decreaseQty() {
  if (parseInt(qty.value) > 0) {
    qty.value = parseInt(qty.value) - 1;
  }
}

// Cart logic
let iconbag = document.querySelector(".btn-fit");
let closecard = document.querySelector("#close");
let body = document.querySelector("body");
let listProductHTML = document.querySelector(".boxItem");
let listCartHTML = document.querySelector(".list-tap");
let ironCartSpan = document.querySelector("span");

let listProducts = [];
let carts = [];

if (iconbag) {
  iconbag.addEventListener("click", function () {
    body.classList.toggle("showcard");
  });
}
if (closecard) {
  closecard.addEventListener("click", function () {
    body.classList.toggle("showcard");
  });
}

const addDataToHtml = () => {
  if (!listProductHTML) return;
  listProductHTML.innerHTML = "";
  if (listProducts.length > 0) {
    listProducts.forEach((product) => {
      let newProduct = document.createElement("div");
      newProduct.classList.add("itemContent");
      newProduct.dataset.id = product.id;
      newProduct.innerHTML = `
                <a href="viewitem.html?productId=${product.id}"><img src="${product.image}" alt="Product Image" class="img-item"></a>
                <div class="item-info">
                    <div class="price-content">
                        <span class="item-price">$ ${product.price}</span>
                        <i class="favorite-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill"
                                viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314" />
                            </svg>
                        </i>    
                    </div>
                    <div class="product-name">
                        <span class="item-name">${product.name}</span>
                        <button class="buttonviewmore">Add To Cart</button>
                    </div>
                </div>`;
      listProductHTML.appendChild(newProduct);
    });
  }
};

if (listProductHTML) {
  listProductHTML.addEventListener("click", (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains("buttonviewmore")) {
      let productElement = positionClick.closest(".itemContent");
      let product_id = productElement.dataset.id;
      addToCart(product_id, 1, null); // Default quantity 1, no size from homepage
    }
  });
}

const addToCart = (product_id, quantity, size) => {
  let positionThisProductInCart = carts.findIndex(
    (value) => value.product_id == product_id && value.size == size
  );
  if (carts.length <= 0 || positionThisProductInCart < 0) {
    carts.push({
      product_id: product_id,
      quantity: quantity,
      size: size,
    });
  } else {
    carts[positionThisProductInCart].quantity += quantity;
  }
  addCartToHTML();
  addCardToMemory();
};

const addCardToMemory = () => {
  localStorage.setItem("cart", JSON.stringify(carts));
};

const addCartToHTML = () => {
  if (!listCartHTML || !ironCartSpan) return;
  listCartHTML.innerHTML = "";
  let totalQuantity = 0;
  if (carts.length > 0) {
    carts.forEach((cart) => {
      totalQuantity += cart.quantity;
      let newCart = document.createElement("div");
      newCart.classList.add("item");
      newCart.dataset.id = cart.product_id;
      let positionProduct = listProducts.findIndex(
        (value) => value.id == cart.product_id
      );
      let info = listProducts[positionProduct];
      newCart.innerHTML = `
                <div class="image-tap">
                    <img src="${info.image}" alt="">
                </div>
                <div class="name">${info.name}${
        cart.size ? " (" + cart.size + ")" : ""
      }</div>
                <div class="quantity">
                    <span class="minus"> < </span>
                    <span> ${cart.quantity} </span>
                    <span class="plus"> > </span>
                </div>
                <div class="price">$${info.price * cart.quantity}</div>`;
      listCartHTML.appendChild(newCart);
    });
  }
  ironCartSpan.innerText = totalQuantity;
};

const updateCartIcon = () => {
  if (!ironCartSpan) return;
  let totalQuantity = 0;
  if (carts.length > 0) {
    totalQuantity = carts.reduce((sum, cart) => sum + cart.quantity, 0);
  }
  ironCartSpan.innerText = totalQuantity;
};

if (listCartHTML) {
  listCartHTML.addEventListener("click", (event) => {
    let positionClick = event.target;
    if (
      positionClick.classList.contains("minus") ||
      positionClick.classList.contains("plus")
    ) {
      let product_id = positionClick.parentElement.parentElement.dataset.id;
      let type = positionClick.classList.contains("plus") ? "plus" : "minus";
      changeQuantity(product_id, type);
    }
  });
}

const changeQuantity = (product_id, type) => {
  let positionItemInCart = carts.findIndex(
    (value) => value.product_id == product_id
  );
  if (positionItemInCart >= 0) {
    switch (type) {
      case "plus":
        carts[positionItemInCart].quantity =
          carts[positionItemInCart].quantity + 1;
        break;
      default:
        let valueChange = carts[positionItemInCart].quantity - 1;
        if (valueChange > 0) {
          carts[positionItemInCart].quantity = valueChange;
        } else {
          carts.splice(positionItemInCart, 1);
        }
        break;
    }
  }
  addCardToMemory();
  addCartToHTML();
};

// Load product details for viewitem.html
const loadProductDetails = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("productId");
  if (productId && listProducts.length > 0) {
    const product = listProducts.find((p) => p.id == productId);
    if (product) {
      // Update product details
      document.getElementById("product-title").innerText = product.name;
      document.getElementById("product-price").innerText = `$ ${product.price}`;
      document.getElementById("img-site2").src = product.image;
      document.getElementById("img0").src = product.image;
      document.getElementById("img1").src = product.image1;
      document.getElementById("img2").src = product.image2;
      document.getElementById("img3").src = product.image3;

      // Add to cart functionality
      const addToBagBtn = document.querySelector(".addToBag");
      if (addToBagBtn) {
        addToBagBtn.addEventListener("click", () => {
          const selectedSize = document.querySelector(
            'input[name="size"]:checked'
          )?.value;
          const quantity = parseInt(document.querySelector(".qtyview").value);
          if (!selectedSize) {
            alert("Please select a size.");
            return;
          }
          addToCart(productId, quantity, selectedSize);
        });
      }
    }
  }
};

const initApp = () => {
  // Load cart from localStorage
  if (localStorage.getItem("cart")) {
    carts = JSON.parse(localStorage.getItem("cart"));
  }

  // Update cart icon on page load
  updateCartIcon();

  // Fetch product data
  fetch("product.json")
    .then((response) => response.json())
    .then((data) => {
      listProducts = data;

      // Render products on homepage
      if (listProductHTML) {
        addDataToHtml();
      }

      // Load product details on viewitem.html
      if (window.location.pathname.includes("viewitem.html")) {
        loadProductDetails();
      }

      // Render cart
      addCartToHTML();
    })
    .catch((error) => console.error("Error fetching products:", error));
};

initApp();
