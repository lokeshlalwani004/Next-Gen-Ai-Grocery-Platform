import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AIAssistant } from './components/AIAssistant';
import { PersonalDashboard } from './components/PersonalDashboard';
import { ProductCard } from './components/ProductCard';
import { ProductQuickView } from './components/ProductQuickView';
import { ShoppingCart } from './components/ShoppingCart';
import { WishlistPanel } from './components/WishlistPanel';
import { NotificationPanel } from './components/NotificationPanel';
import { DeliveryTracking } from './components/DeliveryTracking';
import { VirtualStore } from './components/VirtualStore';
import { SubscriptionManager } from './components/SubscriptionManager';
import { ExpressCheckout } from './components/ExpressCheckout';
import { PriceComparison } from './components/PriceComparison';
import { VoiceSearch } from './components/VoiceSearch';
import { FilterPanel, FilterOptions } from './components/FilterPanel';
import { AuthDialog } from './components/AuthDialog';
import { ProfileSettings } from './components/ProfileSettings';
import { MealPlan } from './components/MealPlan';
import { QuickReorder } from './components/QuickReorder';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { toast } from 'sonner@2.0.3';
import { Toaster } from './components/ui/sonner';
import { 
  ShoppingBag, 
  Truck, 
  Calendar, 
  TrendingUp, 
  Zap,
  Filter,
  SlidersHorizontal,
  Sparkles,
  Search,
  X
} from 'lucide-react';
import { supabase } from './utils/supabase/client';
import { api } from './utils/api';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  inStock: boolean;
  organic?: boolean;
  aiRecommended?: boolean;
  flashSale?: boolean;
  discount?: number;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  inStock: boolean;
}

export default function App() {
  // Authentication state
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);
  
  // UI state
  const [darkMode, setDarkMode] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAIRecommended, setShowAIRecommended] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isVoiceSearchOpen, setIsVoiceSearchOpen] = useState(false);
  const [isExpressCheckoutOpen, setIsExpressCheckoutOpen] = useState(false);
  const [priceComparisonProduct, setPriceComparisonProduct] = useState<Product | null>(null);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [isMealPlanOpen, setIsMealPlanOpen] = useState(false);
  const [isQuickReorderOpen, setIsQuickReorderOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('shop');
  const [trackedOrderId, setTrackedOrderId] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 3000],
    minRating: 0,
    inStockOnly: false,
    organicOnly: false,
    flashSaleOnly: false,
    minDiscount: 0,
    sortBy: 'none',
  });
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'order' as const,
      title: 'Order Delivered!',
      message: 'Your order #GR-2024-10041 has been delivered successfully.',
      time: '5 mins ago',
      read: false,
      actionable: true,
      orderId: 'GR-2024-10041',
    },
    {
      id: '2',
      type: 'price-drop' as const,
      title: 'Price Drop Alert! 📉',
      message: 'Organic Fresh Tomatoes from your wishlist is now ₹399 (was ₹549)',
      time: '1 hour ago',
      read: false,
      actionable: true,
      productId: '1',
      productName: 'Organic Fresh Tomatoes',
      productPrice: 399,
    },
    {
      id: '3',
      type: 'deal' as const,
      title: 'Flash Sale Active! ⚡',
      message: 'Get 30% off on all dairy products. Valid for next 2 hours!',
      time: '2 hours ago',
      read: false,
      actionable: true,
    },
    {
      id: '4',
      type: 'reward' as const,
      title: 'New Badge Unlocked! 🏆',
      message: 'Congratulations! You\'ve earned the "Eco Warrior" badge for buying organic.',
      time: '3 hours ago',
      read: true,
    },
    {
      id: '5',
      type: 'order' as const,
      title: 'Order In Transit! 🚚',
      message: 'Your order #GR-2024-10042 is on the way. ETA: 15 minutes',
      time: '5 hours ago',
      read: false,
      actionable: true,
      orderId: 'GR-2024-10042',
    },
    {
      id: '6',
      type: 'ai-suggestion' as const,
      title: 'AI Smart Suggestion 🤖',
      message: 'Based on your purchase history, you might need Fresh Organic Milk (1L). Add to cart?',
      time: '1 day ago',
      read: false,
      actionable: true,
      productId: 'dairy-2',
      productName: 'Fresh Organic Milk (1L)',
      productPrice: 189,
    },
    {
      id: '7',
      type: 'ai-suggestion' as const,
      title: 'Smart Fridge Alert 🧊',
      message: 'You\'re running low on Premium Red Apples based on your consumption pattern. Stock up now!',
      time: '2 days ago',
      read: false,
      actionable: true,
      productId: 'fruit-2',
      productName: 'Premium Red Apples',
      productPrice: 299,
    },
    {
      id: '8',
      type: 'price-drop' as const,
      title: 'Great Deal Alert! 💰',
      message: 'Sweet Alphonso Mangoes dropped to ₹599 (was ₹799) - Save 25%!',
      time: '3 days ago',
      read: true,
      actionable: true,
      productId: 'fruit-5',
      productName: 'Sweet Alphonso Mangoes',
      productPrice: 599,
    },
  ]);

  // Order Tracking Data
  const [orders] = useState([
    {
      orderId: 'GR-2024-10041',
      status: 'delivered' as const,
      estimatedTime: 'Delivered',
      driverName: 'Lucky Lalwani',
      items: ['Fresh Organic Milk', 'Eggs', 'Bread'],
      total: 450,
    },
    {
      orderId: 'GR-2024-10042',
      status: 'in-transit' as const,
      estimatedTime: '15 mins',
      driverName: 'Lucky Lalwani',
      items: ['Organic Tomatoes', 'Potatoes', 'Onions'],
      total: 680,
    },
    {
      orderId: 'GR-2024-10043',
      status: 'packed' as const,
      estimatedTime: '30 mins',
      driverName: 'Lucky Lalwani',
      items: ['Apples', 'Bananas', 'Oranges'],
      total: 520,
    },
  ]);

  // Mock Products Data (Prices in Indian Rupees)
  const products: Product[] = [
    // VEGETABLES
    {
      id: '1',
      name: 'Organic Fresh Tomatoes',
      price: 399,
      originalPrice: 549,
      image: 'https://images.unsplash.com/photo-1748342319942-223b99937d4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBtYXJrZXR8ZW58MXx8fHwxNzU5NDgxNjY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Vegetables',
      rating: 4.8,
      inStock: true,
      organic: true,
      aiRecommended: true,
      discount: 29,
    },
    {
      id: 'veg-2',
      name: 'Fresh Organic Carrots',
      price: 199,
      originalPrice: 259,
      image: 'https://images.unsplash.com/photo-1603462903957-566630607cc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGNhcnJvdHMlMjB2ZWdldGFibGVzfGVufDF8fHx8MTc1OTQ2NTUwMXww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Vegetables',
      rating: 4.7,
      inStock: true,
      organic: true,
      discount: 23,
    },
    {
      id: 'veg-3',
      name: 'Premium Potatoes (1kg)',
      price: 149,
      image: 'https://images.unsplash.com/photo-1659738538929-715b764d59f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3RhdG9lcyUyMG9yZ2FuaWN8ZW58MXx8fHwxNzU5NTU4MTYxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Vegetables',
      rating: 4.5,
      inStock: true,
      aiRecommended: true,
    },
    {
      id: 'veg-4',
      name: 'Fresh Red Onions',
      price: 179,
      originalPrice: 229,
      image: 'https://images.unsplash.com/photo-1621295213070-e7c9c89972af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMG9uaW9uc3xlbnwxfHx8fDE3NTk1NTgxNjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Vegetables',
      rating: 4.6,
      inStock: true,
      flashSale: true,
      discount: 22,
    },
    {
      id: 'veg-5',
      name: 'Colorful Bell Peppers',
      price: 349,
      originalPrice: 449,
      image: 'https://images.unsplash.com/photo-1509377244-b9820f59c12f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWxsJTIwcGVwcGVycyUyMGNvbG9yZnVsfGVufDF8fHx8MTc1OTU1NjU5N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Vegetables',
      rating: 4.8,
      inStock: true,
      organic: true,
      aiRecommended: true,
      discount: 22,
    },
    {
      id: 'veg-6',
      name: 'Fresh Spinach Bunch',
      price: 129,
      image: 'https://images.unsplash.com/photo-1683536905403-ea18a3176d29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNwaW5hY2h8ZW58MXx8fHwxNzU5NDc1NjA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Vegetables',
      rating: 4.7,
      inStock: true,
      organic: true,
    },
    {
      id: 'veg-7',
      name: 'Organic Broccoli',
      price: 249,
      originalPrice: 329,
      image: 'https://images.unsplash.com/photo-1757332334626-8dadb145540d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm9jY29saSUyMGZyZXNofGVufDF8fHx8MTc1OTU1ODE2NHww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Vegetables',
      rating: 4.9,
      inStock: true,
      organic: true,
      flashSale: true,
      discount: 24,
    },
    {
      id: 'veg-8',
      name: 'Fresh Cauliflower',
      price: 189,
      image: 'https://images.unsplash.com/photo-1569737270187-e250e9a02407?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXVsaWZsb3dlciUyMHZlZ2V0YWJsZXxlbnwxfHx8fDE3NTk1NTgxNjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Vegetables',
      rating: 4.6,
      inStock: true,
    },
    {
      id: 'veg-9',
      name: 'Fresh Green Beans',
      price: 159,
      originalPrice: 199,
      image: 'https://images.unsplash.com/photo-1574963835594-61eede2070dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGJlYW5zfGVufDF8fHx8MTc1OTU1ODE2NHww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Vegetables',
      rating: 4.5,
      inStock: true,
      discount: 20,
    },

    // FRUITS
    {
      id: '2',
      name: 'Fresh Mixed Fruits Bowl',
      price: 699,
      originalPrice: 899,
      image: 'https://images.unsplash.com/photo-1725208961001-d6335cd7bfdc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZydWl0cyUyMGdyb2Nlcnl8ZW58MXx8fHwxNzU5NTE4MTcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Fruits',
      rating: 4.9,
      inStock: true,
      organic: true,
      flashSale: true,
      aiRecommended: true,
      discount: 25,
    },
    {
      id: 'fruit-2',
      name: 'Premium Red Apples',
      price: 299,
      originalPrice: 399,
      image: 'https://images.unsplash.com/photo-1623815242959-fb20354f9b8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGFwcGxlcyUyMHJlZHxlbnwxfHx8fDE3NTk1NTgxNjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Fruits',
      rating: 4.8,
      inStock: true,
      organic: true,
      discount: 25,
    },
    {
      id: 'fruit-3',
      name: 'Fresh Banana Bunch',
      price: 149,
      image: 'https://images.unsplash.com/photo-1668548205409-244bd9250b78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5hbmFzJTIwYnVuY2h8ZW58MXx8fHwxNzU5NTU4MTY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Fruits',
      rating: 4.7,
      inStock: true,
      aiRecommended: true,
    },
    {
      id: 'fruit-4',
      name: 'Juicy Oranges (6 pcs)',
      price: 249,
      originalPrice: 299,
      image: 'https://images.unsplash.com/photo-1613334728649-d3d2bcde2d29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMG9yYW5nZXN8ZW58MXx8fHwxNzU5NTU4MTY1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Fruits',
      rating: 4.9,
      inStock: true,
      flashSale: true,
      discount: 17,
    },
    {
      id: 'fruit-5',
      name: 'Sweet Alphonso Mangoes',
      price: 599,
      originalPrice: 799,
      image: 'https://images.unsplash.com/photo-1590140568979-9d2aebbd9379?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nbyUyMGZydWl0JTIwdHJvcGljYWx8ZW58MXx8fHwxNzU5NTU0NDQ3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Fruits',
      rating: 5.0,
      inStock: true,
      organic: true,
      aiRecommended: true,
      flashSale: true,
      discount: 25,
    },
    {
      id: 'fruit-6',
      name: 'Fresh Green Grapes',
      price: 349,
      image: 'https://images.unsplash.com/photo-1596363505729-4190a9506133?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFwZXMlMjBmcmVzaHxlbnwxfHx8fDE3NTk1NTgxNjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Fruits',
      rating: 4.7,
      inStock: true,
      organic: true,
    },
    {
      id: 'fruit-7',
      name: 'Sweet Watermelon',
      price: 399,
      originalPrice: 499,
      image: 'https://images.unsplash.com/photo-1629265824943-b0a19b32c7a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlcm1lbG9uJTIwc2xpY2VkfGVufDF8fHx8MTc1OTU1ODE2NXww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Fruits',
      rating: 4.8,
      inStock: true,
      discount: 20,
    },
    {
      id: 'fruit-8',
      name: 'Fresh Strawberries',
      price: 449,
      originalPrice: 599,
      image: 'https://images.unsplash.com/photo-1710528184650-fc75ae862c13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJhd2JlcnJpZXMlMjBmcmVzaHxlbnwxfHx8fDE3NTk0ODQxNzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Fruits',
      rating: 4.9,
      inStock: true,
      organic: true,
      flashSale: true,
      aiRecommended: true,
      discount: 25,
    },
    {
      id: 'fruit-9',
      name: 'Golden Pineapple',
      price: 299,
      image: 'https://images.unsplash.com/photo-1738822591561-33cf6bbd9d8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5lYXBwbGUlMjB0cm9waWNhbHxlbnwxfHx8fDE3NTk1NTgxNjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Fruits',
      rating: 4.6,
      inStock: true,
    },

    // DAIRY
    {
      id: '3',
      name: 'Organic Dairy Products',
      price: 999,
      image: 'https://images.unsplash.com/photo-1626697556739-77b40d9a6e99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwZGFpcnklMjBwcm9kdWN0c3xlbnwxfHx8fDE3NTk1NTM5MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Dairy',
      rating: 4.7,
      inStock: true,
      organic: true,
    },
    {
      id: 'dairy-2',
      name: 'Fresh Organic Milk (1L)',
      price: 189,
      originalPrice: 229,
      image: 'https://images.unsplash.com/photo-1555910114-d4ba95cc20e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMG1pbGslMjBib3R0bGV8ZW58MXx8fHwxNzU5NTAzMTY2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Dairy',
      rating: 4.9,
      inStock: true,
      organic: true,
      aiRecommended: true,
      discount: 17,
    },
    {
      id: 'dairy-3',
      name: 'Greek Yogurt (500g)',
      price: 249,
      image: 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2d1cnQlMjBib3dsfGVufDF8fHx8MTc1OTU1ODE2Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Dairy',
      rating: 4.8,
      inStock: true,
      organic: true,
      aiRecommended: true,
    },
    {
      id: 'dairy-4',
      name: 'Premium Cheese Selection',
      price: 549,
      originalPrice: 699,
      image: 'https://images.unsplash.com/photo-1757857755363-a12d462d1962?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVlc2UlMjBkYWlyeXxlbnwxfHx8fDE3NTk1NTgxNjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Dairy',
      rating: 4.7,
      inStock: true,
      flashSale: true,
      discount: 21,
    },
    {
      id: 'dairy-5',
      name: 'Salted Butter (200g)',
      price: 179,
      originalPrice: 219,
      image: 'https://images.unsplash.com/photo-1660798670183-333ac43c3c4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXR0ZXIlMjBkYWlyeXxlbnwxfHx8fDE3NTk1NTgxNjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Dairy',
      rating: 4.6,
      inStock: true,
      discount: 18,
    },
    {
      id: 'dairy-6',
      name: 'Fresh Paneer (250g)',
      price: 229,
      image: 'https://images.unsplash.com/photo-1733907557463-915a34237e8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYW5lZXIlMjBjb3R0YWdlJTIwY2hlZXNlfGVufDF8fHx8MTc1OTQ1NzE5M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Dairy',
      rating: 4.8,
      inStock: true,
      organic: true,
      aiRecommended: true,
    },
    {
      id: 'dairy-7',
      name: 'Heavy Cream (200ml)',
      price: 199,
      originalPrice: 249,
      image: 'https://images.unsplash.com/photo-1718354648565-651f8c6091d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhbSUyMGRhaXJ5JTIwcHJvZHVjdHxlbnwxfHx8fDE3NTk1NTgxNjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Dairy',
      rating: 4.7,
      inStock: true,
      discount: 20,
    },

    // BAKERY
    {
      id: '4',
      name: 'Artisan Fresh Bread',
      price: 449,
      originalPrice: 649,
      image: 'https://images.unsplash.com/photo-1674770067314-296af21ad811?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlcnklMjBicmVhZHxlbnwxfHx8fDE3NTk0OTEwMDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Bakery',
      rating: 4.6,
      inStock: true,
      flashSale: true,
      discount: 31,
    },
    {
      id: 'bakery-2',
      name: 'Butter Croissants (4 pcs)',
      price: 349,
      originalPrice: 449,
      image: 'https://images.unsplash.com/photo-1733754348873-feeb45df3bab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9pc3NhbnQlMjBwYXN0cnl8ZW58MXx8fHwxNzU5NDcwMjAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Bakery',
      rating: 4.9,
      inStock: true,
      flashSale: true,
      aiRecommended: true,
      discount: 22,
    },
    {
      id: 'bakery-3',
      name: 'Multigrain Bagels (6 pcs)',
      price: 299,
      image: 'https://images.unsplash.com/photo-1601585099780-6b176dc702af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWdlbHMlMjBmcmVzaHxlbnwxfHx8fDE3NTk1NTgxNjl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Bakery',
      rating: 4.7,
      inStock: true,
    },
    {
      id: 'bakery-4',
      name: 'Assorted Donuts (6 pcs)',
      price: 399,
      originalPrice: 499,
      image: 'https://images.unsplash.com/photo-1670307335965-02cd42292094?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb251dHMlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NTk1NTgxNjl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Bakery',
      rating: 4.8,
      inStock: true,
      flashSale: true,
      aiRecommended: true,
      discount: 20,
    },
    {
      id: 'bakery-5',
      name: 'Blueberry Muffins (4 pcs)',
      price: 279,
      originalPrice: 349,
      image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdWZmaW5zJTIwYmx1ZWJlcnJ5fGVufDF8fHx8MTc1OTU1ODE3MHww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Bakery',
      rating: 4.6,
      inStock: true,
      discount: 20,
    },
    {
      id: 'bakery-6',
      name: 'Chocolate Chip Cookies',
      price: 249,
      image: 'https://images.unsplash.com/photo-1606406305144-0e2d8f91e61a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29raWVzJTIwY2hvY29sYXRlJTIwY2hpcHxlbnwxfHx8fDE3NTk1NTgxNzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Bakery',
      rating: 4.8,
      inStock: true,
      aiRecommended: true,
    },
    {
      id: 'bakery-7',
      name: 'Premium Cake Slice',
      price: 199,
      originalPrice: 249,
      image: 'https://images.unsplash.com/photo-1632681382835-87ad6c0bf9bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWtlJTIwc2xpY2UlMjBiYWtlcnl8ZW58MXx8fHwxNzU5NTU4MTcwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Bakery',
      rating: 4.7,
      inStock: true,
      flashSale: true,
      discount: 20,
    },

    // MIXED BUNDLES
    {
      id: '5',
      name: 'Premium Grocery Selection',
      price: 1299,
      image: 'https://images.unsplash.com/photo-1553531889-56cc480ac5cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm9jZXJ5JTIwc2hvcHBpbmd8ZW58MXx8fHwxNzU5NDgwMTI1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Mixed',
      rating: 4.8,
      inStock: true,
      aiRecommended: true,
    },
    {
      id: '6',
      name: 'Healthy Food Bundle',
      price: 1599,
      originalPrice: 1999,
      image: 'https://images.unsplash.com/photo-1707915317424-437561f0e323?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZm9vZCUyMGluZ3JlZGllbnRzfGVufDF8fHx8MTc1OTQ4MjE5NHww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Mixed',
      rating: 4.9,
      inStock: true,
      organic: true,
      aiRecommended: true,
      discount: 20,
    },
    {
      id: 'mixed-3',
      name: 'Organic Grocery Basket',
      price: 1799,
      originalPrice: 2299,
      image: 'https://images.unsplash.com/photo-1622031175804-3c70a3ae5ed3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm9jZXJ5JTIwYmFza2V0JTIwb3JnYW5pY3xlbnwxfHx8fDE3NTk1NTgxNzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Mixed',
      rating: 4.9,
      inStock: true,
      organic: true,
      flashSale: true,
      aiRecommended: true,
      discount: 22,
    },
    {
      id: 'mixed-4',
      name: 'Weekly Essentials Pack',
      price: 2199,
      originalPrice: 2799,
      image: 'https://images.unsplash.com/photo-1574226557203-4674395951f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZm9vZCUyMGJ1bmRsZXxlbnwxfHx8fDE3NTk1NTgxNzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Mixed',
      rating: 4.8,
      inStock: true,
      aiRecommended: true,
      flashSale: true,
      discount: 21,
    },
  ];

  const categories = ['all', 'Vegetables', 'Fruits', 'Dairy', 'Bakery', 'Mixed'];

  const filteredProducts = (() => {
    let filtered = selectedCategory === 'all'
      ? products
      : products.filter(p => p.category === selectedCategory);
    
    if (showAIRecommended) {
      filtered = filtered.filter(p => p.aiRecommended);
    }
    
    // Enhanced Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => {
        // Direct name match
        if (p.name.toLowerCase().includes(query)) return true;
        
        // Category match
        if (p.category.toLowerCase().includes(query)) return true;
        
        // Attribute matches
        if (p.organic && (query.includes('organic') || query.includes('natural') || query.includes('healthy'))) return true;
        if (p.flashSale && (query.includes('sale') || query.includes('deal') || query.includes('offer') || query.includes('discount'))) return true;
        if (p.aiRecommended && (query.includes('ai') || query.includes('recommended') || query.includes('suggest'))) return true;
        
        // Price-related searches
        if (p.discount && p.discount > 20 && (query.includes('cheap') || query.includes('discount') || query.includes('save'))) return true;
        if (!p.originalPrice && (query.includes('premium') || query.includes('best'))) return true;
        
        // Specific product keywords
        const keywords: { [key: string]: string[] } = {
          'vegetables': ['tomato', 'carrot', 'potato', 'onion', 'pepper', 'spinach', 'broccoli', 'cauliflower', 'beans', 'veggie', 'veggies'],
          'fruits': ['apple', 'banana', 'orange', 'mango', 'grape', 'watermelon', 'strawberry', 'pineapple', 'fruit'],
          'dairy': ['milk', 'yogurt', 'cheese', 'butter', 'paneer', 'cream'],
          'bakery': ['bread', 'croissant', 'bagel', 'donut', 'muffin', 'cookie', 'cake'],
        };
        
        for (const [category, words] of Object.entries(keywords)) {
          if (p.category.toLowerCase() === category) {
            if (words.some(word => query.includes(word))) return true;
          }
        }
        
        // Check individual words in product name
        const productWords = p.name.toLowerCase().split(' ');
        const queryWords = query.split(' ');
        if (queryWords.some(qWord => productWords.some(pWord => pWord.includes(qWord) || qWord.includes(pWord)))) return true;
        
        return false;
      });
    }

    // Apply Advanced Filters
    // Price Range
    filtered = filtered.filter(p => 
      p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Min Rating
    if (filters.minRating > 0) {
      filtered = filtered.filter(p => p.rating >= filters.minRating);
    }

    // In Stock Only
    if (filters.inStockOnly) {
      filtered = filtered.filter(p => p.inStock);
    }

    // Organic Only
    if (filters.organicOnly) {
      filtered = filtered.filter(p => p.organic);
    }

    // Flash Sale Only
    if (filters.flashSaleOnly) {
      filtered = filtered.filter(p => p.flashSale);
    }

    // Min Discount
    if (filters.minDiscount > 0) {
      filtered = filtered.filter(p => (p.discount || 0) >= filters.minDiscount);
    }

    // Sort
    if (filters.sortBy !== 'none') {
      switch (filters.sortBy) {
        case 'price-low':
          filtered = [...filtered].sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filtered = [...filtered].sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filtered = [...filtered].sort((a, b) => b.rating - a.rating);
          break;
        case 'discount':
          filtered = [...filtered].sort((a, b) => (b.discount || 0) - (a.discount || 0));
          break;
        case 'newest':
          // For demo, reverse the array to simulate newest first
          filtered = [...filtered].reverse();
          break;
      }
    }
    
    return filtered;
  })();

  const aiRecommendedCount = products.filter(p => p.aiRecommended).length;

  const activeFiltersCount = (() => {
    let count = 0;
    if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 3000) count++;
    if (filters.minRating > 0) count++;
    if (filters.inStockOnly) count++;
    if (filters.organicOnly) count++;
    if (filters.flashSaleOnly) count++;
    if (filters.minDiscount > 0) count++;
    if (filters.sortBy !== 'none') count++;
    return count;
  })();

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      priceRange: [0, 3000],
      minRating: 0,
      inStockOnly: false,
      organicOnly: false,
      flashSaleOnly: false,
      minDiscount: 0,
      sortBy: 'none',
    });
  };

  const handleRemoveFilter = (filterKey: string) => {
    const newFilters = { ...filters };
    switch (filterKey) {
      case 'price':
        newFilters.priceRange = [0, 3000];
        break;
      case 'rating':
        newFilters.minRating = 0;
        break;
      case 'inStock':
        newFilters.inStockOnly = false;
        break;
      case 'organic':
        newFilters.organicOnly = false;
        break;
      case 'flashSale':
        newFilters.flashSaleOnly = false;
        break;
      case 'discount':
        newFilters.minDiscount = 0;
        break;
      case 'sort':
        newFilters.sortBy = 'none';
        break;
    }
    setFilters(newFilters);
    toast.info('Filter removed', { duration: 1000 });
  };

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setUser(session.user);
          setAccessToken(session.access_token);
          api.setAccessToken(session.access_token);
          
          // Load user data from backend
          await loadUserData();
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoadingUserData(false);
      }
    };

    checkSession();
  }, []);

  // Load user data from backend
  const loadUserData = async () => {
    try {
      // Load cart
      const { cart } = await api.getCart();
      if (cart) setCartItems(cart);

      // Load wishlist
      const { wishlist } = await api.getWishlist();
      if (wishlist) setWishlistItems(wishlist);

      // Load preferences
      const { preferences } = await api.getPreferences();
      if (preferences) {
        setDarkMode(preferences.darkMode || false);
      }

      // Load notifications
      const { notifications: savedNotifications } = await api.getNotifications();
      if (savedNotifications && savedNotifications.length > 0) {
        setNotifications(savedNotifications);
      }

      // Load search history
      const { searches } = await api.getSearches();
      if (searches) setRecentSearches(searches);

      toast.success('Welcome back! 👋', {
        description: 'Your data has been loaded.',
        duration: 1000,
      });
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // Save cart to backend when it changes (debounced)
  useEffect(() => {
    if (!user) return;

    const timeoutId = setTimeout(() => {
      api.saveCart(cartItems).catch(err => {
        console.error('Failed to save cart:', err);
      });
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [cartItems, user]);

  // Save wishlist to backend when it changes (debounced)
  useEffect(() => {
    if (!user) return;

    const timeoutId = setTimeout(() => {
      api.saveWishlist(wishlistItems).catch(err => {
        console.error('Failed to save wishlist:', err);
      });
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [wishlistItems, user]);

  // Save preferences when dark mode changes
  useEffect(() => {
    if (!user) return;

    api.savePreferences({ darkMode }).catch(err => {
      console.error('Failed to save preferences:', err);
    });
  }, [darkMode, user]);

  // Save notifications when they change (debounced)
  useEffect(() => {
    if (!user) return;

    const timeoutId = setTimeout(() => {
      api.saveNotifications(notifications).catch(err => {
        console.error('Failed to save notifications:', err);
      });
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [notifications, user]);

  // Save search history when it changes (debounced)
  useEffect(() => {
    if (!user) return;

    const timeoutId = setTimeout(() => {
      api.saveSearches(recentSearches).catch(err => {
        console.error('Failed to save searches:', err);
      });
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [recentSearches, user]);

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleAddToCart = (product: Product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
      }]);
    }
    
    toast.success(`${product.name} added to cart! 🛒`, {
      description: 'Auto-applying best available coupons...',
      duration: 1000,
    });
  };

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    toast.info('Item removed from cart', { duration: 1000 });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    
    // Add to recent searches when user actually searches (not on every keystroke)
    if (query.trim() && query.length > 2) {
      // Debounce logic - only add after user stops typing
      const timeoutId = setTimeout(() => {
        if (query === searchQuery) {
          addToRecentSearches(query.trim());
        }
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  };

  const addToRecentSearches = (query: string) => {
    setRecentSearches(prev => {
      // Remove duplicates and add to front
      const filtered = prev.filter(s => s.toLowerCase() !== query.toLowerCase());
      const updated = [query, ...filtered].slice(0, 5); // Keep only last 5
      return updated;
    });
  };

  const handleVoiceSearch = () => {
    // Open voice search modal
    setIsVoiceSearchOpen(true);
  };

  const handleVoiceSearchResult = (query: string) => {
    // Set the search query from voice input
    setSearchQuery(query);
    addToRecentSearches(query);
    
    // Close voice search modal
    setIsVoiceSearchOpen(false);
    
    // Auto-scroll to products
    setTimeout(() => {
      const productsSection = document.querySelector('[data-products-grid]');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleClearRecentSearches = () => {
    setRecentSearches([]);
    toast.info('Recent searches cleared', { duration: 1000 });
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      // Add to recent searches
      addToRecentSearches(searchQuery.trim());
      
      // Show toast notification
      toast.success('🔍 Searching...', {
        description: `Showing results for "${searchQuery}"`,
        duration: 1000,
      });
      
      // Auto-scroll to products
      setTimeout(() => {
        const productsSection = document.querySelector('[data-products-grid]');
        if (productsSection) {
          productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handleVirtualStoreAddToCart = (itemName: string) => {
    toast.success(`${itemName} added to cart! 🛒`, { duration: 1000 });
  };

  const handleAddToWishlist = (product: Product) => {
    const isAlreadyInWishlist = wishlistItems.some(item => item.id === product.id);
    
    if (isAlreadyInWishlist) {
      return;
    }
    
    setWishlistItems([...wishlistItems, {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      inStock: product.inStock,
    }]);
    
    toast.success(`${product.name} added to wishlist! ❤️`, { duration: 1000 });
  };

  const handleRemoveFromWishlist = (id: string) => {
    const item = wishlistItems.find(i => i.id === id);
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
    
    if (item) {
      toast.info(`${item.name} removed from wishlist`, { duration: 1000 });
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const handleAddWishlistItemToCart = (wishlistItem: WishlistItem) => {
    if (!wishlistItem.inStock) {
      toast.error('Item out of stock', {
        description: 'We\'ll notify you when it\'s available!',
        duration: 1000,
      });
      return;
    }

    const existingItem = cartItems.find(item => item.id === wishlistItem.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === wishlistItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, {
        id: wishlistItem.id,
        name: wishlistItem.name,
        price: wishlistItem.price,
        quantity: 1,
        image: wishlistItem.image,
      }]);
    }
    
    // Remove from wishlist after adding to cart
    setWishlistItems(wishlistItems.filter(item => item.id !== wishlistItem.id));
    
    toast.success(`${wishlistItem.name} added to cart! 🛒`, {
      description: `Removed from wishlist • ₹${wishlistItem.price}`,
      duration: 1000,
    });
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (id: string) => {
    const notification = notifications.find(n => n.id === id);
    setNotifications(notifications.filter(n => n.id !== id));
    if (notification) {
      toast.info(`Notification deleted`, { duration: 1000 });
    }
  };

  const handleAddToCartFromNotification = (productId: string, productName: string, productPrice: number) => {
    // Find the full product details
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      // If product not found in main list, create a cart item from notification data
      const existingItem = cartItems.find(item => item.id === productId);
      
      if (existingItem) {
        setCartItems(cartItems.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        setCartItems([...cartItems, {
          id: productId,
          name: productName,
          price: productPrice,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1553531889-56cc480ac5cb?w=400', // Fallback image
        }]);
      }
    } else {
      // Use the full product data
      const existingItem = cartItems.find(item => item.id === product.id);
      
      if (existingItem) {
        setCartItems(cartItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        setCartItems([...cartItems, {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
        }]);
      }
    }
    
    toast.success(`${productName} added to cart! 🛒`, {
      description: `₹${productPrice} • AI-powered suggestion`,
      duration: 1000,
      action: {
        label: 'View Cart',
        onClick: () => setIsCartOpen(true),
      },
    });
  };

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  const handleAddSmartFridgeItems = () => {
    // Smart fridge detected items: Milk and Eggs
    const smartFridgeItems = [
      {
        id: 'dairy-2',
        name: 'Fresh Organic Milk (1L)',
        price: 189,
        image: 'https://images.unsplash.com/photo-1555910114-d4ba95cc20e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMG1pbGslMjBib3R0bGV8ZW58MXx8fHwxNzU5NTAzMTY2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      },
      {
        id: 'eggs-1',
        name: 'Fresh Farm Eggs (12 pcs)',
        price: 120,
        image: 'https://images.unsplash.com/photo-1582722872445-44dc1f3e3b4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGVnZ3N8ZW58MXx8fHwxNzU5NTAzMTY2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      },
    ];

    setCartItems(prevCart => {
      let updatedCart = [...prevCart];
      
      smartFridgeItems.forEach(item => {
        const existingItemIndex = updatedCart.findIndex(cartItem => cartItem.id === item.id);
        
        if (existingItemIndex !== -1) {
          // Item exists, increment quantity
          updatedCart[existingItemIndex] = {
            ...updatedCart[existingItemIndex],
            quantity: updatedCart[existingItemIndex].quantity + 1
          };
        } else {
          // Item doesn't exist, add it
          updatedCart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
            image: item.image,
          });
        }
      });
      
      return updatedCart;
    });

    toast.success('Smart Fridge items added to cart! 🧊🛒', {
      description: `Milk (₹189) and Eggs (₹120) added based on AI suggestion`,
      duration: 1000,
    });
  };

  const handleExpressCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty!', {
        description: 'Add some items to cart first',
        duration: 1000,
      });
      return;
    }
    setIsExpressCheckoutOpen(true);
  };

  const handleCheckoutComplete = async (orderData?: any) => {
    if (user && orderData) {
      try {
        const { order, pointsEarned } = await api.createOrder(orderData);
        toast.success('Order placed successfully! 🎉', {
          description: `Order #${order.id} • Earned ${pointsEarned} points! 🏆`,
          duration: 1000,
        });
      } catch (error) {
        console.error('Failed to save order:', error);
        toast.success('Order placed successfully! 🎉', {
          description: 'Track your order in the Tracking tab',
          duration: 1000,
        });
      }
    } else {
      toast.success('Order placed successfully! 🎉', {
        description: 'Track your order in the Tracking tab',
        duration: 1000,
      });
    }
    
    setCartItems([]);
    setIsCartOpen(false);
  };

  const handleAuthSuccess = async (authUser: any, token: string) => {
    setUser(authUser);
    setAccessToken(token);
    api.setAccessToken(token);
    
    // Load user data
    await loadUserData();
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setAccessToken(null);
      api.setAccessToken(null);
      
      // Clear local state
      setCartItems([]);
      setWishlistItems([]);
      setRecentSearches([]);
      setNotifications([
        {
          id: '1',
          type: 'order' as const,
          title: 'Order Delivered!',
          message: 'Your order #GR-2024-10041 has been delivered successfully.',
          time: '5 mins ago',
          read: false,
          actionable: true,
        },
        {
          id: '2',
          type: 'price-drop' as const,
          title: 'Price Drop Alert! 📉',
          message: 'Organic Fresh Tomatoes from your wishlist is now ₹399 (was ₹549)',
          time: '1 hour ago',
          read: false,
          actionable: true,
          productId: '1',
          productName: 'Organic Fresh Tomatoes',
          productPrice: 399,
        },
        {
          id: '3',
          type: 'deal' as const,
          title: 'Flash Sale Active! ⚡',
          message: 'Get 30% off on all dairy products. Valid for next 2 hours!',
          time: '2 hours ago',
          read: false,
          actionable: true,
        },
      ]);
      
      toast.info('Logged out successfully', {
        description: 'Come back soon!',
        duration: 1000,
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed', {
        description: 'Please try again.',
        duration: 1000,
      });
    }
  };

  const handleLoginPrompt = () => {
    setIsAuthDialogOpen(true);
  };

  const handleOpenPriceComparison = (product: Product) => {
    setPriceComparisonProduct(product);
  };

  const handleTrackOrder = (orderId: string) => {
    setTrackedOrderId(orderId);
    setActiveTab('tracking');
    toast.success('Opening order tracking... 📦', {
      description: `Tracking order #${orderId}`,
      duration: 1000,
    });
  };

  const handleAddToCartFromReorder = (item: { id: string; name: string; price: number; quantity: number; image: string }) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
          : cartItem
      ));
    } else {
      setCartItems([...cartItems, item]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" duration={1000} />
      
      <Header
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onVoiceSearch={handleVoiceSearch}
        onNotificationClick={() => setIsNotificationOpen(true)}
        onWishlistClick={() => setIsWishlistOpen(true)}
        userName={user?.user_metadata?.name || user?.email?.split('@')[0] || 'Guest'}
        userLevel={12}
        notificationCount={unreadNotificationCount}
        wishlistCount={wishlistItems.length}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        recentSearches={recentSearches}
        onClearRecentSearches={handleClearRecentSearches}
        user={user}
        onLoginClick={handleLoginPrompt}
        onLogout={handleLogout}
        onProfileClick={() => setIsProfileSettingsOpen(true)}
        onQuickReorderClick={() => setIsQuickReorderOpen(true)}
      />

      <PersonalDashboard
        userName={user?.user_metadata?.name || user?.email?.split('@')[0] || 'Guest'}
        userLevel={12}
        xp={850}
        maxXp={1000}
        weeklyBudget={120}
        spent={87.50}
        calories={1200}
        targetCalories={1500}
        onAddSmartFridgeItems={handleAddSmartFridgeItems}
        onViewMealPlan={() => setIsMealPlanOpen(true)}
      />

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="shop" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Shop
            </TabsTrigger>
            <TabsTrigger value="virtual" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Virtual Store
            </TabsTrigger>
            <TabsTrigger value="tracking" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Tracking
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Subscriptions
            </TabsTrigger>
          </TabsList>

          {/* Shop Tab */}
          <TabsContent value="shop" className="space-y-6">
            {/* AI Recommendations Banner */}
            <button
              onClick={() => {
                setShowAIRecommended(!showAIRecommended);
                if (!showAIRecommended) {
                  toast.success('🤖 AI Recommendations Activated!', {
                    description: `Showing ${aiRecommendedCount} personalized picks just for you`,
                    duration: 1000,
                  });
                } else {
                  toast.info('Showing all products', { duration: 1000 });
                }
              }}
              className={`w-full rounded-xl p-6 transition-all duration-300 ${
                showAIRecommended
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/50'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`transition-transform duration-300 ${showAIRecommended ? 'scale-110' : ''}`}>
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-white">
                      {showAIRecommended ? '✨ AI Recommendations Active' : 'AI-Powered Recommendations'}
                    </h3>
                    <p className="text-white/90 mt-1">
                      {showAIRecommended
                        ? `Showing ${aiRecommendedCount} personalized picks • Click to view all products`
                        : 'Personalized just for you • Click to see AI-recommended products'}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className="bg-white text-purple-600 hover:bg-white">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    89% Match
                  </Badge>
                  {showAIRecommended && (
                    <Badge className="bg-yellow-400 text-purple-900 hover:bg-yellow-400">
                      {aiRecommendedCount} Items
                    </Badge>
                  )}
                </div>
              </div>
            </button>

            {/* Filters */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <div className="flex gap-2 flex-wrap">
                  {categories.map(cat => (
                    <Button
                      key={cat}
                      size="sm"
                      variant={selectedCategory === cat ? 'default' : 'outline'}
                      onClick={() => {
                        setSelectedCategory(cat);
                        toast.info(`Filtering: ${cat === 'all' ? 'All Products' : cat}`, {
                          description: showAIRecommended ? 'AI recommendations still active' : undefined,
                          duration: 1000,
                        });
                      }}
                      className="capitalize"
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {searchQuery && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setSearchQuery('');
                      toast.info('Search cleared', { duration: 1000 });
                    }}
                    className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/50"
                  >
                    <Search className="h-4 w-4 mr-1" />
                    Searching: "{searchQuery.substring(0, 20)}{searchQuery.length > 20 ? '...' : ''}"
                  </Button>
                )}
                {showAIRecommended && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setShowAIRecommended(false);
                      toast.info('AI filter removed', {
                        description: 'Showing all products',
                        duration: 1000,
                      });
                    }}
                    className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50"
                  >
                    <Sparkles className="h-4 w-4 mr-1" />
                    AI Filter Active
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsFilterPanelOpen(true)}
                  className={activeFiltersCount > 0 ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' : ''}
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  More Filters
                  {activeFiltersCount > 0 && (
                    <Badge className="ml-2 bg-emerald-500">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-2 flex-wrap bg-muted/50 p-3 rounded-lg">
                <span className="text-sm text-muted-foreground">Active Filters:</span>
                {(filters.priceRange[0] !== 0 || filters.priceRange[1] !== 3000) && (
                  <Badge 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    onClick={() => handleRemoveFilter('price')}
                  >
                    Price: ₹{filters.priceRange[0]}-₹{filters.priceRange[1]}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                )}
                {filters.minRating > 0 && (
                  <Badge 
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    onClick={() => handleRemoveFilter('rating')}
                  >
                    {filters.minRating}+ Stars
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                )}
                {filters.inStockOnly && (
                  <Badge 
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    onClick={() => handleRemoveFilter('inStock')}
                  >
                    In Stock
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                )}
                {filters.organicOnly && (
                  <Badge 
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    onClick={() => handleRemoveFilter('organic')}
                  >
                    Organic
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                )}
                {filters.flashSaleOnly && (
                  <Badge 
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    onClick={() => handleRemoveFilter('flashSale')}
                  >
                    Flash Sale
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                )}
                {filters.minDiscount > 0 && (
                  <Badge 
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    onClick={() => handleRemoveFilter('discount')}
                  >
                    {filters.minDiscount}%+ Discount
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                )}
                {filters.sortBy !== 'none' && (
                  <Badge 
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    onClick={() => handleRemoveFilter('sort')}
                  >
                    Sorted: {filters.sortBy.replace('-', ' ')}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    handleClearFilters();
                    toast.info('All advanced filters cleared', { duration: 1000 });
                  }}
                  className="h-6 text-xs"
                >
                  Clear All
                </Button>
              </div>
            )}

            {/* Flash Sale Badge */}
            <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <Zap className="h-5 w-5 text-red-500" />
              <p className="text-sm">
                <span className="text-red-600 dark:text-red-400">Flash Sale Active!</span>
                {' '}Limited time offers - prices updated in real-time
              </p>
            </div>

            {/* Search Results Info */}
            {searchQuery && filteredProducts.length > 0 && (
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <p className="text-sm">
                        <span className="text-emerald-600 dark:text-emerald-400">Search Results:</span>
                        {' '}Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} matching "{searchQuery}"
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Searching in: names, categories, organic, sale items, and more
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSearchQuery('')}
                    className="text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                  >
                    Clear Search
                  </Button>
                </div>
              </div>
            )}

            {/* AI Results Info */}
            {showAIRecommended && filteredProducts.length > 0 && !searchQuery && (
              <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <p className="text-sm">
                    <span className="text-purple-600 dark:text-purple-400">AI-Curated Selection:</span>
                    {' '}Showing {filteredProducts.length} products carefully selected based on your preferences, purchase history, and trending items
                  </p>
                </div>
              </div>
            )}

            {/* No Results */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="mb-2">
                  {searchQuery ? `No results for "${searchQuery}"` : 'No products match your filters'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery 
                    ? 'Try different keywords or browse all products'
                    : 'Try adjusting your category or AI recommendation filters'
                  }
                </p>
                <div className="flex gap-2 justify-center">
                  {searchQuery && (
                    <Button
                      onClick={() => {
                        setSearchQuery('');
                        toast.info('Search cleared', { duration: 1000 });
                      }}
                      variant="default"
                    >
                      Clear Search
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      setSelectedCategory('all');
                      setShowAIRecommended(false);
                      setSearchQuery('');
                      toast.info('All filters reset', { duration: 1000 });
                    }}
                    variant={searchQuery ? 'outline' : 'default'}
                  >
                    Reset All Filters
                  </Button>
                </div>
              </div>
            )}

            {/* Product Grid */}
            {filteredProducts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-products-grid>
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onQuickView={handleQuickView}
                    onAddToWishlist={handleAddToWishlist}
                    onRemoveFromWishlist={handleRemoveFromWishlist}
                    isInWishlist={isInWishlist(product.id)}
                    onPriceCompare={handleOpenPriceComparison}
                  />
                ))}
              </div>
            )}

            {/* Load More */}
            <div className="text-center">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => toast.info('Loading more products...', {
                  description: 'Finding the best deals for you! 🛍️',
                  duration: 1000,
                })}
              >
                Load More Products
              </Button>
            </div>
          </TabsContent>

          {/* Virtual Store Tab */}
          <TabsContent value="virtual">
            <VirtualStore onAddToCart={handleVirtualStoreAddToCart} />
          </TabsContent>

          {/* Tracking Tab */}
          <TabsContent value="tracking" className="space-y-6">
            {trackedOrderId ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2>Order Tracking</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTrackedOrderId(null)}
                  >
                    View All Orders
                  </Button>
                </div>
                {(() => {
                  const order = orders.find(o => o.orderId === trackedOrderId);
                  return order ? (
                    <DeliveryTracking
                      orderId={order.orderId}
                      status={order.status}
                      estimatedTime={order.estimatedTime}
                      driverName={order.driverName}
                    />
                  ) : null;
                })()}
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <h2>Your Orders</h2>
                  <p className="text-muted-foreground mt-2">
                    Track all your orders in real-time
                  </p>
                </div>
                <div className="grid gap-4">
                  {orders.map((order) => (
                    <div
                      key={order.orderId}
                      className="border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleTrackOrder(order.orderId)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3>Order #{order.orderId}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {order.items.join(', ')}
                          </p>
                        </div>
                        <Badge className={
                          order.status === 'delivered' ? 'bg-green-500' :
                          order.status === 'in-transit' ? 'bg-blue-500' :
                          'bg-orange-500'
                        }>
                          {order.status === 'in-transit' ? 'In Transit' :
                           order.status === 'delivered' ? 'Delivered' :
                           'Packed'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {order.status === 'delivered' ? 'Delivered successfully' : `ETA: ${order.estimatedTime}`}
                        </span>
                        <span>Total: ₹{order.total}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTrackOrder(order.orderId);
                        }}
                      >
                        <Truck className="h-4 w-4 mr-2" />
                        Track Order
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions">
            <SubscriptionManager />
          </TabsContent>
        </Tabs>

        {/* Features Showcase */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={handleExpressCheckout}
            className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 p-6 rounded-xl border border-emerald-200 dark:border-emerald-800 text-left hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="bg-emerald-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h4>Express Checkout</h4>
            <p className="text-sm text-muted-foreground mt-2">
              One-click checkout with biometric verification and auto-applied coupons
            </p>
            <div className="mt-4 text-sm text-emerald-600 dark:text-emerald-400 group-hover:underline">
              Click to try now →
            </div>
          </button>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800 relative overflow-hidden">
            <div className="bg-purple-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h4>AI Assistant</h4>
            <p className="text-sm text-muted-foreground mt-2">
              Smart recommendations, recipe suggestions, and budget planning
            </p>
            <div className="mt-4 text-sm text-purple-600 dark:text-purple-400">
              Click the purple bot icon →
            </div>
            <div className="absolute -bottom-2 -right-2 text-6xl opacity-20">🤖</div>
          </div>

          <button
            onClick={() => filteredProducts.length > 0 && handleOpenPriceComparison(filteredProducts[0])}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800 text-left hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="bg-blue-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h4>Price Comparison</h4>
            <p className="text-sm text-muted-foreground mt-2">
              AI-powered price matching ensures you always get the best deals
            </p>
            <div className="mt-4 text-sm text-blue-600 dark:text-blue-400 group-hover:underline">
              Compare prices now →
            </div>
          </button>
        </div>
      </div>

      {/* AI Assistant Floating Button */}
      <AIAssistant />

      {/* Shopping Cart Drawer */}
      <ShoppingCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onExpressCheckout={handleExpressCheckout}
      />

      {/* Wishlist Panel */}
      <WishlistPanel
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlistItems}
        onAddToCart={handleAddWishlistItemToCart}
        onRemoveFromWishlist={handleRemoveFromWishlist}
      />

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationAsRead}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        onDeleteNotification={handleDeleteNotification}
        onAddToCart={handleAddToCartFromNotification}
        onTrackOrder={handleTrackOrder}
      />

      {/* Product Quick View Modal */}
      <ProductQuickView
        product={selectedProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        onAddToCart={handleAddToCart}
        onAddToWishlist={handleAddToWishlist}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        isInWishlist={selectedProduct ? isInWishlist(selectedProduct.id) : false}
      />

      {/* Express Checkout Modal */}
      <ExpressCheckout
        isOpen={isExpressCheckoutOpen}
        onClose={() => setIsExpressCheckoutOpen(false)}
        items={cartItems}
        onCheckoutComplete={handleCheckoutComplete}
      />

      {/* Price Comparison Modal */}
      <PriceComparison
        isOpen={!!priceComparisonProduct}
        onClose={() => setPriceComparisonProduct(null)}
        product={priceComparisonProduct}
      />

      {/* Voice Search Modal */}
      <VoiceSearch
        isOpen={isVoiceSearchOpen}
        onClose={() => setIsVoiceSearchOpen(false)}
        onSearch={handleVoiceSearchResult}
      />

      {/* Filter Panel */}
      <FilterPanel
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
        activeFiltersCount={activeFiltersCount}
      />

      {/* Authentication Dialog */}
      <AuthDialog
        open={isAuthDialogOpen}
        onOpenChange={setIsAuthDialogOpen}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Profile Settings Dialog */}
      {user && (
        <ProfileSettings
          open={isProfileSettingsOpen}
          onOpenChange={setIsProfileSettingsOpen}
          user={user}
          onLogout={handleLogout}
        />
      )}

      {/* Meal Plan Dialog */}
      <MealPlan
        isOpen={isMealPlanOpen}
        onClose={() => setIsMealPlanOpen(false)}
        onAddToCart={handleAddToCart}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
