import { X, ShoppingCart, Trash2, Share2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  inStock: boolean;
}

interface WishlistPanelProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistItems: WishlistItem[];
  onAddToCart: (item: WishlistItem) => void;
  onRemoveFromWishlist: (id: string) => void;
}

export function WishlistPanel({ 
  isOpen, 
  onClose, 
  wishlistItems, 
  onAddToCart, 
  onRemoveFromWishlist 
}: WishlistPanelProps) {

  const handleShareWishlist = () => {
    toast.success('Wishlist link copied! 🔗', {
      description: 'Share your wishlist with friends and family',
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>My Wishlist ({wishlistItems.length} items)</span>
            <Button
              size="sm"
              variant="outline"
              onClick={handleShareWishlist}
            >
              <Share2 className="h-3 w-3 mr-1" />
              Share
            </Button>
          </SheetTitle>
          <SheetDescription>
            Save your favorite items and get notified about price drops
          </SheetDescription>
        </SheetHeader>

        {/* Wishlist Items */}
        <ScrollArea className="flex-1 -mx-6 px-6 my-4">
          <div className="space-y-4">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 p-3 bg-muted/30 rounded-lg border border-border"
              >
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm line-clamp-2">{item.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-emerald-600 dark:text-emerald-400">
                      ₹{item.price}
                    </p>
                    {item.originalPrice && (
                      <p className="text-xs text-muted-foreground line-through">
                        ₹{item.originalPrice}
                      </p>
                    )}
                  </div>
                  {!item.inStock && (
                    <p className="text-xs text-red-500 mt-1">Out of Stock</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      size="sm"
                      className="bg-emerald-500 hover:bg-emerald-600 h-7 text-xs"
                      disabled={!item.inStock}
                      onClick={() => onAddToCart(item)}
                    >
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      {item.inStock ? 'Add to Cart' : 'Notify Me'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      onClick={() => onRemoveFromWishlist(item.id)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {wishlistItems.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>Your wishlist is empty</p>
                <p className="text-sm mt-2">Add items you love to save them for later!</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        {wishlistItems.length > 0 && (
          <div className="space-y-2 pt-4 border-t">
            <Button
              className="w-full bg-emerald-500 hover:bg-emerald-600"
              onClick={() => {
                const inStockItems = wishlistItems.filter(item => item.inStock);
                inStockItems.forEach(item => onAddToCart(item));
                toast.success(`Adding ${inStockItems.length} items to cart! 🛒`, {
                  description: 'In-stock wishlist items added',
                });
              }}
            >
              Add All to Cart
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              💡 We'll notify you when prices drop!
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
