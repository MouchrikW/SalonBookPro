import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Menu,
  Bell,
  User as UserIcon,
  LogOut,
  Heart,
  Settings,
  Calendar,
  Store,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Header() {
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  
  // Use try-catch to handle potential auth context issues
  let user = null;
  let logoutMutation = { mutate: () => {} };
  
  try {
    const auth = useAuth();
    user = auth.user;
    logoutMutation = auth.logoutMutation;
  } catch (error) {
    console.error("Auth provider not available:", error);
  }

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Hide mobile search bar on non-home pages
  useEffect(() => {
    if (location !== "/") {
      setShowMobileSearch(false);
    }
  }, [location]);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <div className="text-primary text-2xl font-bold">SalonBook</div>
          </Link>
        </div>

        {/* Search bar - Desktop */}
        {!isMobile && (
          <div className="flex items-center justify-center flex-1 mx-6">
            <div className="relative w-full max-w-xl">
              <Input
                type="text"
                placeholder="Search salons, services, or locations..."
                className="w-full py-2 pl-10 pr-4 border border-input rounded-full"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex items-center">
          {/* User is logged out */}
          {!user && (
            <div className="flex items-center space-x-4">
              {!isMobile && (
                <Link href="/auth?action=become-partner" className="text-foreground hover:text-primary transition-colors">
                  Become a Partner
                </Link>
              )}
              <Link href="/auth" className="px-4 py-2 rounded-full border border-input hover:shadow-sm transition-shadow text-foreground hover:bg-muted">
                Log in
              </Link>
              <Link href="/auth?tab=register" className="px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-opacity-90 transition-colors">
                Sign up
              </Link>
            </div>
          )}

          {/* User is logged in */}
          {user && (
            <div className="flex items-center space-x-4">
              {!isMobile && (
                <Link href="/dashboard" className="text-foreground hover:text-primary transition-colors">
                  My Bookings
                </Link>
              )}
              {!isMobile && (
                <Button variant="ghost" size="icon" className="text-foreground hover:text-primary transition-colors">
                  <Bell className="h-5 w-5" />
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full p-2 border border-input hover:shadow-md transition-all">
                    <Menu className="h-5 w-5 mr-2" />
                    <div className="w-8 h-8 bg-muted rounded-full overflow-hidden flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center cursor-pointer">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center cursor-pointer">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Bookings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard?tab=favorites" className="flex items-center cursor-pointer">
                      <Heart className="mr-2 h-4 w-4" />
                      <span>Favorites</span>
                    </Link>
                  </DropdownMenuItem>
                  {user.isSalonOwner && (
                    <DropdownMenuItem asChild>
                      <Link href="/salon-dashboard" className="flex items-center cursor-pointer">
                        <Store className="mr-2 h-4 w-4" />
                        <span>Salon Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard?tab=settings" className="flex items-center cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </nav>
      </div>

      {/* Mobile search bar */}
      {isMobile && showMobileSearch && (
        <div className="px-4 pb-3">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Search salons, services..."
              className="w-full py-2 pl-10 pr-4 border border-input rounded-full"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
