require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const supabase = require('./config/supabase');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Auth Routes
app.post('/auth/register', async (req, res) => {
  const { email, password } = req.body;
  
  const { data, error } = await supabase.auth.signUp({ email, password });
  
  if (error) return res.status(400).json({ error: error.message });
  
  res.json({ message: 'Registration successful', user: data.user });
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error) return res.status(400).json({ error: error.message });
  
  res.json({ message: 'Login successful', user: data.user, session: data.session });
});

// Product Routes
app.get('/products', async (req, res) => {
  const { data, error } = await supabase.from('products').select('*');
  
  if (error) return res.status(400).json({ error: error.message });
  
  res.json(data);
});

app.get('/products/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', req.params.id)
    .single();
  
  if (error) return res.status(400).json({ error: error.message });
  
  res.json(data);
});

// Order Routes (Protected)
app.post('/orders', authMiddleware, async (req, res) => {
  const { product_id, quantity } = req.body;
  
  const { data, error } = await supabase
    .from('orders')
    .insert({ user_id: req.user.id, product_id, quantity })
    .select()
    .single();
  
  if (error) return res.status(400).json({ error: error.message });
  
  res.json({ message: 'Order created', order: data });
});

app.get('/orders/my', authMiddleware, async (req, res) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*, products(*)')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false });
  
  if (error) return res.status(400).json({ error: error.message });
  
  res.json(data);
});

// Frontend Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/product.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'product.html'));
});

app.get('/dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
