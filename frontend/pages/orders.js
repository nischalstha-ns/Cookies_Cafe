function OrdersPage() {
  return `
    <div class="container">
      <h1>My Orders</h1>
      <div id="ordersList"></div>
    </div>
  `;
}

async function loadOrders() {
  const res = await fetch(`${API_URL}/orders`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const orders = await res.json();
  
  if (orders.length === 0) {
    document.getElementById('ordersList').innerHTML = '<p>No orders yet</p>';
    return;
  }
  
  document.getElementById('ordersList').innerHTML = orders.map(order => `
    <div class="card" style="text-align: left; margin-bottom: 1rem;">
      <h3>Order #${order.id.substring(0, 8)}</h3>
      <p>Date: ${new Date(order.created_at).toLocaleDateString()}</p>
      <p>Total: $${order.total_amount}</p>
      <p>Status: <strong>${order.status}</strong></p>
      <h4>Items:</h4>
      ${order.order_items.map(item => `
        <p>- ${item.products.title} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</p>
      `).join('')}
    </div>
  `).join('');
}
