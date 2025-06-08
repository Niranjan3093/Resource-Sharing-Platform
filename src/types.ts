
// Define types for our application

export interface User {
  id: string;
  name: string;
  username: string; 
  email: string;
  avatar: string;
  location?: string;
  bio?: string;
  rating?: number;
  joinedDate?: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  available: boolean;
  location: string;
  coordinates?: [number, number]; // [longitude, latitude]
  timeAgo: string;
  createdAt: string;
  owner: User;
  likesCount: number;
  isUserAdded?: boolean; // Adding this property to fix the type error
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface FilterOptions {
  category?: string;
  availability?: boolean;
  distance?: number;
  sortBy?: 'newest' | 'oldest' | 'popular';
}

export interface Notification {
  id: string;
  type: 'new_item' | 'message' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedItemId?: string;
  fromUserId?: string;
}
