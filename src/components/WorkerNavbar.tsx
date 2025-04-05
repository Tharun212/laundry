
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { WashingMachine, LogOut, Home, User, Package } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from "@/hooks/use-toast";

const WorkerNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useSupabaseAuth();

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  const handleLogout = async (): Promise<void> => {
    try {
      console.log("WorkerNavbar: Logging out worker...");
      await signOut();
      console.log("WorkerNavbar: Sign out successful, navigating to login");
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

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <WashingMachine className="h-8 w-8 text-indigo-600 mr-2" />
            <span className="text-lg font-semibold text-gray-900">Laundry MS - Worker</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant={isActive('/worker') ? "default" : "ghost"} 
              onClick={() => navigate('/worker')}
              className={isActive('/worker') ? "bg-indigo-600 text-white" : "text-gray-700"}
            >
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            
            <Button 
              variant={isActive('/worker/orders') ? "default" : "ghost"}
              onClick={() => navigate('/worker/orders')} 
              className={isActive('/worker/orders') ? "bg-indigo-600 text-white" : "text-gray-700"}
            >
              <Package className="h-4 w-4 mr-2" />
              Orders
            </Button>
            
            <Button 
              variant={isActive('/worker/profile') ? "default" : "ghost"}
              onClick={() => navigate('/worker/profile')} 
              className={isActive('/worker/profile') ? "bg-indigo-600 text-white" : "text-gray-700"}
            >
              <User className="h-4 w-4 mr-2" />
              Profile
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

export default WorkerNavbar;
