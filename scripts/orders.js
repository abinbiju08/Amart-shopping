import { cart, saveToStorage } from '../data/cart.js';
import { products } from '../data/products.js';

function attachBuyAgainEvents() {

  const buyAgainButtons = document.querySelectorAll('.buy-again-button');

  buyAgainButtons.forEach((button) => {

    button.addEventListener('click', () => {

      const productName =
        button.closest('.product-details')
          .querySelector('.product-name').innerText;

      const product = products.find(p => p.name === productName);

      if (!product) return;

     
      let matchingItem;

      cart.forEach((item) => {
        if (item.productId === product.id) {
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

      
      const message = button.querySelector('.buy-again-message');
      message.innerHTML = '✓ Added';

      setTimeout(() => {
        message.innerHTML = 'Add to Cart';
      }, 1500);

    });

  });

}


attachBuyAgainEvents();