import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

export const Navigation = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="glass-nav sticky top-0 z-50 border-b border-border">
      <div className="w-full px-4 md:px-6 lg:px-12 py-3">
        <div className="flex items-center justify-between gap-2 max-w-full">
          <Link to="/" className="text-lg md:text-xl lg:text-2xl font-light tracking-tight flex-shrink-0" data-testid="nav-logo">
            <span className="font-semibold text-primary">Coochbehar</span> Polyclinic
          </Link>
          
          <div className="flex items-center gap-1 md:gap-2 lg:gap-4 flex-shrink-0">
            <Link to="/">
              <Button variant="ghost" size="sm" className="rounded-full px-2 md:px-3 lg:px-4 text-xs md:text-sm" data-testid="nav-home">
                <span className="hidden sm:inline">Home / হোম</span>
                <span className="sm:hidden">Home</span>
              </Button>
            </Link>
            <Link to="/doctors">
              <Button variant="ghost" size="sm" className="rounded-full px-2 md:px-3 lg:px-4 text-xs md:text-sm" data-testid="nav-doctors">
                <span className="hidden sm:inline">Doctors / ডাক্তার</span>
                <span className="sm:hidden">Doctors</span>
              </Button>
            </Link>
            
            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin/dashboard' : '/patient/dashboard'}>
                  <Button variant="ghost" size="sm" className="rounded-full px-2 md:px-3 lg:px-4 text-xs md:text-sm" data-testid="nav-dashboard">
                    <User className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden md:inline ml-2">Dashboard</span>
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="rounded-full px-2 md:px-3 lg:px-4 text-xs md:text-sm" 
                  onClick={logout}
                  data-testid="nav-logout"
                >
                  <LogOut className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden md:inline ml-2">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="rounded-full px-2 md:px-3 lg:px-4 text-xs md:text-sm" data-testid="nav-login">
                    <span className="hidden sm:inline">Login / লগইন</span>
                    <span className="sm:hidden">Login</span>
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="rounded-full shadow-lg shadow-primary/20 px-2 md:px-4 lg:px-6 text-xs md:text-sm whitespace-nowrap" data-testid="nav-signup">
                    <span className="hidden sm:inline">Sign Up / সাইন আপ</span>
                    <span className="sm:hidden">Sign Up</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
