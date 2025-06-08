
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Item } from "@/types";

type SearchSuggestionsProps = {
  query: string;
  isVisible: boolean;
  onSelectItem: () => void;
};

type SearchResult = {
  id: string;
  name: string;
  category: string;
};

// Get search results from localStorage items
const getSearchResults = (query: string): SearchResult[] => {
  if (!query.trim()) return [];
  
  const queryLower = query.toLowerCase();
  
  // Try to get items from localStorage
  const storedItems = localStorage.getItem('items');
  let results: SearchResult[] = [];
  
  if (storedItems) {
    try {
      const items: Item[] = JSON.parse(storedItems);
      
      // Filter and map items to search results format
      results = items
        .filter(item => 
          item.title.toLowerCase().includes(queryLower) || 
          item.description.toLowerCase().includes(queryLower) ||
          (item.category && item.category.toLowerCase().includes(queryLower))
        )
        .map(item => ({
          id: item.id,
          name: item.title,
          category: item.category
        }));
    } catch (e) {
      console.error("Failed to parse stored items:", e);
      // Fallback to mock items
      results = getMockResults(query);
    }
  } else {
    // Fallback to mock items if nothing in localStorage
    results = getMockResults(query);
  }
  
  return results.slice(0, 5); // Limit to 5 results
};

// Fallback mock results
const getMockResults = (query: string): SearchResult[] => {
  const queryLower = query.toLowerCase();
  
  const mockItems = [
    { id: "1", name: "Power Drill", category: "Tools" },
    { id: "2", name: "Mountain Bike", category: "Bikes" },
    { id: "3", name: "Party Tent", category: "Party" },
    { id: "4", name: "Lawn Mower", category: "Garden" },
    { id: "5", name: "Projector", category: "Electronics" },
    { id: "6", name: "Barbecue Grill", category: "Kitchen" },
    { id: "7", name: "Toolbox", category: "Tools" },
    { id: "8", name: "Camping Tent", category: "Outdoor" },
  ];
  
  // Filter items based on query
  return mockItems.filter(item => 
    item.name.toLowerCase().includes(queryLower) || 
    item.category.toLowerCase().includes(queryLower)
  ).slice(0, 5); // Limit to 5 results
};

const SearchSuggestions = ({ query, isVisible, onSelectItem }: SearchSuggestionsProps) => {
  const [results, setResults] = useState<SearchResult[]>([]);
  
  useEffect(() => {
    if (query && isVisible) {
      setResults(getSearchResults(query));
    } else {
      setResults([]);
    }
  }, [query, isVisible]);
  
  if (!isVisible || results.length === 0) return null;
  
  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-background rounded-lg border shadow-lg z-50 overflow-hidden">
      <div className="p-2">
        <p className="text-xs font-medium text-muted-foreground px-3 mb-1">Suggestions</p>
        <ul>
          {results.map(item => (
            <li key={item.id}>
              <Link 
                to={`/items/${item.id}`}
                className="flex items-center gap-3 p-2 hover:bg-accent rounded-md transition-colors"
                onClick={onSelectItem}
              >
                <Search className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.category}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-muted/50 p-2 border-t">
        <Link 
          to={`/browse?q=${encodeURIComponent(query)}`}
          className="block w-full text-center text-sm text-primary font-medium p-1 hover:underline"
          onClick={onSelectItem}
        >
          See all results for "{query}"
        </Link>
      </div>
    </div>
  );
};

export default SearchSuggestions;
