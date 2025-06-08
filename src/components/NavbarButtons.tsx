
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, MessageSquare, Upload } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface NavbarButtonProps {
  isScrolled: boolean;
  isAuthenticated: boolean;
}

const NavbarButtons: React.FC<NavbarButtonProps> = ({ isScrolled, isAuthenticated }) => {
  return (
    <div className="hidden md:flex items-center space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" asChild className={cn(
              "rounded-full text-lg",
              isScrolled ? "text-foreground hover:bg-accent" : "text-white hover:bg-primary-foreground/20"
            )}>
              <Link to="/">
                <Home className="h-5 w-5" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Home</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {isAuthenticated && (
        <>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" asChild className={cn(
                  "rounded-full text-lg",
                  isScrolled ? "text-foreground hover:bg-accent" : "text-white hover:bg-primary-foreground/20"
                )}>
                  <Link to="/messages">
                    <MessageSquare className="h-5 w-5" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Messages</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" asChild className={cn(
                  "rounded-full text-lg",
                  isScrolled ? "text-foreground hover:bg-accent" : "text-white hover:bg-primary-foreground/20"
                )}>
                  <Link to="/add">
                    <Upload className="h-5 w-5" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share Items</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </>
      )}
    </div>
  );
};

export default NavbarButtons;
