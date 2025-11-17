import { useState, useEffect, useRef } from 'react';
import { Bot, Send, X, Sparkles, ShoppingCart, Calculator, ChefHat, Loader2, Trash2, Minimize2, ArrowUp, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  suggestions?: string[];
  products?: Array<{ name: string; price: number }>;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI grocery assistant 🛒 I can help you find products, suggest recipes, plan meals, manage your budget, and answer any questions about your orders. What can I help you with today?",
      sender: 'ai',
      suggestions: ['Find healthy breakfast options', 'What\'s on sale today?', 'Show me organic vegetables', 'Plan a week of meals']
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesTopRef = useRef<HTMLDivElement>(null);

  const initialMessage: Message = {
    id: '1',
    text: "Hi! I'm your AI grocery assistant 🛒 I can help you find products, suggest recipes, plan meals, manage your budget, and answer any questions about your orders. What can I help you with today?",
    sender: 'ai',
    suggestions: ['Find healthy breakfast options', 'What\'s on sale today?', 'Show me organic vegetables', 'Plan a week of meals']
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    messagesTopRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleClearChat = () => {
    setMessages([initialMessage]);
    toast.info('Chat cleared! Start a new conversation 🔄', { duration: 1000 });
  };

  const handleMinimize = () => {
    setIsOpen(false);
    toast.info('AI Assistant minimized', {
      description: 'Click the purple button to reopen',
      duration: 1000,
    });
  };

  // Show scroll to top button when there are many messages
  useEffect(() => {
    setShowScrollTop(messages.length > 5);
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response with delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 800 + Math.random() * 700); // Random delay between 800-1500ms
  };

  const generateAIResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase();
    
    // Greeting responses
    if (input.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
      return {
        id: (Date.now() + 1).toString(),
        text: "Hello! Great to see you! 👋 I'm here to make your grocery shopping easier. I can help you find products, discover recipes, manage your budget, and much more!",
        sender: 'ai',
        suggestions: ['Show me today\'s deals', 'What\'s fresh today?', 'Help me plan meals', 'Check my orders']
      };
    }

    // Product search - Vegetables
    if (input.includes('vegetable') || input.includes('veggies') || input.includes('tomato') || input.includes('potato') || input.includes('onion')) {
      return {
        id: (Date.now() + 1).toString(),
        text: "Here are our fresh vegetables available today with great prices! 🥬",
        sender: 'ai',
        products: [
          { name: '🍅 Organic Fresh Tomatoes (1kg)', price: 399 },
          { name: '🥔 Farm Fresh Potatoes (2kg)', price: 249 },
          { name: '🧅 Red Onions (1kg)', price: 179 },
          { name: '🥬 Green Leafy Vegetables', price: 299 },
          { name: '🥕 Fresh Carrots (500g)', price: 149 }
        ],
        suggestions: ['Add all to cart', 'Show me fruits', 'What\'s organic?', 'More vegetables']
      };
    }

    // Product search - Fruits
    if (input.includes('fruit') || input.includes('apple') || input.includes('banana') || input.includes('orange') || input.includes('mango')) {
      return {
        id: (Date.now() + 1).toString(),
        text: "Fresh fruits picked just for you! 🍎🍌",
        sender: 'ai',
        products: [
          { name: '🍎 Fresh Apples (6 pcs)', price: 299 },
          { name: '🍌 Premium Bananas (1 dozen)', price: 199 },
          { name: '🍊 Juicy Oranges (1kg)', price: 349 },
          { name: '🥭 Alphonso Mangoes (4 pcs)', price: 599 },
          { name: '🍇 Seedless Grapes (500g)', price: 249 }
        ],
        suggestions: ['Add to cart', 'Show me vegetables', 'What\'s on sale?', 'Recipe ideas']
      };
    }

    // Product search - Dairy
    if (input.includes('dairy') || input.includes('milk') || input.includes('cheese') || input.includes('yogurt') || input.includes('butter')) {
      return {
        id: (Date.now() + 1).toString(),
        text: "Fresh dairy products delivered daily! 🥛",
        sender: 'ai',
        products: [
          { name: '🥛 Organic Whole Milk (1L)', price: 89 },
          { name: '🧀 Cheddar Cheese Block (200g)', price: 249 },
          { name: '🧈 Premium Butter (500g)', price: 299 },
          { name: '🥛 Greek Yogurt (400g)', price: 149 },
          { name: '🧀 Mozzarella Cheese (150g)', price: 199 }
        ],
        suggestions: ['Add to cart', 'Set up subscription', 'Show me bakery items', 'Healthy options']
      };
    }

    // Product search - Bakery
    if (input.includes('bread') || input.includes('bakery') || input.includes('cake') || input.includes('cookie')) {
      return {
        id: (Date.now() + 1).toString(),
        text: "Freshly baked goods just out of the oven! 🍞",
        sender: 'ai',
        products: [
          { name: '🍞 Whole Wheat Bread', price: 449 },
          { name: '🥐 Butter Croissants (4 pcs)', price: 299 },
          { name: '🥖 French Baguette', price: 199 },
          { name: '🍪 Chocolate Chip Cookies (12 pcs)', price: 349 },
          { name: '🎂 Vanilla Sponge Cake', price: 599 }
        ],
        suggestions: ['Add to cart', 'Show me breakfast items', 'What\'s healthy?', 'More options']
      };
    }

    // Organic products
    if (input.includes('organic') || input.includes('natural') || input.includes('chemical-free')) {
      return {
        id: (Date.now() + 1).toString(),
        text: "Our certified organic selection - 100% natural and pesticide-free! 🌿",
        sender: 'ai',
        products: [
          { name: '🥑 Organic Avocados (2 pcs)', price: 299 },
          { name: '🍅 Organic Tomatoes (1kg)', price: 399 },
          { name: '🥬 Organic Spinach (500g)', price: 249 },
          { name: '🥛 Organic Milk (1L)', price: 129 },
          { name: '🥚 Organic Free-Range Eggs (6 pcs)', price: 199 }
        ],
        suggestions: ['Add all to cart', 'Why choose organic?', 'Show me more', 'Health benefits']
      };
    }

    // Sales and deals
    if (input.includes('sale') || input.includes('deal') || input.includes('discount') || input.includes('offer') || input.includes('cheap')) {
      return {
        id: (Date.now() + 1).toString(),
        text: "🔥 Hot deals today! Limited time offers - grab them before they're gone!",
        sender: 'ai',
        products: [
          { name: '🍎 Fresh Apples - 30% OFF', price: 209 },
          { name: '🍞 Artisan Bread - Flash Sale', price: 299 },
          { name: '🥛 Dairy Bundle - Save ₹200', price: 499 },
          { name: '🥗 Salad Mix - Buy 1 Get 1', price: 199 },
          { name: '🍝 Pasta Pack - 25% OFF', price: 349 }
        ],
        suggestions: ['Add all to cart', 'Set price alerts', 'Show me more deals', 'Weekly specials']
      };
    }

    // Recipe and meal planning
    if (input.includes('recipe') || input.includes('meal') || input.includes('cook') || input.includes('dinner') || input.includes('breakfast') || input.includes('lunch')) {
      return {
        id: (Date.now() + 1).toString(),
        text: "Based on what's fresh and your preferences, here are some delicious recipes! 👨‍🍳",
        sender: 'ai',
        products: [
          { name: '🥗 Mediterranean Quinoa Bowl', price: 399 },
          { name: '🍝 Classic Pasta Aglio e Olio', price: 299 },
          { name: '🥙 Chicken Tikka Wrap', price: 449 },
          { name: '🍛 Dal Tadka with Rice', price: 349 },
          { name: '🥘 Vegetable Stir Fry', price: 299 }
        ],
        suggestions: ['Get ingredients for all', 'Show me quick recipes', 'Meal plan for week', 'Healthy options']
      };
    }

    // Budget and savings
    if (input.includes('budget') || input.includes('save') || input.includes('spend') || input.includes('money') || input.includes('cost')) {
      return {
        id: (Date.now() + 1).toString(),
        text: "💰 Budget Analysis: You've spent ₹87.50 of your ₹120 weekly budget. Here's how to save more:\n\n✓ Switch to store brands: Save ₹150/week\n✓ Buy seasonal produce: Save ₹200/month\n✓ Use bulk discounts: Save 15-20%\n✓ Subscribe to essentials: Get 10% off\n\nYour personalized savings plan can help you save ₹500+ monthly!",
        sender: 'ai',
        suggestions: ['Show budget-friendly items', 'Set spending limit', 'View analytics', 'Smart shopping tips']
      };
    }

    // Healthy and nutrition
    if (input.includes('healthy') || input.includes('nutrition') || input.includes('calorie') || input.includes('diet') || input.includes('fitness')) {
      return {
        id: (Date.now() + 1).toString(),
        text: "🥗 Healthy picks for your 1500 cal/day goal! These superfoods are perfect for your diet:",
        sender: 'ai',
        products: [
          { name: '🥑 Fresh Avocados (High in healthy fats)', price: 299 },
          { name: '🥦 Broccoli Florets (Vitamin C rich)', price: 199 },
          { name: '🍓 Mixed Berries (Antioxidants)', price: 349 },
          { name: '🥜 Almonds (Protein-packed)', price: 449 },
          { name: '🐟 Salmon Fillet (Omega-3)', price: 799 }
        ],
        suggestions: ['Calculate nutrition', 'Weekly meal plan', 'Low-calorie options', 'Protein-rich foods']
      };
    }

    // Orders and tracking
    if (input.includes('order') || input.includes('delivery') || input.includes('track') || input.includes('status') || input.includes('when')) {
      return {
        id: (Date.now() + 1).toString(),
        text: "📦 Your Orders:\n\nOrder #GR-2024-10041: ✅ Delivered (Today)\nOrder #GR-2024-10042: 🚚 In Transit (15 mins away)\n\nYour subscription for Fresh Milk is scheduled for delivery tomorrow at 8 AM. Driver: John Smith",
        sender: 'ai',
        suggestions: ['Track current delivery', 'View order history', 'Reorder favorites', 'Contact driver']
      };
    }

    // Subscription management
    if (input.includes('subscription') || input.includes('subscribe') || input.includes('recurring') || input.includes('weekly')) {
      return {
        id: (Date.now() + 1).toString(),
        text: "📅 Your Active Subscriptions:\n\n✓ Fresh Milk (Daily) - ₹89/day\n✓ Bread (Weekly) - ₹449/week\n✓ Vegetables (Every 3 days) - ₹299\n\nTotal savings with subscriptions: ₹450/month!\n\nWant to add more items to your subscriptions?",
        sender: 'ai',
        suggestions: ['Add new subscription', 'Manage subscriptions', 'Pause delivery', 'Save more with bundles']
      };
    }

    // Price comparison
    if (input.includes('price') || input.includes('compare') || input.includes('cheaper') || input.includes('expensive')) {
      return {
        id: (Date.now() + 1).toString(),
        text: "💵 Price Comparison Activated! I'm checking prices across all stores...\n\n✅ You're getting the BEST prices!\n\n• Organic Tomatoes: ₹399 (₹100 cheaper than Store B)\n• Fresh Milk: ₹89 (₹20 cheaper than Store C)\n• Bread: ₹449 (₹50 cheaper than Store A)\n\nTotal savings: ₹170 on your current cart!",
        sender: 'ai',
        suggestions: ['Show all comparisons', 'Set price alerts', 'Find alternatives', 'Best value products']
      };
    }

    // Fridge integration
    if (input.includes('fridge') || input.includes('inventory') || input.includes('stock') || input.includes('running low')) {
      return {
        id: (Date.now() + 1).toString(),
        text: "🧊 Smart Fridge Analysis:\n\nYou're running low on:\n• Eggs (2 left) - Reorder now?\n• Milk (expires in 1 day)\n• Tomatoes (4 left)\n\nRecommended: Stock up on these essentials!",
        sender: 'ai',
        products: [
          { name: '🥚 Free-Range Eggs (12 pcs)', price: 199 },
          { name: '🥛 Organic Milk (2L)', price: 169 },
          { name: '🍅 Fresh Tomatoes (1kg)', price: 399 }
        ],
        suggestions: ['Add all to cart', 'Auto-reorder setup', 'View full inventory', 'Smart alerts']
      };
    }

    // Help and general questions
    if (input.includes('help') || input.includes('what can you do') || input.includes('features')) {
      return {
        id: (Date.now() + 1).toString(),
        text: "I can help you with:\n\n🛒 Product Search - Find anything you need\n📝 Recipe Suggestions - Based on what you have\n💰 Budget Management - Track and save money\n📦 Order Tracking - Real-time delivery updates\n🔔 Smart Alerts - Price drops, restocks\n📅 Subscriptions - Never run out of essentials\n🥗 Meal Planning - AI-generated plans\n🧊 Fridge Integration - Smart inventory\n🏆 Rewards & Gamification - Earn while you shop!",
        sender: 'ai',
        suggestions: ['Find products', 'Plan meals', 'Track orders', 'Manage budget']
      };
    }

    // Thank you responses
    if (input.match(/^(thank|thanks|ty|appreciate)/)) {
      return {
        id: (Date.now() + 1).toString(),
        text: "You're very welcome! 😊 I'm always here to help make your grocery shopping easier and more enjoyable. Is there anything else you'd like to know?",
        sender: 'ai',
        suggestions: ['Show me deals', 'Find products', 'Recipe ideas', 'Help me save money']
      };
    }

    // Default response with smart suggestions
    return {
      id: (Date.now() + 1).toString(),
      text: "I'd be happy to help! Here are some things I can do for you:\n\n🛒 Search for products\n🍳 Suggest recipes\n💰 Help with budgeting\n📦 Track your orders\n🌿 Find organic options\n🎯 Personalized deals\n\nWhat would you like to explore?",
      sender: 'ai',
      suggestions: ['Show me fresh vegetables', 'What\'s on sale?', 'Plan my meals', 'Track my order']
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!suggestion.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: suggestion,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI response with delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(suggestion);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  const handleQuickAction = (action: string) => {
    let query = '';
    switch(action) {
      case 'recipes':
        query = 'Show me recipe suggestions';
        break;
      case 'budget':
        query = 'Help me with my budget';
        break;
      case 'cart':
        query = 'What\'s in my cart?';
        break;
    }
    
    if (!query) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: query,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = generateAIResponse(query);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  return (
    <TooltipProvider>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="lg"
                  onClick={() => {
                    setIsOpen(true);
                    toast.success('AI Assistant opened! 🤖', {
                      description: 'Ask me anything about groceries, recipes, or budget',
                      duration: 1000,
                    });
                  }}
                  className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-2xl relative hover:scale-110 transition-transform"
                >
                  <Bot className="h-8 w-8" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-purple-500"></span>
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="text-base">
                <p className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Click to chat with AI Assistant
                </p>
              </TooltipContent>
            </Tooltip>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[600px] shadow-2xl"
          >
            <Card className="h-full flex flex-col overflow-hidden border-2 shadow-2xl">
              {/* Header */}
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <Bot className="h-6 w-6" />
                  <div>
                    <p className="flex items-center gap-1">
                      AI Assistant
                      <Sparkles className="h-4 w-4" />
                    </p>
                    <p className="text-xs opacity-90">
                      {messages.length === 1 ? 'Ready to assist' : `${messages.length} messages • Scroll to view all`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-white hover:bg-white/20 h-8 w-8"
                        title="More options"
                      >
                        <Sparkles className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleClearChat}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear Chat
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleMinimize}>
                        <Minimize2 className="h-4 w-4 mr-2" />
                        Minimize
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-red-500 hover:bg-opacity-80 h-10 w-10 rounded-lg transition-all hover:scale-110"
                    title="Close Chat"
                  >
                    <X className="h-6 w-6 stroke-[2.5]" />
                  </Button>
                </div>
              </div>

              {/* Scrollable Messages Area - ENHANCED FOR SCROLLING */}
              <div className="flex-1 relative bg-gradient-to-b from-background/50 to-background overflow-hidden">
                {/* Scroll Indicator at Top */}
                {messages.length > 3 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-purple-100 dark:from-purple-900/40 via-purple-50/80 dark:via-purple-900/20 to-transparent z-10 flex items-center justify-center pointer-events-none border-b-2 border-purple-200/50 dark:border-purple-700/50"
                  >
                    <Badge variant="secondary" className="text-xs pointer-events-auto shadow-lg animate-pulse">
                      ↑ SCROLL UP to view all {messages.length} messages ↑
                    </Badge>
                  </motion.div>
                )}
                
                {/* SCROLLABLE AREA WITH VISIBLE SCROLLBAR */}
                <div 
                  className="h-full overflow-y-auto overflow-x-hidden p-4 scroll-smooth"
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#a855f7 #e5e7eb'
                  }}
                >
                  <style>{`
                    /* Custom Scrollbar for Webkit browsers */
                    .h-full::-webkit-scrollbar {
                      width: 8px;
                    }
                    .h-full::-webkit-scrollbar-track {
                      background: #f1f1f1;
                      border-radius: 10px;
                    }
                    .dark .h-full::-webkit-scrollbar-track {
                      background: #2d2d2d;
                    }
                    .h-full::-webkit-scrollbar-thumb {
                      background: linear-gradient(180deg, #a855f7 0%, #ec4899 100%);
                      border-radius: 10px;
                      border: 2px solid transparent;
                      background-clip: padding-box;
                    }
                    .h-full::-webkit-scrollbar-thumb:hover {
                      background: linear-gradient(180deg, #9333ea 0%, #db2777 100%);
                      background-clip: padding-box;
                    }
                  `}</style>
                  
                  <div className="space-y-4 pb-4">
                    {/* Invisible element for scrolling to top */}
                    <div ref={messagesTopRef} />
                    
                    {/* Help Banner - Only show at start */}
                    {messages.length === 1 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-2 border-blue-300 dark:border-blue-700 rounded-xl p-4 mb-4 shadow-sm"
                      >
                        <p className="text-sm flex items-center gap-2">
                          <span className="text-2xl">💡</span>
                          <strong>How to Use This Chat:</strong>
                        </p>
                        <ul className="text-xs text-muted-foreground mt-3 space-y-2 ml-8">
                          <li className="flex items-start gap-2">
                            <span className="text-purple-500 mt-0.5">▶</span>
                            <span><strong>SCROLL with mouse wheel</strong> to see old messages</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-purple-500 mt-0.5">▶</span>
                            <span><strong>Click X button</strong> (top/bottom right) to close</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-purple-500 mt-0.5">▶</span>
                            <span><strong>Press Enter</strong> to send your messages</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-purple-500 mt-0.5">▶</span>
                            <span><strong>Click products</strong> to instantly add to cart</span>
                          </li>
                        </ul>
                      </motion.div>
                    )}
                  
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl p-3 ${
                          message.sender === 'user'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">{message.text}</p>
                        
                        {message.products && (
                          <div className="mt-3 space-y-2">
                            {message.products.map((product, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between bg-background/50 p-2 rounded-lg cursor-pointer hover:bg-background/70 transition-colors"
                                onClick={() => {
                                  toast.success(`${product.name} added to cart! 🛒`, {
                                    description: `₹${product.price}`,
                                    duration: 1000,
                                  });
                                }}
                              >
                                <span className="text-xs">{product.name}</span>
                                <Badge variant="secondary" className="text-xs">
                                  ₹{product.price}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {message.suggestions && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {message.suggestions.map((suggestion, idx) => (
                              <Button
                                key={idx}
                                size="sm"
                                variant="secondary"
                                className="text-xs h-7"
                                onClick={() => handleSuggestionClick(suggestion)}
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-2xl p-3 flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">AI is typing...</span>
                      </div>
                    </div>
                  )}

                    {/* Invisible element for scrolling to */}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Scroll to Top Button - PROMINENT */}
                {showScrollTop && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                    className="absolute bottom-32 right-6 z-20"
                  >
                    <Button
                      size="icon"
                      onClick={scrollToTop}
                      className="h-14 w-14 rounded-full shadow-2xl bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-3 border-white animate-bounce"
                      title="Scroll to top of chat"
                    >
                      <ArrowUp className="h-7 w-7 stroke-[3]" />
                    </Button>
                  </motion.div>
                )}

                {/* Scroll Indicator at Bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background/90 to-transparent z-10 flex items-center justify-center pointer-events-none">
                  <p className="text-xs text-muted-foreground">
                    Scroll up ↑ • {messages.length} message{messages.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-3 border-t bg-muted/30">
                <div className="flex gap-2 mb-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 text-xs h-8"
                    onClick={() => handleQuickAction('recipes')}
                  >
                    <ChefHat className="h-3 w-3 mr-1" />
                    Recipes
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 text-xs h-8"
                    onClick={() => handleQuickAction('budget')}
                  >
                    <Calculator className="h-3 w-3 mr-1" />
                    Budget
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 text-xs h-8"
                    onClick={() => handleQuickAction('cart')}
                  >
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    Cart
                  </Button>
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t bg-background space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask me anything..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSend} 
                    size="icon" 
                    className="bg-emerald-500 hover:bg-emerald-600 h-10 w-10"
                    disabled={!inputValue.trim() || isTyping}
                    title="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => setIsOpen(false)}
                    size="icon"
                    variant="outline"
                    className="h-10 w-10 border-2 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                    title="Close Chat"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  Press Enter to send • Click X to close chat
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </TooltipProvider>
  );
}
