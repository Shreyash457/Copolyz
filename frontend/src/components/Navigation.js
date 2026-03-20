import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

export const Navigation = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="glass-nav sticky top-0 z-50 border-b border-border">
      <div className="w-full px-3 py-2.5">
        <div className="flex items-center justify-between gap-2">
          <Link to="/" className="text-base md:text-lg lg:text-xl font-light tracking-tight flex-shrink-0 mr-2" data-testid="nav-logo">
            <span className="font-semibold text-primary">Coochbehar</span> Polyclinic
          </Link>
          
          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
            <Link to="/">
              <Button variant="ghost" size="sm" className="rounded-full px-2 py-1 h-8 text-xs" data-testid="nav-home">
                Home
              </Button>
            </Link>
            <Link to="/doctors">
              <Button variant="ghost" size="sm" className="rounded-full px-2 py-1 h-8 text-xs" data-testid="nav-doctors">
                Doctors
              </Button>
            </Link>
            
            {user && (
              <>
                <Link to={user.role === 'admin' ? '/admin/dashboard' : '/patient/dashboard'}>
                  <Button variant="ghost" size="sm" className="rounded-full px-2 py-1 h-8 text-xs" data-testid="nav-dashboard">
                    <User className="h-3 w-3" />
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="rounded-full px-2 py-1 h-8 text-xs" 
                  onClick={logout}
                  data-testid="nav-logout"
                >
                  <LogOut className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
