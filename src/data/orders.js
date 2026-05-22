export let orders = JSON.parse(localStorage.getItem('orders')) || [];

export function saveOrders(cart) {

  const newOrder = {
    id: crypto.randomUUID(),
    items: cart,
    date: new Date().toDateString()
  };

  orders.push(newOrder);

  localStorage.setItem('orders', JSON.stringify(orders));
}