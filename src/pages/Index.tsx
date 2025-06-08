
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to Landing page (root path)
    navigate("/");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin-slow h-12 w-12 rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold mb-2">Redirecting to Home Page</h1>
        <p className="text-muted-foreground">Please wait...</p>
      </div>
    </div>
  );
};

export default Index;
