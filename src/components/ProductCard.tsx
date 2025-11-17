import { useState } from 'react';
import { ShoppingCart, Heart, Eye, Sparkles, Zap, Leaf, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
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

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  onRemoveFromWishlist: (id: string) => void;
  isInWishlist: boolean;
  onPriceCompare?: (product: Product) => void;
}

export function ProductCard({ 
  product, 
  onAddToCart, 
  onQuickView,
  onAddToWishlist,
  onRemoveFromWishlist,
  isInWishlist,
  onPriceCompare
}: ProductCardProps) {
  const [isRotating, setIsRotating] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden group cursor-pointer relative">
        {/* Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {product.organic && (
            <Badge className="bg-green-500 hover:bg-green-500">
              <Leaf className="h-3 w-3 mr-1" />
              Organic
            </Badge>
          )}
          {product.flashSale && (
            <Badge className="bg-red-500 hover:bg-red-500 animate-pulse">
              <Zap className="h-3 w-3 mr-1" />
              Flash Sale
            </Badge>
          )}
          {product.aiRecommended && (
            <Badge className="bg-purple-500 hover:bg-purple-500">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Pick
            </Badge>
          )}
        </div>

        {/* Like Button */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-sm hover:bg-white dark:hover:bg-black"
          onClick={(e) => {
            e.stopPropagation();
            if (isInWishlist) {
              onRemoveFromWishlist(product.id);
            } else {
              onAddToWishlist(product);
            }
          }}
        >
          <Heart
            className={`h-4 w-4 transition-all ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`}
          />
        </Button>

        {/* Product Image with 3D Effect */}
        <div 
          className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900"
          onMouseEnter={() => setIsRotating(true)}
          onMouseLeave={() => setIsRotating(false)}
        >
          <motion.div
            animate={isRotating ? { rotateY: 360 } : { rotateY: 0 }}
            transition={{ duration: 2, repeat: isRotating ? Infinity : 0, ease: "linear" }}
          >
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </motion.div>
          
          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
            >
              <Eye className="h-4 w-4 mr-2" />
              Quick 3D View
            </Button>
          </div>

          {/* Discount Badge */}
          {product.discount && (
            <div className="absolute bottom-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full">
              <p className="text-xs">-{product.discount}%</p>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <p className="text-xs text-muted-foreground uppercase mb-1">{product.category}</p>
          <h4 className="mb-2 line-clamp-2">{product.name}</h4>
          
          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400">
                {i < Math.floor(product.rating) ? '★' : '☆'}
              </span>
            ))}
            <span className="text-xs text-muted-foreground ml-1">({product.rating})</span>
          </div>

          {/* Price */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 dark:text-emerald-400">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>
              {!product.inStock && (
                <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
              )}
            </div>
            {onPriceCompare && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-7 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                onClick={(e) => {
                  e.stopPropagation();
                  onPriceCompare(product);
                }}
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                Compare Prices
              </Button>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button
            className="w-full bg-emerald-500 hover:bg-emerald-600"
            disabled={!product.inStock}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.inStock ? 'Add to Cart' : 'Notify Me'}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
