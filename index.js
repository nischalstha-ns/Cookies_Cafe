const supabase = require('./config/supabase');

async function testConnection() {
  try {
    const { data, error } = await supabase.from('products').select('count');
    
    if (error) throw error;
    
    console.log('✅ Successfully connected to Supabase!');
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    return false;
  }
}

async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true);
  
  if (error) {
    console.error('Error fetching products:', error);
    return null;
  }
  
  return data;
}

async function addToCart(userId, productId, quantity) {
  const { data, error } = await supabase
    .from('cart')
    .upsert({ user_id: userId, product_id: productId, quantity })
    .select();
  
  if (error) {
    console.error('Error adding to cart:', error);
    return null;
  }
  
  return data;
}

async function createOrder(userId, totalAmount, shippingAddress, items) {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({ user_id: userId, total_amount: totalAmount, shipping_address: shippingAddress })
    .select()
    .single();
  
  if (orderError) {
    console.error('Error creating order:', orderError);
    return null;
  }
  
  const orderItems = items.map(item => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price
  }));
  
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);
  
  if (itemsError) {
    console.error('Error creating order items:', itemsError);
    return null;
  }
  
  return order;
}

testConnection();

module.exports = { supabase, getProducts, addToCart, createOrder };
