function AdminPage() {
  return `
    <div class="container">
      <h1>Admin Dashboard</h1>
      
      <h2>Manage Products</h2>
      <button onclick="showAddProductForm()" class="btn btn-primary">Add New Product</button>
      <div id="adminProducts" class="grid"></div>
      
      <h2 style="margin-top: 3rem;">Manage Orders</h2>
      <div id="adminOrders"></div>
      
      <div id="productFormModal" class="modal">
        <div class="modal-content">
          <h2>Add Product</h2>
          <input type="text" id="prodTitle" placeholder="Title">
          <textarea id="prodDesc" placeholder="Description"></textarea>
          <input type="number" id="prodPrice" placeholder="Price" step="0.01">
          <input type="number" id="prodStock" placeholder="Stock">
          <input type="text" id="prodImage" placeholder="Image URL">
          <button onclick="saveProduct()" class="btn btn-primary">Save</button>
          <button onclick="closeProductForm()" class="btn btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  `;
}

async function loadAdminData() {
  await loadAdminProducts();
  await loadAdminOrders();
}

async function loadAdminProducts() {
  const res = await fetch(`${API_URL}/products`);
  const products = await res.json();
  
  document.getElementById('adminProducts').innerHTML = products.map(p => `
    <div class="card">
      <div>${p.image_url}</div>
      <h3>${p.title}</h3>
      <p>Price: $${p.price}</p>
      <p>Stock: ${p.stock}</p>
      <button onclick="deleteProduct('${p.id}')" class="btn btn-secondary">Delete</button>
    </div>
  `).join('');
}

async function loadAdminOrders() {
  const res = await fetch(`${API_URL}/orders/admin/all`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const orders = await res.json();
  
  document.getElementById('adminOrders').innerHTML = `
    <table>
      <tr>
        <th>Order ID</th>
        <th>User</th>
        <th>Total</th>
        <th>Status</th>
        <th>Action</th>
      </tr>
      ${orders.map(o => `
        <tr>
          <td>${o.id.substring(0, 8)}</td>
          <td>${o.users?.email || 'N/A'}</td>
          <td>$${o.total_amount}</td>
          <td>${o.status}</td>
          <td>
            <select onchange="updateOrderStatus('${o.id}', this.value)">
              <option value="">Change Status</option>
              <option value="paid">Paid</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </td>
        </tr>
      `).join('')}
    </table>
  `;
}

function showAddProductForm() {
  document.getElementById('productFormModal').style.display = 'block';
}

function closeProductForm() {
  document.getElementById('productFormModal').style.display = 'none';
}

async function saveProduct() {
  const product = {
    title: document.getElementById('prodTitle').value,
    description: document.getElementById('prodDesc').value,
    price: parseFloat(document.getElementById('prodPrice').value),
    stock: parseInt(document.getElementById('prodStock').value),
    image_url: document.getElementById('prodImage').value
  };
  
  const res = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(product)
  });
  
  if (res.ok) {
    alert('Product added!');
    closeProductForm();
    loadAdminProducts();
  }
}

async function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (res.ok) {
    loadAdminProducts();
  }
}

async function updateOrderStatus(id, status) {
  if (!status) return;
  
  const res = await fetch(`${API_URL}/orders/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });
  
  if (res.ok) {
    loadAdminOrders();
  }
}
