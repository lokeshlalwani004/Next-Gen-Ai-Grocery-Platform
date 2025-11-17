import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { 
  SlidersHorizontal, 
  Star, 
  Leaf, 
  Zap, 
  Tag, 
  TrendingUp,
  TrendingDown,
  Clock,
  Award,
  X
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export interface FilterOptions {
  priceRange: [number, number];
  minRating: number;
  inStockOnly: boolean;
  organicOnly: boolean;
  flashSaleOnly: boolean;
  minDiscount: number;
  sortBy: 'none' | 'price-low' | 'price-high' | 'rating' | 'discount' | 'newest';
}

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
}

export function FilterPanel({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onClearFilters,
  activeFiltersCount,
}: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  const handlePriceChange = (value: number[]) => {
    setLocalFilters({ ...localFilters, priceRange: [value[0], value[1]] });
  };

  const handleRatingChange = (rating: number) => {
    setLocalFilters({ ...localFilters, minRating: rating });
  };

  const handleToggle = (key: keyof FilterOptions, value: boolean) => {
    setLocalFilters({ ...localFilters, [key]: value });
  };

  const handleDiscountChange = (value: number[]) => {
    setLocalFilters({ ...localFilters, minDiscount: value[0] });
  };

  const handleSortChange = (sortBy: FilterOptions['sortBy']) => {
    setLocalFilters({ ...localFilters, sortBy });
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    toast.success('Filters applied! 🎯', {
      description: `${activeFiltersCount + 1} filter${activeFiltersCount + 1 !== 1 ? 's' : ''} active`,
    });
    onClose();
  };

  const handleReset = () => {
    const defaultFilters: FilterOptions = {
      priceRange: [0, 3000],
      minRating: 0,
      inStockOnly: false,
      organicOnly: false,
      flashSaleOnly: false,
      minDiscount: 0,
      sortBy: 'none',
    };
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
    onClearFilters();
    toast.info('All filters cleared');
  };

  const isFilterActive = () => {
    return (
      localFilters.priceRange[0] !== 0 ||
      localFilters.priceRange[1] !== 3000 ||
      localFilters.minRating > 0 ||
      localFilters.inStockOnly ||
      localFilters.organicOnly ||
      localFilters.flashSaleOnly ||
      localFilters.minDiscount > 0 ||
      localFilters.sortBy !== 'none'
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5" />
            Advanced Filters
            {activeFiltersCount > 0 && (
              <Badge className="ml-2 bg-emerald-500">
                {activeFiltersCount} active
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription>
            Customize your product search with advanced filtering options
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-6 px-6 my-6">
          <div className="space-y-6">
            {/* Price Range */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Price Range
                </Label>
                <span className="text-sm text-muted-foreground">
                  ₹{localFilters.priceRange[0]} - ₹{localFilters.priceRange[1]}
                </span>
              </div>
              <Slider
                min={0}
                max={3000}
                step={50}
                value={localFilters.priceRange}
                onValueChange={handlePriceChange}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>₹0</span>
                <span>₹3000+</span>
              </div>
            </div>

            <Separator />

            {/* Minimum Rating */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                Minimum Rating
              </Label>
              <div className="grid grid-cols-5 gap-2">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <Button
                    key={rating}
                    size="sm"
                    variant={localFilters.minRating === rating + 1 ? 'default' : 'outline'}
                    onClick={() => handleRatingChange(rating === 0 ? 0 : rating + 1)}
                    className="flex flex-col items-center gap-1 h-auto py-2"
                  >
                    {rating === 0 ? (
                      <span className="text-xs">Any</span>
                    ) : (
                      <>
                        <div className="flex items-center gap-0.5">
                          <Star className="h-3 w-3 fill-current" />
                          <span className="text-xs">{rating + 1}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">+</span>
                      </>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Quick Filters */}
            <div className="space-y-4">
              <Label>Quick Filters</Label>
              
              {/* In Stock Only */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Award className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <Label htmlFor="inStock" className="cursor-pointer">
                      In Stock Only
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Show available items
                    </p>
                  </div>
                </div>
                <Switch
                  id="inStock"
                  checked={localFilters.inStockOnly}
                  onCheckedChange={(checked) => handleToggle('inStockOnly', checked)}
                />
              </div>

              {/* Organic Only */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Leaf className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <Label htmlFor="organic" className="cursor-pointer">
                      Organic Products
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Certified organic only
                    </p>
                  </div>
                </div>
                <Switch
                  id="organic"
                  checked={localFilters.organicOnly}
                  onCheckedChange={(checked) => handleToggle('organicOnly', checked)}
                />
              </div>

              {/* Flash Sale Only */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <Label htmlFor="flashSale" className="cursor-pointer">
                      Flash Sale Only
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Limited time deals
                    </p>
                  </div>
                </div>
                <Switch
                  id="flashSale"
                  checked={localFilters.flashSaleOnly}
                  onCheckedChange={(checked) => handleToggle('flashSaleOnly', checked)}
                />
              </div>
            </div>

            <Separator />

            {/* Minimum Discount */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  Minimum Discount
                </Label>
                <Badge variant="secondary">
                  {localFilters.minDiscount}%+
                </Badge>
              </div>
              <Slider
                min={0}
                max={50}
                step={5}
                value={[localFilters.minDiscount]}
                onValueChange={handleDiscountChange}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>No discount</span>
                <span>50%+ off</span>
              </div>
            </div>

            <Separator />

            {/* Sort By */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                Sort By
              </Label>
              <RadioGroup
                value={localFilters.sortBy}
                onValueChange={(value) => handleSortChange(value as FilterOptions['sortBy'])}
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="sort-none" />
                    <Label htmlFor="sort-none" className="cursor-pointer flex items-center gap-2">
                      <Award className="h-3 w-3" />
                      Default (Featured)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="price-low" id="sort-price-low" />
                    <Label htmlFor="sort-price-low" className="cursor-pointer flex items-center gap-2">
                      <TrendingDown className="h-3 w-3 text-green-600" />
                      Price: Low to High
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="price-high" id="sort-price-high" />
                    <Label htmlFor="sort-price-high" className="cursor-pointer flex items-center gap-2">
                      <TrendingUp className="h-3 w-3 text-red-600" />
                      Price: High to Low
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rating" id="sort-rating" />
                    <Label htmlFor="sort-rating" className="cursor-pointer flex items-center gap-2">
                      <Star className="h-3 w-3 text-yellow-500" />
                      Highest Rated
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="discount" id="sort-discount" />
                    <Label htmlFor="sort-discount" className="cursor-pointer flex items-center gap-2">
                      <Tag className="h-3 w-3 text-orange-600" />
                      Best Discount
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="newest" id="sort-newest" />
                    <Label htmlFor="sort-newest" className="cursor-pointer flex items-center gap-2">
                      <Clock className="h-3 w-3 text-blue-600" />
                      Newest First
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="space-y-2 pt-4 border-t">
          <div className="flex gap-2">
            <Button
              onClick={handleApply}
              className="flex-1"
              size="lg"
            >
              Apply Filters
              {isFilterActive() && (
                <Badge className="ml-2 bg-white text-primary">
                  {Object.values(localFilters).filter((v) => 
                    typeof v === 'boolean' ? v : 
                    Array.isArray(v) ? v[0] !== 0 || v[1] !== 3000 :
                    typeof v === 'number' ? v !== 0 :
                    v !== 'none'
                  ).length}
                </Badge>
              )}
            </Button>
          </div>
          <Button
            onClick={handleReset}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <X className="h-4 w-4 mr-2" />
            Clear All Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}