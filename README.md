# 🚀 Quick Start - 3 Steps Only!

## Before You Start

Make sure you have:
- Node.js installed
- Supabase account created

## Step 1: Setup Database (One Time Only)

1. Go to https://supabase.com
2. Create new project
3. Go to SQL Editor
4. Copy and paste everything from `database/complete-schema.sql`
5. Click Run
6. Go to Settings → API → Copy your URL and Key

## Step 2: Add Your Credentials

Open `backend/.env` and add:
```
SUPABASE_URL=your_url_here
SUPABASE_ANON_KEY=your_key_here
STRIPE_SECRET_KEY=sk_test_51xxxxx
```

Get Stripe test key from: https://dashboard.stripe.com/test/apikeys

## Step 3: Run the App

**Windows:**
```
Double-click START.bat
```

**Mac/Linux:**
```bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend
cd frontend
npx serve
```

## Done! 🎉

- Backend: http://localhost:5000
- Frontend: http://localhost:3000 (or port shown)

## First Time Use

1. Click **Register** → Create account
2. Browse products
3. Add to cart
4. Checkout with card: `4242 4242 4242 4242`

## Make Yourself Admin

Go to Supabase SQL Editor and run:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

Then logout and login again. You'll see Admin button!

---

**Need Help?** Check `HOW_TO_RUN.md` for detailed instructions.
