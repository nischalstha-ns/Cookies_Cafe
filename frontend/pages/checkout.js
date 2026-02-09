const stripe = Stripe('pk_test_your_stripe_publishable_key');
let cardElement;

function CheckoutPage() {
  return `
    <div class="container">
      <h1>Checkout</h1>
      <div id="checkoutForm">
        <div id="card-element" style="border: 1px solid #ddd; padding: 1rem; border-radius: 5px; margin: 1rem 0;"></div>
        <button onclick="processPayment()" class="btn btn-primary">Pay Now</button>
      </div>
    </div>
  `;
}

setTimeout(() => {
  if (document.getElementById('card-element') && !cardElement) {
    const elements = stripe.elements();
    cardElement = elements.create('card');
    cardElement.mount('#card-element');
  }
}, 100);

async function processPayment() {
  const cartRes = await fetch(`${API_URL}/cart`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const cart = await cartRes.json();
  
  const total = cart.reduce((sum, item) => sum + (item.products.price * item.quantity), 0);
  
  const intentRes = await fetch(`${API_URL}/orders/payment-intent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ amount: total })
  });
  
  const { clientSecret } = await intentRes.json();
  
  const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
    payment_method: { card: cardElement }
  });
  
  if (error) {
    alert(error.message);
    return;
  }
  
  const items = cart.map(item => ({
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.products.price
  }));
  
  const orderRes = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      items,
      total_amount: total,
      payment_id: paymentIntent.id
    })
  });
  
  if (orderRes.ok) {
    alert('Order placed successfully!');
    navigate('orders');
  }
}
