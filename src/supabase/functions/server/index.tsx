import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Helper function to verify user authentication
async function verifyUser(authHeader: string | null) {
  if (!authHeader) {
    return { error: 'Unauthorized', user: null };
  }
  
  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return { error: 'Unauthorized', user: null };
  }
  
  return { error: null, user };
}

// ============ AUTHENTICATION ============

// Sign up endpoint
app.post("/make-server-70d9165f/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Signup error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Initialize user data
    await kv.set(`user:${data.user.id}:preferences`, {
      darkMode: false,
      notifications: true,
      emailUpdates: true,
    });

    await kv.set(`user:${data.user.id}:rewards`, {
      points: 0,
      badges: [],
      level: 1,
    });

    return c.json({ user: data.user });
  } catch (error) {
    console.log(`Signup error: ${error}`);
    return c.json({ error: 'Signup failed' }, 500);
  }
});

// ============ USER PREFERENCES ============

// Get user preferences
app.get("/make-server-70d9165f/user/preferences", async (c) => {
  const { error: authError, user } = await verifyUser(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const preferences = await kv.get(`user:${user!.id}:preferences`) || {
      darkMode: false,
      notifications: true,
      emailUpdates: true,
    };

    return c.json({ preferences });
  } catch (error) {
    console.log(`Error fetching preferences: ${error}`);
    return c.json({ error: 'Failed to fetch preferences' }, 500);
  }
});

// Save user preferences
app.post("/make-server-70d9165f/user/preferences", async (c) => {
  const { error: authError, user } = await verifyUser(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const preferences = await c.req.json();
    await kv.set(`user:${user!.id}:preferences`, preferences);

    return c.json({ success: true });
  } catch (error) {
    console.log(`Error saving preferences: ${error}`);
    return c.json({ error: 'Failed to save preferences' }, 500);
  }
});

// ============ CART ============

// Get cart
app.get("/make-server-70d9165f/cart", async (c) => {
  const { error: authError, user } = await verifyUser(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const cart = await kv.get(`user:${user!.id}:cart`) || [];
    return c.json({ cart });
  } catch (error) {
    console.log(`Error fetching cart: ${error}`);
    return c.json({ error: 'Failed to fetch cart' }, 500);
  }
});

// Save cart
app.post("/make-server-70d9165f/cart", async (c) => {
  const { error: authError, user } = await verifyUser(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const { cart } = await c.req.json();
    await kv.set(`user:${user!.id}:cart`, cart);

    return c.json({ success: true });
  } catch (error) {
    console.log(`Error saving cart: ${error}`);
    return c.json({ error: 'Failed to save cart' }, 500);
  }
});

// ============ WISHLIST ============

// Get wishlist
app.get("/make-server-70d9165f/wishlist", async (c) => {
  const { error: authError, user } = await verifyUser(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const wishlist = await kv.get(`user:${user!.id}:wishlist`) || [];
    return c.json({ wishlist });
  } catch (error) {
    console.log(`Error fetching wishlist: ${error}`);
    return c.json({ error: 'Failed to fetch wishlist' }, 500);
  }
});

// Save wishlist
app.post("/make-server-70d9165f/wishlist", async (c) => {
  const { error: authError, user } = await verifyUser(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const { wishlist } = await c.req.json();
    await kv.set(`user:${user!.id}:wishlist`, wishlist);

    return c.json({ success: true });
  } catch (error) {
    console.log(`Error saving wishlist: ${error}`);
    return c.json({ error: 'Failed to save wishlist' }, 500);
  }
});

// ============ ORDERS ============

// Create order
app.post("/make-server-70d9165f/orders", async (c) => {
  const { error: authError, user } = await verifyUser(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const orderData = await c.req.json();
    const orderId = `GR-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    
    const order = {
      id: orderId,
      userId: user!.id,
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    await kv.set(`order:${orderId}`, order);

    // Add to user's order history
    const orders = await kv.get(`user:${user!.id}:orders`) || [];
    orders.push(orderId);
    await kv.set(`user:${user!.id}:orders`, orders);

    // Update rewards
    const rewards = await kv.get(`user:${user!.id}:rewards`) || { points: 0, badges: [], level: 1 };
    const pointsEarned = Math.floor(orderData.total / 10); // 1 point per ₹10 spent
    rewards.points += pointsEarned;
    
    // Level up logic
    if (rewards.points >= rewards.level * 100) {
      rewards.level += 1;
    }
    
    await kv.set(`user:${user!.id}:rewards`, rewards);

    // Clear cart after successful order
    await kv.set(`user:${user!.id}:cart`, []);

    return c.json({ order, pointsEarned });
  } catch (error) {
    console.log(`Error creating order: ${error}`);
    return c.json({ error: 'Failed to create order' }, 500);
  }
});

// Get user orders
app.get("/make-server-70d9165f/orders", async (c) => {
  const { error: authError, user } = await verifyUser(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const orderIds = await kv.get(`user:${user!.id}:orders`) || [];
    const orders = await Promise.all(
      orderIds.map((id: string) => kv.get(`order:${id}`))
    );

    return c.json({ orders: orders.filter(Boolean) });
  } catch (error) {
    console.log(`Error fetching orders: ${error}`);
    return c.json({ error: 'Failed to fetch orders' }, 500);
  }
});

// ============ NOTIFICATIONS ============

// Get notifications
app.get("/make-server-70d9165f/notifications", async (c) => {
  const { error: authError, user } = await verifyUser(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const notifications = await kv.get(`user:${user!.id}:notifications`) || [];
    return c.json({ notifications });
  } catch (error) {
    console.log(`Error fetching notifications: ${error}`);
    return c.json({ error: 'Failed to fetch notifications' }, 500);
  }
});

// Save notifications
app.post("/make-server-70d9165f/notifications", async (c) => {
  const { error: authError, user } = await verifyUser(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const { notifications } = await c.req.json();
    await kv.set(`user:${user!.id}:notifications`, notifications);

    return c.json({ success: true });
  } catch (error) {
    console.log(`Error saving notifications: ${error}`);
    return c.json({ error: 'Failed to save notifications' }, 500);
  }
});

// ============ SUBSCRIPTIONS ============

// Get subscriptions
app.get("/make-server-70d9165f/subscriptions", async (c) => {
  const { error: authError, user } = await verifyUser(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const subscriptions = await kv.get(`user:${user!.id}:subscriptions`) || [];
    return c.json({ subscriptions });
  } catch (error) {
    console.log(`Error fetching subscriptions: ${error}`);
    return c.json({ error: 'Failed to fetch subscriptions' }, 500);
  }
});

// Save subscriptions
app.post("/make-server-70d9165f/subscriptions", async (c) => {
  const { error: authError, user } = await verifyUser(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const { subscriptions } = await c.req.json();
    await kv.set(`user:${user!.id}:subscriptions`, subscriptions);

    return c.json({ success: true });
  } catch (error) {
    console.log(`Error saving subscriptions: ${error}`);
    return c.json({ error: 'Failed to save subscriptions' }, 500);
  }
});

// ============ REWARDS & GAMIFICATION ============

// Get rewards
app.get("/make-server-70d9165f/rewards", async (c) => {
  const { error: authError, user } = await verifyUser(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const rewards = await kv.get(`user:${user!.id}:rewards`) || {
      points: 0,
      badges: [],
      level: 1,
    };

    return c.json({ rewards });
  } catch (error) {
    console.log(`Error fetching rewards: ${error}`);
    return c.json({ error: 'Failed to fetch rewards' }, 500);
  }
});

// Update rewards
app.post("/make-server-70d9165f/rewards", async (c) => {
  const { error: authError, user } = await verifyUser(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const rewards = await c.req.json();
    await kv.set(`user:${user!.id}:rewards`, rewards);

    return c.json({ success: true });
  } catch (error) {
    console.log(`Error updating rewards: ${error}`);
    return c.json({ error: 'Failed to update rewards' }, 500);
  }
});

// ============ SEARCH HISTORY ============

// Get recent searches
app.get("/make-server-70d9165f/searches", async (c) => {
  const { error: authError, user } = await verifyUser(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const searches = await kv.get(`user:${user!.id}:searches`) || [];
    return c.json({ searches });
  } catch (error) {
    console.log(`Error fetching searches: ${error}`);
    return c.json({ error: 'Failed to fetch searches' }, 500);
  }
});

// Save recent searches
app.post("/make-server-70d9165f/searches", async (c) => {
  const { error: authError, user } = await verifyUser(c.req.header('Authorization'));
  if (authError) {
    return c.json({ error: authError }, 401);
  }

  try {
    const { searches } = await c.req.json();
    await kv.set(`user:${user!.id}:searches`, searches);

    return c.json({ success: true });
  } catch (error) {
    console.log(`Error saving searches: ${error}`);
    return c.json({ error: 'Failed to save searches' }, 500);
  }
});

// Health check endpoint
app.get("/make-server-70d9165f/health", (c) => {
  return c.json({ status: "ok" });
});

Deno.serve(app.fetch);