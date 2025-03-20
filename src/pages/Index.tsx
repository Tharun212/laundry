
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { WashingMachine, Shirt } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  
  // Redirect to Student Entry page
  React.useEffect(() => {
    navigate('/');
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="text-center">
        <WashingMachine className="h-24 w-24 text-blue-600 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Laundry Management System</h1>
        <p className="text-xl text-gray-600 mb-8">Redirecting to the Student Entry page...</p>
        <Button 
          onClick={() => navigate('/')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Go to Student Entry
        </Button>
      </div>
    </div>
  );
};

export default Index;
