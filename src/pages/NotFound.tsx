
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { FileQuestion, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-lg px-6">
        <div className="inline-flex items-center justify-center bg-primary/10 h-20 w-20 rounded-full mb-6">
          <FileQuestion className="h-10 w-10 text-primary" />
        </div>
        
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-foreground mb-2">Page Not Found</p>
        <p className="text-muted-foreground mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/browse">
              <Search className="h-4 w-4 mr-2" />
              Browse Items
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
