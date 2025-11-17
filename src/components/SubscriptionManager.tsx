import { useState } from 'react';
import { Calendar, Coffee, Apple, Milk, Edit, Pause, Play, Trash2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { toast } from 'sonner@2.0.3';

interface Subscription {
  id: string;
  name: string;
  frequency: string;
  nextDelivery: string;
  price: number;
  active: boolean;
  icon: any;
}

export function SubscriptionManager() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: '1',
      name: 'Fresh Milk',
      frequency: 'Every morning',
      nextDelivery: 'Tomorrow, 7:00 AM',
      price: 399,
      active: true,
      icon: Milk,
    },
    {
      id: '2',
      name: 'Seasonal Fruits',
      frequency: 'Every weekend',
      nextDelivery: 'Saturday, 9:00 AM',
      price: 999,
      active: true,
      icon: Apple,
    },
    {
      id: '3',
      name: 'Coffee Beans',
      frequency: 'Every 2 weeks',
      nextDelivery: 'Oct 12, 2025',
      price: 1499,
      active: false,
      icon: Coffee,
    },
  ]);

  const handleToggleSubscription = (id: string) => {
    setSubscriptions(subscriptions.map(sub =>
      sub.id === id ? { ...sub, active: !sub.active } : sub
    ));
    const sub = subscriptions.find(s => s.id === id);
    if (sub) {
      toast.success(sub.active ? `${sub.name} subscription paused` : `${sub.name} subscription activated! ☕`);
    }
  };

  const handleCardClick = (sub: Subscription) => {
    if (!sub.active) {
      handleToggleSubscription(sub.id);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3>Automated Subscriptions</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Never run out of your essentials
          </p>
        </div>
        <Button>
          <Calendar className="h-4 w-4 mr-2" />
          Add Subscription
        </Button>
      </div>

      <div className="space-y-4">
        {subscriptions.map((sub) => {
          const Icon = sub.icon;
          return (
            <Card
              key={sub.id}
              onClick={() => handleCardClick(sub)}
              className={`p-4 transition-all ${
                sub.active
                  ? 'border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/10'
                  : 'opacity-60 hover:opacity-80 cursor-pointer hover:border-emerald-500/30'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-xl ${
                    sub.active
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
                      : 'bg-muted'
                  }`}
                >
                  <Icon className={`h-6 w-6 ${sub.active ? 'text-white' : 'text-muted-foreground'}`} />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="flex items-center gap-2">
                        {sub.name}
                        {sub.active && (
                          <Badge className="bg-emerald-500 hover:bg-emerald-500">Active</Badge>
                        )}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">{sub.frequency}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={sub.active}
                        onCheckedChange={() => handleToggleSubscription(sub.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Next Delivery</p>
                        <p className="text-sm mt-0.5">{sub.nextDelivery}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Price</p>
                        <p className="text-sm mt-0.5 text-emerald-600 dark:text-emerald-400">
                          ₹{sub.price}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.info(`Editing ${sub.name} subscription`);
                        }}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleSubscription(sub.id);
                        }}
                      >
                        {sub.active ? (
                          <>
                            <Pause className="h-3 w-3 mr-1" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="h-3 w-3 mr-1" />
                            Resume
                          </>
                        )}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.error(`${sub.name} subscription removed`);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Smart Fridge Integration */}
      <Card className="p-4 mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 p-2 rounded-lg">
            <Coffee className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="flex items-center gap-2">
              <span>Smart Fridge Connected</span>
              <Badge variant="secondary" className="text-xs bg-green-500 text-white hover:bg-green-500">
                ● Online
              </Badge>
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              AI detected low milk. Auto-adding to next subscription delivery.
            </p>
          </div>
          <Button size="sm" variant="outline">Configure</Button>
        </div>
      </Card>
    </Card>
  );
}
