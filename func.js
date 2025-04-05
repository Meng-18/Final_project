// Slider (unchanged)
const swiper = new Swiper(".slider-container", {
  effect: "slide",
  speed: 1000,
  autoplay: { delay: 2000 },
});

// Change items (for viewitem.html) - unchanged
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

// Quantity ViewItems (unchanged)
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

// Toggle cart visibility
if (iconbag) {
  iconbag.addEventListener("click", () => {
    body.classList.toggle("showcard");
  });
}
if (closecard) {
  closecard.addEventListener("click", () => {
    body.classList.toggle("showcard");
  });
}

// Render products on the homepage
const addDataToHtml = () => {
  if (!listProductHTML) return;
  listProductHTML.innerHTML = "";
  if (listProducts.length > 0) {
    listProducts.forEach((product) => {
      let newProduct = document.createElement("div");
      newProduct.classList.add("itemContent");
      newProduct.dataset.id = product.id;
      newProduct.innerHTML = `
        <a href="viewitem.html?productId=${product.id}">
          <img src="${product.image}" alt="Product Image" class="img-item">
        </a>
        <div class="item-info">
          <div class="price-content">
            <span class="item-price">$ ${product.price}</span>
            <i class="favorite-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
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
  } else {
    listProductHTML.innerHTML = "<p>No products available.</p>";
  }
};

// Add to cart from homepage
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

// Add product to cart
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

// Save cart to localStorage
const addCardToMemory = () => {
  localStorage.setItem("cart", JSON.stringify(carts));
};

// Render cart items
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

// Update cart icon
const updateCartIcon = () => {
  if (!ironCartSpan) return;
  let totalQuantity = 0;
  if (carts.length > 0) {
    totalQuantity = carts.reduce((sum, cart) => sum + cart.quantity, 0);
  }
  ironCartSpan.innerText = totalQuantity;
};

// Handle cart quantity changes
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
        carts[positionItemInCart].quantity += 1;
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

// Initialize the app
// Initialize the app with embedded data
const initApp = () => {
  // Load cart from localStorage
  if (localStorage.getItem("cart")) {
    carts = JSON.parse(localStorage.getItem("cart"));
  }

  // Update cart icon on page load
  updateCartIcon();

  // Embedded product data (replace with your actual data from product.json)
  listProducts = [
    {
      id: 1,
      name: "Cropped Tops",
      price: 6.95,
      image: "image/HOMEPAGE1.jpg",
      image1: "imageElse/1-1.jpg",
      image2: "imageElse/1-2.jpg",
      image3: "imageElse/1-3.jpg",
    },
    {
      id: 2,
      name: "Cropped Tops",
      price: 6.95,
      image: "image/HOMEPAGE2.jpg",
      image1: "imageElse/2-1.jpg",
      image2: "imageElse/2-2.jpg",
      image3: "imageElse/2-3.jpg",
    },

    {
      id: 3,
      name: "Cropped Tops",
      price: 6.95,
      image: "image/HOMEPAGE3.jpg",
      image1: "imageElse/3-1.jpg",
      image2: "imageElse/3-2.jpg",
      image3: "imageElse/3-3.jpg",
    },
    {
      id: 4,
      name: "Mini Puff-Sleeves Dresses",
      price: 19.59,
      image: "image/HOMEPAGE4.jpg",
      image1: "imageElse/4-1.jpg",
      image2: "imageElse/4-2.jpg",
      image3: "imageElse/4-3.jpg",
    },
    {
      id: 5,
      name: "Monki Ribbed Knitted Sweatshirt",
      price: 23.59,
      image: "image/HOMEPAGE5.jpg",
      image1: "imageElse/5-1.jpg",
      image2: "imageElse/5-2.jpg",
      image3: "imageElse/5-3.jpg",
    },
    {
      id: 6,
      name: "Monki Ribbed Knitted Sweatshirt",
      price: 23.59,
      image: "image/HOMEPAGE6.jpg",
      image1: "imageElse/6-1.jpg",
      image2: "imageElse/6-2.jpg",
      image3: "imageElse/6-3.jpg",
    },
    {
      id: 7,
      name: "Ribbon Tops",
      price: 18.59,
      image: "image/HOMEPAGE7.jpg",
      image1: "imageElse/7-1.jpg",
      image2: "imageElse/7-2.jpg",
      image3: "imageElse/7-3.jpg",
    },
    {
      id: 8,
      name: "Ribbon Tops",
      price: 18.59,
      image: "image/HOMEPAGE8.jpg",
      image1: "imageElse/8-1.jpg",
      image2: "imageElse/8-2.jpg",
      image3: "imageElse/8-3.jpg",
    },
    {
      id: 9,
      name: "Regular Hoodie Jacket",
      price: 36.95,
      image: "image/HOMEPAGE9.jpg",
      image1: "imageElse/9-1.jpg",
      image2: "imageElse/9-2.jpg",
      image3: "imageElse/9-3.jpg",
    },
    {
      id: 10,
      name: "Relaxed Fit Zip-Polo Shirt",
      price: 6.95,
      image: "image/HOMEPAGE10.jpg",
      image1: "imageElse/10-1.jpg",
      image2: "imageElse/10-2.jpg",
      image3: "imageElse/10-3.jpg",
    },
    {
      id: 11,
      name: "Relaxed Fit Shirts",
      price: 6.95,
      image: "image/HOMEPAGE11.jpg",
      image1: "imageElse/11-1.jpg",
      image2: "imageElse/11-2.jpg",
      image3: "imageElse/11-3.jpg",
    },
    {
      id: 12,
      name: "Regular Printed T-Shirts",
      price: 6.95,
      image: "image/HOMEPAGE12.jpg",
      image1: "imageElse/12-1.jpg",
      image2: "imageElse/12-2.jpg",
      image3: "imageElse/12-3.jpg",
    },
    {
      id: 13,
      name: "Regular Fit Jacket",
      price: 25.59,
      image: "image/HOMEPAGE13.jpg",
      image1: "imageElse/14-1.jpg",
      image2: "imageElse/14-2.jpg",
      image3: "imageElse/14-3.jpg",
    },
    {
      id: 14,
      name: "Loose Fit T-Shirts",
      price: 13.95,
      image: "image/HOMEPAGE14.jpg",
      image1: "imageElse/15-1.jpg",
      image2: "imageElse/15-2.jpg",
      image3: "imageElse/15-3.jpg",
    },
    {
      id: 15,
      name: "Regular Denim Shorts",
      price: 18.59,
      image: "image/HOMEPAGE15.jpg",
      image1: "imageElse/16-1.jpg",
      image2: "imageElse/16-2.jpg",
      image3: "imageElse/16-3.jpg",
    },
    {
      id: 16,
      name: "Regular Shirt With Printed",
      price: 16.95,
      image: "image/HOMEPAGE16.jpg",
      image1: "imageElse/17-1.jpg",
      image2: "imageElse/17-2.jpg",
      image3: "imageElse/17-3.jpg",
    },
    {
      id: 17,
      name: "Loose Fit Shirts With Printed",
      price: 16.95,
      image: "image/Loose Fit Shirts With Printed 17.jpg",
      image1: "imageElse/18-1.jpg",
      image2: "imageElse/18-2.jpg",
      image3: "imageElse/18-3.jpg",
    },
    {
      id: 18,
      name: "Relaxed T-Shirt With Printed",
      price: 14.95,
      image: "image/HOMEPAGE18.jpg",
      image1: "imageElse/19-1.jpg",
      image2: "imageElse/19-2.jpg",
      image3: "imageElse/19-3.jpg",
    },
    {
      id: 19,
      name: "Regular T-Shirt With Printed",
      price: 13.59,
      image: "image/HOMEPAGE19.jpg",
      image1: "imageElse/13-1.jpg",
      image2: "image/HOMEPAGE19.jpg",
      image3: "imageElse/13-1.jpg",
    },
    {
      id: 20,
      name: "Regular Stripe Sweatshirt",
      price: 18.59,
      image: "image/HOMEPAGE20.jpg",
      image1: "imageElse/20-1.jpg",
      image2: "imageElse/20-2.jpg",
      image3: "imageElse/20-3.jpg",
    },
  ];

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
};

// Start the app
initApp();
