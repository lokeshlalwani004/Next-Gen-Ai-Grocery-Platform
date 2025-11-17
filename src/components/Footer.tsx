import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin, 
  ShoppingBag,
  Truck,
  Shield,
  Award,
  Leaf,
  Zap,
  Send,
  Heart
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner@2.0.3';
import { useState } from 'react';

export function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success('Subscribed to newsletter! 🎉', {
        description: `We'll send updates to ${email}`,
      });
      setEmail('');
    }
  };

  const quickLinks = [
    { name: 'About Us', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Press', href: '#' },
    { name: 'Gift Cards', href: '#' },
  ];

  const shopCategories = [
    { name: 'Vegetables', href: '#' },
    { name: 'Fruits', href: '#' },
    { name: 'Dairy Products', href: '#' },
    { name: 'Bakery Items', href: '#' },
    { name: 'Organic Products', href: '#' },
  ];

  const customerService = [
    { name: 'Help Center', href: '#' },
    { name: 'Track Order', href: '#' },
    { name: 'Returns & Refunds', href: '#' },
    { name: 'Shipping Info', href: '#' },
    { name: 'FAQs', href: '#' },
  ];

  const policies = [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Cookie Policy', href: '#' },
    { name: 'Accessibility', href: '#' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  const paymentMethods = [
    { name: 'UPI', color: 'bg-green-500' },
    { name: 'Visa', color: 'bg-blue-600' },
    { name: 'Mastercard', color: 'bg-red-500' },
    { name: 'Paytm', color: 'bg-blue-500' },
    { name: 'GPay', color: 'bg-blue-400' },
  ];

  const features = [
    { icon: Truck, text: 'Free Delivery Over ₹500', color: 'text-blue-500' },
    { icon: Shield, text: '100% Secure Payments', color: 'text-green-500' },
    { icon: Award, text: 'Quality Guarantee', color: 'text-yellow-500' },
    { icon: Leaf, text: 'Fresh & Organic', color: 'text-emerald-500' },
  ];

  return (
    <footer className="bg-gradient-to-b from-background to-muted/20 border-t border-border mt-16">
      {/* Features Bar */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                <div className={`${feature.color} bg-opacity-10 p-2 rounded-lg`}>
                  <feature.icon className={`h-5 w-5 ${feature.color}`} />
                </div>
                <p className="text-sm">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-xl">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl">FreshMart AI</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              India's most advanced AI-powered grocery platform. Get fresh, organic products delivered to your doorstep with cutting-edge technology and personalized shopping experiences.
            </p>
            
            {/* Newsletter */}
            <div className="space-y-2">
              <p className="text-sm">Subscribe to our newsletter</p>
              <form onSubmit={handleNewsletterSubscribe} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>

            {/* Social Links */}
            <div className="flex gap-2 mt-4">
              {socialLinks.map((social) => (
                <button
                  key={social.label}
                  onClick={() => toast.info(`Opening ${social.label}...`)}
                  className="p-2 rounded-lg bg-accent hover:bg-accent/70 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4">Company</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => toast.info(`Navigating to ${link.name}...`)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop Categories */}
          <div>
            <h4 className="mb-4">Shop</h4>
            <ul className="space-y-2">
              {shopCategories.map((category) => (
                <li key={category.name}>
                  <button
                    onClick={() => toast.info(`Browsing ${category.name}...`)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="mb-4">Support</h4>
            <ul className="space-y-2">
              {customerService.map((service) => (
                <li key={service.name}>
                  <button
                    onClick={() => toast.info(`Opening ${service.name}...`)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {service.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-4">Contact</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => toast.success('Calling customer support...')}
                  className="flex items-start gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>1800-123-4567</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => toast.success('Opening email client...')}
                  className="flex items-start gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>support@freshmart.in</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => toast.info('Opening locations map...')}
                  className="flex items-start gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Mumbai, Delhi, Bangalore & 47 more cities</span>
                </button>
              </li>
            </ul>

            {/* Download App */}
            <div className="mt-6 space-y-2">
              <p className="text-sm">Download App</p>
              <div className="space-y-2">
                <button
                  onClick={() => toast.info('Opening Play Store...')}
                  className="w-full px-3 py-2 bg-black text-white rounded-lg text-xs hover:bg-black/80 transition-colors flex items-center justify-center gap-2"
                >
                  <span>📱 Google Play</span>
                </button>
                <button
                  onClick={() => toast.info('Opening App Store...')}
                  className="w-full px-3 py-2 bg-black text-white rounded-lg text-xs hover:bg-black/80 transition-colors flex items-center justify-center gap-2"
                >
                  <span>🍎 App Store</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">We Accept</p>
              <div className="flex flex-wrap gap-2">
                {paymentMethods.map((method) => (
                  <div
                    key={method.name}
                    className="px-3 py-1.5 bg-card border border-border rounded text-xs flex items-center gap-1.5"
                  >
                    <div className={`w-2 h-2 rounded-full ${method.color}`} />
                    {method.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-xs text-emerald-600 dark:text-emerald-400">
                <Leaf className="h-3 w-3" />
                Organic Certified
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-blue-600 dark:text-blue-400">
                <Shield className="h-3 w-3" />
                SSL Secured
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded text-xs text-purple-600 dark:text-purple-400">
                <Zap className="h-3 w-3" />
                AI Powered
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-wrap gap-4">
              {policies.map((policy) => (
                <button
                  key={policy.name}
                  onClick={() => toast.info(`Opening ${policy.name}...`)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {policy.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>© 2025 FreshMart AI. Made with</span>
              <Heart className="h-3 w-3 text-red-500 fill-red-500" />
              <span>in India</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
