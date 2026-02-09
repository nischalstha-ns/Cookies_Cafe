function ProductPage() {
  return `
    <div class="container">
      <button onclick="navigate('home')" class="btn btn-secondary">← Back</button>
      <div id="productDetail"></div>
    </div>
  `;
}

async function loadProductDetail(id) {
  const res = await fetch(`${API_URL}/products/${id}`);
  const p = await res.json();
  
  document.getElementById('productDetail').innerHTML = `
    <div class="card" style="max-width: 600px; margin: 2rem auto;">
      <div style="font-size: 6rem;">${p.image_url}</div>
      <h2>${p.title}</h2>
      <p>${p.description}</p>
      <div class="price">$${p.price}</div>
      <p>Stock: ${p.stock}</p>
      <input type="number" id="quantity" value="1" min="1" max="${p.stock}" style="width: 100px;">
      <button onclick="addToCartWithQty('${p.id}')" class="btn btn-primary">Add to Cart</button>
    </div>
  `;
}

async function addToCartWithQty(productId) {
  if (!token) {
    alert('Please login first');
    return navigate('login');
  }
  
  const quantity = parseInt(document.getElementById('quantity').value);
  
  const res = await fetch(`${API_URL}/cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ product_id: productId, quantity })
  });
  
  if (res.ok) {
    alert('Added to cart!');
    navigate('cart');
  } else {
    alert('Failed to add to cart');
  }
}
