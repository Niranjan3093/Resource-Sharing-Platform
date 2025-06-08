import { User, Item, Category } from "@/types";

// Mock user data
export const users: User[] = [
  {
    id: "user1",
    name: "John Doe",
    username: "johndoe",
    email: "john.doe@example.com",
    avatar: "https://i.pravatar.cc/150?u=user1",
    location: "New York, USA",
    bio: "Passionate about sharing and caring for the environment.",
    rating: 4.8,
    joinedDate: "2022-01-15",
  },
  {
    id: "user2",
    name: "Jane Smith",
    username: "janesmith",
    email: "jane.smith@example.com",
    avatar: "https://i.pravatar.cc/150?u=user2",
    location: "San Francisco, USA",
    bio: "Love gardening and sharing my tools with neighbors.",
    rating: 4.5,
    joinedDate: "2022-02-20",
  },
  {
    id: "user3",
    name: "Mike Johnson",
    username: "mikejohnson",
    email: "mike.johnson@example.com",
    avatar: "https://i.pravatar.cc/150?u=user3",
    location: "Chicago, USA",
    bio: "Handyman and DIY enthusiast. Happy to share my tools!",
    rating: 4.9,
    joinedDate: "2022-03-10",
  },
  {
    id: "user4",
    name: "Sarah Williams",
    username: "sarahwilliams",
    email: "sarah.williams@example.com",
    avatar: "https://i.pravatar.cc/150?u=user4",
    location: "Boston, USA",
    bio: "I believe in sustainable living and community sharing.",
    rating: 4.7,
    joinedDate: "2022-04-05",
  },
];

// Mock category data
export const categories: Category[] = [
  { id: "cat1", name: "Electronics", icon: "⚡️" },
  { id: "cat2", name: "Home & Garden", icon: "🏡" },
  { id: "cat3", name: "Sports", icon: "⚽" },
  { id: "cat4", name: "Books", icon: "📚" },
  { id: "cat5", name: "Tools", icon: "🛠️" },
  { id: "cat6", name: "Clothing", icon: "👕" },
  { id: "cat7", name: "Games", icon: "🎮" },
  { id: "cat8", name: "Outdoors", icon: "🏕️" },
];

// Mock popular items for the landing page
export const mockPopularItems = [
  {
    id: "item1",
    title: "Mountain Bike",
    description: "High-quality mountain bike for trails and city. Well maintained with new tires.",
    category: "Sports",
    imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=2070&auto=format&fit=crop",
    available: true,
    location: "Thamel, Kathmandu",
    coordinates: [85.3118, 27.7172] as [number, number],
    timeAgo: "3 days ago",
    createdAt: "2023-10-15T10:30:00Z",
    owner: users[0],
    likesCount: 12
  },
  {
    id: "item2",
    title: "DSLR Camera",
    description: "Professional camera with two lenses and a tripod. Perfect for photography enthusiasts.",
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=2070&auto=format&fit=crop",
    available: true,
    location: "Patan, Lalitpur",
    coordinates: [85.3240, 27.6588] as [number, number],
    timeAgo: "1 week ago",
    createdAt: "2023-10-10T08:15:00Z",
    owner: users[1],
    likesCount: 8
  },
  {
    id: "item3",
    title: "Gardening Tools Set",
    description: "Complete set of gardening tools including shovel, rake, pruners, and gloves.",
    category: "Home & Garden",
    imageUrl: "https://images.unsplash.com/photo-1620149955595-e065f432a90d?q=80&w=2071&auto=format&fit=crop",
    available: false,
    location: "Bhaktapur",
    coordinates: [85.4271, 27.6711] as [number, number],
    timeAgo: "2 weeks ago",
    createdAt: "2023-10-03T14:45:00Z",
    owner: users[2],
    likesCount: 5
  },
  {
    id: "item4",
    title: "Camping Tent (4-Person)",
    description: "Waterproof camping tent that fits 4 people comfortably. Includes rainfly and stakes.",
    category: "Outdoors",
    imageUrl: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=2070&auto=format&fit=crop",
    available: true,
    location: "Budhanilkantha, Kathmandu",
    coordinates: [85.3729, 27.7769] as [number, number],
    timeAgo: "5 days ago",
    createdAt: "2023-10-12T11:20:00Z",
    owner: users[0],
    likesCount: 10
  },
];

// Mock category items with counts for the landing page
export const mockCategoryItems = [
  { id: "cat1", name: "Electronics", icon: "⚡️", count: 42 },
  { id: "cat2", name: "Home & Garden", icon: "🏡", count: 35 },
  { id: "cat3", name: "Sports", icon: "⚽", count: 28 },
  { id: "cat4", name: "Books", icon: "📚", count: 52 },
  { id: "cat5", name: "Tools", icon: "🛠️", count: 31 },
  { id: "cat6", name: "Clothing", icon: "👕", count: 19 },
  { id: "cat7", name: "Games", icon: "🎮", count: 24 },
  { id: "cat8", name: "Outdoors", icon: "🏕️", count: 17 },
];

// Function to initialize localStorage with default items if it doesn't exist
const initializeItems = () => {
  if (!localStorage.getItem('items')) {
    const defaultItems = [
      {
        id: "item1",
        title: "Mountain Bike",
        description: "High-quality mountain bike for trails and city. Well maintained with new tires.",
        category: "Sports",
        imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=2070&auto=format&fit=crop",
        available: true,
        location: "Thamel, Kathmandu",
        coordinates: [85.3118, 27.7172] as [number, number],
        timeAgo: "3 days ago",
        createdAt: "2023-10-15T10:30:00Z",
        owner: users[0],
        likesCount: 12
      },
      {
        id: "item2",
        title: "DSLR Camera",
        description: "Professional camera with two lenses and a tripod. Perfect for photography enthusiasts.",
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=2070&auto=format&fit=crop",
        available: true,
        location: "Patan, Lalitpur",
        coordinates: [85.3240, 27.6588] as [number, number],
        timeAgo: "1 week ago",
        createdAt: "2023-10-10T08:15:00Z",
        owner: users[1],
        likesCount: 8
      },
      {
        id: "item3",
        title: "Gardening Tools Set",
        description: "Complete set of gardening tools including shovel, rake, pruners, and gloves.",
        category: "Home & Garden",
        imageUrl: "https://images.unsplash.com/photo-1620149955595-e065f432a90d?q=80&w=2071&auto=format&fit=crop",
        available: false,
        location: "Bhaktapur",
        coordinates: [85.4271, 27.6711] as [number, number],
        timeAgo: "2 weeks ago",
        createdAt: "2023-10-03T14:45:00Z",
        owner: users[2],
        likesCount: 5
      },
      {
        id: "item4",
        title: "Camping Tent (4-Person)",
        description: "Waterproof camping tent that fits 4 people comfortably. Includes rainfly and stakes.",
        category: "Outdoors",
        imageUrl: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=2070&auto=format&fit=crop",
        available: true,
        location: "Budhanilkantha, Kathmandu",
        coordinates: [85.3729, 27.7769] as [number, number],
        timeAgo: "5 days ago",
        createdAt: "2023-10-12T11:20:00Z",
        owner: users[0],
        likesCount: 10
      },
      {
        id: "item5",
        title: "Power Tools Kit",
        description: "Set of power tools including drill, circular saw, and sander. All in working condition.",
        category: "Tools",
        imageUrl: "https://images.unsplash.com/photo-1426927308491-6380b6a9936f?q=80&w=2071&auto=format&fit=crop",
        available: true,
        location: "Balaju, Kathmandu",
        coordinates: [85.2961, 27.7385] as [number, number],
        timeAgo: "2 days ago",
        createdAt: "2023-10-16T09:00:00Z",
        owner: users[3],
        likesCount: 7
      },
      {
        id: "item6",
        title: "Board Games Collection",
        description: "Collection of popular board games including Catan, Ticket to Ride, and Pandemic.",
        category: "Games",
        imageUrl: "https://images.unsplash.com/photo-1632501641765-e568d28b0015?q=80&w=1974&auto=format&fit=crop",
        available: true,
        location: "Kirtipur, Kathmandu",
        coordinates: [85.2795, 27.6773] as [number, number],
        timeAgo: "1 day ago",
        createdAt: "2023-10-17T15:30:00Z",
        owner: users[1],
        likesCount: 15
      },
      {
        id: "item7",
        title: "Laptop (MacBook Pro)",
        description: "2022 MacBook Pro with M1 chip, 16GB RAM, and 512GB storage. Perfect for professionals.",
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=2026&auto=format&fit=crop",
        available: true,
        location: "Boudha, Kathmandu",
        coordinates: [85.3618, 27.7215] as [number, number],
        timeAgo: "4 days ago",
        createdAt: "2023-10-14T16:45:00Z",
        owner: users[2],
        likesCount: 14
      },
      {
        id: "item8",
        title: "Classic Literature Collection",
        description: "Collection of classic novels including works by Austen, Dickens, and Tolstoy. Well-preserved hardcover editions.",
        category: "Books",
        imageUrl: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=2070&auto=format&fit=crop",
        available: true,
        location: "Jawalakhel, Lalitpur",
        coordinates: [85.3140, 27.6673] as [number, number],
        timeAgo: "1 week ago",
        createdAt: "2023-10-11T10:20:00Z",
        owner: users[3],
        likesCount: 9
      },
      {
        id: "item9",
        title: "Vintage Record Player",
        description: "Fully functional vintage record player with built-in speakers. Comes with a small collection of classic vinyl records.",
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1593078166039-c1b1d98c465b?q=80&w=2070&auto=format&fit=crop",
        available: true,
        location: "Maharajgunj, Kathmandu",
        coordinates: [85.3376, 27.7361] as [number, number],
        timeAgo: "3 days ago",
        createdAt: "2023-10-15T13:10:00Z",
        owner: users[0],
        likesCount: 11
      },
      {
        id: "item10",
        title: "Designer Dress (Size M)",
        description: "Elegant designer dress perfect for formal occasions. Only worn once, in excellent condition.",
        category: "Clothing",
        imageUrl: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1974&auto=format&fit=crop",
        available: true,
        location: "Lazimpat, Kathmandu",
        coordinates: [85.3200, 27.7200] as [number, number],
        timeAgo: "5 days ago",
        createdAt: "2023-10-13T14:00:00Z",
        owner: users[1],
        likesCount: 18
      },
      {
        id: "item11",
        title: "Sony PlayStation 5",
        description: "Latest PS5 console with two controllers and 5 popular games. Available for short-term rental.",
        category: "Games",
        imageUrl: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?q=80&w=2127&auto=format&fit=crop",
        available: true,
        location: "Golfutar, Kathmandu",
        coordinates: [85.3412, 27.7464] as [number, number],
        timeAgo: "2 days ago",
        createdAt: "2023-10-16T18:30:00Z",
        owner: users[2],
        likesCount: 24
      },
      {
        id: "item12",
        title: "Professional Lawn Mower",
        description: "Powerful gas-powered lawn mower in excellent condition. Perfect for large lawns and gardens.",
        category: "Home & Garden",
        imageUrl: "https://images.unsplash.com/photo-1590212222334-ded9e9070953?q=80&w=2128&auto=format&fit=crop",
        available: true,
        location: "Satdobato, Lalitpur",
        coordinates: [85.3307, 27.6581] as [number, number],
        timeAgo: "6 days ago",
        createdAt: "2023-10-12T09:15:00Z",
        owner: users[3],
        likesCount: 6
      },
      {
        id: "item13",
        title: "Carpentry Toolkit",
        description: "Complete set of professional carpentry tools including chisels, planes, and precision measuring tools.",
        category: "Tools",
        imageUrl: "https://images.unsplash.com/photo-1572981779307-38b8cced0a57?q=80&w=1925&auto=format&fit=crop",
        available: true,
        location: "Chabahil, Kathmandu",
        coordinates: [85.3450, 27.7173] as [number, number],
        timeAgo: "4 days ago",
        createdAt: "2023-10-14T11:45:00Z",
        owner: users[0],
        likesCount: 13
      },
      {
        id: "item14",
        title: "Acoustic Guitar",
        description: "Beautiful acoustic guitar with soft case. Excellent sound quality, perfect for beginners and intermediate players.",
        category: "Sports",
        imageUrl: "https://images.unsplash.com/photo-1525201548942-d8732f6617f0?q=80&w=2070&auto=format&fit=crop",
        available: true,
        location: "Kupondole, Lalitpur",
        coordinates: [85.3143, 27.6825] as [number, number],
        timeAgo: "1 week ago",
        createdAt: "2023-10-11T14:20:00Z",
        owner: users[1],
        likesCount: 19
      },
      {
        id: "item15",
        title: "Hiking Backpack",
        description: "65L hiking backpack with rain cover. Perfect for multi-day trekking trips in the Himalayas.",
        category: "Outdoors",
        imageUrl: "https://images.unsplash.com/photo-1501554728187-ce583db33af7?q=80&w=1908&auto=format&fit=crop",
        available: false,
        location: "Kalanki, Kathmandu",
        coordinates: [85.2792, 27.6942] as [number, number],
        timeAgo: "2 weeks ago",
        createdAt: "2023-10-04T16:30:00Z",
        owner: users[2],
        likesCount: 15
      },
      {
        id: "item16",
        title: "Science Fiction Book Collection",
        description: "Collection of modern sci-fi classics including works by Liu Cixin, Ted Chiang, and N.K. Jemisin.",
        category: "Books",
        imageUrl: "https://images.unsplash.com/photo-1513001900722-370f803f498d?q=80&w=1974&auto=format&fit=crop",
        available: true,
        location: "Pulchowk, Lalitpur",
        coordinates: [85.3177, 27.6788] as [number, number],
        timeAgo: "3 days ago",
        createdAt: "2023-10-15T09:40:00Z",
        owner: users[3],
        likesCount: 7
      }
    ];
    
    localStorage.setItem('items', JSON.stringify(defaultItems));
  }
};

// Initialize items on import
initializeItems();

// Function to simulate fetching items from localStorage or fallback to mock data
export const fetchItems = async (): Promise<Item[]> => {
  // Simulate API request delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // Try to get items from localStorage first
  const storedItems = localStorage.getItem('items');
  if (storedItems) {
    try {
      return JSON.parse(storedItems);
    } catch (e) {
      console.error("Failed to parse stored items:", e);
    }
  }
  
  // Fallback to default items (should not happen after initialization)
  const items = [
    {
      id: "item1",
      title: "Mountain Bike",
      description: "High-quality mountain bike for trails and city. Well maintained with new tires.",
      category: "Sports",
      imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=2070&auto=format&fit=crop",
      available: true,
      location: "Thamel, Kathmandu",
      coordinates: [85.3118, 27.7172] as [number, number],
      timeAgo: "3 days ago",
      createdAt: "2023-10-15T10:30:00Z",
      owner: users[0],
      likesCount: 12
    },
    {
      id: "item2",
      title: "DSLR Camera",
      description: "Professional camera with two lenses and a tripod. Perfect for photography enthusiasts.",
      category: "Electronics",
      imageUrl: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=2070&auto=format&fit=crop",
      available: true,
      location: "Patan, Lalitpur",
      coordinates: [85.3240, 27.6588] as [number, number],
      timeAgo: "1 week ago",
      createdAt: "2023-10-10T08:15:00Z",
      owner: users[1],
      likesCount: 8
    },
    {
      id: "item3",
      title: "Gardening Tools Set",
      description: "Complete set of gardening tools including shovel, rake, pruners, and gloves.",
      category: "Home & Garden",
      imageUrl: "https://images.unsplash.com/photo-1620149955595-e065f432a90d?q=80&w=2071&auto=format&fit=crop",
      available: false,
      location: "Bhaktapur",
      coordinates: [85.4271, 27.6711] as [number, number],
      timeAgo: "2 weeks ago",
      createdAt: "2023-10-03T14:45:00Z",
      owner: users[2],
      likesCount: 5
    },
    {
      id: "item4",
      title: "Camping Tent (4-Person)",
      description: "Waterproof camping tent that fits 4 people comfortably. Includes rainfly and stakes.",
      category: "Outdoors",
      imageUrl: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=2070&auto=format&fit=crop",
      available: true,
      location: "Budhanilkantha, Kathmandu",
      coordinates: [85.3729, 27.7769] as [number, number],
      timeAgo: "5 days ago",
      createdAt: "2023-10-12T11:20:00Z",
      owner: users[0],
      likesCount: 10
    },
    {
      id: "item5",
      title: "Power Tools Kit",
      description: "Set of power tools including drill, circular saw, and sander. All in working condition.",
      category: "Tools",
      imageUrl: "https://images.unsplash.com/photo-1426927308491-6380b6a9936f?q=80&w=2071&auto=format&fit=crop",
      available: true,
      location: "Balaju, Kathmandu",
      coordinates: [85.2961, 27.7385] as [number, number],
      timeAgo: "2 days ago",
      createdAt: "2023-10-16T09:00:00Z",
      owner: users[3],
      likesCount: 7
    },
    {
      id: "item6",
      title: "Board Games Collection",
      description: "Collection of popular board games including Catan, Ticket to Ride, and Pandemic.",
      category: "Games",
      imageUrl: "https://images.unsplash.com/photo-1632501641765-e568d28b0015?q=80&w=1974&auto=format&fit=crop",
      available: true,
      location: "Kirtipur, Kathmandu",
      coordinates: [85.2795, 27.6773] as [number, number],
      timeAgo: "1 day ago",
      createdAt: "2023-10-17T15:30:00Z",
      owner: users[1],
      likesCount: 15
    },
    {
      id: "item7",
      title: "Laptop (MacBook Pro)",
      description: "2022 MacBook Pro with M1 chip, 16GB RAM, and 512GB storage. Perfect for professionals.",
      category: "Electronics",
      imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=2026&auto=format&fit=crop",
      available: true,
      location: "Boudha, Kathmandu",
      coordinates: [85.3618, 27.7215] as [number, number],
      timeAgo: "4 days ago",
      createdAt: "2023-10-14T16:45:00Z",
      owner: users[2],
      likesCount: 14
    },
    {
      id: "item8",
      title: "Classic Literature Collection",
      description: "Collection of classic novels including works by Austen, Dickens, and Tolstoy. Well-preserved hardcover editions.",
      category: "Books",
      imageUrl: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=2070&auto=format&fit=crop",
      available: true,
      location: "Jawalakhel, Lalitpur",
      coordinates: [85.3140, 27.6673] as [number, number],
      timeAgo: "1 week ago",
      createdAt: "2023-10-11T10:20:00Z",
      owner: users[3],
      likesCount: 9
    },
    {
      id: "item9",
      title: "Vintage Record Player",
      description: "Fully functional vintage record player with built-in speakers. Comes with a small collection of classic vinyl records.",
      category: "Electronics",
      imageUrl: "https://images.unsplash.com/photo-1593078166039-c1b1d98c465b?q=80&w=2070&auto=format&fit=crop",
      available: true,
      location: "Maharajgunj, Kathmandu",
      coordinates: [85.3376, 27.7361] as [number, number],
      timeAgo: "3 days ago",
      createdAt: "2023-10-15T13:10:00Z",
      owner: users[0],
      likesCount: 11
    },
    {
      id: "item10",
      title: "Designer Dress (Size M)",
      description: "Elegant designer dress perfect for formal occasions. Only worn once, in excellent condition.",
      category: "Clothing",
      imageUrl: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1974&auto=format&fit=crop",
      available: true,
      location: "Lazimpat, Kathmandu",
      coordinates: [85.3200, 27.7200] as [number, number],
      timeAgo: "5 days ago",
      createdAt: "2023-10-13T14:00:00Z",
      owner: users[1],
      likesCount: 18
    },
    {
      id: "item11",
      title: "Sony PlayStation 5",
      description: "Latest PS5 console with two controllers and 5 popular games. Available for short-term rental.",
      category: "Games",
      imageUrl: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?q=80&w=2127&auto=format&fit=crop",
      available: true,
      location: "Golfutar, Kathmandu",
      coordinates: [85.3412, 27.7464] as [number, number],
      timeAgo: "2 days ago",
      createdAt: "2023-10-16T18:30:00Z",
      owner: users[2],
      likesCount: 24
    },
    {
      id: "item12",
      title: "Professional Lawn Mower",
      description: "Powerful gas-powered lawn mower in excellent condition. Perfect for large lawns and gardens.",
      category: "Home & Garden",
      imageUrl: "https://images.unsplash.com/photo-1590212222334-ded9e9070953?q=80&w=2128&auto=format&fit=crop",
      available: true,
      location: "Satdobato, Lalitpur",
      coordinates: [85.3307, 27.6581] as [number, number],
      timeAgo: "6 days ago",
      createdAt: "2023-10-12T09:15:00Z",
      owner: users[3],
      likesCount: 6
    },
    {
      id: "item13",
      title: "Carpentry Toolkit",
      description: "Complete set of professional carpentry tools including chisels, planes, and precision measuring tools.",
      category: "Tools",
      imageUrl: "https://images.unsplash.com/photo-1572981779307-38b8cced0a57?q=80&w=1925&auto=format&fit=crop",
      available: true,
      location: "Chabahil, Kathmandu",
      coordinates: [85.3450, 27.7173] as [number, number],
      timeAgo: "4 days ago",
      createdAt: "2023-10-14T11:45:00Z",
      owner: users[0],
      likesCount: 13
    },
    {
      id: "item14",
      title: "Acoustic Guitar",
      description: "Beautiful acoustic guitar with soft case. Excellent sound quality, perfect for beginners and intermediate players.",
      category: "Sports",
      imageUrl: "https://images.unsplash.com/photo-1525201548942-d8732f6617f0?q=80&w=2070&auto=format&fit=crop",
      available: true,
      location: "Kupondole, Lalitpur",
      coordinates: [85.3143, 27.6825] as [number, number],
      timeAgo: "1 week ago",
      createdAt: "2023-10-11T14:20:00Z",
      owner: users[1],
      likesCount: 19
    },
    {
      id: "item15",
      title: "Hiking Backpack",
      description: "65L hiking backpack with rain cover. Perfect for multi-day trekking trips in the Himalayas.",
      category: "Outdoors",
      imageUrl: "https://images.unsplash.com/photo-1501554728187-ce583db33af7?q=80&w=1908&auto=format&fit=crop",
      available: false,
      location: "Kalanki, Kathmandu",
      coordinates: [85.2792, 27.6942] as [number, number],
      timeAgo: "2 weeks ago",
      createdAt: "2023-10-04T16:30:00Z",
      owner: users[2],
      likesCount: 15
    },
    {
      id: "item16",
      title: "Science Fiction Book Collection",
      description: "Collection of modern sci-fi classics including works by Liu Cixin, Ted Chiang, and N.K. Jemisin.",
      category: "Books",
      imageUrl: "https://images.unsplash.com/photo-1513001900722-370f803f498d?q=80&w=1974&auto=format&fit=crop",
      available: true,
      location: "Pulchowk, Lalitpur",
      coordinates: [85.3177, 27.6788] as [number, number],
      timeAgo: "3 days ago",
      createdAt: "2023-10-15T09:40:00Z",
      owner: users[3],
      likesCount: 7
    }
  ];
  
  return items;
};

// Function to simulate fetching items by user ID
export const fetchUserItems = async (userId: string): Promise<Item[]> => {
  // Simulate API request delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // Get all items and filter by owner ID
  const allItems = await fetchItems();
  return allItems.filter(item => item.owner?.id === userId);
};

// Function to simulate fetching a single item by ID
export const fetchItemById = async (id: string): Promise<Item | null> => {
  // Simulate API request delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const items = await fetchItems();
  const item = items.find((item) => item.id === id);
  return item || null;
};

// Function to simulate adding a new item
export const addItem = async (itemData: Partial<Item>): Promise<Item> => {
  // Simulate API request delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  // Create a new item with the provided data and some default values
  const newItem: Item = {
    id: `item${Math.floor(Math.random() * 10000)}`,
    title: itemData.title || "Untitled Item",
    description: itemData.description || "No description provided",
    category: itemData.category || "Other",
    imageUrl: itemData.imageUrl || "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=2070&auto=format&fit=crop",
    available: itemData.available !== undefined ? itemData.available : true,
    location: itemData.location || "Kathmandu",
    coordinates: itemData.coordinates || [85.3240, 27.7172] as [number, number],
    timeAgo: "Just now",
    createdAt: new Date().toISOString(),
    owner: itemData.owner || users[0],
    likesCount: 0,
    isUserAdded: itemData.isUserAdded || false
  };
  
  return newItem;
};

// Function to simulate deleting an item
export const deleteItem = async (id: string): Promise<void> => {
  // Simulate API request delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  // Remove from localStorage if it exists
  const storedItems = localStorage.getItem('items');
  if (storedItems) {
    try {
      const items = JSON.parse(storedItems);
      const updatedItems = items.filter((item: Item) => item.id !== id);
      localStorage.setItem('items', JSON.stringify(updatedItems));
    } catch (e) {
      console.error("Failed to delete item from storage:", e);
    }
  }
  
  console.log(`Item with id ${id} deleted`);
};
