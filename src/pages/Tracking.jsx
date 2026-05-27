import { Link, useSearchParams } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../CartContext';

import '../styles/shared/general.css';
import '../styles/shared/header.css';
import '../styles/pages/tracking.css';

function Tracking() {

  const { cart, orders } = useCart();
  const [searchParams] = useSearchParams();

  const orderId = searchParams.get('orderId');
  const productId = searchParams.get('productId');

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const order = orders.find((o) => o.id === orderId);
  const cartItem = order?.items.find((item) => item.id === productId);
  const product = products.find((p) => p.id === productId);

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
      <div className="tracking-page">

        <Link className="back-to-orders-link" to="/orders">
          View all orders
        </Link>

        {!product || !cartItem ? (

          <div style={{ fontSize: '16px', color: '#555' }}>
            Product not found.{' '}
            <Link to="/orders" style={{ color: 'rgb(25,135,84)' }}>
              Back to orders
            </Link>
          </div>

        ) : (
          <>

            <div className="delivery-date">
              Arriving on Tuesday, May 26
            </div>

            <div className="product-info">
              {product.name}
            </div>

            <div className="product-info">
              Quantity: {cartItem.quantity}
            </div>

            <img
              className="product-image"
              src={product.image}
              alt={product.name}
            />

            <div className="progress-labels-container">
              <div className="progress-label">Preparing</div>
              <div className="progress-label current-status">Shipped</div>
              <div className="progress-label">Delivered</div>
            </div>

            <div className="progress-bar-container">
              <div className="progress-bar"></div>
            </div>

          </>
        )}

      </div>

    </>
  );
}

export default Tracking;
