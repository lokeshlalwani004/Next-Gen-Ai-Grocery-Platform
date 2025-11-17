import { Search, ShoppingCart, User, Menu, Mic, Sun, Moon, Bell, Heart, Package, Clock, TrendingUp, X, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { toast } from 'sonner@2.0.3';
import { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  cartItemsCount: number;
  onCartClick: () => void;
  onVoiceSearch: () => void;
  onNotificationClick: () => void;
  onWishlistClick: () => void;
  userName: string;
  userLevel: number;
  notificationCount?: number;
  wishlistCount?: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit?: () => void;
  recentSearches?: string[];
  onClearRecentSearches?: () => void;
  user?: any;
  onLoginClick?: () => void;
  onLogout?: () => void;
  onProfileClick?: () => void;
  onQuickReorderClick?: () => void;
}

export function Header({ 
  darkMode, 
  toggleDarkMode, 
  cartItemsCount, 
  onCartClick, 
  onVoiceSearch,
  onNotificationClick,
  onWishlistClick,
  userName,
  userLevel,
  notificationCount = 3,
  wishlistCount = 5,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  recentSearches = [],
  onClearRecentSearches,
  user,
  onLoginClick,
  onLogout,
  onProfileClick,
  onQuickReorderClick
}: HeaderProps) {
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const popularSearches = [
    'organic vegetables',
    'fresh fruits',
    'dairy products',
    'bakery items',
    'flash sale',
    'discount offers',
    'ai recommended',
    'healthy food',
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-emerald-600 dark:text-emerald-400">GroceryAI</h1>
              <p className="text-xs text-muted-foreground">Smart Shopping</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl relative" ref={searchRef}>
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors z-10 ${
              searchQuery ? 'text-emerald-500' : 'text-muted-foreground'
            }`} />
            <Input 
              placeholder="Search for groceries, recipes, or ask AI..." 
              className={`pl-10 pr-12 bg-input-background border-0 transition-all ${
                searchQuery ? 'ring-2 ring-emerald-500/20 bg-emerald-50 dark:bg-emerald-950/20' : ''
              }`}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setShowSearchSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  setShowSearchSuggestions(false);
                  if (onSearchSubmit) {
                    onSearchSubmit();
                  }
                }
              }}
            />
            {searchQuery && (
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-10 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-destructive/10 text-muted-foreground hover:text-destructive z-10"
                onClick={() => {
                  onSearchChange('');
                  setShowSearchSuggestions(true);
                }}
              >
                ✕
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              className={`absolute right-1 top-1/2 transform -translate-y-1/2 transition-colors z-10 ${
                searchQuery ? 'text-emerald-500' : ''
              }`}
              onClick={onVoiceSearch}
            >
              <Mic className="h-4 w-4" />
            </Button>

            {/* Search Suggestions Dropdown */}
            {showSearchSuggestions && (
              <div className="absolute top-full mt-2 w-full bg-popover border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="border-b border-border">
                    <div className="flex items-center justify-between px-4 py-2 bg-muted/50">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Recent Searches</span>
                      </div>
                      {onClearRecentSearches && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={onClearRecentSearches}
                          className="h-6 text-xs text-muted-foreground hover:text-foreground"
                        >
                          Clear All
                        </Button>
                      )}
                    </div>
                    <div className="max-h-32 overflow-y-auto">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          className="w-full px-4 py-2 text-left hover:bg-accent/50 flex items-center justify-between group"
                          onClick={() => {
                            onSearchChange(search);
                            setShowSearchSuggestions(false);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{search}</span>
                          </div>
                          <X className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Searches */}
                <div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-muted/50">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Popular Searches</span>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {popularSearches.map((search, index) => (
                      <button
                        key={index}
                        className="w-full px-4 py-2 text-left hover:bg-accent/50 flex items-center gap-2"
                        onClick={() => {
                          onSearchChange(search);
                          setShowSearchSuggestions(false);
                        }}
                      >
                        <TrendingUp className="h-3 w-3 text-emerald-500" />
                        <span className="text-sm">{search}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search Tips */}
                <div className="px-4 py-3 bg-muted/30 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Search tips:</span> Try "organic", "sale", "discount", "premium", "fresh", product names, or categories
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={onNotificationClick}
            >
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                  {notificationCount}
                </Badge>
              )}
            </Button>

            {/* Wishlist */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={onWishlistClick}
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-pink-500">
                  {wishlistCount}
                </Badge>
              )}
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative" onClick={onCartClick}>
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-emerald-500">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>

            {/* Dark Mode Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                    {userName.charAt(0)}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm">{userName}</p>
                    <p className="text-xs text-muted-foreground">Level {userLevel} 🏆</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user ? (
                  <>
                    <DropdownMenuItem onClick={onProfileClick}>
                      Profile Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onProfileClick}>
                      Order History
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onQuickReorderClick} className="text-emerald-600 dark:text-emerald-400">
                      <Zap className="h-4 w-4 mr-2" />
                      Quick Reorder
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.info('Opening subscriptions... 📅', { duration: 1000 })}>
                      Subscriptions
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.info('Connecting to smart fridge... 🧊', {
                      description: 'Syncing inventory data',
                      duration: 1000,
                    })}>
                      Smart Fridge
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.info('Generating AI meal plans... 🥗', { duration: 1000 })}>
                      Meal Plans
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onProfileClick}>
                      Rewards & NFTs
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onLogout}>
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={onLoginClick}>
                    Login / Sign Up
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
