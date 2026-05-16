import { cart } from '../data/cart.js';
import { products } from '../data/products.js';

function renderCheckout() {

  let checkoutHTML = '';
  let totalItems = 0;
  let totalPriceCents = 0;

  if (cart.length === 0) {

    checkoutHTML = `
      <div class="empty-cart-message">
        <p>Your cart is empty</p>
        <a href="index.html">
          <button class="view-products-button">View Products</button>
        </a>
      </div>
    `;

    document.querySelector('.order-summary').innerHTML = checkoutHTML;

    renderPaymentSummary(0, 0);
    return;
  }

  cart.forEach((cartItem) => {

    const product = products.find(p => p.id === cartItem.productId);

    totalItems += cartItem.quantity;
    totalPriceCents += product.priceCents * cartItem.quantity;

    checkoutHTML += `
      <div class="cart-item-container">

        <div class="cart-item-details-grid">
          <img class="product-image" src="${product.image}">

          <div class="cart-item-details">
            <div class="product-name">${product.name}</div>

            <div class="product-price">
              $${(product.priceCents / 100).toFixed(2)}
            </div>

            <div class="product-quantity">
              Quantity: ${cartItem.quantity}
            </div>
          </div>

        </div>

      </div>
    `;
  });

  document.querySelector('.order-summary').innerHTML = checkoutHTML;

  renderPaymentSummary(totalItems, totalPriceCents);
}

function renderPaymentSummary(totalItems, totalPriceCents) {

  const shippingCents = totalItems > 0 ? 499 : 0;
  const taxCents = totalPriceCents * 0.10;
  const totalCents = totalPriceCents + shippingCents + taxCents;

  const paymentHTML = `
    <div class="payment-summary-title">Payment Summary</div>

    <div class="payment-summary-row">
      <div>Items (${totalItems}):</div>
      <div>$${(totalPriceCents / 100).toFixed(2)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping & handling:</div>
      <div>$${(shippingCents / 100).toFixed(2)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div>$${((totalPriceCents + shippingCents) / 100).toFixed(2)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div>$${(taxCents / 100).toFixed(2)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div>$${(totalCents / 100).toFixed(2)}</div>
    </div>

    <button class="place-order-button button-primary">
      Place your order
    </button>
  `;

  document.querySelector('.payment-summary').innerHTML = paymentHTML;

  
  document.querySelector('.place-order-button')
    .addEventListener('click', () => {
      window.location.href = 'orders.html';
    });
}

renderCheckout();

document.querySelector('.place-order-button')
  .addEventListener('click', () => {

    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    const newOrder = {
      id: crypto.randomUUID(),
      date: new Date().toDateString(),
      items: JSON.parse(JSON.stringify(cart)) 
    };

    orders.push(newOrder);

    localStorage.setItem('orders', JSON.stringify(orders));

    window.location.href = 'orders.html';
  });