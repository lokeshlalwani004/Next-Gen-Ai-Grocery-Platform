import { useState } from 'react';
import { CreditCard, Wallet, Zap, Lock, Tag, CheckCircle, Fingerprint, Gift, X } from 'lucide-react';
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
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  description: string;
}

interface ExpressCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onCheckoutComplete: () => void;
}

export function ExpressCheckout({ isOpen, onClose, items, onCheckoutComplete }: ExpressCheckoutProps) {
  const [checkoutStep, setCheckoutStep] = useState<'payment' | 'verification' | 'processing' | 'success'>('payment');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [appliedCoupons, setAppliedCoupons] = useState<Coupon[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);

  const availableCoupons: Coupon[] = [
    {
      id: '1',
      code: 'FIRST50',
      discount: 50,
      type: 'fixed',
      description: 'First order discount'
    },
    {
      id: '2',
      code: 'SAVE20',
      discount: 20,
      type: 'percentage',
      description: '20% off on all items'
    },
    {
      id: '3',
      code: 'GROCERY100',
      discount: 100,
      type: 'fixed',
      description: 'Flat ₹100 off'
    }
  ];

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const calculateDiscount = () => {
    let totalDiscount = 0;
    appliedCoupons.forEach(coupon => {
      if (coupon.type === 'percentage') {
        totalDiscount += (subtotal * coupon.discount) / 100;
      } else {
        totalDiscount += coupon.discount;
      }
    });
    return totalDiscount;
  };

  const discount = calculateDiscount();
  const deliveryFee = 40;
  const total = subtotal - discount + deliveryFee;

  const handleAutoApplyCoupons = () => {
    // Auto-apply the best coupon
    const bestCoupon = availableCoupons.reduce((best, current) => {
      const currentSavings = current.type === 'percentage' 
        ? (subtotal * current.discount) / 100 
        : current.discount;
      const bestSavings = best.type === 'percentage' 
        ? (subtotal * best.discount) / 100 
        : best.discount;
      return currentSavings > bestSavings ? current : best;
    });

    if (!appliedCoupons.find(c => c.id === bestCoupon.id)) {
      setAppliedCoupons([...appliedCoupons, bestCoupon]);
      toast.success(`Coupon ${bestCoupon.code} applied! 🎉`, {
        description: `You saved ₹${bestCoupon.type === 'percentage' ? (subtotal * bestCoupon.discount) / 100 : bestCoupon.discount}`
      });
    }
  };

  const handleRemoveCoupon = (couponId: string) => {
    setAppliedCoupons(appliedCoupons.filter(c => c.id !== couponId));
    toast.info('Coupon removed');
  };

  const handleBiometricVerification = () => {
    setIsVerifying(true);
    setCheckoutStep('verification');

    // Simulate biometric verification
    setTimeout(() => {
      setIsVerifying(false);
      setCheckoutStep('processing');
      
      toast.success('Biometric verification successful! 👆', {
        description: 'Processing your payment...'
      });

      // Simulate payment processing
      setTimeout(() => {
        setCheckoutStep('success');
        toast.success('Payment successful! 🎉', {
          description: 'Your order has been placed'
        });
      }, 2000);
    }, 1500);
  };

  const handleExpressCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    handleBiometricVerification();
  };

  const handleClose = () => {
    setCheckoutStep('payment');
    setAppliedCoupons([]);
    onClose();
  };

  const handleCompleteCheckout = () => {
    onCheckoutComplete();
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <AnimatePresence mode="wait">
          {checkoutStep === 'payment' && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-emerald-500" />
                  Express Checkout
                </DialogTitle>
                <DialogDescription>
                  Complete your order in seconds with one-click payment
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                {/* Order Summary */}
                <div className="space-y-3">
                  <h4 className="flex items-center gap-2">
                    Order Summary
                    <Badge variant="secondary">{items.length} items</Badge>
                  </h4>
                  <div className="max-h-32 overflow-y-auto space-y-2">
                    {items.map(item => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.name} x{item.quantity}
                        </span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Coupons */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Available Coupons
                    </h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleAutoApplyCoupons}
                      className="h-7"
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Auto-Apply Best
                    </Button>
                  </div>

                  {appliedCoupons.length > 0 && (
                    <div className="space-y-2">
                      {appliedCoupons.map(coupon => (
                        <div
                          key={coupon.id}
                          className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-2"
                        >
                          <div className="flex items-center gap-2">
                            <Gift className="h-4 w-4 text-emerald-600" />
                            <div>
                              <p className="text-sm">{coupon.code}</p>
                              <p className="text-xs text-muted-foreground">{coupon.description}</p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => handleRemoveCoupon(coupon.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {appliedCoupons.length === 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {availableCoupons.slice(0, 3).map(coupon => (
                        <Button
                          key={coupon.id}
                          size="sm"
                          variant="outline"
                          className="text-xs h-auto py-2 flex-col"
                          onClick={() => {
                            setAppliedCoupons([coupon]);
                            toast.success(`Coupon ${coupon.code} applied!`);
                          }}
                        >
                          <span className="text-emerald-600">{coupon.code}</span>
                          <span className="text-xs text-muted-foreground mt-1">
                            {coupon.type === 'percentage' ? `${coupon.discount}% off` : `₹${coupon.discount} off`}
                          </span>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                {/* Payment Method */}
                <div className="space-y-3">
                  <h4 className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Payment Method
                  </h4>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:border-emerald-500 transition-colors">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span>UPI Payment</span>
                          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                            Instant
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Google Pay, PhonePe, Paytm</p>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:border-emerald-500 transition-colors">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span>Credit/Debit Card</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Visa, Mastercard, Rupay</p>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:border-emerald-500 transition-colors">
                      <RadioGroupItem value="wallet" id="wallet" />
                      <Label htmlFor="wallet" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span>Wallet</span>
                          <Badge variant="secondary">₹2,450 Available</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Pay from wallet balance</p>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2 bg-muted/30 p-4 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400">
                      <span>Discount</span>
                      <span>-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span>₹{deliveryFee}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span className="text-emerald-600 dark:text-emerald-400">₹{total.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <Badge className="w-full justify-center bg-emerald-500">
                      You saved ₹{discount.toFixed(2)}! 🎉
                    </Badge>
                  )}
                </div>

                {/* Checkout Button */}
                <Button
                  className="w-full bg-emerald-500 hover:bg-emerald-600 h-12"
                  onClick={handleExpressCheckout}
                  disabled={items.length === 0}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Pay ₹{total.toFixed(2)} with Biometric
                  <Fingerprint className="h-4 w-4 ml-2" />
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  🔒 Secured payment • Auto-applied best coupons • Instant confirmation
                </p>
              </div>
            </motion.div>
          )}

          {checkoutStep === 'verification' && (
            <motion.div
              key="verification"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/20 mb-6"
              >
                <Fingerprint className="h-12 w-12 text-emerald-600" />
              </motion.div>
              <h3 className="mb-2">Biometric Verification</h3>
              <p className="text-muted-foreground">Please verify your fingerprint or Face ID</p>
              <Progress value={66} className="mt-6 max-w-xs mx-auto" />
            </motion.div>
          )}

          {checkoutStep === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/20 mb-6"
              >
                <CreditCard className="h-12 w-12 text-blue-600" />
              </motion.div>
              <h3 className="mb-2">Processing Payment</h3>
              <p className="text-muted-foreground">Please wait while we process your payment...</p>
              <Progress value={90} className="mt-6 max-w-xs mx-auto" />
            </motion.div>
          )}

          {checkoutStep === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/20 mb-6"
              >
                <CheckCircle className="h-12 w-12 text-emerald-600" />
              </motion.div>
              <h3 className="mb-2">Payment Successful! 🎉</h3>
              <p className="text-muted-foreground mb-4">Your order has been placed successfully</p>
              
              <div className="bg-muted/30 rounded-lg p-4 mb-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Order ID</span>
                  <span className="font-mono">GR-{Date.now().toString().slice(-8)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="text-emerald-600">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Time</span>
                  <span>30-45 mins</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  className="w-full bg-emerald-500 hover:bg-emerald-600"
                  onClick={handleCompleteCheckout}
                >
                  Track Order
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleClose}
                >
                  Continue Shopping
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
