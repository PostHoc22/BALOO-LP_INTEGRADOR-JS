//**conexion con los elementos del DOM - INICIO:

const $cardsContainer = document.querySelector(".product-cards-container"); //contenedor general de cards
const $cardItem = document.querySelectorAll(".product-card-item"); // contenedor de cada card
const $cardBtn = document.querySelectorAll(".btn-card"); //botones de card
const $cardTitle = document.querySelectorAll(".card-info-title");

//-----//---

const $cartContainer = document.querySelector(".cart"); //capturo contenedor del carrito
const $cartIcon = document.querySelector(".bxs-cart"); //capturo icono del carrito
const $cartDropdown = document.querySelector(".cart-dropdown"); //despliege del menu del carrito
const $cartEmpty = document.querySelector(".cart-without-products"); //info carrito vacio
const $cartItem = document.querySelector(".cart-item-container"); //contenedor con info de cada producto agregado al carrito;
const $rowTitleCartItems = document.querySelector(".row-title-cart-items"); //titulos del carrito con productos cargados
const $cartTotalValueBuy = document.querySelector(".cart-product-total");
const $cartBubble = document.querySelector(".cart-bubble");
const $cartModalSuccesProduct = document.querySelector(
  ".cart-modal-succes-product"
); //modal con mensaje de producto agregado al carrito
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

//TODO ----------- FUNCIONES AUXILIADORAS: INICIO-------------------

//TODO ----------- FUNCIONES AUXILIADORAS: FINAL-------------------

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
              <p class="card-info-buys-price">${(
                product.precioLista * product.descuento
              )
                .toFixed(2)
                .replace(".", ",")}</p>
              <p class="card-info-buys-listPrice">$${product.precioLista}</p>
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

//funcion que calcula la cantidad total en unidades de productos adquiridos por el usuario en el resumen de compras
const cartTotalQuantityBuy = () => {
  let nQuantity = Object.values(cartShop)
    .map((cart) => cart.quantity)
    .reduce((acc, quantity) => acc + quantity, 0);
  return nQuantity;
};

//funcion que calcula la cantidad total en unidades de productos agregados al carrito de compra en la burbuja del carrito
const cartBubbleQuantity = () => {
  return ($cartBubble.textContent = cartTotalQuantityBuy());
};

//funcion que calcula el valor total de la compra realizada por el usuario
const cartTotalValueBuy = () => {
  let nTotal = Object.values(cartShop).reduce(
    (acc, { price, quantity }) =>
      parseFloat(acc) + parseFloat(price) * parseFloat(quantity),
    0
  );
  nTotal = nTotal.toFixed(2).replace(".", ",");
  return nTotal;
};

//template para adherir los productos al carrrito de compras
const templateAddToCart = (product) => {
  return `
    <ul>
  <li> <img src="${product.img}" alt="${product.name}"></li>
  <li>${product.name}</li>
  <li>$ ${product.price}</li>
  <li class="cart-quantity-container"> 
      <button class="cart-product-btn-rem">
      -
      </button>
      <span>${product.quantity}</span>
      
      <button class="cart-product-btn-add">
      +
      </button>
   </li>
  <li>Subtotal: $${(parseFloat(product.price.trim()) * product.quantity)
    .toFixed(2)
    .replace(".", ",")}</li>
</ul>
  `;
};

//template para adherir al carrito el resumen de la compra total y para confirmar la compra o vaciar el carrito
const templateCartProductTotal = () => {
  return ($cartTotalValueBuy.innerHTML = `
    <h3>Resumen de su compra</h3>
          <ul>
            <li>Cantidad de Productos = ${cartTotalQuantityBuy()} </li>
            <li>Valor Total = $ ${cartTotalValueBuy()} </li>
          </ul>
          <button class="btn-confirm-buy"> 
            <span>Confirmar</span> 
          </button>
          <button class="btn-delete-buy">
            <span class="text">Eliminar</span><span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path
                  d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z">
                </path>
              </svg>
              </span>
          </button>
  `);
};

//funcion para desplegar y ocultar menu cuando sucede el evento click
const toggleCart = () => {
  $cartDropdown.classList.toggle("cart-dropdown");
  $cartDropdown.classList.toggle("cart-show");
};

//funcion para capturar toda la informacion de la tarjeta del producto en la cual se desencadena el evento click en el boton "comprar" cuando lo pulsa el usuario
const catchValuesCart = (e) => {
  if (e.target.classList.contains("btn-card")) {
    setCart(e.target.parentElement.parentElement.parentElement);
  }
  e.stopPropagation();
};

const showModalMessageAddProductSucces = (message) => {
  $cartModalSuccesProduct.textContent = message;
  $cartModalSuccesProduct.style.display = "block";

  // Ocultar el mensaje después de 3 segundos
  setTimeout(() => {
    $cartModalSuccesProduct.style.display = "none";
  }, 3000);
};

//funcion que adhiere al carrito cada producto que es comprado por el usuario (tambien maneja ciertos estilos del contenedor de cada producto dentro del carrito)
const addToCart = () => {
  // console.log(cartShop);
  if (Object.keys(cartShop).length > 0) {
    $cartEmpty.style.display = "none";
    // addToCart();
  }
  $rowTitleCartItems.innerHTML = `
  <h3>-- Productos Añadidos --</h3>
  `;
  $cartItem.style.display = "grid";
  $cartItem.style.height = "50vh";
  $cartItem.innerHTML = Object.values(cartShop)
    .map((product) => templateAddToCart(product))
    .join("");
  templateCartProductTotal();
  cartBubbleQuantity();
  showModalMessageAddProductSucces("Se agregó el producto al Carrito");
};

//funcion que genera un objeto con la informacion de cada producto que es comprado por el usuario para luego enviar al carrito
const setCart = (cart) => {
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
  // console.log(product);
  addToCart();
};

//?---- CONTENEDOR CARRITO FINAL ----

const init = () => {
  document.addEventListener("DOMContentLoaded", fetchData); //para renderizar apenas termine de cargar el browser

  $cartIcon.addEventListener("click", toggleCart); //para desplegar carrito

  $cardsContainer.addEventListener("click", catchValuesCart); //para escuchar del DOM evento click con la info de cada producto del carrito
};
init();
