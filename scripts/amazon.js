import { products } from '../data/products.js';
import { cart, saveToStorage } from '../data/cart.js';



function renderProducts(productsToRender) {

  let productsHTML = '';

  productsToRender.forEach((product) => {

    productsHTML += `
      <div class="product-container">

        <div class="product-image-container">
          <img class="product-image"
            src="${product.image}">
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars"
            src="images/ratings/rating-${product.rating.stars * 10}.png">

          <div class="product-rating-count link-primary">
            ${product.rating.count}
          </div>
        </div>

        <div class="product-price">
          $${(product.priceCents / 100).toFixed(2)}
        </div>

        <div class="added-to-cart">
          <img src="images/icons/checkmark.png">
          Added
        </div>

        <button class="add-to-cart-button button-primary">
          Add to Cart
        </button>

      </div>
    `;
  });

  document.querySelector('.products-grid').innerHTML = productsHTML;

  const addToCartButtons =
    document.querySelectorAll('.add-to-cart-button');

  addToCartButtons.forEach((button, index) => {

    button.addEventListener('click', () => {

      const product = productsToRender[index];

      let matchingItem;

      cart.forEach((item) => {

        if (product.id === item.productId) {
          matchingItem = item;
        }

      });

      if (matchingItem) {

        matchingItem.quantity += 1;

      } else {

        cart.push({
          productId: product.id,
          quantity: 1
        });

      }

      saveToStorage();

      updateCartQuantity();

      const productContainer = button.parentElement;

      const addedMessage =
        productContainer.querySelector('.added-to-cart');

      addedMessage.classList.add('visible');

      setTimeout(() => {

        addedMessage.classList.remove('visible');

      }, 2000);

    });

  });

}

function updateCartQuantity() {

  let cartQuantity = 0;

  cart.forEach((item) => {

    cartQuantity += item.quantity;

  });

  document.querySelector('.cart-quantity').innerHTML =
    cartQuantity;
}

renderProducts(products);

updateCartQuantity();

const searchBar = document.querySelector('.search-bar');

searchBar.addEventListener('input', () => {

  const searchText = searchBar.value.toLowerCase();

  const filteredProducts = products.filter((product) => {

    return product.name.toLowerCase().includes(searchText);

  });

  renderProducts(filteredProducts);

});