# 🍪 Cookies Cafe - Supabase Connection Guide

## ✅ Current Configuration

**Backend Port:** 5001  
**Frontend Port:** 3000  
**Supabase Project:** Already connected to `wvhpilzjtnknuaybqliv.supabase.co`

---

## 📋 Step-by-Step Setup

### 1️⃣ Verify Supabase Connection

Your Supabase is already configured! Check your credentials:

**File:** `backend/.env`
```
PORT=5001
SUPABASE_URL=https://wvhpilzjtnknuaybqliv.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
STRIPE_SECRET_KEY=sk_test_51Syv39KZZD8bWla06Ss5e9JNGNipfuvZiSStJy9wFE7ozXoloHgncntlkBmqrks9X58GLUnyR4qHsiBdpGxODXEJ00QQuia96u
```

### 2️⃣ Setup Database Schema

1. Go to: https://supabase.com/dashboard/project/wvhpilzjtnknuaybqliv
2. Click **SQL Editor** (left sidebar)
3. Open file: `database/complete-schema.sql`
4. Copy ALL content
5. Paste in SQL Editor
6. Click **Run** button
7. Wait for "Success" message

### 3️⃣ Verify Tables Created

In Supabase Dashboard:
1. Click **Table Editor**
2. You should see these tables:
   - ✅ users
   - ✅ products
   - ✅ cart
   - ✅ orders
   - ✅ order_items

### 4️⃣ Run the Application

**Option A - Windows (Easy):**
```
Double-click START.bat
```

**Option B - Manual:**
```bash
# Terminal 1 - Backend
npm install
npm start

# Terminal 2 - Frontend
cd frontend
npx serve -p 3000
```

---

## 🌐 Access Your App

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5001/api
- **Supabase Dashboard:** https://supabase.com/dashboard/project/wvhpilzjtnknuaybqliv

---

## 🔧 Environment Variables Explained

### Backend (.env)
- `PORT=5001` → Backend server port
- `SUPABASE_URL` → Your Supabase project URL
- `SUPABASE_ANON_KEY` → Public API key (safe for frontend)
- `STRIPE_SECRET_KEY` → Payment processing (test mode)

### Frontend (app.js)
- `API_URL` → Points to backend: `http://localhost:5001/api`

---

## 🧪 Test the Connection

### Test 1: Backend Health
Open browser: http://localhost:5001/api/products

**Expected:** JSON array (empty or with products)

### Test 2: Frontend Connection
1. Open: http://localhost:3000
2. Click **Register**
3. Create account
4. If successful → ✅ Connected!

---

## 👤 Make Yourself Admin

After registering, run this in Supabase SQL Editor:

```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'your@email.com';
```

Then logout and login again. You'll see the **Admin** button!

---

## 🎨 Customize for "Cookies Cafe"

### Update Branding
Edit `frontend/index.html`:
```html
<title>Cookies Cafe - Delicious Homemade Cookies</title>
```

### Add Sample Products
Run in Supabase SQL Editor:
```sql
INSERT INTO products (name, description, price, image_url, stock) VALUES
('Chocolate Chip', 'Classic chocolate chip cookies', 12.99, 'https://example.com/choc.jpg', 100),
('Oatmeal Raisin', 'Healthy oatmeal cookies', 10.99, 'https://example.com/oat.jpg', 80),
('Double Chocolate', 'Extra chocolatey cookies', 14.99, 'https://example.com/double.jpg', 60);
```

---

## 🚨 Troubleshooting

### Error: "Missing Supabase environment variables"
- Check `backend/.env` exists
- Verify SUPABASE_URL and SUPABASE_ANON_KEY are set

### Error: "Port 5001 already in use"
- Change PORT in `backend/.env` to 5002
- Update `frontend/app.js` API_URL to match

### Frontend can't connect to backend
- Verify backend is running: http://localhost:5001/api/products
- Check browser console for CORS errors
- Ensure both servers are running

---

## 📞 Quick Reference

| Component | Port | URL |
|-----------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend | 5001 | http://localhost:5001 |
| Supabase | - | https://wvhpilzjtnknuaybqliv.supabase.co |

---

**🎉 You're all set! Your Cookies Cafe is ready to serve delicious cookies online!**
