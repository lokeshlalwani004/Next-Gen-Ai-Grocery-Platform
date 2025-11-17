import { useState } from 'react';
import { X, Trash2, Users, CreditCard, Sparkles, Tag } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onExpressCheckout?: () => void;
}

export function ShoppingCart({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem, onExpressCheckout }: ShoppingCartProps) {
  const [groupCartEnabled, setGroupCartEnabled] = useState(false);
  const [splitPaymentEnabled, setSplitPaymentEnabled] = useState(false);
  
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const autoCouponSavings = 150;
  const delivery = subtotal > 500 ? 0 : 49;
  const total = subtotal - autoCouponSavings + delivery;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({items.length} items)</SheetTitle>
          <SheetDescription>
            Smart suggestions and auto-applied coupons active
          </SheetDescription>
        </SheetHeader>

        {/* Cart Items */}
        <ScrollArea className="flex-1 -mx-6 px-6 my-4">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm line-clamp-2">{item.name}</h4>
                  <p className="text-emerald-600 dark:text-emerald-400 mt-1">
                    ₹{item.price}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 w-7 p-0"
                      onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    >
                      -
                    </Button>
                    <span className="text-sm w-8 text-center">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 w-7 p-0"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => onRemoveItem(item.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}

            {items.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>Your cart is empty</p>
                <p className="text-sm mt-2">Add items to get started!</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {items.length > 0 && (
          <>
            {/* AI Suggestions */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-4 rounded-lg mb-4">
              <div className="flex items-start gap-2">
                <Sparkles className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm">AI Suggestion</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Add bread to get free delivery! Only ₹{Math.max(0, 500 - subtotal)} more needed.
                  </p>
                </div>
              </div>
            </div>

            {/* Group Cart & Split Payment */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="group-cart">Enable Group Cart</Label>
                </div>
                <Switch 
                  id="group-cart" 
                  checked={groupCartEnabled}
                  onCheckedChange={(checked) => {
                    setGroupCartEnabled(checked);
                    toast.success(checked ? 'Group cart enabled! Share link to split items 👥' : 'Group cart disabled');
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="split-payment">Split Payment</Label>
                </div>
                <Switch 
                  id="split-payment" 
                  checked={splitPaymentEnabled}
                  onCheckedChange={(checked) => {
                    setSplitPaymentEnabled(checked);
                    toast.success(checked ? 'Split payment enabled! Divide bill among friends 💳' : 'Split payment disabled');
                  }}
                />
              </div>
            </div>

            <Separator className="mb-4" />

            {/* Price Summary */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  Auto-applied Coupons
                </span>
                <span className="text-emerald-600">-₹{autoCouponSavings}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery</span>
                <span>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>Total</span>
                <span className="text-emerald-600 dark:text-emerald-400">₹{total}</span>
              </div>
            </div>

            {/* Checkout Buttons */}
            <div className="space-y-2">
              <Button 
                className="w-full bg-emerald-500 hover:bg-emerald-600"
                onClick={() => {
                  onClose();
                  if (onExpressCheckout) {
                    onExpressCheckout();
                  }
                }}
                disabled={items.length === 0}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Express Checkout (1-Click)
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  onClose();
                  toast.info('Continue shopping for more great deals! 🛍️');
                }}
              >
                Continue Shopping
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-2">
                🔒 Secure checkout with biometric verification
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
