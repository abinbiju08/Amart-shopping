import { useState } from 'react';
import { products } from '../data/products';
import { Link } from 'react-router-dom';
import { useCart } from '../CartContext';

import '../styles/shared/general.css';
import '../styles/shared/header.css';
import '../styles/pages/index.css';

function Home() {

  const { cart, addToCart } = useCart();

  const [addedProductId, setAddedProductId] = useState(null);
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  function handleAddToCart(product) {
    const quantity = selectedQuantities[product.id] || 1;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 2000);
  }

  function handleQuantityChange(productId, value) {
    setSelectedQuantities(prev => ({
      ...prev,
      [productId]: Number(value)
    }));
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.keywords && product.keywords.some(k =>
      k.toLowerCase().includes(searchQuery.toLowerCase())
    ))
  );

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <>

      <div className="header">

        <div className="left-section">
          <Link to="/" className="header-link">
            <img className="logo" src="/images/Main.image.png" alt="logo" />
            <img className="mobile-logo" src="/images/white-mobile-logo.png" alt="mobile logo" />
          </Link>
        </div>

        <div className="middle-section">
          <input
            className="search-bar"
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-button">
            <img className="search-icon" src="/images/icons/search-icon.png" alt="search" />
          </button>
        </div>

        <div className="right-section">

          <Link className="header-link orders-link" to="/orders">
            <span className="orders-text">Orders</span>
          </Link>

          <Link
            className="header-link cart-link" to="/checkout" style={{ position: 'relative' }}>
            <img className="cart-icon" src="/images/icons/cart-icon.png" alt="cart" />
            <div className="cart-quantity">
              {cartCount > 0 ? cartCount : ''}
            </div>
            <div className="cart-text">Cart</div>
          </Link>

        </div>

      </div>

      <div className="home-page">

        {filteredProducts.length === 0 && (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            fontSize: '16px',
            color: '#555'
          }}>
            No products found for "{searchQuery}"
          </div>
        )}

        <div className="products-grid">

          {filteredProducts.map((product) => {

            const isAdded = addedProductId === product.id;

            return (
              <div className="product-container" key={product.id}>

                <div
                  className="product-image-container"
                  style={{
                    width: '100%',
                    height: '220px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '8px'
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                </div>

                <div className="product-name limit-text-to-2-lines">
                  {product.name}
                </div>

                <div className="product-rating-container">
                  <img
                    className="product-rating-stars"
                    src={`/images/ratings/rating-${product.rating.stars * 10}.png`}
                    alt="rating"
                  />
                  <div className="product-rating-count link-primary">
                    {product.rating.count}
                  </div>
                </div>

                <div className="product-price">
                  ${(product.priceCents / 100).toFixed(2)}
                </div>

                <div className="product-quantity-container">
                  <select
                    className="product-quantity"
                    value={selectedQuantities[product.id] || 1}
                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                  >
                    {[1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>

                {}
                <button
                  className="add-to-cart-button button-primary"
                  onClick={() => handleAddToCart(product)}
                  style={{
                    marginTop: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  {isAdded ? (
                    <>
                      <img
                        src="/images/icons/checkmark.png"
                        alt="checkmark"
                        style={{
                          height: '14px',
                          width: '14px',
                          filter: 'brightness(0) invert(1)'
                        }}
                      />
                      Added
                    </>
                  ) : (
                    'Add to Cart'
                  )}
                </button>

              </div>
            );
          })}

        </div>

      </div>

    </>
  );
}

export default Home;
