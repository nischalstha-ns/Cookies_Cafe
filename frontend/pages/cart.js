function CartPage() {
  return `
    <div class="container">
      <h1>Shopping Cart</h1>
      <div id="cartItems"></div>
      <div style="text-align: right; margin-top: 2rem;">
        <h2>Total: $<span id="cartTotal">0.00</span></h2>
        <button onclick="navigate('checkout')" class="btn btn-primary">Proceed to Checkout</button>
      </div>
    </div>
  `;
}

async function loadCart() {
  const res = await fetch(`${API_URL}/cart`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const cart = await res.json();
  
  if (cart.length === 0) {
    document.getElementById('cartItems').innerHTML = '<p>Your cart is empty</p>';
    return;
  }
  
  const total = cart.reduce((sum, item) => sum + (item.products.price * item.quantity), 0);
  document.getElementById('cartTotal').textContent = total.toFixed(2);
  
  document.getElementById('cartItems').innerHTML = cart.map(item => `
    <div class="card" style="display: flex; justify-content: space-between; align-items: center; text-align: left;">
      <div>
        <h3>${item.products.title}</h3>
        <p>Price: $${item.products.price}</p>
        <p>Quantity: ${item.quantity}</p>
        <p>Subtotal: $${(item.products.price * item.quantity).toFixed(2)}</p>
      </div>
      <button onclick="removeFromCart('${item.id}')" class="btn btn-secondary">Remove</button>
    </div>
  `).join('');
}

async function removeFromCart(id) {
  const res = await fetch(`${API_URL}/cart/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (res.ok) {
    loadCart();
  }
}
