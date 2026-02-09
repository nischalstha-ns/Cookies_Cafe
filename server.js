require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const supabase = require('./config/supabase');
const authMiddleware = require('./middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 5001;

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

// Auth
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return res.status(400).json({ error: error.message });
    await supabase.from('users').insert({ id: data.user.id, email, role: role || 'customer' });
    res.json({ user: data.user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(400).json({ error: error.message });
    const { data: userData } = await supabase.from('users').select('role').eq('id', data.user.id).single();
    res.json({ user: data.user, session: data.session, role: userData?.role });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Products
app.get('/api/products', async (req, res) => {
  const { data, error } = await supabase.from('products').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.get('/api/products/:id', async (req, res) => {
  const { data, error } = await supabase.from('products').select('*').eq('id', req.params.id).single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post('/api/products', authMiddleware, async (req, res) => {
  const { data: user } = await supabase.from('users').select('role').eq('id', req.user.id).single();
  if (user?.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  const { data, error } = await supabase.from('products').insert(req.body).select();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.put('/api/products/:id', authMiddleware, async (req, res) => {
  const { data: user } = await supabase.from('users').select('role').eq('id', req.user.id).single();
  if (user?.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  const { data, error } = await supabase.from('products').update(req.body).eq('id', req.params.id).select();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.delete('/api/products/:id', authMiddleware, async (req, res) => {
  const { data: user } = await supabase.from('users').select('role').eq('id', req.user.id).single();
  if (user?.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  const { error } = await supabase.from('products').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Deleted' });
});

// Cart
app.get('/api/cart', authMiddleware, async (req, res) => {
  const { data, error } = await supabase.from('cart').select('*, products(*)').eq('user_id', req.user.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post('/api/cart', authMiddleware, async (req, res) => {
  const { product_id, quantity } = req.body;
  const { data, error } = await supabase.from('cart').upsert({ user_id: req.user.id, product_id, quantity }).select();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.delete('/api/cart/:id', authMiddleware, async (req, res) => {
  const { error } = await supabase.from('cart').delete().eq('id', req.params.id).eq('user_id', req.user.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Removed' });
});

// Checkout
app.post('/api/checkout', authMiddleware, async (req, res) => {
  try {
    const { items } = req.body;
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const paymentIntent = await stripe.paymentIntents.create({ amount: Math.round(total * 100), currency: 'usd', metadata: { user_id: req.user.id } });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Orders
app.post('/api/orders', authMiddleware, async (req, res) => {
  try {
    const { items, total, stripe_payment_id, shipping_address } = req.body;
    const { data: order, error } = await supabase.from('orders').insert({ user_id: req.user.id, total, stripe_payment_id, shipping_address, status: 'paid' }).select().single();
    if (error) return res.status(400).json({ error: error.message });
    const orderItems = items.map(item => ({ order_id: order.id, product_id: item.product_id, quantity: item.quantity, price: item.price }));
    await supabase.from('order_items').insert(orderItems);
    await supabase.from('cart').delete().eq('user_id', req.user.id);
    res.json({ order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/orders', authMiddleware, async (req, res) => {
  const { data, error } = await supabase.from('orders').select('*, order_items(*, products(*))').eq('user_id', req.user.id).order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Admin
app.get('/api/admin/orders', authMiddleware, async (req, res) => {
  const { data: user } = await supabase.from('users').select('role').eq('id', req.user.id).single();
  if (user?.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  const { data, error } = await supabase.from('orders').select('*, order_items(*, products(*)), users(email)').order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.put('/api/admin/orders/:id', authMiddleware, async (req, res) => {
  const { data: user } = await supabase.from('users').select('role').eq('id', req.user.id).single();
  if (user?.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  const { status } = req.body;
  const { data, error } = await supabase.from('orders').update({ status }).eq('id', req.params.id).select();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
