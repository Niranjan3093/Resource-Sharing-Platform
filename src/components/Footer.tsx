
import { Link } from "react-router-dom";
import { Github, Twitter, Instagram, Facebook } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-accent mt-auto">
      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2">
              <span className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white font-semibold">SH</span>
              </span>
              <span className="font-bold text-xl tracking-tight">ShareHaven</span>
            </div>
            
            <p className="max-w-xs mt-4 text-sm text-muted-foreground">
              Creating communities through sharing resources. Connect with your neighbors in Kathmandu and across Nepal.
            </p>
            
            <div className="flex mt-6 space-x-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold tracking-wider">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/browse" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Browse Items
                </Link>
              </li>
              <li>
                <Link to="/add" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Add an Item
                </Link>
              </li>
              <li>
                <Link to="/my-items" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  My Items
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  My Profile
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold tracking-wider">Contact Us</h3>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-muted-foreground">
                Kathmandu, Nepal
              </li>
              <li>
                <a href="mailto:info@sharehaven.np" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  info@sharehaven.np
                </a>
              </li>
              <li>
                <a href="tel:+9771234567" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  +977 1234567
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 mt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-muted-foreground">
              &copy; {currentYear} ShareHaven Nepal. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 space-x-4">
              <Link to="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link to="/faq" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
