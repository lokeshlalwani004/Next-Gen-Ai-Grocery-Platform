import { TrendingUp, Zap, Trophy, Target, Clock, Heart, Calendar } from 'lucide-react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';

interface PersonalDashboardProps {
  userName: string;
  userLevel: number;
  xp: number;
  maxXp: number;
  weeklyBudget: number;
  spent: number;
  calories: number;
  targetCalories: number;
  onAddSmartFridgeItems?: () => void;
  onViewMealPlan?: () => void;
}

export function PersonalDashboard({
  userName,
  userLevel,
  xp,
  maxXp,
  weeklyBudget,
  spent,
  calories,
  targetCalories,
  onAddSmartFridgeItems,
  onViewMealPlan
}: PersonalDashboardProps) {
  const budgetPercentage = (spent / weeklyBudget) * 100;
  const xpPercentage = (xp / maxXp) * 100;
  const caloriesPercentage = (calories / targetCalories) * 100;

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-b">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              Welcome back, {userName}! 👋
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Here's your personalized shopping insights</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline"
              size="default"
              onClick={() => toast.success('Reordering your last 5 items! 🔄', {
                description: 'Milk, Eggs, Bread, Fruits, Vegetables added to cart',
                duration: 1000,
              })}
            >
              <Zap className="h-4 w-4 mr-2" />
              Quick Reorder
            </Button>
            <Button 
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
              size="default"
              onClick={() => toast.info('Opening delivery scheduler... 📅', {
                description: 'Choose your preferred delivery time slot',
                duration: 1000,
              })}
            >
              <Clock className="h-4 w-4 mr-2" />
              Schedule Delivery
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Gamification Card */}
          <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-white/80 mb-1">Your Level</p>
                <h3 className="text-3xl font-bold text-white">Level {userLevel}</h3>
              </div>
              <Trophy className="h-10 w-10 text-yellow-300 flex-shrink-0" />
            </div>
            <div className="mb-3">
              <Progress value={xpPercentage} className="h-2 bg-white/20" />
            </div>
            <p className="text-sm font-medium text-white/90 mb-4">
              {xp} / {maxXp} XP to Level {userLevel + 1}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-yellow-400 text-purple-900 hover:bg-yellow-400 font-medium">
                🏆 Smart Shopper
              </Badge>
              <Badge className="bg-green-400 text-purple-900 hover:bg-green-400 font-medium">
                ♻️ Eco Warrior
              </Badge>
            </div>
          </Card>

          {/* Budget Tracker */}
          <Card className="p-6 shadow-md">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Weekly Budget</p>
                <h3 className="text-2xl font-bold">₹{spent.toFixed(2)} / ₹{weeklyBudget}</h3>
              </div>
              <Target className="h-10 w-10 text-emerald-500 flex-shrink-0" />
            </div>
            <div className="mb-3">
              <Progress value={budgetPercentage} className="h-2" />
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-3">
              ₹{(weeklyBudget - spent).toFixed(2)} remaining this week
            </p>
            <Button 
              variant="link" 
              className="px-0 h-auto text-emerald-600 hover:text-emerald-700 font-medium"
              onClick={() => toast.info('Opening spending analytics dashboard... 📊', { duration: 1000 })}
            >
              View spending analytics →
            </Button>
          </Card>

          {/* Health Tracker */}
          <Card className="p-6 shadow-md">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Today's Nutrition</p>
                <h3 className="text-2xl font-bold">{calories} / {targetCalories} cal</h3>
              </div>
              <Heart className="h-10 w-10 text-pink-500 flex-shrink-0" />
            </div>
            <div className="mb-3">
              <Progress value={caloriesPercentage} className="h-2" />
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-3">
              {targetCalories - calories} calories left today
            </p>
            <Button 
              variant="link" 
              className="px-0 h-auto text-pink-600 hover:text-pink-700 font-medium"
              onClick={() => {
                if (onViewMealPlan) {
                  onViewMealPlan();
                } else {
                  toast.info('Generating AI meal plan... 🥗', {
                    description: 'Based on your nutrition goals and preferences',
                    duration: 1000,
                  });
                }
              }}
            >
              View meal plan →
            </Button>
          </Card>
        </div>

        {/* AI Smart Fridge Recommendations Banner */}
        <Card className="p-5 mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800 shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="bg-blue-500 p-3 rounded-lg flex-shrink-0">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="flex items-center gap-2 font-semibold text-base mb-1">
                <span>AI Smart Suggestions</span>
                <Badge variant="secondary" className="text-xs font-medium">New</Badge>
              </p>
              <p className="text-sm text-muted-foreground">
                Based on your fridge inventory, you're low on <span className="font-medium">milk</span> and <span className="font-medium">eggs</span>. Add to cart?
              </p>
            </div>
            <Button 
              className="bg-blue-500 hover:bg-blue-600 font-medium shadow-sm flex-shrink-0"
              size="default"
              onClick={() => {
                if (onAddSmartFridgeItems) {
                  onAddSmartFridgeItems();
                } else {
                  toast.success('Smart items added to cart! 🛒', {
                    description: 'Milk and Eggs added based on AI suggestion',
                    duration: 1000,
                  });
                }
              }}
            >
              Add Items
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
