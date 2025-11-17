import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Store, CheckCircle, AlertCircle, Zap, RefreshCw, Clock, Star, Package, IndianRupee, Filter, ArrowUpDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
}

interface PriceComparisonProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

interface StorePrice {
  storeName: string;
  storeType: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  delivery: string;
  deliveryFee: number;
  rating: number;
  inStock: boolean;
  estimatedDelivery: string;
  estimatedMinutes: number;
  isBestPrice?: boolean;
  isBestTotal?: boolean;
  isFastestDelivery?: boolean;
  totalCost?: number;
  priceHistory?: number[];
}

type SortOption = 'best-price' | 'total-cost' | 'fastest' | 'rating';

export function PriceComparison({ isOpen, onClose, product }: PriceComparisonProps) {
  const [isComparing, setIsComparing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('best-price');
  const [progress, setProgress] = useState(0);

  // Generate more realistic comparison data
  // IMPORTANT: GroceryAI is ALWAYS guaranteed to have the LOWEST/MINIMAL price
  // compared to all competitor stores (5-15% lower than cheapest competitor)
  const generateComparisons = (): StorePrice[] => {
    if (!product) return [];
    
    const basePrice = product.price;
    
    // Generate price variations (0% to +50%) - competitors are always higher
    const priceVariation = () => {
      const variance = Math.random() * 0.5 + 0.05; // +5% to +55%
      return Math.round(basePrice * (1 + variance));
    };
    
    // Generate realistic price history (last 7 days)
    const generatePriceHistory = (currentPrice: number) => {
      const history = [];
      let price = currentPrice * (0.95 + Math.random() * 0.1); // Start within ±5%
      for (let i = 0; i < 7; i++) {
        history.push(Math.round(price));
        price = price * (0.97 + Math.random() * 0.06); // Slight variations
      }
      return history;
    };

    // First, generate competitor stores with higher prices
    const competitorStores = [
      {
        storeName: 'BigBasket',
        storeType: 'Grocery Chain',
        price: priceVariation(),
        delivery: 'Standard',
        deliveryFee: 40,
        rating: 4.5,
        inStock: Math.random() > 0.1,
        estimatedDelivery: '2-3 hours',
        estimatedMinutes: 150
      },
      {
        storeName: 'Blinkit',
        storeType: 'Quick Commerce',
        price: priceVariation(),
        delivery: 'Quick',
        deliveryFee: 25,
        rating: 4.6,
        inStock: Math.random() > 0.15,
        estimatedDelivery: '10-15 mins',
        estimatedMinutes: 12
      },
      {
        storeName: 'Zepto',
        storeType: 'Ultra Fast',
        price: priceVariation(),
        delivery: 'Ultra Fast',
        deliveryFee: 20,
        rating: 4.4,
        inStock: Math.random() > 0.2,
        estimatedDelivery: '8-12 mins',
        estimatedMinutes: 10
      },
      {
        storeName: 'Swiggy Instamart',
        storeType: 'Quick Commerce',
        price: priceVariation(),
        delivery: 'Fast',
        deliveryFee: 30,
        rating: 4.3,
        inStock: Math.random() > 0.25,
        estimatedDelivery: '20-30 mins',
        estimatedMinutes: 25
      },
      {
        storeName: 'DMart Ready',
        storeType: 'Retail Chain',
        price: priceVariation(),
        delivery: 'Express',
        deliveryFee: 50,
        rating: 4.7,
        inStock: Math.random() > 0.1,
        estimatedDelivery: '1-2 hours',
        estimatedMinutes: 90
      },
      {
        storeName: 'JioMart',
        storeType: 'Online Grocery',
        price: priceVariation(),
        delivery: 'Standard',
        deliveryFee: 35,
        rating: 4.2,
        inStock: Math.random() > 0.15,
        estimatedDelivery: '3-4 hours',
        estimatedMinutes: 210
      },
      {
        storeName: 'Amazon Fresh',
        storeType: 'E-commerce',
        price: priceVariation(),
        delivery: 'Same Day',
        deliveryFee: 45,
        rating: 4.4,
        inStock: Math.random() > 0.2,
        estimatedDelivery: '2-4 hours',
        estimatedMinutes: 180
      }
    ];

    // Find the minimum price among all competitors (only in-stock)
    const inStockCompetitors = competitorStores.filter(s => s.inStock);
    const minCompetitorPrice = inStockCompetitors.length > 0 
      ? Math.min(...inStockCompetitors.map(s => s.price))
      : basePrice * 1.2; // fallback if all out of stock

    // GroceryAI price is always 5-15% lower than the cheapest competitor
    const discountPercentage = 0.05 + Math.random() * 0.10; // 5-15% discount
    const groceryAIPrice = Math.round(minCompetitorPrice * (1 - discountPercentage));

    // Ensure GroceryAI price is at least slightly lower than basePrice for consistency
    const finalGroceryAIPrice = Math.min(groceryAIPrice, basePrice);

    // Create GroceryAI store entry with the best price
    const groceryAIStore = {
      storeName: 'GroceryAI',
      storeType: 'Your Store',
      price: finalGroceryAIPrice,
      originalPrice: product.originalPrice || Math.round(finalGroceryAIPrice * 1.2),
      discount: product.originalPrice 
        ? Math.round(((product.originalPrice - finalGroceryAIPrice) / product.originalPrice) * 100)
        : 20,
      delivery: 'Express',
      deliveryFee: 0, // Free delivery - best total cost!
      rating: 4.9,
      inStock: true,
      estimatedDelivery: '30-45 mins',
      estimatedMinutes: 37,
      priceHistory: generatePriceHistory(finalGroceryAIPrice)
    };

    // Combine all stores
    const stores = [groceryAIStore, ...competitorStores];

    // Add discounts and price history to competitor stores
    const storesWithDiscounts = stores.map(store => {
      if (store.storeName !== 'GroceryAI') {
        // Add price history for competitors
        const storeWithHistory = {
          ...store,
          priceHistory: generatePriceHistory(store.price)
        };
        
        // Add discounts to some competitor items
        if (Math.random() > 0.4) {
          const discountPercent = Math.floor(Math.random() * 25) + 5; // 5-30% discount
          const originalPrice = Math.round(store.price / (1 - discountPercent / 100));
          return {
            ...storeWithHistory,
            originalPrice,
            discount: discountPercent
          };
        }
        return storeWithHistory;
      }
      return store;
    });

    // Calculate total costs and identify best options
    const inStockStores = storesWithDiscounts.filter(s => s.inStock);
    const bestPrice = Math.min(...inStockStores.map(s => s.price));
    const fastestDelivery = Math.min(...inStockStores.map(s => s.estimatedMinutes));
    
    return storesWithDiscounts.map(store => {
      const totalCost = store.price + store.deliveryFee;
      return {
        ...store,
        totalCost,
        isBestPrice: store.inStock && store.price === bestPrice,
        isFastestDelivery: store.inStock && store.estimatedMinutes === fastestDelivery
      };
    }).map((store, _, arr) => {
      const inStockStoresWithTotal = arr.filter(s => s.inStock);
      const bestTotalCost = Math.min(...inStockStoresWithTotal.map(s => s.totalCost!));
      return {
        ...store,
        isBestTotal: store.inStock && store.totalCost === bestTotalCost
      };
    });
  };

  const [storePrices, setStorePrices] = useState<StorePrice[]>([]);

  // Auto-start comparison when dialog opens
  useEffect(() => {
    if (isOpen && product) {
      setShowResults(false);
      setIsComparing(true);
      setProgress(0);
      
      // Reset and generate new comparisons
      const newComparisons = generateComparisons();
      setStorePrices(newComparisons);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 150);

      // Show results after animation
      const timer = setTimeout(() => {
        clearInterval(progressInterval);
        setIsComparing(false);
        setShowResults(true);
        setProgress(100);
        
        const inStockCount = newComparisons.filter(s => s.inStock).length;
        toast.success('Price comparison complete! 🎯', {
          description: `Compared prices across ${inStockCount} stores`
        });
      }, 1800);

      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
      };
    }
  }, [isOpen, product]);

  if (!product) return null;

  const inStockStores = storePrices.filter(s => s.inStock);
  const bestPrice = inStockStores.length > 0 ? Math.min(...inStockStores.map(s => s.price)) : 0;
  const avgPrice = inStockStores.length > 0 ? inStockStores.reduce((sum, s) => sum + s.price, 0) / inStockStores.length : 0;
  const bestTotalCost = inStockStores.length > 0 ? Math.min(...inStockStores.map(s => s.totalCost!)) : 0;
  const yourStore = storePrices.find(s => s.storeName === 'GroceryAI');
  const yourSavings = yourStore && yourStore.inStock ? avgPrice - yourStore.price : 0;
  const yourTotalSavings = yourStore && yourStore.inStock ? avgPrice + 35 - (yourStore.price + yourStore.deliveryFee) : 0;

  const handleStartComparison = () => {
    setIsComparing(true);
    setProgress(0);
    
    const newComparisons = generateComparisons();
    setStorePrices(newComparisons);
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    toast.info('Refreshing prices...', {
      description: 'Scanning all stores for latest prices'
    });

    setTimeout(() => {
      clearInterval(progressInterval);
      setIsComparing(false);
      setShowResults(true);
      setProgress(100);
      toast.success('Prices updated! ✨');
    }, 1800);
  };

  // Sort stores based on selected option
  const sortedStores = [...storePrices].sort((a, b) => {
    switch (sortBy) {
      case 'best-price':
        if (!a.inStock) return 1;
        if (!b.inStock) return -1;
        return a.price - b.price;
      case 'total-cost':
        if (!a.inStock) return 1;
        if (!b.inStock) return -1;
        return a.totalCost! - b.totalCost!;
      case 'fastest':
        if (!a.inStock) return 1;
        if (!b.inStock) return -1;
        return a.estimatedMinutes - b.estimatedMinutes;
      case 'rating':
        if (!a.inStock) return 1;
        if (!b.inStock) return -1;
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const handleSetPriceAlert = () => {
    toast.success('Price alert set! 🔔', {
      description: 'We\'ll notify you when the price drops'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            AI Price Comparison - Lowest Price Guaranteed
          </DialogTitle>
          <DialogDescription>
            GroceryAI always shows the minimal price compared to all major stores
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Product Info */}
          <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-lg">
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h4>{product.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-emerald-600 dark:text-emerald-400">
                  ₹{product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleStartComparison}
              disabled={isComparing}
            >
              {isComparing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </>
              )}
            </Button>
          </div>

          {isComparing && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {progress < 30 && 'Connecting to stores...'}
                  {progress >= 30 && progress < 60 && 'Fetching prices...'}
                  {progress >= 60 && progress < 90 && 'Analyzing deals...'}
                  {progress >= 90 && 'Finalizing comparison...'}
                </span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Scanning {storePrices.length} stores for the best price...
              </p>
            </div>
          )}

          {!isComparing && !showResults && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/20 mb-4">
                <CheckCircle className="h-10 w-10 text-emerald-600" />
              </div>
              <h4 className="mb-2">🎯 Lowest Price Guarantee</h4>
              <p className="text-sm text-muted-foreground mb-6">
                Our AI scans 7+ stores in real-time and guarantees GroceryAI shows the minimal price across all platforms
              </p>
              <Button
                className="bg-emerald-500 hover:bg-emerald-600"
                onClick={handleStartComparison}
              >
                <Zap className="h-4 w-4 mr-2" />
                Start Comparison
              </Button>
            </div>
          )}

          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* GroceryAI Best Price Banner */}
              {yourStore && yourStore.inStock && (
                <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white p-5 rounded-xl shadow-lg border-2 border-emerald-400">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                      <CheckCircle className="h-7 w-7" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-bold text-white">🎯 GroceryAI Has the Lowest Price!</h3>
                        <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-400 font-bold">
                          GUARANTEED
                        </Badge>
                      </div>
                      <p className="text-white/90 text-sm">
                        Our AI ensures you always get the minimum price across all major stores. Save ₹{yourSavings.toFixed(0)} compared to market average + FREE delivery!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-1 mb-1">
                    <CheckCircle className="h-3 w-3 text-emerald-600" />
                    <p className="text-xs text-muted-foreground">GroceryAI Price</p>
                  </div>
                  <p className="text-emerald-600 dark:text-emerald-400">₹{bestPrice}</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Lowest!</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-1 mb-1">
                    <TrendingUp className="h-3 w-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Avg. Price</p>
                  </div>
                  <p className="text-blue-600 dark:text-blue-400">₹{avgPrice.toFixed(0)}</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-1 mb-1">
                    <Package className="h-3 w-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Best Total</p>
                  </div>
                  <p className="text-purple-600 dark:text-purple-400">₹{bestTotalCost}</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-1 mb-1">
                    <Zap className="h-3 w-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">You Save</p>
                  </div>
                  <p className="text-orange-600 dark:text-orange-400">₹{yourSavings.toFixed(0)}</p>
                </div>
              </div>

              {/* Sort Options */}
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Sort by:</span>
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                    <SelectTrigger className="w-[160px] h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="best-price">
                        <div className="flex items-center gap-2">
                          <IndianRupee className="h-3 w-3" />
                          Best Price
                        </div>
                      </SelectItem>
                      <SelectItem value="total-cost">
                        <div className="flex items-center gap-2">
                          <Package className="h-3 w-3" />
                          Total Cost
                        </div>
                      </SelectItem>
                      <SelectItem value="fastest">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          Fastest Delivery
                        </div>
                      </SelectItem>
                      <SelectItem value="rating">
                        <div className="flex items-center gap-2">
                          <Star className="h-3 w-3" />
                          Top Rated
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-sm text-muted-foreground">
                  {inStockStores.length} of {storePrices.length} stores have stock
                </div>
              </div>

              <Separator />

              {/* Store Comparisons */}
              <div className="space-y-3">
                <h4>Store Comparison Results</h4>
                {sortedStores.map((store, index) => (
                  <motion.div
                    key={store.storeName}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-lg border transition-all ${
                      store.isBestPrice || store.isBestTotal
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 shadow-sm'
                        : 'bg-muted/30 border-border hover:border-border/60'
                    } ${!store.inStock ? 'opacity-50' : ''}`}
                  >
                    <div className="space-y-3">
                      {/* Store Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            store.isBestPrice || store.isBestTotal ? 'bg-emerald-500' : 'bg-muted'
                          }`}>
                            <Store className={`h-6 w-6 ${
                              store.isBestPrice || store.isBestTotal ? 'text-white' : 'text-muted-foreground'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="font-medium">{store.storeName}</span>
                              {store.storeName === 'GroceryAI' && (
                                <>
                                  <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 h-5">
                                    <Zap className="h-3 w-3 mr-1" />
                                    Your Store
                                  </Badge>
                                  <Badge className="bg-yellow-400 text-yellow-900 h-5">
                                    💰 Cheapest
                                  </Badge>
                                </>
                              )}
                              {store.isBestPrice && (
                                <Badge className="bg-emerald-500 h-5">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Best Price
                                </Badge>
                              )}
                              {store.isBestTotal && !store.isBestPrice && (
                                <Badge className="bg-purple-500 h-5">
                                  <Package className="h-3 w-3 mr-1" />
                                  Best Total
                                </Badge>
                              )}
                              {store.isFastestDelivery && (
                                <Badge className="bg-blue-500 h-5">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Fastest
                                </Badge>
                              )}
                              {!store.inStock && (
                                <Badge variant="destructive" className="h-5">
                                  Out of Stock
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{store.storeType}</p>
                          </div>
                        </div>
                      </div>

                      {/* Price Info */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-xl ${store.isBestPrice ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                              ₹{store.price}
                            </span>
                            {store.originalPrice && (
                              <>
                                <span className="text-sm text-muted-foreground line-through">
                                  ₹{store.originalPrice}
                                </span>
                                <Badge variant="secondary" className="h-5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                                  {store.discount}% OFF
                                </Badge>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-muted-foreground">+ Delivery ₹{store.deliveryFee}</span>
                            <span className="text-muted-foreground">•</span>
                            <span className={store.isBestTotal ? 'text-purple-600 dark:text-purple-400 font-medium' : 'text-muted-foreground'}>
                              Total: ₹{store.totalCost}
                            </span>
                          </div>
                        </div>

                        {store.inStock && store.price > bestPrice && (
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                              <TrendingUp className="h-4 w-4" />
                              <span className="text-sm font-medium">+₹{store.price - bestPrice}</span>
                            </div>
                            <p className="text-xs text-red-600 dark:text-red-400">
                              {Math.round(((store.price - bestPrice) / bestPrice) * 100)}% costlier
                            </p>
                          </div>
                        )}
                        {store.inStock && store.price === bestPrice && store.storeName !== 'GroceryAI' && (
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                              <TrendingDown className="h-4 w-4" />
                              <span className="text-sm">Best!</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Delivery & Rating Info */}
                      <div className="flex items-center justify-between pt-2 border-t border-border/50">
                        <div className="flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            <span>{store.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span>{store.estimatedDelivery}</span>
                          </div>
                        </div>
                        <div className="text-xs">
                          <Badge variant="outline" className="h-6">
                            {store.delivery}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Separator />

              {/* Savings Summary */}
              {yourStore && yourStore.inStock && (
                <div className="space-y-4">
                  {/* Main Savings Card */}
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-5 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <CheckCircle className="h-6 w-6 flex-shrink-0" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white mb-2">
                          {yourStore.isBestPrice ? "You're Getting the Best Price! 🎉" : "Great Choice! 💚"}
                        </h4>
                        <div className="space-y-2 text-sm text-white/90">
                          <div className="flex items-center justify-between">
                            <span>Your Price:</span>
                            <span className="font-medium">₹{yourStore.price}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Average Market Price:</span>
                            <span className="font-medium">₹{avgPrice.toFixed(0)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Delivery Fee:</span>
                            <span className="font-medium">{yourStore.deliveryFee === 0 ? 'FREE 🎁' : `₹${yourStore.deliveryFee}`}</span>
                          </div>
                          <Separator className="bg-white/20" />
                          <div className="flex items-center justify-between text-base">
                            <span className="font-medium">Total Savings:</span>
                            <span className="font-medium text-lg">₹{yourTotalSavings.toFixed(0)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Benefits */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs text-muted-foreground">Free Delivery</span>
                      </div>
                      <p className="text-sm text-blue-600 dark:text-blue-400">Save ₹{Math.round(storePrices.filter(s => s.inStock).reduce((sum, s) => sum + s.deliveryFee, 0) / inStockStores.length)}</p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-950/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-xs text-muted-foreground">Top Rated</span>
                      </div>
                      <p className="text-sm text-purple-600 dark:text-purple-400">{yourStore.rating} ⭐ Rating</p>
                    </div>
                  </div>
                </div>
              )}

              {yourStore && !yourStore.inStock && (
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-amber-900 dark:text-amber-100 mb-1">Currently Out of Stock</h4>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        The best price is ₹{bestPrice} at {storePrices.find(s => s.price === bestPrice && s.inStock)?.storeName}. 
                        We'll notify you when this item is back in stock!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleSetPriceAlert}
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Set Price Alert
                </Button>
                <Button
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                  onClick={onClose}
                >
                  Continue Shopping
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
