const API_URL = 'http://localhost:5001/api';
let token = localStorage.getItem('token');
let userRole = localStorage.getItem('role');

function navigate(page) {
  const app = document.getElementById('app');
  
  switch(page) {
    case 'home':
      app.innerHTML = HomePage();
      loadProducts();
      break;
    case 'product':
      app.innerHTML = ProductPage();
      break;
    case 'cart':
      if (!token) return navigate('login');
      app.innerHTML = CartPage();
      loadCart();
      break;
    case 'checkout':
      if (!token) return navigate('login');
      app.innerHTML = CheckoutPage();
      break;
    case 'orders':
      if (!token) return navigate('login');
      app.innerHTML = OrdersPage();
      loadOrders();
      break;
    case 'admin':
      if (userRole !== 'admin') return navigate('home');
      app.innerHTML = AdminPage();
      loadAdminData();
      break;
    case 'login':
      app.innerHTML = LoginPage();
      break;
    case 'register':
      app.innerHTML = RegisterPage();
      break;
    default:
      navigate('home');
  }
}

function updateNavbar() {
  const navbar = document.getElementById('navbar');
  navbar.innerHTML = Navbar();
}

window.onload = () => {
  updateNavbar();
  navigate('home');
};
