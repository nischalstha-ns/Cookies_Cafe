# Supabase E-commerce Setup Guide

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - Project name: `cookies-cafe`
   - Database password: (create a strong password)
   - Region: (choose closest to you)
5. Click "Create new project" and wait for setup to complete

## Step 2: Get Your Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (under Project URL)
   - **anon/public key** (under Project API keys)

## Step 3: Configure Your Project

1. Create a `.env` file in the project root:
   ```bash
   copy .env.example .env
   ```

2. Open `.env` and add your credentials:
   ```
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 4: Create Database Tables

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire content from `database/schema.sql`
4. Paste it into the SQL editor
5. Click "Run" to execute

## Step 5: Install Dependencies

```bash
npm install
```

## Step 6: Test Connection

```bash
npm start
```

You should see: `✅ Successfully connected to Supabase!`

## Database Structure

### Tables Created:
- **profiles** - User profile information
- **categories** - Product categories
- **products** - Product catalog
- **cart** - Shopping cart items
- **orders** - Customer orders
- **order_items** - Individual items in orders

## Usage Examples

### Fetch Products
```javascript
const { getProducts } = require('./index');

const products = await getProducts();
console.log(products);
```

### Add to Cart
```javascript
const { addToCart } = require('./index');

await addToCart(userId, productId, 2);
```

### Create Order
```javascript
const { createOrder } = require('./index');

const items = [
  { product_id: 'uuid', quantity: 2, price: 10.99 }
];

await createOrder(userId, 21.98, '123 Main St', items);
```

## Authentication (Optional)

To enable user authentication:

```javascript
const supabase = require('./config/supabase');

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});

// Get current user
const { data: { user } } = await supabase.auth.getUser();
```

## Next Steps

1. Add sample data to your tables via Supabase dashboard
2. Build your API endpoints using Express.js
3. Implement authentication flows
4. Create frontend to interact with the database

## Troubleshooting

- **Connection failed**: Check your `.env` credentials
- **RLS errors**: Ensure you're authenticated or adjust RLS policies
- **Table not found**: Make sure you ran the schema.sql file

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
