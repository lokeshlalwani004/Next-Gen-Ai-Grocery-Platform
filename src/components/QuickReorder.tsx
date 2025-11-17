import { useState, useEffect } from 'react';
import { Package, ShoppingCart, Clock, X, CheckCircle, Plus, Minus, Zap, IndianRupee } from 'lucide-react';
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
import { Card } from './ui/card';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface PastOrder {
  orderId: string;
  date: string;
  items: OrderItem[];
  total: number;
}

interface QuickReorderProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: { id: string; name: string; price: number; quantity: number; image: string }) => void;
  userId: string | null;
}

export function QuickReorder({ isOpen, onClose, onAddToCart, userId }: QuickReorderProps) {
  const [pastOrders, setPastOrders] = useState<PastOrder[]>([]);
  const [selectedItems, setSelectedItems] = useState<Map<string, number>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  // Load past orders when dialog opens
  useEffect(() => {
    if (isOpen && userId) {
      loadPastOrders();
    }
  }, [isOpen, userId]);

  const loadPastOrders = async () => {
    setIsLoading(true);
    try {
      // Simulate API call - in a real app, this would fetch from Supabase
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data - last 3 orders
      const mockOrders: PastOrder[] = [
        {
          orderId: 'ORD-2024-001',
          date: '2024-10-28',
          total: 1250,
          items: [
            {
              id: '1',
              name: 'Organic Milk',
              price: 80,
              quantity: 2,
              image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&h=200&fit=crop'
            },
            {
              id: '2',
              name: 'Farm Fresh Eggs',
              price: 120,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200&h=200&fit=crop'
            },
            {
              id: '3',
              name: 'Whole Wheat Bread',
              price: 50,
              quantity: 3,
              image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop'
            },
            {
              id: '4',
              name: 'Fresh Tomatoes',
              price: 60,
              quantity: 2,
              image: 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=200&h=200&fit=crop'
            },
            {
              id: '5',
              name: 'Basmati Rice 5kg',
              price: 450,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop'
            }
          ]
        },
        {
          orderId: 'ORD-2024-002',
          date: '2024-10-25',
          total: 890,
          items: [
            {
              id: '6',
              name: 'Greek Yogurt',
              price: 150,
              quantity: 2,
              image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&h=200&fit=crop'
            },
            {
              id: '7',
              name: 'Fresh Spinach',
              price: 40,
              quantity: 2,
              image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=200&h=200&fit=crop'
            },
            {
              id: '8',
              name: 'Chicken Breast',
              price: 320,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=200&h=200&fit=crop'
            }
          ]
        },
        {
          orderId: 'ORD-2024-003',
          date: '2024-10-20',
          total: 750,
          items: [
            {
              id: '9',
              name: 'Fresh Oranges',
              price: 100,
              quantity: 2,
              image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=200&h=200&fit=crop'
            },
            {
              id: '10',
              name: 'Olive Oil',
              price: 350,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&h=200&fit=crop'
            }
          ]
        }
      ];

      setPastOrders(mockOrders);
      
      // Pre-select all items from the most recent order
      if (mockOrders.length > 0) {
        const newSelection = new Map<string, number>();
        mockOrders[0].items.forEach(item => {
          newSelection.set(item.id, item.quantity);
        });
        setSelectedItems(newSelection);
      }
    } catch (error) {
      console.error('Error loading past orders:', error);
      toast.error('Failed to load past orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (itemId: string, delta: number) => {
    setSelectedItems(prev => {
      const newMap = new Map(prev);
      const currentQty = newMap.get(itemId) || 0;
      const newQty = Math.max(0, currentQty + delta);
      
      if (newQty === 0) {
        newMap.delete(itemId);
      } else {
        newMap.set(itemId, newQty);
      }
      
      return newMap;
    });
  };

  const handleReorderAll = () => {
    if (selectedItems.size === 0) {
      toast.error('Please select at least one item to reorder');
      return;
    }

    const latestOrder = pastOrders[0];
    let addedCount = 0;

    selectedItems.forEach((quantity, itemId) => {
      const item = latestOrder.items.find(i => i.id === itemId);
      if (item) {
        onAddToCart({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: quantity,
          image: item.image
        });
        addedCount++;
      }
    });

    toast.success(`${addedCount} items added to cart! 🛒`, {
      description: 'Your previous order has been restored',
    });

    onClose();
  };

  const handleQuickAddAll = () => {
    if (pastOrders.length === 0) return;

    const latestOrder = pastOrders[0];
    const newSelection = new Map<string, number>();
    
    latestOrder.items.forEach(item => {
      newSelection.set(item.id, item.quantity);
    });
    
    setSelectedItems(newSelection);
    
    toast.success('All items selected! ✨', {
      description: 'Ready to add to cart',
    });
  };

  const calculateTotal = () => {
    if (pastOrders.length === 0) return 0;
    
    const latestOrder = pastOrders[0];
    let total = 0;
    
    selectedItems.forEach((quantity, itemId) => {
      const item = latestOrder.items.find(i => i.id === itemId);
      if (item) {
        total += item.price * quantity;
      }
    });
    
    return total;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  if (!userId) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Quick Reorder</DialogTitle>
            <DialogDescription>
              Please sign in to view your past orders
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-8">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Sign in to access your order history</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-emerald-500" />
            Quick Reorder
          </DialogTitle>
          <DialogDescription>
            Reorder items from your last purchase with one click
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
            <p className="text-muted-foreground">Loading your orders...</p>
          </div>
        ) : pastOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h4 className="mb-2">No Orders Yet</h4>
            <p className="text-sm text-muted-foreground">
              Start shopping to build your order history
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Most Recent Order Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white">Last Order</h4>
                    <Badge className="bg-white/20 text-white hover:bg-white/20">
                      {pastOrders[0].orderId}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/90">
                    <Clock className="h-4 w-4" />
                    <span>{formatDate(pastOrders[0].date)}</span>
                    <span>•</span>
                    <span>{pastOrders[0].items.length} items</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleQuickAddAll}
                  className="bg-white text-emerald-600 hover:bg-white/90"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Select All
                </Button>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Select items to reorder</h4>
              <div className="space-y-2">
                <AnimatePresence>
                  {pastOrders[0].items.map((item, index) => {
                    const selectedQty = selectedItems.get(item.id) || 0;
                    const isSelected = selectedQty > 0;

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className={`p-4 transition-all ${
                          isSelected 
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' 
                            : 'border-border hover:border-emerald-300'
                        }`}>
                          <div className="flex items-center gap-4">
                            {/* Product Image */}
                            <ImageWithFallback
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium mb-1">{item.name}</h5>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                  ₹{item.price}
                                </span>
                                <span className="text-muted-foreground">
                                  • Originally: {item.quantity}x
                                </span>
                              </div>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              {isSelected ? (
                                <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-1 border border-emerald-500">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                                    onClick={() => handleQuantityChange(item.id, -1)}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <span className="w-8 text-center font-medium">
                                    {selectedQty}
                                  </span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                                    onClick={() => handleQuantityChange(item.id, 1)}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleQuantityChange(item.id, item.quantity)}
                                  className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add
                                </Button>
                              )}
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            <Separator />

            {/* Summary & Actions */}
            <div className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Selected Items:</span>
                  <span className="font-medium">{selectedItems.size} items</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Quantity:</span>
                  <span className="font-medium">
                    {Array.from(selectedItems.values()).reduce((sum, qty) => sum + qty, 0)} units
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total Amount:</span>
                  <div className="flex items-center gap-1">
                    <IndianRupee className="h-4 w-4 text-emerald-600" />
                    <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                      {calculateTotal()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                  onClick={handleReorderAll}
                  disabled={selectedItems.size === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add {selectedItems.size} {selectedItems.size === 1 ? 'Item' : 'Items'} to Cart
                </Button>
              </div>
            </div>

            {/* Past Orders History (collapsed) */}
            {pastOrders.length > 1 && (
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Previous Orders</h4>
                <div className="space-y-2">
                  {pastOrders.slice(1, 3).map((order) => (
                    <Card key={order.orderId} className="p-3 bg-muted/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{order.orderId}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(order.date)} • {order.items.length} items • ₹{order.total}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          onClick={() => {
                            toast.info('Feature coming soon! 🚀', {
                              description: 'You\'ll be able to view and reorder from any past order'
                            });
                          }}
                        >
                          View
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
