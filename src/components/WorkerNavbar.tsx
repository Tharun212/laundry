
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { WashingMachine, LogOut } from 'lucide-react';
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
      await signOut();
      navigate('/login');
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
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
              Dashboard
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
