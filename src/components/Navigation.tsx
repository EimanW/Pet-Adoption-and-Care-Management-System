import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Home, ShoppingBag, BookOpen, Calendar, User, LogIn, PawPrint, LogOut } from "lucide-react";
import petIcon from "@/assets/pet-icon.png";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const location = useLocation();
  const { user, userRole, signOut } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src={petIcon} alt="PawHaven" className="h-10 w-10" />
          <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            PawHaven
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-1">
          <Button
            variant={isActive("/") ? "default" : "ghost"}
            size="sm"
            asChild
          >
            <Link to="/" className="gap-2">
              <Home className="h-4 w-4" />
              Home
            </Link>
          </Button>
          
          <Button
            variant={isActive("/pets") ? "default" : "ghost"}
            size="sm"
            asChild
          >
            <Link to="/pets" className="gap-2">
              <PawPrint className="h-4 w-4" />
              Find Pets
            </Link>
          </Button>
          
          <Button
            variant={isActive("/resources") ? "default" : "ghost"}
            size="sm"
            asChild
          >
            <Link to="/resources" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Resources
            </Link>
          </Button>
          
          <Button
            variant={isActive("/store") ? "default" : "ghost"}
            size="sm"
            asChild
          >
            <Link to="/store" className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              Store
            </Link>
          </Button>
          
          <Button
            variant={isActive("/donate") ? "default" : "ghost"}
            size="sm"
            asChild
          >
            <Link to="/donate" className="gap-2">
              <Heart className="h-4 w-4" />
              Donate
            </Link>
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button
                variant={isActive("/dashboard") ? "default" : "outline"}
                size="sm"
                asChild
              >
                <Link to="/dashboard" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              </Button>
              
              {userRole === 'admin' && (
                <Button
                  variant={isActive("/admin") ? "default" : "outline"}
                  size="sm"
                  asChild
                >
                  <Link to="/admin" className="gap-2">
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                </Button>
              )}
              
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </>
          ) : (
            <Button variant="default" size="sm" asChild>
              <Link to="/login" className="gap-2">
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
