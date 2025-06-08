
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Loader2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Item } from "@/types";
import { fetchUserItems } from "@/services/mockData";
import ItemCard from "@/components/ItemCard";
import { AuthContext } from "@/App";
import { toast } from "sonner";

const MyItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  
  // Get user ID from context
  const { user } = useContext(AuthContext);
  const currentUserId = user?.id || "user1";

  // Load user items from localStorage or mock service
  useEffect(() => {
    const loadUserItems = async () => {
      try {
        setIsLoading(true);
        
        // Try to get items from localStorage first
        const storedItems = localStorage.getItem('items');
        let userItems: Item[] = [];
        
        if (storedItems) {
          try {
            const parsedItems = JSON.parse(storedItems);
            // Filter items that belong to the current user
            userItems = parsedItems.filter((item: Item) => item.owner?.id === currentUserId);
            
            // If we found user items, use them
            if (userItems.length > 0) {
              setItems(userItems);
              setFilteredItems(userItems);
              setIsLoading(false);
              return;
            }
          } catch (e) {
            console.error("Failed to parse stored items:", e);
          }
        }
        
        // If no items in localStorage or no user items found, fetch from mock service
        userItems = await fetchUserItems(currentUserId);
        
        // Store the fetched items in localStorage
        const allItems = localStorage.getItem('items');
        let itemsArray: Item[] = [];
        try {
          itemsArray = allItems ? JSON.parse(allItems) : [];
        } catch (e) {
          itemsArray = [];
        }
        
        // Add the user items that aren't already in localStorage
        const existingIds = new Set(itemsArray.map((item: Item) => item.id));
        const newItems = userItems.filter(item => !existingIds.has(item.id));
        
        if (newItems.length > 0) {
          const updatedItems = [...itemsArray, ...newItems];
          localStorage.setItem('items', JSON.stringify(updatedItems));
        }
        
        setItems(userItems);
        setFilteredItems(userItems);
      } catch (error) {
        console.error("Error loading user items:", error);
        toast.error("Failed to load your items. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserItems();
    
    // Listen for localStorage changes
    const handleStorageChange = () => {
      const storedItems = localStorage.getItem('items');
      if (storedItems) {
        try {
          const parsedItems = JSON.parse(storedItems);
          const userItems = parsedItems.filter((item: Item) => item.owner?.id === currentUserId);
          setItems(userItems);
          
          // Also update filtered items while preserving search filter
          if (searchTerm) {
            const term = searchTerm.toLowerCase();
            const filtered = userItems.filter(item => 
              item.title.toLowerCase().includes(term) || 
              item.description.toLowerCase().includes(term) ||
              item.category.toLowerCase().includes(term)
            );
            setFilteredItems(filtered);
          } else {
            setFilteredItems(userItems);
          }
        } catch (e) {
          console.error("Failed to parse stored items:", e);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event to refresh items when a new item is added
    const handleItemAdded = () => {
      console.log("Item added event received, refreshing items");
      handleStorageChange();
    };
    
    window.addEventListener('itemAdded', handleItemAdded);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('itemAdded', handleItemAdded);
    };
  }, [currentUserId, searchTerm]);

  // Filter items based on search term and tab
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (!term) {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item => 
        item.title.toLowerCase().includes(term) || 
        item.description.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term)
      );
      setFilteredItems(filtered);
    }
  };

  // Filter based on tab
  const filterByTab = (tab: string) => {
    if (tab === "all") {
      return items.filter(item => 
        searchTerm ? (
          item.title.toLowerCase().includes(searchTerm) || 
          item.description.toLowerCase().includes(searchTerm) ||
          item.category.toLowerCase().includes(searchTerm)
        ) : true
      );
    }
    
    if (tab === "available") {
      return items.filter(item => 
        item.available && (
          searchTerm ? (
            item.title.toLowerCase().includes(searchTerm) || 
            item.description.toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm)
          ) : true
        )
      );
    }
    
    if (tab === "unavailable") {
      return items.filter(item => 
        !item.available && (
          searchTerm ? (
            item.title.toLowerCase().includes(searchTerm) || 
            item.description.toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm)
          ) : true
        )
      );
    }
    
    return [];
  };

  return (
    <div className="container mx-auto max-w-7xl pt-24 pb-12 px-4">
      <div className="flex flex-col space-y-6">
        <div className="pt-4">
          <h1 className="h2 mb-2">My Items</h1>
          <p className="text-lg text-muted-foreground">
            Manage your shared items
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Search */}
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search my items..."
              className="pl-9 rounded-full"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          {/* Add Item button */}
          <Button asChild>
            <Link to="/add">
              <Plus className="h-4 w-4 mr-2" />
              Add New Item
            </Link>
          </Button>
        </div>

        {/* Items Tabs and Content */}
        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-between items-center">
            <TabsList className="mb-6">
              <TabsTrigger value="all">
                All
                <Badge variant="secondary" className="ml-2">{items.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="available">
                Available
                <Badge variant="secondary" className="ml-2">{items.filter(item => item.available).length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="unavailable">
                Unavailable
                <Badge variant="secondary" className="ml-2">{items.filter(item => !item.available).length}</Badge>
              </TabsTrigger>
            </TabsList>
            
            <Button variant="outline" size="sm" className="mb-6">
              <Filter className="h-4 w-4 mr-2" />
              Sort By
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading your items...</p>
              </div>
            </div>
          ) : (
            <>
              <TabsContent value="all">
                {filterByTab("all").length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filterByTab("all").map(item => (
                      <ItemCard key={item.id} item={item} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="bg-accent/50 p-6 rounded-full mb-4">
                      <Filter className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">No items found</h3>
                    <p className="text-muted-foreground mb-6 max-w-md">
                      {searchTerm 
                        ? "No items match your search. Try different keywords or clear your search."
                        : "You haven't added any items to share yet. Start sharing with your community!"
                      }
                    </p>
                    {searchTerm ? (
                      <Button onClick={() => setSearchTerm("")}>
                        Clear Search
                      </Button>
                    ) : (
                      <Button asChild>
                        <Link to="/add">Add Your First Item</Link>
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="available">
                {filterByTab("available").length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filterByTab("available").map(item => (
                      <ItemCard key={item.id} item={item} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="bg-accent/50 p-6 rounded-full mb-4">
                      <Filter className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">No available items</h3>
                    <p className="text-muted-foreground mb-6 max-w-md">
                      {searchTerm 
                        ? "No available items match your search criteria."
                        : "You don't have any items marked as available. Add new items or update existing ones."
                      }
                    </p>
                    {searchTerm ? (
                      <Button onClick={() => setSearchTerm("")}>
                        Clear Search
                      </Button>
                    ) : (
                      <Button asChild>
                        <Link to="/add">Add New Item</Link>
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="unavailable">
                {filterByTab("unavailable").length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filterByTab("unavailable").map(item => (
                      <ItemCard key={item.id} item={item} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="bg-accent/50 p-6 rounded-full mb-4">
                      <Filter className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">No unavailable items</h3>
                    <p className="text-muted-foreground mb-6 max-w-md">
                      {searchTerm 
                        ? "No unavailable items match your search criteria."
                        : "You don't have any items marked as unavailable."
                      }
                    </p>
                    <Button onClick={() => setSearchTerm("")}>
                      Clear Search
                    </Button>
                  </div>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default MyItems;
