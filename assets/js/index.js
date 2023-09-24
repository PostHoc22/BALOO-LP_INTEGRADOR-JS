//**conexion con los elementos del DOM - INICIO:

//!-------- cards: -------------
const $cardsContainer = document.querySelector(".product-cards-container"); //contenedor general de cards
const $cardItem = document.querySelectorAll(".product-card-item"); // contenedor de cada card
const $cardBtn = document.querySelectorAll(".btn-card"); //botones de card
const $cardTitle = document.querySelectorAll(".card-info-title");
//!-------- cards: -------------

//! -------- carrito de compras --------
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
const $btnDeleteCartBuy = document.querySelector(".empty-cart"); //para vaciar carrito
const $btnConfirmCartBuy = document.querySelector(".confirm-buy"); // boton confirmar compra del carrito
const $btnAddCart = document.querySelector(".cart-product-btn-add"); //para boton "+" que suma unidades al producto agregado al carrito
const $btnRemoveCart = document.querySelector(".cart-product-btn-rem"); //para boton "-" que resta unidades al producto agregado al carrito
const $modalConfirmBuyCart = document.querySelector(".modal-confirm-cart-buy"); // modal de compra confirmada
const $closeModalConfirmBuyCart = document.querySelector(".close-modal"); // "x" para cerrar modal de compra confirmada
const $modalDeleteBuyCart = document.querySelector(".modal-delete-cart-buy"); // modal vaciar carrito ok
//! -------- carrito de compras --------
//----

//! -------- menu hamburguesa ----------
const $menuIcon = document.querySelector(".bx-menu"); //capturo icono del menu

const $menu = document.querySelector(".menu"); // contenedor menu

const $menuShow = document.querySelector(".menu-show"); // para desplegar menu hamburguesa
//! -------- menu hamburguesa ----------

//*conexion con los elementos del DOM - FINAL

//---------------------------------------------------

//declaracion del carrito de compras, el cual puede ser un objeto  vacio o puede ontener productos almacenados en Local Storage
let cartShop = {};

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

//?---- CONTENEDOR MENU-TOGGLE INICIO ----

//funcion para desplegar y ocultar menu hamburgeusa cuando sucede el evento click
const toggleMenu = () => {
  $menu.classList.toggle("menu-show");
  $menu.classList.toggle("menu");
};

//?---- CONTENEDOR MENU-TOGGLE FINAL ----

//-------------------------------------
//-------------------------------------

//?---- CONTENEDOR CARRITO INICIO ----

//funcion que trae los productos del carrito que esta almacenados en local storage
const cartInfo = () => {
  fetchData();
  if (localStorage.getItem("cart")) {
    cartShop = JSON.parse(localStorage.getItem("cart"));
    showModalMessageAddProductSucces(
      "Existen productos cargados en tu Carrito"
    );
  }
};

//funcion que almacena los productos cargados en el carrito en el local storage
const saveCartShop = () => {
  localStorage.setItem("cart", JSON.stringify(cartShop));
};

//funcion para desplegar y ocultar menu carrito cuando sucede el evento click
const toggleCart = () => {
  $cartDropdown.classList.toggle("cart-dropdown");
  $cartDropdown.classList.toggle("cart-show");
};

//funcion que calcula la cantidad total en unidades de productos adquiridos por el usuario en el contenedor "resumen de compras"
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

//template para carrito vacio:
// const templateEmptyCart = () => {
//   return `
//         <p> Aun no hay productos cargados en tu Carrito</p>
//           <i class='bx bx-shopping-bag'></i>
//           <button class="btn-cart-buy">
//             <a class="hover-underline" href="#product"> Comprar Ahora </a>
//             <i class='bx bx-right-arrow-alt bx-flashing'></i>
//           </button>
//   `;
// };

//template para adherir los productos al carrrito de compras
const templateAddToCart = (product) => {
  return `
    <ul>
  <li> <img src="${product.img}" alt="${product.name}"></li>
  <li>${product.name}</li>
  <li>$ ${product.price}</li>
  <li class="cart-quantity-container"> 
      <button class="cart-product-btn-rem" data-id="${product.id}">
      -
      </button>
      <span>${product.quantity}</span>
      
      <button class="cart-product-btn-add" data-id="${product.id}">
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
          <button class="btn-confirm-buy confirm-buy"> 
            <span class="confirm-buy">Confirmar</span> 
          </button>
          <button class="btn-delete-buy empty-cart">
            <span class="text empty-cart">Eliminar</span> <i class="icon bx bx-trash empty-cart"></i>
          </button>
  `);
};

//template para mostrar ventana con mensaje de confirmacion de la compra luego de pulsar el boton "confirmar" del resumen de compras del carrito:
const templateModalConfirmBuy = () => {
  return ($modalConfirmBuyCart.innerHTML = `
    <div class="modal-content">
    
      <span class="close-modal">&times;</span>
      
       <p>Confirmamos su Pedido.</p>
       <p>A la brevedad, uno de nuestros representantes se pondrá en contacto con usted para finalizar la compra.</p>
    
    </div>
  `);
};

//template para mostrar ventana con mensaje de confirmacion de la compra luego de pulsar el boton "confirmar" del resumen de compras del carrito:
const templateModalDeleteBuy = () => {
  return ($modalDeleteBuyCart.innerHTML = `
    <div class="modal-content">
    
      <span class="close-modal-delete">&times;</span>
      
       <p>Atencion: esta a punto de eliminar su carrito de compras.</p>

       <button class="btn-delete-buy empty-cart delete-cart">
            <span class="text empty-cart delete-cart">Confirmar</span> <i class="icon bx bx-run bx-flashing empty-cart delete-cart"></i>
          </button>
    
    </div>
  `);
};

//funcion que captura y envia al carrito toda la info del producto al que el usuario dio clic en el boton "comprar" de la card
const catchValuesCart = (e) => {
  if (e.target.classList.contains("btn-card")) {
    setCart(e.target.parentElement.parentElement.parentElement);
  }
  e.stopPropagation();
};

//funcion para mostrar mensaje una vez que se agrego el producto al carrito:
const showModalMessageAddProductSucces = (message) => {
  $cartModalSuccesProduct.textContent = message;
  $cartModalSuccesProduct.style.display = "flex";
  $cartModalSuccesProduct.style.alignItems = "center";
  $cartModalSuccesProduct.style.justifyContent = "center";

  // Ocultar el mensaje después de 3 segundos
  setTimeout(() => {
    $cartModalSuccesProduct.style.display = "none";
  }, 3000);
};

//funcion que elimina el carrito y resetea el contador de la burbuja del icono carrito ubicado en la barra de navegacion:
const emptyCart = () => {
  $cartEmpty.style.display = "flex";
  $rowTitleCartItems.style.display = "none";
  $cartItem.style.display = "none";
  $cartTotalValueBuy.style.display = "none";
  $cartBubble.textContent = "0";
  localStorage.removeItem("cart");
};

//funcion que conecta el evento del boton "eliminar" de la seccion "resumen de compras" para posteriormente mostrar modal de "eliminar carrito de compras"
const clearCart = (e) => {
  // console.log(e.target.classList.contains("empty-cart"));
  if (e.target.classList.contains("empty-cart")) {
    // emptyCart(e.target.parentElement.parentElement.parentElement);
    templateModalDeleteBuy();
    deleteBuy();
    // emptyCart();
  }
  // e.stopPropagation();
};

//funcion que elimina el item del producto cargado en carrito cuando su cantidad es cero al presionar el boton "-"
const deleteItemCart = () => {
  const validProducts = Object.values(cartShop).filter(
    (product) => product.quantity > 0
  );
  if (validProducts.length === 0) {
    // Si no hay productos válidos, mostrar carrito vacío
    emptyCart();
  }
};

//funcion que adhiere al carrito cada producto que es comprado por el usuario (tambien maneja ciertos estilos del contenedor de cada producto dentro del carrito)
const addToCart = () => {
  deleteItemCart();
  // console.log(cartShop);
  if (Object.keys(cartShop).length > 0) {
    $cartEmpty.style.display = "none";
    $rowTitleCartItems.innerHTML = `
  <h3>-- Productos Añadidos --</h3>
  `;
    $cartItem.style.display = "grid";
    $cartItem.style.height = "50vh";
    $cartItem.innerHTML = Object.values(cartShop)
      .map((product) => templateAddToCart(product))
      .join("");
    $cartTotalValueBuy.style.display = "flex";
    templateCartProductTotal();
    cartBubbleQuantity();
    saveCartShop();
  } else {
    emptyCart();
  }
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
  showModalMessageAddProductSucces("Se agregó el producto al Carrito");
};

//funcion que adhiere una unidad mas al item de cada producto cargado en el carrito cuando se presiona el boton "+"
const addUnitCartProduct = (e) => {
  // console.log(e.target.classList.contains("cart-product-btn-add"));
  if (e.target.classList.contains("cart-product-btn-add")) {
    // console.log(e.target.dataset.id);
    const product = cartShop[e.target.dataset.id];
    product.quantity++;
    cartShop[e.target.dataset.id] = { ...product };
    addToCart();
    showModalMessageAddProductSucces(
      "Se agregó una unidad del producto al Carrito"
    );
  }
  // e.stopPropagation();
};

//funcion que resta una unidad mas al item de cada producto cargado en el carrito cuando se presiona el boton "-"
const removeUnitCartProduct = (e) => {
  // console.log(e.target.classList.contains("cart-product-btn-add"));
  if (e.target.classList.contains("cart-product-btn-rem")) {
    // console.log(e.target.dataset.id);
    const product = cartShop[e.target.dataset.id];
    product.quantity--;
    // cartShop[e.target.dataset.id] = { ...product };
    if (product.quantity === 0) {
      delete cartShop[e.target.dataset.id];
    }
    localStorage.removeItem("cart");
    addToCart();
    showModalMessageAddProductSucces("Se quito una unidad del producto");
  }
  // e.stopPropagation();
};

//funcion que solicita, a traves de un mensaje, confirmacion para vaciar productos carrito luego de pulsar el boton "eliminar" en el resumen de compras del carrito:
const deleteBuy = (e) => {
  // console.log(e.target.classList.contains("confirm-buy"));
  if (e.target.classList.contains("empty-cart")) {
    // emptyCart(e.target.parentElement.parentElement.parentElement);
    $modalDeleteBuyCart.style.display = "flex";
    templateModalDeleteBuy();
  }
  e.stopPropagation();
};

//funcion que permite volver atras al presionar boton "x" del modal eliminar carrito de compras. Mantiene cargados los productos en el carrito
const closeDeleteBuy = (e) => {
  if (e.target.classList.contains("close-modal-delete")) {
    $modalDeleteBuyCart.style.display = "none";
  }
  e.stopPropagation();
};

//funcion que permite que al presionar boton "Confirmar" del modal para eliminar compra en resumen de compra, cierra al mismo y vacia el carrito
const confirmDeleteBuy = (e) => {
  if (e.target.classList.contains("delete-cart")) {
    $modalDeleteBuyCart.style.display = "none";
    emptyCart();
    cartShop = {};
    // localStorage.removeItem("cart");
  }
  e.stopPropagation();
};

//funcion con la cual al presionar el boton "confirmar" de resumen de compra del carrito, muestra un modal de confirmacion de compra ok
const confirmBuy = (e) => {
  // console.log(e.target.classList.contains("confirm-buy"));
  if (e.target.classList.contains("confirm-buy")) {
    // emptyCart(e.target.parentElement.parentElement.parentElement);
    templateModalConfirmBuy();
    $modalConfirmBuyCart.style.display = "flex";
  }
  e.stopPropagation();
};

//funcion que permite que al presionar la "x" del modal de compra confirmada, cierra al mismo y vacia el carrito
const closeConfirmBuy = (e) => {
  if (e.target.classList.contains("close-modal")) {
    $modalConfirmBuyCart.style.display = "none";
    deleteItemCart();
    emptyCart();
    cartShop = {};
  }
  e.stopPropagation();
};

//?---- CONTENEDOR CARRITO FINAL ----

const init = () => {
  document.addEventListener("DOMContentLoaded", cartInfo);

  document.addEventListener("DOMContentLoaded", fetchData); //para renderizar info de productos apenas termine de cargar el browser

  $cartIcon.addEventListener("click", toggleCart); //para desplegar carrito

  document.addEventListener("DOMContentLoaded", addToCart); //para traer contenedor carrito (vacio o con productos)

  $cardsContainer.addEventListener("click", catchValuesCart); //para escuchar del DOM evento click con la info de cada producto del carrito

  document.addEventListener("click", clearCart); //para eliminar items de productos del carrito de compras

  document.addEventListener("click", addUnitCartProduct); //para adherir items de productos desde el boton "+" del carrito de compras

  document.addEventListener("click", removeUnitCartProduct); //para remover items de productos desde el boton "-" del carrito de compras

  window.addEventListener("click", confirmBuy); //para abrir modal de compra confirmada luego de presionar el boton "confirmar" en resumen de compras del carrito

  window.addEventListener("click", closeConfirmBuy); //para cerrar modal de compra confirmada en resumen de compras del carrito

  window.addEventListener("click", deleteBuy); //para abrir modal de vaciar carrito luego de presionar el boton "eliminar" en resumen de compras del carrito

  window.addEventListener("click", closeDeleteBuy); //para cerrar modal de vaciar carrito luego de presionar el boton "confirmar"

  window.addEventListener("click", confirmDeleteBuy);

  $menuIcon.addEventListener("click", toggleMenu);
};
init();
