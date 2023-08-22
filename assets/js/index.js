document.addEventListener("DOMContentLoaded", () => {
  fetchData();
});

//conexion a base de datos de productos: "data.json"
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

//conexion con los elementos del DOM:
const cardsContainer = document.querySelector(".product-cards-container"); //contenedor de cards
console.log(cardsContainer);

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
              <button class="btn-card button">Comprar</button>
            </div>
          </div>
        </div>
      `;
};

const renderCardProducts = (data) => {
  return (cardsContainer.innerHTML = data
    .map((product) => templateCardProduct(product))
    .join(""));
};

const init = () => {
  cardsContainer.addEventListener("DOMContentLoaded", renderCardProducts);
};
