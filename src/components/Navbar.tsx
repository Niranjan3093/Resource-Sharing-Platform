
import { useState, useEffect, useRef, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, User, Settings, LogOut, MessageSquare, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import SearchSuggestions from "./SearchSuggestions";
import SettingsDialog from "./SettingsDialog";
import NotificationMenu from "./NotificationMenu";
import { AuthContext } from "@/App";
import NavbarButtons from "./NavbarButtons";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSearchSuggestions(e.target.value.trim() !== "");
  };

  const handleSearchFocus = () => {
    if (searchQuery.trim() !== "") {
      setShowSearchSuggestions(true);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      navigate(`/browse?q=${encodeURIComponent(searchQuery)}`);
      setShowSearchSuggestions(false);
    }
  };

  const handleSelectSearchItem = () => {
    setShowSearchSuggestions(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full",
          isScrolled 
            ? "bg-background/80 backdrop-blur-md border-b shadow-sm" 
            : "bg-primary text-primary-foreground"
        )}
      >
        <div className="container px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
              <span className="text-primary font-semibold">SH</span>
            </span>
            <span className={cn(
              "font-bold text-xl tracking-tight",
              isScrolled ? "text-foreground" : "text-white"
            )}>ShareHaven</span>
          </Link>

          <div className="hidden md:block flex-1 max-w-md mx-auto" ref={searchRef}>
            <div className="relative w-full">
              <Search className={cn(
                "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4",
                isScrolled ? "text-muted-foreground" : "text-primary"
              )} />
              <Input
                type="search"
                placeholder="Tools, bikes, party gear..."
                className={cn(
                  "pl-10 pr-4 py-2 w-full rounded-full border-primary",
                  isScrolled 
                    ? "bg-background border-primary/20" 
                    : "bg-white border-transparent text-foreground"
                )}
                value={searchQuery}
                onChange={handleSearchInputChange}
                onFocus={handleSearchFocus}
                onKeyDown={handleSearchKeyDown}
              />
              <SearchSuggestions 
                query={searchQuery} 
                isVisible={showSearchSuggestions}
                onSelectItem={handleSelectSearchItem}
              />
            </div>
          </div>

          <NavbarButtons isScrolled={isScrolled} isAuthenticated={isAuthenticated} />

          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated && (
              <NotificationMenu />
            )}
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn(
                      "rounded-full text-lg",
                      isScrolled ? "text-foreground hover:bg-accent" : "text-white hover:bg-primary-foreground/20"
                    )}
                    onClick={() => setSettingsOpen(true)}
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9 border-2 border-white">
                      <AvatarImage src={user?.avatar || ""} alt={user?.name || ""} />
                      <AvatarFallback className="bg-white text-primary">
                        {user?.name?.charAt(0) || ""}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium">{user?.name || ""}</p>
                    <p className="text-xs text-muted-foreground">@{user?.username || ""}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer flex w-full">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-items" className="cursor-pointer flex w-full">
                      My Items
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                    <div className="flex items-center w-full">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link to="/login">Log in</Link>
              </Button>
            )}
          </div>

          <div className="flex md:hidden items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "rounded-full",
                isScrolled ? "text-foreground" : "text-white"
              )}
              onClick={() => {
                // Toggle mobile search
              }}
            >
              <Search className="h-5 w-5" />
            </Button>
            
            {isAuthenticated && (
              <NotificationMenu />
            )}
            
            {isAuthenticated ? (
              <Button 
                variant="ghost" 
                className="relative h-8 w-8 rounded-full"
                onClick={toggleMobileMenu}
              >
                <Avatar className="h-8 w-8 border-2 border-white">
                  <AvatarImage src={user?.avatar || ""} alt={user?.name || ""} />
                  <AvatarFallback className="bg-white text-primary">
                    {user?.name?.charAt(0) || ""}
                  </AvatarFallback>
                </Avatar>
              </Button>
            ) : (
              <Button 
                variant="ghost"
                size="sm" 
                asChild
                className={cn(
                  "rounded-full",
                  isScrolled ? "bg-primary text-white" : "bg-white text-primary"
                )}
              >
                <Link to="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>

        <div 
          className={cn(
            "md:hidden fixed inset-0 z-50 transform transition-all duration-300 ease-in-out",
            mobileMenuOpen 
              ? "translate-x-0 opacity-100" 
              : "translate-x-full opacity-0 pointer-events-none"
          )}
        >
          <div className="flex flex-col h-full bg-background p-6">
            <div className="flex items-center justify-between mb-8">
              <Link to="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
                <span className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-white font-semibold">SH</span>
                </span>
                <span className="font-bold text-xl tracking-tight">ShareHaven</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={toggleMobileMenu}
              >
                <User className="h-5 w-5" />
              </Button>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tools, bikes, party gear..."
                className="pl-9 rounded-full bg-accent"
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
            </div>

            <nav className="flex flex-col space-y-4">
              <Link 
                to="/browse" 
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Search className="h-5 w-5" />
                <span>Browse</span>
              </Link>
              {isAuthenticated && (
                <>
                  <Link 
                    to="/messages" 
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span>Messages</span>
                  </Link>
                  <Link 
                    to="/add" 
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Upload className="h-5 w-5" />
                    <span>Add Item</span>
                  </Link>
                  <Link 
                    to="/my-items" 
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span>My Items</span>
                  </Link>
                </>
              )}
              <button 
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent text-left"
                onClick={() => {
                  setSettingsOpen(true);
                  setMobileMenuOpen(false);
                }}
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </button>
            </nav>

            <div className="mt-auto pt-6 border-t">
              {isAuthenticated ? (
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10 border-2 border-primary">
                      <AvatarImage src={user?.avatar || ""} alt={user?.name || ""} />
                      <AvatarFallback className="bg-primary text-white">
                        {user?.name?.charAt(0) || ""}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user?.name || ""}</p>
                      <p className="text-xs text-muted-foreground">@{user?.username || ""}</p>
                    </div>
                  </div>
                  <Link 
                    to="/profile" 
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Profile</span>
                  </Link>
                  <button 
                    className="w-full text-left p-2 rounded-lg hover:bg-accent flex items-center"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    <span>Log out</span>
                  </button>
                </div>
              ) : (
                <Button asChild className="w-full">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Log in</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
};

export default Navbar;
