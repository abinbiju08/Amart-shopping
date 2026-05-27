import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../CartContext';

import '../styles/shared/general.css';
import '../styles/shared/header.css';
import '../styles/pages/orders.css';

function Orders() {

  const { cart, orders, addToCart } = useCart();
  const navigate = useNavigate();
  
  const [addedKey, setAddedKey] = useState(null);

  function handleAddToCart(product, orderId) {
    addToCart(product);
    const key = `${orderId}-${product.id}`;
    setAddedKey(key);
    setTimeout(() => setAddedKey(null), 2000);
  }

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <>

      {}
      <div className="header">

        <div className="left-section">
          <Link to="/" className="header-link">
            <img className="logo" src="/images/Main.image.png" alt="logo" />
          </Link>
        </div>

        <div className="middle-section">
          <input className="search-bar" type="text" placeholder="Search" />
          <button className="search-button">
            <img className="search-icon" src="/images/icons/search-icon.png" alt="search" />
          </button>
        </div>

        <div className="right-section">
          <Link className="orders-link header-link" to="/orders">
            <span className="orders-text">Orders</span>
          </Link>
          <Link className="cart-link header-link" to="/checkout" style={{ position: 'relative' }}>
            <img className="cart-icon" src="/images/icons/cart-icon.png" alt="cart" />
            <div className="cart-quantity">
              {cartCount > 0 ? cartCount : ''}
            </div>
            <div className="cart-text">Cart</div>
          </Link>
        </div>

      </div>

      {}
      <div className="main">

        <div className="page-title">Your Orders</div>

        {orders.length === 0 && (
          <div style={{ padding: '40px 20px', fontSize: '16px', color: '#555' }}>
            No orders yet.{' '}
            <Link to="/" style={{ color: 'rgb(25,135,84)' }}>
              Start shopping
            </Link>
          </div>
        )}

        <div className="orders-grid">

          {orders.map((order) => {

            const orderTotal = order.totalCents * 1.1;

            return (
              <div className="order-container" key={order.id}>

                <div className="order-header">
                  <div className="order-header-left-section">
                    <div className="order-date">
                      <div className="order-header-label">Order Placed:</div>
                      <div>{order.date}</div>
                    </div>
                    <div className="order-total">
                      <div className="order-header-label">Total:</div>
                      <div>${(orderTotal / 100).toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="order-header-right-section">
                    <div className="order-header-label">Order ID:</div>
                    <div>{order.id}</div>
                  </div>
                </div>

                {order.items.map((cartItem) => {

                  const product = products.find((p) => p.id === cartItem.id);
                  if (!product) return null;
                
                  const itemKey = `${order.id}-${product.id}`;
                  const isAdded = addedKey === itemKey;

                  return (
                    <div className="order-details-grid" key={cartItem.id}>

                      <div className="product-image-container">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="product-image"
                        />
                      </div>

                      <div className="product-details">

                        <div className="product-name">{product.name}</div>

                        <div className="product-delivery-date">
                          Arriving on: May 26
                        </div>

                        <div className="product-quantity">
                          Quantity: {cartItem.quantity}
                        </div>

                        {}
                        <button
                          className="buy-again-button button-primary"
                          onClick={() => handleAddToCart(product, order.id)}
                          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          {isAdded ? (
                            <>
                              <img
                                src="/images/icons/checkmark.png"
                                alt="checkmark"
                                style={{ height: '14px', width: '14px', filter: 'brightness(0) invert(1)' }}
                              />
                              <span className="buy-again-message">Added</span>
                            </>
                          ) : (
                            <>
                              <img
                                className="buy-again-icon"
                                src="/images/icons/buy-again.png"
                                alt="buy again"
                              />
                              <span className="buy-again-message">Add to Cart</span>
                            </>
                          )}
                        </button>

                      </div>

                      <div className="product-actions">
                        <button
                          className="track-package-button"
                          onClick={() => navigate(
                            `/tracking?orderId=${order.id}&productId=${cartItem.id}`
                          )}
                        >
                          Track package
                        </button>
                      </div>

                    </div>
                  );
                })}

              </div>
            );
          })}

        </div>

      </div>

    </>
  );
}

export default Orders;
