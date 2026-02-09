function HomePage() {
  return `
    <div class="container">
      <h1>Our Products</h1>
      <div id="productsList" class="grid"></div>
    </div>
  `;
}

async function loadProducts() {
  const res = await fetch(`${API_URL}/products`);
  const products = await res.json();
  
  document.getElementById('productsList').innerHTML = products.map(p => `
    <div class="card">
      <div>${p.image_url}</div>
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <div class="price">$${p.price}</div>
      <p>Stock: ${p.stock}</p>
      <button onclick="viewProduct('${p.id}')" class="btn btn-secondary">View</button>
      <button onclick="addToCart('${p.id}')" class="btn btn-primary">Add to Cart</button>
    </div>
  `).join('');
}

function viewProduct(id) {
  window.productId = id;
  navigate('product');
  loadProductDetail(id);
}

async function addToCart(productId) {
  if (!token) {
    alert('Please login first');
    return navigate('login');
  }
  
  const res = await fetch(`${API_URL}/cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ product_id: productId, quantity: 1 })
  });
  
  if (res.ok) {
    alert('Added to cart!');
  } else {
    alert('Failed to add to cart');
  }
}
