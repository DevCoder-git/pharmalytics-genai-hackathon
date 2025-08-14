import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, 
  X, 
  Stethoscope, 
  Shield, 
  Users, 
  FileText,
  Settings,
  LogOut,
  User
} from "lucide-react";
import { AuthModal } from "./AuthModal";
import { apiClient } from "../lib/api";

const NavigationHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      }
    };
    
    checkAuth();
    
    // Listen for storage changes (login/logout in other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken' || e.key === 'user') {
        checkAuth();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  const navigation = [
    { name: "Dashboard", href: "#dashboard", icon: Stethoscope },
    { name: "Drug Checker", href: "#checker", icon: Shield },
    { name: "Patients", href: "#patients", icon: Users },
    { name: "Reports", href: "#reports", icon: FileText },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                PharmaLytics
              </h1>
              <div className="text-xs text-muted-foreground">AI Platform</div>
            </div>
            <Badge variant="secondary" className="ml-2 text-xs">
              Demo
            </Badge>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.name}
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                  asChild
                >
                  <a href={item.href} className="flex items-center">
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </a>
                </Button>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => setShowAuthModal(true)}>
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.name}
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground hover:text-foreground"
                    asChild
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <a href={item.href} className="flex items-center">
                      <Icon className="w-4 h-4 mr-3" />
                      {item.name}
                    </a>
                  </Button>
                );
              })}
              <div className="pt-4 border-t border-border space-y-2">
                {user ? (
                  <>
                    <Button variant="outline" className="w-full justify-start" size="sm" onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" className="w-full justify-start" size="sm" onClick={() => setShowAuthModal(true)}>
                    <User className="w-4 h-4 mr-3" />
                    Sign In
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onSuccess={(userData) => setUser(userData)}
      />
    </header>
  );
};

export default NavigationHeader;