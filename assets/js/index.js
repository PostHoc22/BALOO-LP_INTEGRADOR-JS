//**conexion con los elementos del DOM - INICIO:

const $cardsContainer = document.querySelector(".product-cards-container"); //contenedor general de cards
const $cardItem = document.querySelectorAll(".product-card-item"); // contenedor de cada card
const $cardBtn = document.querySelectorAll(".btn-card"); //botones de card
const $cardTitle = document.querySelectorAll(".card-info-title");

const $cartContainer = document.querySelector(".cart"); //capturo contenedor del carrito
const $cartIcon = document.querySelector(".bxs-cart"); //capturo icono del carrito
const $cartDropdown = document.querySelector(".cart-dropdown"); //despliege del menu del carrito
const $cartItem = document.querySelector(".cart-item-container"); //contenedor de cada producto agregado al carrito;

//*conexion con los elementos del DOM - FINAL

let cartShop = {};

//---------------------------------------------------

//? ---- CONTENEDOR CARDS INICIO ----

//*conexion a base de datos de productos: "data.json" - INICIO
const fetchData = async () => {
  try {
    const res = await fetch("/assets/json/data.json");
    const data = await res.json();
    // console.log(data);
    renderCardProducts(data);
  } catch (error) {
    console.log(error);
  }
};
//*conexion a base de datos de productos: "data.json" - FINAL

//*template para clonar tarjetas de productos
const templateCardProduct = (product) => {
  return `
      <div class="product-card-item">
          <div class="card-img">
            <img src="${product.imagen_02}" alt="${product.nombre}"
              class="card-img-back" id="card-01-img-b">
            <img src="${product.imagen_01}" alt="${product.nombre}"
              class="card-img-above" id="card-01-img-a">
          </div>
          <div class="card-info">
            <h3 class="card-info-title">${product.nombre}</h3>
            <div class="card-info-buys">
              <p class="card-info-buys-price">$ ${(
                product.precioLista * product.descuento
              )
                .toFixed(2)
                .replace(".", ",")}</p>
              <p class="card-info-buys-listPrice">$ ${product.precioLista}</p>
            </div>
            <div class="card-info-buys-btn">
              <button class="btn-card button" data-id="${
                product.id
              }">Comprar</button>
            </div>
          </div>
        </div>
      `;
};

//* renderizado de tarjetas de productos
const renderCardProducts = (data) => {
  $cardsContainer.innerHTML = data
    .map((product) => templateCardProduct(product))
    .join("");
};

//?---- CONTENEDOR CARDS FINAL ----

//-------------------------------------
//-------------------------------------

//?---- CONTENEDOR CARRITO INICIO ----

const toggleCart = () => {
  //para desplegar y ocultar menu
  $cartDropdown.classList.toggle("cart-dropdown");
  $cartDropdown.classList.toggle("cart-show");
};

const catchValuesCart = (e) => {
  //para escuchar desde DOM la info de cada producto del carrito
  if (e.target.classList.contains("btn-card")) {
    // console.log(e.target.parentElement.parentElement.parentElement);
    setCart(e.target.parentElement.parentElement.parentElement);
  }
  e.stopPropagation();
};

const setCart = (cart) => {
  //capturar info del producto para adherir luego al carrito
  // console.log(cart);
  const product = {
    id: cart.querySelector(".btn-card").dataset.id,
    name: cart.querySelector(".card-info-title").textContent,
    price: cart.querySelector(".card-info-buys-price").textContent,
    img: cart.querySelector(".card-img-back").src,
    quantity: 1,
  };
  if (cartShop.hasOwnProperty(product.id)) {
    product.quantity = cartShop[product.id].quantity + 1;
  }
  cartShop[product.id] = { ...product };
  // console.log(cartShop);
  addToCart();
};

const addToCart = () => {
  console.log(cartShop);
  // $cartDropdown.classList.remove("no-products");
  if (Object.keys(cartShop).length === 0) {
    `  <h3 class="cart-title">Carrito de Compras</h3>
    <p class="no-products">Aun no hay productos cargados en tu Carrito</p>
    <div class="cart-item-container">
    </div>`;
  } else {
    $cartDropdown.innerHTML = Object.values(cartShop)
      .map((product) => templateAddToCart(product))
      .join("");
  }
};

const templateAddToCart = (product) => {
  return `
  <h3 class="cart-title">Carrito de Compras</h3>
  <div class="cart-column">
  <div class="cart-body">
    <img class="cart-img" src="${product.img}" alt="${product.name}">
    <p class="cart-product-name"> ${product.name}</p>
    <p class="cart-product-price">${product.price}</p>
    <div class="cart-quantity-container">
    <button class="cart-product-btn-rem">-</button>
    <p class="cart-product-quantity">${product.quantity}</p>
      <button class="cart-product-btn-add">+</button>
    </div>
    <p class="cart-product-subtotal">Subtotal: $300 </p>
  </div>
    <p class="cart-product-total">Total</p>
  </div>
  `;
};

//?---- CONTENEDOR CARRITO FINAL ----

const init = () => {
  document.addEventListener("DOMContentLoaded", fetchData); //para renderizar apenas termine de cargar el browser

  $cartIcon.addEventListener("click", toggleCart); //para desplegar carrito

  $cardsContainer.addEventListener("click", catchValuesCart); //para escuchar del DOM evento click con la info de cada producto del carrito
};
init();
