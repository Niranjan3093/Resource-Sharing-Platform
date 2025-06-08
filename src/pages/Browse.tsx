
import { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { MapPin, Filter, X, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Item, FilterOptions } from "@/types";
import { fetchItems, categories } from "@/services/mockData";
import ItemCard from "@/components/ItemCard";
import ItemsMap from "@/components/ItemsMap";
import { toast } from "sonner";
import { AuthContext } from "@/App";

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeView, setActiveView] = useState<"grid" | "map">("grid");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const { user } = useContext(AuthContext);
  
  const [filters, setFilters] = useState<FilterOptions>({
    category: searchParams.get("category") || undefined,
    availability: true,
    distance: 10,
    sortBy: "newest",
  });

  // Load items from localStorage or fetch from mock service
  useEffect(() => {
    const loadItems = async () => {
      try {
        setIsLoading(true);
        
        // Try to get items from localStorage first
        const storedItems = localStorage.getItem('items');
        let allItems: Item[] = [];
        
        if (storedItems) {
          try {
            allItems = JSON.parse(storedItems);
          } catch (e) {
            console.error("Failed to parse stored items:", e);
            // Fallback to fetching from mock service
            allItems = await fetchItems();
          }
        } else {
          // If no items in localStorage, fetch from mock service
          allItems = await fetchItems();
          
          // Store the fetched items in localStorage for future use
          localStorage.setItem('items', JSON.stringify(allItems));
        }
        
        setItems(allItems);
        
        const initialSearchTerm = searchParams.get("q") || "";
        setSearchTerm(initialSearchTerm);
        
        const initialCategory = searchParams.get("category");
        if (initialCategory) {
          setFilters(prev => ({ ...prev, category: initialCategory }));
        }
      } catch (error) {
        console.error("Error loading items:", error);
        toast.error("Failed to load items. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadItems();
    
    // Set up a localStorage change listener to refresh items when they change
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'items') {
        loadItems();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [searchParams]);

  useEffect(() => {
    let result = [...items];
    
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.title.toLowerCase().includes(searchTermLower) ||
        item.description.toLowerCase().includes(searchTermLower) ||
        (item.category && item.category.toLowerCase().includes(searchTermLower)) ||
        (item.location && item.location.toLowerCase().includes(searchTermLower))
      );
    }
    
    if (filters.category && filters.category !== "all") {
      result = result.filter(item => item.category === filters.category);
    }
    
    if (filters.availability !== undefined) {
      result = result.filter(item => item.available === filters.availability);
    }
    
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "newest":
          result = result.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
        case "oldest":
          result = result.sort((a, b) => 
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          break;
        case "popular":
          result = result.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
          break;
      }
    }
    
    setFilteredItems(result);
  }, [items, searchTerm, filters]);

  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchTerm) {
      params.set("q", searchTerm);
    }
    
    if (filters.category && filters.category !== "all") {
      params.set("category", filters.category);
    }
    
    setSearchParams(params, { replace: true });
  }, [searchTerm, filters.category, setSearchParams]);

  const clearFilters = () => {
    setFilters({
      category: undefined,
      availability: true,
      distance: 10,
      sortBy: "newest",
    });
    setSearchTerm("");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Additional functionality could be added here if needed
    toast.success(`Searching for "${searchTerm}"`);
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== undefined).length;

  return (
    <div className="container mx-auto max-w-7xl pt-24 pb-12 px-4">
      <div className="flex flex-col space-y-6">
        <div className="pt-4">
          <h1 className="h2 mb-2">Browse Items</h1>
          <p className="text-lg text-muted-foreground">
            Find items available for sharing in your community
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <form onSubmit={handleSearch} className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search items..."
              className="pl-9 rounded-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </form>

          <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
            <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Refine your search with these filters
                  </SheetDescription>
                </SheetHeader>
                
                <div className="py-6 space-y-6">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select 
                      value={filters.category || "all"} 
                      onValueChange={(value) => setFilters(prev => ({ ...prev, category: value === "all" ? undefined : value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.icon} {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="availability">Available Items Only</Label>
                      <Switch 
                        id="availability" 
                        checked={filters.availability} 
                        onCheckedChange={(checked) => setFilters(prev => ({ ...prev, availability: checked }))}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Only show items that are currently available
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Maximum Distance</Label>
                      <span className="text-sm">{filters.distance} km</span>
                    </div>
                    <Slider 
                      value={[filters.distance || 10]} 
                      min={1} 
                      max={20} 
                      step={1} 
                      onValueChange={([value]) => setFilters(prev => ({ ...prev, distance: value }))}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1 km</span>
                      <span>20 km</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Sort By</Label>
                    <Select 
                      value={filters.sortBy} 
                      onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Newest First" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="popular">Most Popular</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <SheetFooter className="flex flex-row gap-2 sm:flex-row">
                  <Button variant="outline" onClick={clearFilters} className="flex-1">
                    Clear All
                  </Button>
                  <Button onClick={() => setIsFiltersOpen(false)} className="flex-1">
                    Apply Filters
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            <div className="flex border rounded-lg overflow-hidden">
              <Button
                variant={activeView === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveView("grid")}
                className="rounded-none border-0"
              >
                Grid
              </Button>
              <Separator orientation="vertical" className="h-8" />
              <Button
                variant={activeView === "map" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveView("map")}
                className="rounded-none border-0"
              >
                Map
              </Button>
            </div>
          </div>
        </div>

        {(searchTerm || (filters.category && filters.category !== "all") || !filters.availability) && (
          <div className="flex flex-wrap gap-2 mt-2">
            {searchTerm && (
              <Badge variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                Search: {searchTerm}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            
            {filters.category && filters.category !== "all" && (
              <Badge variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                Category: {filters.category}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => setFilters(prev => ({ ...prev, category: undefined }))}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            
            {filters.availability === false && (
              <Badge variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                Show Unavailable
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => setFilters(prev => ({ ...prev, availability: true }))}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            
            {(searchTerm || (filters.category && filters.category !== "all") || !filters.availability) && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7">
                Clear All
              </Button>
            )}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading items...</p>
            </div>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground mt-2">
              {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
            </p>

            {activeView === "grid" ? (
              filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
                  {filteredItems.map((item) => (
                    <ItemCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[300px] mt-4 text-center">
                  <div className="bg-accent/50 p-4 rounded-full mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-medium">No items found</h3>
                  <p className="text-muted-foreground mt-2 max-w-md">
                    Try adjusting your search or filters to find what you're looking for
                  </p>
                  <Button onClick={clearFilters} className="mt-4">
                    Clear Filters
                  </Button>
                </div>
              )
            ) : (
              <div className="h-[70vh] mt-4 rounded-xl overflow-hidden border">
                <ItemsMap items={filteredItems} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Browse;
