async function loadProducts() {
  try {
    const res = await fetch('/products');
    const products = await res.json();
    
    const productGrid = document.getElementById('productGrid');
    
    if (!products || products.length === 0) {
      productGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No products available</p>';
      return;
    }
    
    productGrid.innerHTML = products.map(product => `
      <div class="product-card">
        <div class="product-image">${product.image_url}</div>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <span class="price">$${product.price}</span>
        <button class="btn-add" onclick="location.href='/product.html?id=${product.id}'">View Details</button>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading products:', error);
    document.getElementById('productGrid').innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Error loading products</p>';
  }
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

window.addEventListener('DOMContentLoaded', loadProducts);
