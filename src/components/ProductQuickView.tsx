import { useState } from 'react';
import { X, ShoppingCart, Heart, Share2, RotateCcw, Maximize2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';

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

interface ProductQuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  onRemoveFromWishlist: (id: string) => void;
  isInWishlist: boolean;
}

export function ProductQuickView({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart,
  onAddToWishlist,
  onRemoveFromWishlist,
  isInWishlist
}: ProductQuickViewProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * 30;
    const y = ((e.clientX - rect.left) / rect.width - 0.5) * -30;
    setRotation({ x, y });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>3D Product Preview</span>
            <div className="flex gap-2">
              <Button 
                size="icon" 
                variant="ghost"
                onClick={() => toast.success('Product link copied to clipboard! 🔗', {
                  description: 'Share with your friends'
                })}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost"
                onClick={() => {
                  if (isInWishlist) {
                    onRemoveFromWishlist(product.id);
                  } else {
                    onAddToWishlist(product);
                  }
                }}
              >
                <Heart className={`h-4 w-4 transition-all ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>
          </DialogTitle>
          <DialogDescription className="sr-only">
            Interactive 3D view with product details, nutritional information, and customer reviews
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          {/* 3D Interactive Preview */}
          <div className="space-y-4">
            <div
              className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 h-96 flex items-center justify-center overflow-hidden cursor-move"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <motion.div
                animate={{
                  rotateX: rotation.x,
                  rotateY: rotation.y,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="relative"
              >
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-80 object-contain drop-shadow-2xl"
                />
              </motion.div>
              
              <div className="absolute bottom-4 right-4 flex gap-2">
                <Button 
                  size="sm" 
                  variant="secondary"
                  onClick={() => {
                    setRotation({ x: 0, y: 0 });
                    toast.info('3D view reset');
                  }}
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Reset
                </Button>
                <Button 
                  size="sm" 
                  variant="secondary"
                  onClick={() => toast.info('Opening AR camera view... 📱', {
                    description: 'See how this product looks in your space'
                  })}
                >
                  <Maximize2 className="h-3 w-3 mr-1" />
                  AR View
                </Button>
              </div>

              <div className="absolute top-4 left-4">
                <Badge className="bg-purple-500">Move mouse to rotate</Badge>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border-2 border-border rounded-lg overflow-hidden cursor-pointer hover:border-emerald-500 transition-colors">
                  <ImageWithFallback
                    src={product.image}
                    alt={`View ${i}`}
                    className="w-full h-20 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground uppercase">{product.category}</p>
              <h2 className="mt-1">{product.name}</h2>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">
                    {i < Math.floor(product.rating) ? '★' : '☆'}
                  </span>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({product.rating} / 5) · 234 reviews</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-emerald-600 dark:text-emerald-400">₹{product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-muted-foreground line-through">
                    ₹{product.originalPrice}
                  </span>
                  <Badge variant="destructive">Save {product.discount}%</Badge>
                </>
              )}
            </div>

            {/* Badges */}
            <div className="flex gap-2 flex-wrap">
              {product.organic && <Badge variant="secondary">🌱 Organic Certified</Badge>}
              {product.flashSale && <Badge className="bg-red-500">⚡ Flash Sale</Badge>}
              {product.aiRecommended && <Badge className="bg-purple-500">✨ AI Recommended</Badge>}
              <Badge variant="outline">🚚 Free Delivery</Badge>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span>Quantity:</span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                onClick={() => {
                  for (let i = 0; i < quantity; i++) {
                    onAddToCart(product);
                  }
                  toast.success(`${quantity}x ${product.name} added to cart! 🛒`);
                  onClose();
                }}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  toast.success('Redirecting to express checkout... ⚡', {
                    description: `Total: ₹${product.price * quantity}`
                  });
                  onClose();
                }}
              >
                Buy Now
              </Button>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="details" className="mt-6">
              <TabsList className="w-full">
                <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
                <TabsTrigger value="nutrition" className="flex-1">Nutrition</TabsTrigger>
                <TabsTrigger value="ai" className="flex-1">AI Insights</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-2 mt-4">
                <p className="text-sm">Premium quality {product.name.toLowerCase()} sourced from local farms.</p>
                <p className="text-sm text-muted-foreground">• Fresh and handpicked</p>
                <p className="text-sm text-muted-foreground">• Pesticide-free guarantee</p>
                <p className="text-sm text-muted-foreground">• Delivered within 2 hours</p>
              </TabsContent>
              <TabsContent value="nutrition" className="space-y-2 mt-4">
                <p className="text-sm">Nutritional Information (per 100g):</p>
                <p className="text-sm text-muted-foreground">Calories: 52 kcal</p>
                <p className="text-sm text-muted-foreground">Protein: 1.2g</p>
                <p className="text-sm text-muted-foreground">Carbs: 12g</p>
                <p className="text-sm text-muted-foreground">Fiber: 2.4g</p>
              </TabsContent>
              <TabsContent value="ai" className="space-y-2 mt-4">
                <p className="text-sm">✨ AI Recommendations:</p>
                <p className="text-sm text-muted-foreground">• Pairs well with your recent pasta purchase</p>
                <p className="text-sm text-muted-foreground">• 89% of similar shoppers also bought cheese</p>
                <p className="text-sm text-muted-foreground">• Best price in your area (15% below average)</p>
                <p className="text-sm text-muted-foreground">• Peak freshness: Order within 2 days</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
