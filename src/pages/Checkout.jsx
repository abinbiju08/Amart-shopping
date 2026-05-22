import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../CartContext';

import '../styles/shared/general.css';
import '../styles/shared/header.css';
import '../styles/pages/checkout/checkout-header.css';
import '../styles/pages/checkout/checkout.css';

// Delivery options config
const DELIVERY_OPTIONS = [
  { id: 'free',    label: 'Tuesday, May 26',   priceCents: 0,   display: 'FREE Shipping' },
  { id: 'medium',  label: 'Wednesday, May 20', priceCents: 499, display: '$4.99 - Shipping' },
  { id: 'fast',    label: 'Monday, May 18',    priceCents: 999, display: '$9.99 - Shipping' },
];

function Checkout() {

  const { cart, updateQuantity, deleteFromCart, placeOrder } = useCart();
  const navigate = useNavigate();

  // FIX 3: track selected delivery option per cart item
  const [deliverySelections, setDeliverySelections] = useState({});

  function getDeliveryOption(cartItemId) {
    return deliverySelections[cartItemId] || 'free';
  }

  function handleDeliveryChange(cartItemId, optionId) {
    setDeliverySelections(prev => ({
      ...prev,
      [cartItemId]: optionId
    }));
  }

  let totalItems = 0;
  let totalPriceCents = 0;
  let totalShippingCents = 0;

  cart.forEach((cartItem) => {
    const matchingProduct = products.find(
      (product) => product.id === cartItem.id
    );
    if (matchingProduct) {
      totalItems += cartItem.quantity;
      totalPriceCents += matchingProduct.priceCents * cartItem.quantity;

      // FIX 3: add selected shipping cost per item
      const selectedOptionId = getDeliveryOption(cartItem.id);
      const selectedOption = DELIVERY_OPTIONS.find(o => o.id === selectedOptionId);
      totalShippingCents += selectedOption ? selectedOption.priceCents : 0;
    }
  });

  const subtotalCents = totalPriceCents + totalShippingCents;
  const taxCents = subtotalCents * 0.1;
  const totalCents = subtotalCents + taxCents;

  function handlePlaceOrder() {
    placeOrder(cart);
    navigate('/orders');
  }

  return (
    <>

      {/* HEADER */}
      <div className="checkout-header">
        <div className="header-content">

          <div className="checkout-header-left-section">
            <Link to="/">
              <img className="logo" src="/images/green-logo.png" alt="logo" />
            </Link>
          </div>

          <div className="checkout-header-middle-section">
            Checkout (
            <Link className="return-to-home-link" to="/">
              {totalItems} items
            </Link>
            )
          </div>

        </div>
      </div>

      {/* MAIN */}
      <div className="main">

        <div className="page-title">Review your order</div>

        <div className="checkout-grid">

          {/* LEFT SIDE */}
          <div className="order-summary">

            {cart.length === 0 && (
              <div style={{ padding: '20px', fontSize: '16px', color: '#555' }}>
                Your cart is empty.{' '}
                <Link to="/" style={{ color: 'rgb(25,135,84)' }}>
                  Continue shopping
                </Link>
              </div>
            )}

            {cart.map((cartItem) => {
              const product = products.find((p) => p.id === cartItem.id);
              if (!product) return null;

              const selectedOptionId = getDeliveryOption(cartItem.id);

              return (
                <div className="cart-item-container" key={cartItem.id}>

                  <div className="delivery-date">
                    Delivery date: Tuesday, May 26
                  </div>

                  <div className="cart-item-details-grid">

                    <img
                      className="product-image"
                      src={product.image}
                      alt={product.name}
                    />

                    <div className="cart-item-details">

                      <div className="product-name">{product.name}</div>

                      <div className="product-price">
                        ${(product.priceCents / 100).toFixed(2)}
                      </div>

                      <div className="product-quantity">
                        Quantity: {cartItem.quantity}

                        <span
                          className="update-quantity-link"
                          onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                          style={{ cursor: 'pointer', marginLeft: '8px' }}
                        >
                          +
                        </span>

                        <span
                          className="update-quantity-link"
                          onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
                          style={{ cursor: 'pointer', marginLeft: '4px' }}
                        >
                          −
                        </span>

                        <span
                          className="delete-quantity-link"
                          onClick={() => deleteFromCart(cartItem.id)}
                          style={{ cursor: 'pointer', marginLeft: '8px' }}
                        >
                          Delete
                        </span>
                      </div>

                    </div>

                    {/* FIX 3: delivery options now update the total */}
                    <div className="delivery-options">

                      <div className="delivery-options-title">
                        Choose a delivery option:
                      </div>

                      {DELIVERY_OPTIONS.map((option) => (
                        <div className="delivery-option" key={option.id}>
                          <input
                            type="radio"
                            className="delivery-option-input"
                            name={`delivery-${cartItem.id}`}
                            checked={selectedOptionId === option.id}
                            onChange={() => handleDeliveryChange(cartItem.id, option.id)}
                          />
                          <div>
                            <div className="delivery-option-date">{option.label}</div>
                            <div className="delivery-option-price">{option.display}</div>
                          </div>
                        </div>
                      ))}

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

          {/* RIGHT SIDE */}
          <div className="payment-summary">

            <div className="payment-summary-title">Payment Summary</div>

            <div className="payment-summary-row">
              <div>Items ({totalItems}):</div>
              <div>${(totalPriceCents / 100).toFixed(2)}</div>
            </div>

            {/* FIX 3: shipping now reflects selected options */}
            <div className="payment-summary-row">
              <div>Shipping & handling:</div>
              <div>
                {totalShippingCents === 0
                  ? 'FREE'
                  : `$${(totalShippingCents / 100).toFixed(2)}`}
              </div>
            </div>

            <div className="payment-summary-row subtotal-row">
              <div>Total before tax:</div>
              <div>${(subtotalCents / 100).toFixed(2)}</div>
            </div>

            <div className="payment-summary-row">
              <div>Estimated tax (10%):</div>
              <div>${(taxCents / 100).toFixed(2)}</div>
            </div>

            <div className="payment-summary-row total-row">
              <div>Order total:</div>
              <div>${(totalCents / 100).toFixed(2)}</div>
            </div>

            <button
              className="place-order-button"
              onClick={handlePlaceOrder}
              disabled={cart.length === 0}
            >
              Place your order
            </button>

            {/* FIX 4: Continue Shopping button */}
            <Link
              to="/"
              style={{
                display: 'block',
                textAlign: 'center',
                marginTop: '12px',
                color: 'rgb(25,135,84)',
                fontSize: '14px',
                textDecoration: 'underline',
                cursor: 'pointer'
              }}
            >
              Continue Shopping
            </Link>

          </div>

        </div>

      </div>

    </>
  );
}

export default Checkout;