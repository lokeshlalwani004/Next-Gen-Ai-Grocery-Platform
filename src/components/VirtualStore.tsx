import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, ShoppingCart, Info, Zap, Star, ArrowLeft, ArrowRight, Tag } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface VirtualStoreProps {
  onAddToCart: (itemName: string) => void;
}

interface Product {
  name: string;
  price: number;
  originalPrice?: number;
  emoji: string;
  description: string;
  rating: number;
  inStock: boolean;
  discount?: number;
}

interface Aisle {
  name: string;
  products: Product[];
  color: string;
  icon: string;
}

export function VirtualStore({ onAddToCart }: VirtualStoreProps) {
  const [currentAisle, setCurrentAisle] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  const aisles: Aisle[] = [
    {
      name: 'Fresh Produce',
      icon: '🥬',
      color: 'from-green-500 to-emerald-600',
      products: [
        {
          name: 'Organic Tomatoes',
          price: 399,
          originalPrice: 549,
          emoji: '🍅',
          description: 'Farm fresh organic tomatoes, rich in vitamins',
          rating: 4.8,
          inStock: true,
          discount: 27
        },
        {
          name: 'Fresh Lettuce',
          price: 249,
          emoji: '🥬',
          description: 'Crisp green lettuce, perfect for salads',
          rating: 4.6,
          inStock: true
        },
        {
          name: 'Sweet Bell Peppers',
          price: 299,
          originalPrice: 399,
          emoji: '🫑',
          description: 'Colorful bell peppers packed with nutrients',
          rating: 4.7,
          inStock: true,
          discount: 25
        },
        {
          name: 'Fresh Carrots',
          price: 149,
          emoji: '🥕',
          description: 'Crunchy and sweet organic carrots',
          rating: 4.9,
          inStock: true
        }
      ]
    },
    {
      name: 'Dairy & Eggs',
      icon: '🥛',
      color: 'from-blue-500 to-cyan-600',
      products: [
        {
          name: 'Fresh Whole Milk',
          price: 89,
          emoji: '🥛',
          description: 'Pure full cream milk, delivered daily',
          rating: 4.9,
          inStock: true
        },
        {
          name: 'Greek Yogurt',
          price: 149,
          originalPrice: 199,
          emoji: '🥄',
          description: 'Creamy Greek yogurt, high in protein',
          rating: 4.8,
          inStock: true,
          discount: 25
        },
        {
          name: 'Organic Free-Range Eggs',
          price: 199,
          emoji: '🥚',
          description: 'Farm fresh organic eggs (12 pcs)',
          rating: 4.7,
          inStock: true
        },
        {
          name: 'Premium Butter',
          price: 299,
          emoji: '🧈',
          description: 'Rich and creamy butter (500g)',
          rating: 4.6,
          inStock: true
        }
      ]
    },
    {
      name: 'Bakery',
      icon: '🥖',
      color: 'from-amber-500 to-orange-600',
      products: [
        {
          name: 'Whole Wheat Bread',
          price: 449,
          originalPrice: 649,
          emoji: '🍞',
          description: 'Freshly baked whole wheat bread',
          rating: 4.8,
          inStock: true,
          discount: 31
        },
        {
          name: 'Butter Croissants',
          price: 299,
          emoji: '🥐',
          description: 'Flaky French croissants (4 pcs)',
          rating: 4.9,
          inStock: true
        },
        {
          name: 'Bagels Assorted',
          price: 249,
          emoji: '🥯',
          description: 'Fresh bagels in various flavors',
          rating: 4.5,
          inStock: true
        },
        {
          name: 'Chocolate Muffins',
          price: 349,
          originalPrice: 449,
          emoji: '🧁',
          description: 'Rich chocolate muffins (6 pcs)',
          rating: 4.7,
          inStock: true,
          discount: 22
        }
      ]
    },
    {
      name: 'Beverages',
      icon: '☕',
      color: 'from-purple-500 to-pink-600',
      products: [
        {
          name: 'Fresh Orange Juice',
          price: 199,
          emoji: '🍊',
          description: 'Freshly squeezed orange juice (1L)',
          rating: 4.8,
          inStock: true
        },
        {
          name: 'Premium Coffee Beans',
          price: 599,
          originalPrice: 799,
          emoji: '☕',
          description: 'Arabica coffee beans (500g)',
          rating: 4.9,
          inStock: true,
          discount: 25
        },
        {
          name: 'Green Tea Box',
          price: 349,
          emoji: '🍵',
          description: 'Organic green tea (25 bags)',
          rating: 4.6,
          inStock: true
        },
        {
          name: 'Sparkling Water',
          price: 149,
          emoji: '💧',
          description: 'Premium sparkling water (1L)',
          rating: 4.5,
          inStock: true
        }
      ]
    },
    {
      name: 'Snacks & Treats',
      icon: '🍿',
      color: 'from-red-500 to-rose-600',
      products: [
        {
          name: 'Potato Chips',
          price: 199,
          originalPrice: 249,
          emoji: '🍟',
          description: 'Crispy potato chips (200g)',
          rating: 4.7,
          inStock: true,
          discount: 20
        },
        {
          name: 'Chocolate Bar',
          price: 149,
          emoji: '🍫',
          description: 'Premium dark chocolate (100g)',
          rating: 4.8,
          inStock: true
        },
        {
          name: 'Mixed Nuts',
          price: 449,
          emoji: '🥜',
          description: 'Roasted mixed nuts (250g)',
          rating: 4.9,
          inStock: true
        },
        {
          name: 'Popcorn Pack',
          price: 99,
          emoji: '🍿',
          description: 'Microwave popcorn (3 packs)',
          rating: 4.5,
          inStock: true
        }
      ]
    },
    {
      name: 'Frozen Foods',
      icon: '🧊',
      color: 'from-cyan-500 to-blue-600',
      products: [
        {
          name: 'Ice Cream Tub',
          price: 399,
          originalPrice: 499,
          emoji: '🍨',
          description: 'Premium vanilla ice cream (1L)',
          rating: 4.8,
          inStock: true,
          discount: 20
        },
        {
          name: 'Frozen Pizza',
          price: 299,
          emoji: '🍕',
          description: 'Cheese & vegetable pizza',
          rating: 4.6,
          inStock: true
        },
        {
          name: 'Frozen Vegetables',
          price: 199,
          emoji: '🥦',
          description: 'Mixed vegetables (500g)',
          rating: 4.7,
          inStock: true
        },
        {
          name: 'Frozen Berries',
          price: 349,
          emoji: '🫐',
          description: 'Mixed berries (400g)',
          rating: 4.9,
          inStock: true
        }
      ]
    }
  ];

  const currentAisleData = aisles[currentAisle];

  const nextAisle = () => {
    setCurrentAisle((prev) => (prev + 1) % aisles.length);
    toast.info(`Now browsing: ${aisles[(currentAisle + 1) % aisles.length].name}`, {
      description: 'Use arrow keys to navigate faster'
    });
  };

  const prevAisle = () => {
    setCurrentAisle((prev) => (prev - 1 + aisles.length) % aisles.length);
    toast.info(`Now browsing: ${aisles[(currentAisle - 1 + aisles.length) % aisles.length].name}`, {
      description: 'Use arrow keys to navigate faster'
    });
  };

  const handleAddToCart = (product: Product) => {
    onAddToCart(product.name);
    toast.success(`${product.name} added to cart! 🛒`, {
      description: `₹${product.price} • Added from Virtual Store`
    });
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    handleAddToCart(product);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextAisle();
      } else if (e.key === 'ArrowLeft') {
        prevAisle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentAisle]);

  return (
    <>
      <Card className="overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{currentAisleData.icon}</span>
              <div>
                <h3 className="text-white">Virtual Store Walkthrough</h3>
                <p className="text-white/90 text-sm mt-1">
                  Navigate through our virtual supermarket - Interactive 360° Experience
                </p>
              </div>
            </div>
            <Button 
              size="sm" 
              variant="secondary"
              onClick={() => {
                setIsFullscreen(!isFullscreen);
                toast.info(isFullscreen ? 'Exited fullscreen mode' : 'Fullscreen mode activated! 🎮', {
                  description: isFullscreen ? '' : 'Use arrow keys to navigate aisles'
                });
              }}
            >
              <Maximize2 className="h-4 w-4 mr-2" />
              {isFullscreen ? 'Exit' : 'Fullscreen VR'}
            </Button>
          </div>
        </div>

        {/* Virtual Aisle View */}
        <div className={`relative ${isFullscreen ? 'h-[600px]' : 'h-96'} bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 transition-all duration-300`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentAisle}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              {/* Aisle Background with 3D Effect */}
              <div className={`absolute inset-0 bg-gradient-to-t ${currentAisleData.color} opacity-20`} />

              {/* Enhanced Perspective Grid */}
              <div className="absolute inset-0 overflow-hidden">
                <div 
                  className="absolute inset-0" 
                  style={{
                    background: `
                      linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.05) 50%, transparent 100%),
                      repeating-linear-gradient(
                        0deg,
                        rgba(0,0,0,0.03) 0px,
                        transparent 1px,
                        transparent 40px,
                        rgba(0,0,0,0.03) 41px
                      )
                    `,
                  }} 
                />
              </div>

              {/* Floating Aisle Sign */}
              <motion.div 
                className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div className={`bg-gradient-to-r ${currentAisleData.color} text-white px-8 py-4 rounded-xl shadow-2xl border-2 border-white/20`}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{currentAisleData.icon}</span>
                    <div>
                      <h4 className="text-white text-center">{currentAisleData.name}</h4>
                      <p className="text-xs text-white/90 text-center mt-1">
                        Aisle {currentAisle + 1} of {aisles.length} • {currentAisleData.products.length} items
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Product Shelves with 3D Perspective */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {currentAisleData.products.map((product, idx) => (
                    <motion.div
                      key={product.name}
                      initial={{ opacity: 0, y: 50, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      onHoverStart={() => setHoveredProduct(idx)}
                      onHoverEnd={() => setHoveredProduct(null)}
                    >
                      <Card 
                        className={`p-4 hover:shadow-2xl transition-all cursor-pointer group relative ${
                          hoveredProduct === idx ? 'scale-105 border-2 border-emerald-500' : ''
                        }`}
                        onClick={() => handleProductClick(product)}
                      >
                        {/* Discount Badge */}
                        {product.discount && (
                          <Badge className="absolute -top-2 -right-2 bg-red-500 z-10">
                            -{product.discount}%
                          </Badge>
                        )}

                        {/* Product Image/Emoji */}
                        <div className={`h-24 bg-gradient-to-br ${currentAisleData.color} rounded-lg mb-3 flex items-center justify-center transform transition-transform group-hover:scale-110`}>
                          <div className="text-5xl">{product.emoji}</div>
                        </div>

                        {/* Product Info */}
                        <div className="space-y-2">
                          <p className="text-sm line-clamp-1">{product.name}</p>
                          
                          {/* Rating */}
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-muted-foreground">{product.rating}</span>
                          </div>

                          {/* Price */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-emerald-600 dark:text-emerald-400">
                                ₹{product.price}
                              </span>
                              {product.originalPrice && (
                                <span className="text-xs text-muted-foreground line-through">
                                  ₹{product.originalPrice}
                                </span>
                              )}
                            </div>
                            <Button
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity h-7 bg-emerald-500 hover:bg-emerald-600"
                              onClick={(e) => handleQuickAdd(product, e)}
                            >
                              <ShoppingCart className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Stock Status */}
                          {product.inStock ? (
                            <Badge variant="secondary" className="text-xs">
                              In Stock
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="text-xs">
                              Out of Stock
                            </Badge>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <Button
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 h-14 w-14 rounded-full bg-white/90 dark:bg-black/90 hover:bg-white dark:hover:bg-black shadow-2xl border-2 border-gray-200 dark:border-gray-700"
            onClick={prevAisle}
          >
            <ChevronLeft className="h-7 w-7" />
          </Button>
          <Button
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 h-14 w-14 rounded-full bg-white/90 dark:bg-black/90 hover:bg-white dark:hover:bg-black shadow-2xl border-2 border-gray-200 dark:border-gray-700"
            onClick={nextAisle}
          >
            <ChevronRight className="h-7 w-7" />
          </Button>

          {/* Info Badges */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Info className="h-3 w-3" />
              Click products for details
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" />
              <ArrowRight className="h-3 w-3" />
              Arrow keys to navigate
            </Badge>
          </div>

          {/* Deals Counter */}
          <div className="absolute top-4 right-4">
            <Badge className="bg-red-500 flex items-center gap-1">
              <Zap className="h-3 w-3" />
              {currentAisleData.products.filter(p => p.discount).length} Deals
            </Badge>
          </div>
        </div>

        {/* Aisle Quick Navigation */}
        <div className="p-4 border-t bg-muted/30">
          <div className="flex gap-2 justify-center flex-wrap">
            {aisles.map((aisle, idx) => (
              <Button
                key={idx}
                size="sm"
                variant={idx === currentAisle ? 'default' : 'outline'}
                onClick={() => {
                  setCurrentAisle(idx);
                  toast.info(`Jumped to: ${aisle.name}`);
                }}
                className="text-xs"
              >
                <span className="mr-1">{aisle.icon}</span>
                {aisle.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="p-4 border-t bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20">
          <div className="flex items-center justify-around text-center">
            <div>
              <p className="text-xs text-muted-foreground">Total Aisles</p>
              <p className="text-emerald-600 dark:text-emerald-400">{aisles.length}</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="text-xs text-muted-foreground">Total Products</p>
              <p className="text-emerald-600 dark:text-emerald-400">
                {aisles.reduce((sum, aisle) => sum + aisle.products.length, 0)}
              </p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="text-xs text-muted-foreground">Active Deals</p>
              <p className="text-red-600 dark:text-red-400">
                {aisles.reduce((sum, aisle) => sum + aisle.products.filter(p => p.discount).length, 0)}
              </p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="text-xs text-muted-foreground">Avg Rating</p>
              <p className="text-yellow-600 dark:text-yellow-400">
                {(aisles.reduce((sum, aisle) => 
                  sum + aisle.products.reduce((s, p) => s + p.rating, 0), 0) / 
                  aisles.reduce((sum, aisle) => sum + aisle.products.length, 0)).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-3xl">{selectedProduct?.emoji}</span>
              {selectedProduct?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedProduct?.description}
            </DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-4">
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{selectedProduct.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  ({Math.floor(Math.random() * 500 + 100)} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-2xl text-emerald-600 dark:text-emerald-400">
                  ₹{selectedProduct.price}
                </span>
                {selectedProduct.originalPrice && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      ₹{selectedProduct.originalPrice}
                    </span>
                    <Badge className="bg-red-500">
                      Save ₹{selectedProduct.originalPrice - selectedProduct.price}
                    </Badge>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div>
                {selectedProduct.inStock ? (
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                    ✓ In Stock - Ships Today
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    Out of Stock
                  </Badge>
                )}
              </div>

              {/* Features */}
              <div className="space-y-2">
                <h4 className="text-sm">Product Features:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Fresh and high quality</li>
                  <li>• Carefully selected for you</li>
                  <li>• 100% satisfaction guaranteed</li>
                  <li>• Fast delivery available</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                  onClick={() => {
                    handleAddToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  disabled={!selectedProduct.inStock}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedProduct(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
