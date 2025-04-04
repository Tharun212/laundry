
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { WashingMachine, LogOut } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from "@/hooks/use-toast";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user } = useSupabaseAuth();

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  const handleLogout = async (): Promise<void> => {
    try {
      console.log("Navbar: Logging out user...");
      await signOut();
      console.log("Navbar: Sign out successful, navigating to login");
      navigate('/login');
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error logging out",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <WashingMachine className="h-8 w-8 text-indigo-600 mr-2" />
            <span className="text-lg font-semibold text-gray-900">Laundry MS</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant={isActive('/dashboard') ? "default" : "ghost"} 
              onClick={() => navigate('/dashboard')}
              className={isActive('/dashboard') ? "bg-indigo-600 text-white" : "text-gray-700"}
            >
              Home
            </Button>
            
            <Button 
              variant={isActive('/services') ? "default" : "ghost"} 
              onClick={() => navigate('/services')}
              className={isActive('/services') ? "bg-indigo-600 text-white" : "text-gray-700"}
            >
              Services
            </Button>
            
            <Button 
              variant={isActive('/cart') ? "default" : "ghost"} 
              onClick={() => navigate('/cart')}
              className={isActive('/cart') ? "bg-indigo-600 text-white" : "text-gray-700"}
            >
              Cart
            </Button>
            
            <Button 
              variant={isActive('/history') ? "default" : "ghost"} 
              onClick={() => navigate('/history')}
              className={isActive('/history') ? "bg-indigo-600 text-white" : "text-gray-700"}
            >
              Orders
            </Button>
            
            <Button 
              variant="ghost" 
              className="text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
