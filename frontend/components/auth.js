function LoginPage() {
  return `
    <div id="loginModal" class="modal" style="display: block;">
      <div class="modal-content">
        <div class="modal-header">
          <button class="modal-close" onclick="navigate('home')">&times;</button>
          <h2>Welcome Back!</h2>
        </div>
        <div class="modal-body">
          <form onsubmit="handleLogin(event)">
            <div class="form-group">
              <label for="loginEmail">Email Address</label>
              <input type="email" id="loginEmail" placeholder="Enter your email" required>
            </div>
            <div class="form-group">
              <label for="loginPassword">Password</label>
              <input type="password" id="loginPassword" placeholder="Enter your password" required>
            </div>
            <button type="submit" class="btn btn-primary btn-full">Login</button>
          </form>
        </div>
        <div class="modal-footer">
          <p>Don't have an account? <a href="#" onclick="navigate('register')">Create Account</a></p>
        </div>
      </div>
    </div>
  `;
}

function RegisterPage() {
  return `
    <div id="registerModal" class="modal" style="display: block;">
      <div class="modal-content">
        <div class="modal-header">
          <button class="modal-close" onclick="navigate('home')">&times;</button>
          <h2>Create Account</h2>
        </div>
        <div class="modal-body">
          <form onsubmit="handleRegister(event)">
            <div class="form-group">
              <label for="registerName">Full Name</label>
              <input type="text" id="registerName" placeholder="Enter your name" required>
            </div>
            <div class="form-group">
              <label for="registerEmail">Email Address</label>
              <input type="email" id="registerEmail" placeholder="Enter your email" required>
            </div>
            <div class="form-group">
              <label for="registerPassword">Password</label>
              <input type="password" id="registerPassword" placeholder="Create a password" required minlength="6">
            </div>
            <button type="submit" class="btn btn-primary btn-full">Create Account</button>
          </form>
        </div>
        <div class="modal-footer">
          <p>Already have an account? <a href="#" onclick="navigate('login')">Login</a></p>
        </div>
      </div>
    </div>
  `;
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const btn = e.target.querySelector('button');
  
  btn.innerHTML = '<div class="spinner"></div>';
  btn.disabled = true;
  
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await res.json();
    
    if (res.ok) {
      token = data.session.access_token;
      userRole = data.role;
      localStorage.setItem('token', token);
      localStorage.setItem('role', userRole);
      
      showAlert('Login successful! Welcome back.', 'success');
      
      setTimeout(() => {
        updateNavbar();
        navigate('home');
      }, 1000);
    } else {
      showAlert(data.error || 'Login failed', 'error');
      btn.innerHTML = 'Login';
      btn.disabled = false;
    }
  } catch (error) {
    showAlert('Network error. Please try again.', 'error');
    btn.innerHTML = 'Login';
    btn.disabled = false;
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const btn = e.target.querySelector('button');
  
  if (password.length < 6) {
    showAlert('Password must be at least 6 characters', 'error');
    return;
  }
  
  btn.innerHTML = '<div class="spinner"></div>';
  btn.disabled = true;
  
  try {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    
    const data = await res.json();
    
    if (res.ok) {
      showAlert('Registration successful! Please login.', 'success');
      setTimeout(() => navigate('login'), 1500);
    } else {
      showAlert(data.error || 'Registration failed', 'error');
      btn.innerHTML = 'Create Account';
      btn.disabled = false;
    }
  } catch (error) {
    showAlert('Network error. Please try again.', 'error');
    btn.innerHTML = 'Create Account';
    btn.disabled = false;
  }
}

function showAlert(message, type) {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;
  
  const modalBody = document.querySelector('.modal-body');
  modalBody.insertBefore(alertDiv, modalBody.firstChild);
  
  setTimeout(() => alertDiv.remove(), 5000);
}
