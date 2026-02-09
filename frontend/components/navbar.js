function Navbar() {
  return `
    <h1 onclick="navigate('home')" style="cursor: pointer;">🍪 Cookies Cafe</h1>
    <div>
      <button onclick="navigate('home')">Home</button>
      ${token ? `
        <button onclick="navigate('cart')">Cart <span class="badge" id="cartBadge">0</span></button>
        <button onclick="navigate('orders')">Orders</button>
        ${userRole === 'admin' ? '<button onclick="navigate(\'admin\')">Admin</button>' : ''}
        <button onclick="logout()">Logout</button>
      ` : `
        <button onclick="showLoginModal()">Login</button>
        <button onclick="showRegisterModal()">Register</button>
      `}
    </div>
  `;
}

function showLoginModal() {
  navigate('login');
}

function showRegisterModal() {
  navigate('register');
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  token = null;
  userRole = null;
  updateNavbar();
  navigate('home');
  showAlert('Logged out successfully', 'success');
}
