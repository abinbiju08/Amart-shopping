import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Tracking from './pages/Tracking';

import { CartContext } from './CartContext';

function App() {

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem('orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  function addToCart(product) {
    setCart(prevCart => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      let updatedCart;
      if (existingItem) {
        updatedCart = prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...prevCart, { ...product, quantity: 1 }];
      }
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  }

  function updateQuantity(productId, newQuantity) {
    setCart(prevCart => {
      let updatedCart;
      if (newQuantity <= 0) {
        updatedCart = prevCart.filter((item) => item.id !== productId);
      } else {
        updatedCart = prevCart.map((item) =>
          item.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  }

  function deleteFromCart(productId) {
    setCart(prevCart => {
      const updatedCart = prevCart.filter((item) => item.id !== productId);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  }

  function placeOrder(cartItems) {
    const newOrder = {
      id: crypto.randomUUID(),
      date: new Date().toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
      }),
      items: cartItems,
      totalCents: cartItems.reduce((sum, item) => sum + item.priceCents * item.quantity, 0)
    };

    setOrders(prevOrders => {
      const updatedOrders = [newOrder, ...prevOrders];
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      return updatedOrders;
    });

    setCart([]);
    localStorage.removeItem('cart');
  }

  return (
    <CartContext.Provider value={{
      cart, orders, addToCart, updateQuantity, deleteFromCart, placeOrder
    }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/tracking" element={<Tracking />} />
        </Routes>
      </BrowserRouter>
    </CartContext.Provider>
  );
}

export default App;