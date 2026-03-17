import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

export const Navigation = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="glass-nav sticky top-0 z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-light tracking-tight" data-testid="nav-logo">
            <span className="font-semibold text-primary">Coochbehar</span> Polyclinic
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" className="rounded-full" data-testid="nav-home">
                Home / হোম
              </Button>
            </Link>
            <Link to="/doctors">
              <Button variant="ghost" className="rounded-full" data-testid="nav-doctors">
                Doctors / ডাক্তার
              </Button>
            </Link>
            
            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin/dashboard' : '/patient/dashboard'}>
                  <Button variant="ghost" className="rounded-full" data-testid="nav-dashboard">
                    <User className="h-4 w-4 mr-2" />
                    Dashboard / ড্যাশবোর্ড
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="rounded-full" 
                  onClick={logout}
                  data-testid="nav-logout"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout / লগআউট
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="rounded-full" data-testid="nav-login">
                    Login / লগইন
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="rounded-full shadow-lg shadow-primary/20" data-testid="nav-signup">
                    Sign Up / সাইন আপ
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
