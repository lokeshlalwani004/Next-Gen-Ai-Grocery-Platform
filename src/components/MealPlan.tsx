import { useState } from 'react';
import { 
  Coffee, 
  Sun, 
  Sunset, 
  Apple, 
  Clock, 
  Flame, 
  ChefHat,
  ShoppingCart,
  CheckCircle2,
  Calendar,
  Utensils,
  Heart,
  Sparkles
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner@2.0.3';

interface MealItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  prepTime: string;
  ingredients: {
    name: string;
    amount: string;
    price: number;
    productId?: string;
  }[];
  recipe: string[];
  tags: string[];
  image: string;
}

interface MealPlanProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (productId: string, productName: string, productPrice: number) => void;
}

export function MealPlan({ isOpen, onClose, onAddToCart }: MealPlanProps) {
  const [addedIngredients, setAddedIngredients] = useState<Set<string>>(new Set());

  // Get today's date
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // AI-Generated Meal Plan for Today
  const mealPlan: { [key: string]: MealItem } = {
    breakfast: {
      name: 'Oats & Banana Power Bowl',
      calories: 450,
      protein: 12,
      carbs: 68,
      fats: 14,
      prepTime: '10 mins',
      image: 'https://images.unsplash.com/photo-1517673900593-e63367463d1e?w=400',
      tags: ['High Fiber', 'Heart Healthy', 'Quick'],
      ingredients: [
        { name: 'Rolled Oats', amount: '1 cup', price: 120, productId: 'grain-1' },
        { name: 'Fresh Banana', amount: '2 pcs', price: 80, productId: 'fruit-3' },
        { name: 'Almonds', amount: '30g', price: 150, productId: 'nuts-1' },
        { name: 'Organic Honey', amount: '2 tbsp', price: 200, productId: 'honey-1' },
        { name: 'Fresh Milk', amount: '200ml', price: 189, productId: 'dairy-2' },
      ],
      recipe: [
        'Boil 1 cup of water or heat milk in a saucepan',
        'Add rolled oats and cook for 5-7 minutes, stirring occasionally',
        'Slice the bananas into rounds',
        'Pour oats into a bowl and top with banana slices',
        'Add chopped almonds and drizzle honey on top',
        'Optional: Add a pinch of cinnamon for extra flavor'
      ]
    },
    lunch: {
      name: 'Grilled Chicken Caesar Salad',
      calories: 520,
      protein: 45,
      carbs: 28,
      fats: 24,
      prepTime: '25 mins',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      tags: ['High Protein', 'Low Carb', 'Keto-Friendly'],
      ingredients: [
        { name: 'Chicken Breast', amount: '200g', price: 280, productId: 'meat-1' },
        { name: 'Fresh Lettuce', amount: '1 head', price: 60, productId: 'veg-5' },
        { name: 'Cherry Tomatoes', amount: '100g', price: 80, productId: '1' },
        { name: 'Parmesan Cheese', amount: '50g', price: 150, productId: 'dairy-3' },
        { name: 'Olive Oil', amount: '2 tbsp', price: 250, productId: 'oil-1' },
        { name: 'Garlic', amount: '3 cloves', price: 40, productId: 'veg-6' },
      ],
      recipe: [
        'Season chicken breast with salt, pepper, and herbs',
        'Grill chicken on medium-high heat for 6-7 minutes each side',
        'Let chicken rest for 5 minutes, then slice into strips',
        'Wash and tear lettuce into bite-sized pieces',
        'Halve cherry tomatoes and add to lettuce',
        'Make dressing: Mix olive oil, minced garlic, lemon juice, and grated parmesan',
        'Toss salad with dressing and top with grilled chicken',
        'Garnish with extra parmesan shavings'
      ]
    },
    snack: {
      name: 'Greek Yogurt & Berry Parfait',
      calories: 280,
      protein: 18,
      carbs: 35,
      fats: 8,
      prepTime: '5 mins',
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
      tags: ['Protein Rich', 'Probiotic', 'Antioxidants'],
      ingredients: [
        { name: 'Greek Yogurt', amount: '200g', price: 180, productId: 'dairy-4' },
        { name: 'Mixed Berries', amount: '150g', price: 250, productId: 'fruit-6' },
        { name: 'Granola', amount: '50g', price: 120, productId: 'grain-2' },
        { name: 'Honey', amount: '1 tbsp', price: 200, productId: 'honey-1' },
      ],
      recipe: [
        'Layer 100g Greek yogurt in a glass or bowl',
        'Add a layer of mixed berries (strawberries, blueberries, raspberries)',
        'Sprinkle granola on top of berries',
        'Repeat layers with remaining yogurt and berries',
        'Drizzle honey over the top layer',
        'Optional: Add chia seeds or chopped nuts for extra nutrition'
      ]
    },
    dinner: {
      name: 'Paneer Tikka with Quinoa',
      calories: 580,
      protein: 32,
      carbs: 54,
      fats: 22,
      prepTime: '35 mins',
      image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400',
      tags: ['Vegetarian', 'High Protein', 'Indian'],
      ingredients: [
        { name: 'Paneer Cubes', amount: '250g', price: 180, productId: 'dairy-5' },
        { name: 'Quinoa', amount: '1 cup', price: 350, productId: 'grain-3' },
        { name: 'Bell Peppers', amount: '2 pcs', price: 120, productId: 'veg-7' },
        { name: 'Onions', amount: '2 pcs', price: 60, productId: '3' },
        { name: 'Greek Yogurt', amount: '100g', price: 180, productId: 'dairy-4' },
        { name: 'Tikka Masala', amount: '2 tbsp', price: 80, productId: 'spice-1' },
      ],
      recipe: [
        'Marinate paneer cubes in yogurt, tikka masala, and lemon juice for 20 mins',
        'Cut bell peppers and onions into large chunks',
        'Thread marinated paneer, peppers, and onions onto skewers',
        'Grill or bake at 200°C for 15-20 minutes, turning occasionally',
        'Meanwhile, cook quinoa: Rinse and cook in 2 cups water for 15 minutes',
        'Fluff quinoa with a fork and season with salt and herbs',
        'Serve hot paneer tikka skewers over quinoa bed',
        'Garnish with fresh cilantro and lemon wedges'
      ]
    }
  };

  const totalNutrition = {
    calories: Object.values(mealPlan).reduce((sum, meal) => sum + meal.calories, 0),
    protein: Object.values(mealPlan).reduce((sum, meal) => sum + meal.protein, 0),
    carbs: Object.values(mealPlan).reduce((sum, meal) => sum + meal.carbs, 0),
    fats: Object.values(mealPlan).reduce((sum, meal) => sum + meal.fats, 0),
  };

  const handleAddIngredient = (ingredient: any) => {
    if (ingredient.productId && !addedIngredients.has(ingredient.name)) {
      onAddToCart(ingredient.productId, ingredient.name, ingredient.price);
      setAddedIngredients(prev => new Set(prev).add(ingredient.name));
      toast.success(`${ingredient.name} added to cart! 🛒`, {
        description: `₹${ingredient.price} • ${ingredient.amount}`,
        duration: 1000,
      });
    }
  };

  const handleAddAllIngredients = (meal: MealItem) => {
    let addedCount = 0;
    meal.ingredients.forEach(ingredient => {
      if (ingredient.productId && !addedIngredients.has(ingredient.name)) {
        onAddToCart(ingredient.productId, ingredient.name, ingredient.price);
        setAddedIngredients(prev => new Set(prev).add(ingredient.name));
        addedCount++;
      }
    });
    
    if (addedCount > 0) {
      toast.success(`${addedCount} ingredients added to cart! 🛒`, {
        description: `All items for ${meal.name}`,
        duration: 1000,
      });
    }
  };

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        return <Coffee className="h-5 w-5" />;
      case 'lunch':
        return <Sun className="h-5 w-5" />;
      case 'snack':
        return <Apple className="h-5 w-5" />;
      case 'dinner':
        return <Sunset className="h-5 w-5" />;
      default:
        return <Utensils className="h-5 w-5" />;
    }
  };

  const getMealColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        return 'text-orange-500 bg-orange-50 dark:bg-orange-950';
      case 'lunch':
        return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950';
      case 'snack':
        return 'text-green-500 bg-green-50 dark:bg-green-950';
      case 'dinner':
        return 'text-purple-500 bg-purple-50 dark:bg-purple-950';
      default:
        return 'text-gray-500 bg-gray-50 dark:bg-gray-950';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <ChefHat className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl">AI-Generated Meal Plan</DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4" />
                {today}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Daily Nutrition Summary */}
        <div className="grid grid-cols-4 gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-lg">
          <div className="text-center">
            <Flame className="h-5 w-5 mx-auto mb-1 text-orange-500" />
            <div className="text-2xl font-bold">{totalNutrition.calories}</div>
            <div className="text-xs text-muted-foreground">Calories</div>
          </div>
          <div className="text-center">
            <Heart className="h-5 w-5 mx-auto mb-1 text-red-500" />
            <div className="text-2xl font-bold">{totalNutrition.protein}g</div>
            <div className="text-xs text-muted-foreground">Protein</div>
          </div>
          <div className="text-center">
            <Sparkles className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
            <div className="text-2xl font-bold">{totalNutrition.carbs}g</div>
            <div className="text-xs text-muted-foreground">Carbs</div>
          </div>
          <div className="text-center">
            <Apple className="h-5 w-5 mx-auto mb-1 text-green-500" />
            <div className="text-2xl font-bold">{totalNutrition.fats}g</div>
            <div className="text-xs text-muted-foreground">Fats</div>
          </div>
        </div>

        <Tabs defaultValue="breakfast" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="breakfast" className="flex items-center gap-2">
              <Coffee className="h-4 w-4" />
              Breakfast
            </TabsTrigger>
            <TabsTrigger value="lunch" className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              Lunch
            </TabsTrigger>
            <TabsTrigger value="snack" className="flex items-center gap-2">
              <Apple className="h-4 w-4" />
              Snack
            </TabsTrigger>
            <TabsTrigger value="dinner" className="flex items-center gap-2">
              <Sunset className="h-4 w-4" />
              Dinner
            </TabsTrigger>
          </TabsList>

          {Object.entries(mealPlan).map(([mealType, meal]) => (
            <TabsContent key={mealType} value={mealType} className="flex-1 overflow-hidden mt-4">
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-6">
                  {/* Meal Header */}
                  <div className="flex items-start gap-4">
                    <img 
                      src={meal.image} 
                      alt={meal.name}
                      className="w-32 h-32 object-cover rounded-lg shadow-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-2 rounded-lg ${getMealColor(mealType)}`}>
                          {getMealIcon(mealType)}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">{meal.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Clock className="h-4 w-4" />
                            {meal.prepTime}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {meal.tags.map((tag, idx) => (
                          <Badge key={idx} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Nutrition Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Nutritional Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <div className="text-lg font-bold text-orange-500">{meal.calories}</div>
                          <div className="text-xs text-muted-foreground">Calories</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-red-500">{meal.protein}g</div>
                          <div className="text-xs text-muted-foreground">Protein</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-yellow-500">{meal.carbs}g</div>
                          <div className="text-xs text-muted-foreground">Carbs</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-500">{meal.fats}g</div>
                          <div className="text-xs text-muted-foreground">Fats</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Ingredients */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">Ingredients</CardTitle>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleAddAllIngredients(meal)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add All to Cart
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {meal.ingredients.map((ingredient, idx) => (
                          <div 
                            key={idx}
                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{ingredient.name}</span>
                                {addedIngredients.has(ingredient.name) && (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {ingredient.amount} • ₹{ingredient.price}
                              </div>
                            </div>
                            {ingredient.productId && !addedIngredients.has(ingredient.name) && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleAddIngredient(ingredient)}
                              >
                                <ShoppingCart className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recipe Steps */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <ChefHat className="h-4 w-4" />
                        Cooking Instructions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ol className="space-y-3">
                        {meal.recipe.map((step, idx) => (
                          <li key={idx} className="flex gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">
                              {idx + 1}
                            </div>
                            <p className="flex-1 pt-0.5">{step}</p>
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            🤖 Generated by AI based on your health goals and preferences
          </div>
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
