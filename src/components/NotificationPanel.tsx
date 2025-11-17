import { Bell, Package, Tag, TrendingDown, Gift, Check, Trash2, Sparkles, ShoppingCart } from 'lucide-react';
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
import { toast } from 'sonner@2.0.3';

export interface Notification {
  id: string;
  type: 'order' | 'deal' | 'price-drop' | 'reward' | 'ai-suggestion';
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionable?: boolean;
  productId?: string; // For AI suggestions and price drops
  productName?: string;
  productPrice?: number;
  orderId?: string; // For order tracking
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
  onAddToCart?: (productId: string, productName: string, productPrice: number) => void;
  onTrackOrder?: (orderId: string) => void;
}

export function NotificationPanel({ 
  isOpen, 
  onClose, 
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onAddToCart,
  onTrackOrder
}: NotificationPanelProps) {

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'deal':
        return <Tag className="h-5 w-5 text-emerald-500" />;
      case 'price-drop':
        return <TrendingDown className="h-5 w-5 text-orange-500" />;
      case 'reward':
        return <Gift className="h-5 w-5 text-purple-500" />;
      case 'ai-suggestion':
        return <Sparkles className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleMarkAsRead = (id: string) => {
    onMarkAsRead(id);
    toast.success('Notification marked as read ✓', { duration: 1000 });
  };

  const handleMarkAllAsRead = () => {
    onMarkAllAsRead();
    toast.success('All notifications marked as read! ✓', { duration: 1000 });
  };

  const handleDeleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteNotification(id);
  };

  const handleNotificationAction = (notification: Notification) => {
    switch (notification.type) {
      case 'order':
        if (notification.orderId && onTrackOrder) {
          onTrackOrder(notification.orderId);
          onClose();
        } else {
          toast.info('Opening order details...', {
            description: `Order #${notification.id}`,
            duration: 1000,
          });
        }
        break;
      case 'price-drop':
        if (notification.productId && notification.productName && notification.productPrice && onAddToCart) {
          onAddToCart(notification.productId, notification.productName, notification.productPrice);
          // Mark as read after adding to cart
          onMarkAsRead(notification.id);
        } else {
          toast.success('Adding item to cart! 🛒', {
            description: notification.productName || 'Product at special price',
            duration: 1000,
          });
        }
        break;
      case 'ai-suggestion':
        if (notification.productId && notification.productName && notification.productPrice && onAddToCart) {
          onAddToCart(notification.productId, notification.productName, notification.productPrice);
          // Mark as read after adding to cart
          onMarkAsRead(notification.id);
        } else {
          toast.info('AI suggestion activated! 🤖', { duration: 1000 });
        }
        break;
      case 'deal':
        toast.info('Opening deals section... 🏷️', { duration: 1000 });
        break;
      case 'reward':
        toast.info('Opening rewards & badges... 🏆', { duration: 1000 });
        break;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>
              Notifications
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-red-500">{unreadCount} new</Badge>
              )}
            </span>
            {unreadCount > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleMarkAllAsRead}
              >
                <Check className="h-3 w-3 mr-1" />
                Mark all read
              </Button>
            )}
          </SheetTitle>
          <SheetDescription>
            Stay updated with your orders, deals, and AI suggestions
          </SheetDescription>
        </SheetHeader>

        {/* Notifications List */}
        <ScrollArea className="flex-1 -mx-6 px-6 my-4">
          <div className="space-y-3">
            {notifications.map((notification, index) => (
              <div key={notification.id}>
                <div
                  className={`p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
                    notification.read
                      ? 'bg-transparent border-border'
                      : 'bg-muted/30 border-emerald-200 dark:border-emerald-800'
                  }`}
                  onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm">{notification.title}</h4>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <div className="h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                            onClick={(e) => handleDeleteNotification(notification.id, e)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-muted-foreground">
                          {notification.time}
                        </p>
                        {notification.actionable && (
                          <Button
                            size="sm"
                            variant={notification.type === 'ai-suggestion' || notification.type === 'price-drop' ? 'default' : 'outline'}
                            className={`h-7 text-xs ${
                              notification.type === 'ai-suggestion' 
                                ? 'bg-purple-600 hover:bg-purple-700' 
                                : notification.type === 'price-drop'
                                ? 'bg-emerald-600 hover:bg-emerald-700'
                                : ''
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNotificationAction(notification);
                            }}
                          >
                            {notification.type === 'ai-suggestion' || notification.type === 'price-drop' ? (
                              <>
                                <ShoppingCart className="h-3 w-3 mr-1" />
                                Add to Cart
                              </>
                            ) : (
                              'View'
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {index < notifications.length - 1 && (
                  <Separator className="my-2" />
                )}
              </div>
            ))}

            {notifications.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No notifications</p>
                <p className="text-sm mt-2">You're all caught up!</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Settings */}
        <div className="pt-4 border-t">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              toast.info('Opening notification settings... ⚙️', {
                description: 'Customize your notification preferences',
              });
            }}
          >
            Notification Settings
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
