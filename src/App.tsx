import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense, useState, useEffect, createContext, useContext } from "react";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Layout
import AppLayout from "./layouts/AppLayout";

// Pages
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Auth context
export const AuthContext = createContext<{
  isAuthenticated: boolean;
  user: { id: string; name: string; username: string; avatar?: string; email?: string; } | null;
  login: (userData?: { id: string; name: string; username: string; avatar?: string; email?: string; }) => void;
  logout: () => void;
  getRegisteredUsers: () => any[];
}>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
  getRegisteredUsers: () => []
});

// Lazy loaded pages for better performance
const Landing = lazy(() => import("./pages/Landing"));
const Browse = lazy(() => import("./pages/Browse"));
const ItemDetails = lazy(() => import("./pages/ItemDetails"));
const AddItem = lazy(() => import("./pages/AddItem"));
const Profile = lazy(() => import("./pages/Profile"));
const MyItems = lazy(() => import("./pages/MyItems"));
const Messages = lazy(() => import("./pages/Messages"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (renamed from cacheTime)
    },
  },
});

// Loading spinner component for lazy-loaded routes
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin-slow h-12 w-12 rounded-full border-4 border-primary border-t-transparent"></div>
  </div>
);

// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useContext(AuthContext);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<{ id: string; name: string; username: string; avatar?: string; email?: string; } | null>(null);
  
  useEffect(() => {
    const checkAuth = () => {
      const hasToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');
      
      if (hasToken && storedUser) {
        setIsAuthenticated(true);
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          setUser({ id: 'user1', name: 'John Doe', username: 'johndoe', avatar: '/lovable-uploads/2f608b3f-7445-4488-99c2-d8dbafd1263b.png' });
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    };
    
    checkAuth();
    
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);
  
  const getRegisteredUsers = () => {
    const registeredUsers = localStorage.getItem('registeredUsers');
    return registeredUsers ? JSON.parse(registeredUsers) : [];
  };
  
  const login = (userData?: { id: string; name: string; username: string; avatar?: string; email?: string; }) => {
    localStorage.setItem('authToken', 'dummy-token');
    
    const userToStore = userData || { id: 'user1', name: 'John Doe', username: 'johndoe', avatar: '/lovable-uploads/2f608b3f-7445-4488-99c2-d8dbafd1263b.png' };
    localStorage.setItem('user', JSON.stringify(userToStore));
    
    setIsAuthenticated(true);
    setUser(userToStore);
  };
  
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    
    const itemsToKeep = JSON.parse(localStorage.getItem('items') || '[]').filter(
      (item: any) => !item.isUserAdded
    );
    localStorage.setItem('items', JSON.stringify(itemsToKeep));
  };
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ isAuthenticated, user, login, logout, getRegisteredUsers }}>
        <ThemeProvider>
          <NotificationProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/index" element={<Index />} />
                  <Route path="/login" element={
                    isAuthenticated ? <Navigate to="/profile" replace /> : <Login />
                  } />
                  <Route path="/register" element={
                    isAuthenticated ? <Navigate to="/profile" replace /> : <Register />
                  } />
                  
                  <Route path="/" element={<AppLayout />}>
                    <Route index element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <Landing />
                      </Suspense>
                    } />
                    <Route path="browse" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <Browse />
                      </Suspense>
                    } />
                    <Route path="items/:id" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <ItemDetails />
                      </Suspense>
                    } />
                    <Route path="add" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <ProtectedRoute>
                          <AddItem />
                        </ProtectedRoute>
                      </Suspense>
                    } />
                    <Route path="profile" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      </Suspense>
                    } />
                    <Route path="my-items" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <ProtectedRoute>
                          <MyItems />
                        </ProtectedRoute>
                      </Suspense>
                    } />
                    <Route path="messages" element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <ProtectedRoute>
                          <Messages />
                        </ProtectedRoute>
                      </Suspense>
                    } />
                  </Route>
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </NotificationProvider>
        </ThemeProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
