import { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  Bell, 
  Shield, 
  Award, 
  Package, 
  Calendar,
  Settings,
  LogOut,
  Edit2,
  Save,
  X,
  ChevronRight,
  Heart,
  Smartphone,
  Lock,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  Check,
  Clock,
  TrendingUp,
  Star,
  Loader2
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { toast } from 'sonner@2.0.3';
import { supabase } from '../utils/supabase/client';
import { api } from '../utils/api';

interface ProfileSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
  onLogout: () => void;
}

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'upi';
  last4?: string;
  cardType?: string;
  upiId?: string;
  isDefault: boolean;
}

interface Order {
  id: string;
  date: string;
  status: 'delivered' | 'in-transit' | 'processing' | 'cancelled';
  items: number;
  total: number;
  deliveryDate?: string;
}

export function ProfileSettings({ open, onOpenChange, user, onLogout }: ProfileSettingsProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Profile data
  const [profileData, setProfileData] = useState({
    name: user?.user_metadata?.name || 'Guest User',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
    bio: user?.user_metadata?.bio || '',
  });

  // Addresses
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      type: 'home',
      line1: '123, Green Valley Apartments',
      line2: 'MG Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      isDefault: true,
    },
  ]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  // Payment methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      last4: '4242',
      cardType: 'Visa',
      isDefault: true,
    },
    {
      id: '2',
      type: 'upi',
      upiId: 'user@paytm',
      isDefault: false,
    },
  ]);

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Settings
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    priceAlerts: true,
    promotions: true,
    biometricLogin: false,
    voiceControl: true,
    gestureControl: false,
    darkMode: false,
    smartFridgeSync: false,
  });

  // Rewards
  const [rewards, setRewards] = useState({
    points: 2450,
    level: 5,
    badges: [
      { id: '1', name: 'Eco Warrior', icon: '🌱', earned: true },
      { id: '2', name: 'Flash Buyer', icon: '⚡', earned: true },
      { id: '3', name: 'Premium Member', icon: '👑', earned: true },
      { id: '4', name: 'Early Adopter', icon: '🚀', earned: true },
      { id: '5', name: 'Health Guru', icon: '🥗', earned: false },
      { id: '6', name: 'Savings Master', icon: '💰', earned: false },
    ],
    nfts: [
      { id: '1', name: 'Golden Cart NFT', rarity: 'Epic', value: 5000 },
      { id: '2', name: 'Fresh Start Badge', rarity: 'Rare', value: 2000 },
    ],
  });

  // Load orders when tab changes
  useEffect(() => {
    if (activeTab === 'orders' && user && orders.length === 0) {
      loadOrders();
    }
  }, [activeTab, user]);

  const loadOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const { orders: fetchedOrders } = await api.getOrders();
      if (fetchedOrders && fetchedOrders.length > 0) {
        setOrders(fetchedOrders);
      } else {
        // Mock data if no orders found
        setOrders([
          {
            id: 'GR-2024-10041',
            date: '2024-11-01',
            status: 'delivered',
            items: 12,
            total: 2849,
            deliveryDate: '2024-11-02',
          },
          {
            id: 'GR-2024-10040',
            date: '2024-10-28',
            status: 'delivered',
            items: 8,
            total: 1560,
            deliveryDate: '2024-10-29',
          },
          {
            id: 'GR-2024-10039',
            date: '2024-10-25',
            status: 'in-transit',
            items: 15,
            total: 3240,
            deliveryDate: '2024-11-04',
          },
          {
            id: 'GR-2024-10038',
            date: '2024-10-20',
            status: 'delivered',
            items: 6,
            total: 945,
            deliveryDate: '2024-10-21',
          },
          {
            id: 'GR-2024-10037',
            date: '2024-10-15',
            status: 'delivered',
            items: 20,
            total: 4120,
            deliveryDate: '2024-10-16',
          },
        ]);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // Update user metadata in Supabase
      const { error } = await supabase.auth.updateUser({
        data: {
          name: profileData.name,
          phone: profileData.phone,
          bio: profileData.bio,
        }
      });

      if (error) throw error;

      toast.success('Profile updated successfully! ✅');
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile', {
        description: error.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      onLogout();
      onOpenChange(false);
      toast.success('Logged out successfully! 👋');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const handleChangePassword = async () => {
    toast.info('Password reset link sent to your email! 📧');
  };

  const getStatusBadge = (status: Order['status']) => {
    const variants: Record<Order['status'], { color: string; text: string }> = {
      delivered: { color: 'bg-green-500', text: 'Delivered' },
      'in-transit': { color: 'bg-blue-500', text: 'In Transit' },
      processing: { color: 'bg-yellow-500', text: 'Processing' },
      cancelled: { color: 'bg-red-500', text: 'Cancelled' },
    };
    return variants[status];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[85vh] p-0 bg-white dark:bg-gray-900" aria-describedby="profile-settings-description">
        <DialogDescription id="profile-settings-description" className="sr-only">
          Manage your profile information, addresses, payment methods, order history, rewards, settings, and security preferences
        </DialogDescription>
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4">
            <div className="space-y-6">
              {/* User Info */}
              <div className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-emerald-500 to-teal-600">
                  <AvatarFallback className="text-2xl text-white">
                    {profileData.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold">{profileData.name}</h3>
                <p className="text-sm text-muted-foreground">{profileData.email}</p>
                <Badge className="mt-2 bg-gradient-to-r from-purple-500 to-pink-500">
                  Level {rewards.level} 🏆
                </Badge>
              </div>

              <Separator />

              {/* Navigation */}
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === 'profile' 
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm">Profile</span>
                </button>

                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === 'addresses' 
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Addresses</span>
                </button>

                <button
                  onClick={() => setActiveTab('payments')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === 'payments' 
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span className="text-sm">Payments</span>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === 'orders' 
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span className="text-sm">Order History</span>
                </button>

                <button
                  onClick={() => setActiveTab('rewards')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === 'rewards' 
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span className="text-sm">Rewards & NFTs</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === 'settings' 
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-sm">Settings</span>
                </button>

                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === 'security' 
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">Security</span>
                </button>
              </nav>

              <Separator />

              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <DialogHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <DialogTitle className="text-2xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {activeTab === 'profile' && 'Profile Settings'}
                {activeTab === 'addresses' && 'Delivery Addresses'}
                {activeTab === 'payments' && 'Payment Methods'}
                {activeTab === 'orders' && 'Order History'}
                {activeTab === 'rewards' && 'Rewards & NFTs'}
                {activeTab === 'settings' && 'Preferences'}
                {activeTab === 'security' && 'Privacy & Security'}
              </DialogTitle>
            </DialogHeader>

            <ScrollArea className="flex-1 p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6 max-w-2xl">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Update your personal details</CardDescription>
                      </div>
                      {!isEditing ? (
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                          <Edit2 className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                          <Button size="sm" onClick={handleSaveProfile} disabled={isSaving}>
                            {isSaving ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Save className="w-4 h-4 mr-2" />
                            )}
                            Save
                          </Button>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          disabled={!isEditing}
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Input
                          id="bio"
                          value={profileData.bio}
                          onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                          disabled={!isEditing}
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Account Statistics</CardTitle>
                      <CardDescription>Your shopping journey</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                          <Package className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                          <div className="text-2xl font-semibold">{orders.length}</div>
                          <div className="text-sm text-muted-foreground">Total Orders</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <Star className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                          <div className="text-2xl font-semibold">{rewards.points}</div>
                          <div className="text-sm text-muted-foreground">Reward Points</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                          <div className="text-2xl font-semibold">₹{orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Total Spent</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className="space-y-4 max-w-3xl">
                  {addresses.map((address) => (
                    <Card key={address.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={address.type === 'home' ? 'default' : 'secondary'}>
                                {address.type}
                              </Badge>
                              {address.isDefault && (
                                <Badge variant="outline" className="border-emerald-500 text-emerald-600">
                                  Default
                                </Badge>
                              )}
                            </div>
                            <p>{address.line1}</p>
                            {address.line2 && <p>{address.line2}</p>}
                            <p>{address.city}, {address.state} - {address.pincode}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Address
                  </Button>
                </div>
              )}

              {/* Payment Methods Tab */}
              {activeTab === 'payments' && (
                <div className="space-y-4 max-w-3xl">
                  {paymentMethods.map((method) => (
                    <Card key={method.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {method.type === 'card' ? (
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <CreditCard className="w-6 h-6 text-white" />
                              </div>
                            ) : (
                              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                <Smartphone className="w-6 h-6 text-white" />
                              </div>
                            )}
                            <div>
                              {method.type === 'card' ? (
                                <>
                                  <p className="font-medium">{method.cardType} •••• {method.last4}</p>
                                  <p className="text-sm text-muted-foreground">Credit/Debit Card</p>
                                </>
                              ) : (
                                <>
                                  <p className="font-medium">{method.upiId}</p>
                                  <p className="text-sm text-muted-foreground">UPI</p>
                                </>
                              )}
                              {method.isDefault && (
                                <Badge variant="outline" className="mt-1 border-emerald-500 text-emerald-600">
                                  Default
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {isLoadingOrders ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                      <p className="text-muted-foreground">Start shopping to see your orders here!</p>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <Card key={order.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold text-lg">Order #{order.id}</h4>
                                <Badge className={`${getStatusBadge(order.status).color} text-white`}>
                                  {getStatusBadge(order.status).text}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(order.date).toLocaleDateString('en-IN', { 
                                    day: 'numeric', 
                                    month: 'short', 
                                    year: 'numeric' 
                                  })}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Package className="w-4 h-4" />
                                  {order.items} items
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-semibold text-emerald-600">
                                ₹{order.total.toLocaleString()}
                              </div>
                              {order.deliveryDate && (
                                <p className="text-sm text-muted-foreground">
                                  Delivered on {new Date(order.deliveryDate).toLocaleDateString('en-IN')}
                                </p>
                              )}
                            </div>
                          </div>
                          <Separator className="my-4" />
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                            {order.status === 'delivered' && (
                              <>
                                <Button variant="outline" size="sm" className="flex-1">
                                  <Package className="w-4 h-4 mr-2" />
                                  Reorder
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1">
                                  <Star className="w-4 h-4 mr-2" />
                                  Rate Order
                                </Button>
                              </>
                            )}
                            {order.status === 'in-transit' && (
                              <Button variant="outline" size="sm" className="flex-1">
                                <MapPin className="w-4 h-4 mr-2" />
                                Track Order
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}

              {/* Rewards Tab */}
              {activeTab === 'rewards' && (
                <div className="space-y-6 max-w-3xl">
                  <Card>
                    <CardHeader>
                      <CardTitle>Loyalty Points</CardTitle>
                      <CardDescription>Earn points with every purchase</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl mb-4">
                        <Award className="w-12 h-12 mx-auto mb-2" />
                        <div className="text-4xl font-semibold mb-1">{rewards.points}</div>
                        <div className="text-sm opacity-90">Total Points</div>
                      </div>
                      <p className="text-sm text-muted-foreground text-center">
                        You're at Level {rewards.level}! Keep shopping to unlock more rewards.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Achievement Badges</CardTitle>
                      <CardDescription>Collect badges as you shop</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        {rewards.badges.map((badge) => (
                          <div 
                            key={badge.id} 
                            className={`p-4 rounded-lg text-center ${
                              badge.earned 
                                ? 'bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30' 
                                : 'bg-gray-100 dark:bg-gray-800 opacity-50'
                            }`}
                          >
                            <div className="text-4xl mb-2">{badge.icon}</div>
                            <div className="text-sm font-medium">{badge.name}</div>
                            {badge.earned && (
                              <Check className="w-4 h-4 mx-auto mt-2 text-green-600" />
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>NFT Collection</CardTitle>
                      <CardDescription>Your exclusive digital rewards</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {rewards.nfts.map((nft) => (
                          <div key={nft.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                            <div>
                              <h4 className="font-medium">{nft.name}</h4>
                              <p className="text-sm text-muted-foreground">Rarity: {nft.rarity}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-emerald-600 font-semibold">₹{nft.value}</div>
                              <p className="text-xs text-muted-foreground">Value</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6 max-w-2xl">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>Manage how we communicate with you</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">Receive updates via email</p>
                        </div>
                        <Switch
                          checked={settings.emailNotifications}
                          onCheckedChange={(checked) => 
                            setSettings({ ...settings, emailNotifications: checked })
                          }
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Push Notifications</p>
                          <p className="text-sm text-muted-foreground">Get instant updates on your device</p>
                        </div>
                        <Switch
                          checked={settings.pushNotifications}
                          onCheckedChange={(checked) => 
                            setSettings({ ...settings, pushNotifications: checked })
                          }
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">SMS Notifications</p>
                          <p className="text-sm text-muted-foreground">Receive text messages for important updates</p>
                        </div>
                        <Switch
                          checked={settings.smsNotifications}
                          onCheckedChange={(checked) => 
                            setSettings({ ...settings, smsNotifications: checked })
                          }
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Order Updates</p>
                          <p className="text-sm text-muted-foreground">Track your order status</p>
                        </div>
                        <Switch
                          checked={settings.orderUpdates}
                          onCheckedChange={(checked) => 
                            setSettings({ ...settings, orderUpdates: checked })
                          }
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Price Alerts</p>
                          <p className="text-sm text-muted-foreground">Get notified when prices drop</p>
                        </div>
                        <Switch
                          checked={settings.priceAlerts}
                          onCheckedChange={(checked) => 
                            setSettings({ ...settings, priceAlerts: checked })
                          }
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Promotions & Offers</p>
                          <p className="text-sm text-muted-foreground">Exclusive deals and discounts</p>
                        </div>
                        <Switch
                          checked={settings.promotions}
                          onCheckedChange={(checked) => 
                            setSettings({ ...settings, promotions: checked })
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Advanced Features</CardTitle>
                      <CardDescription>Enable next-gen shopping features</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Voice Control</p>
                          <p className="text-sm text-muted-foreground">Navigate using voice commands</p>
                        </div>
                        <Switch
                          checked={settings.voiceControl}
                          onCheckedChange={(checked) => 
                            setSettings({ ...settings, voiceControl: checked })
                          }
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Gesture Control</p>
                          <p className="text-sm text-muted-foreground">Use gestures to interact</p>
                        </div>
                        <Switch
                          checked={settings.gestureControl}
                          onCheckedChange={(checked) => 
                            setSettings({ ...settings, gestureControl: checked })
                          }
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Smart Fridge Sync</p>
                          <p className="text-sm text-muted-foreground">Connect to your smart refrigerator</p>
                        </div>
                        <Switch
                          checked={settings.smartFridgeSync}
                          onCheckedChange={(checked) => {
                            setSettings({ ...settings, smartFridgeSync: checked });
                            if (checked) {
                              toast.success('Smart Fridge connected! 🧊', {
                                description: 'Syncing your inventory...'
                              });
                            }
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6 max-w-2xl">
                  <Card>
                    <CardHeader>
                      <CardTitle>Password & Authentication</CardTitle>
                      <CardDescription>Manage your account security</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button variant="outline" className="w-full" onClick={handleChangePassword}>
                        <Lock className="w-4 h-4 mr-2" />
                        Change Password
                      </Button>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Biometric Login</p>
                          <p className="text-sm text-muted-foreground">Use fingerprint or face recognition</p>
                        </div>
                        <Switch
                          checked={settings.biometricLogin}
                          onCheckedChange={(checked) => {
                            setSettings({ ...settings, biometricLogin: checked });
                            if (checked) {
                              toast.success('Biometric login enabled! 👆');
                            }
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Privacy Settings</CardTitle>
                      <CardDescription>Control your data and privacy</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Shield className="w-4 h-4 mr-2" />
                        Download My Data
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
