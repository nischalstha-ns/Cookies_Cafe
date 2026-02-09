function showRegister() {
  document.getElementById('loginForm').classList.add('hidden');
  document.getElementById('registerForm').classList.remove('hidden');
  clearMessage();
}

function showLogin() {
  document.getElementById('registerForm').classList.add('hidden');
  document.getElementById('loginForm').classList.remove('hidden');
  clearMessage();
}

function showMessage(message, isError = false) {
  const messageDiv = document.getElementById('message');
  messageDiv.textContent = message;
  messageDiv.className = isError ? 'error' : 'success';
  setTimeout(() => clearMessage(), 5000);
}

function clearMessage() {
  document.getElementById('message').textContent = '';
  document.getElementById('message').className = '';
}

async function handleRegister(event) {
  event.preventDefault();
  
  const fullName = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      showMessage('Registration successful! Please login.');
      setTimeout(() => showLogin(), 2000);
    } else {
      showMessage(data.error, true);
    }
  } catch (error) {
    showMessage('Registration failed', true);
  }
}

async function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('session', JSON.stringify(data.session));
      showDashboard(data.user);
    } else {
      showMessage(data.error, true);
    }
  } catch (error) {
    showMessage('Login failed', true);
  }
}

async function handleLogout() {
  try {
    await fetch('/api/logout', { method: 'POST' });
    localStorage.removeItem('session');
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
    showMessage('Logged out successfully');
  } catch (error) {
    showMessage('Logout failed', true);
  }
}

function showDashboard(user) {
  document.getElementById('loginForm').classList.add('hidden');
  document.getElementById('registerForm').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
  document.getElementById('userName').textContent = user.user_metadata?.full_name || 'User';
  document.getElementById('userEmail').textContent = user.email;
}

window.onload = () => {
  const session = localStorage.getItem('session');
  if (session) {
    const sessionData = JSON.parse(session);
    if (sessionData.user) {
      showDashboard(sessionData.user);
    }
  }
};
