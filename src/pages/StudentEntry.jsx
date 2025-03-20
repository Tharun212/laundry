
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { WashingMachine } from 'lucide-react';

const StudentEntry = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulating an API call to check if user is registered
    setTimeout(() => {
      setLoading(false);
      // For demo purposes, consider users with roll numbers starting with 'B' as registered
      if (rollNumber.startsWith('B')) {
        navigate('/login', { state: { rollNumber } });
      } else {
        toast({
          title: "Not Registered",
          description: "You are not registered with us. Please contact the administrator.",
          variant: "destructive",
        });
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <WashingMachine className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Laundry Management System</h1>
          <p className="mt-2 text-gray-600">Enter your roll number to get started</p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Roll Number
            </label>
            <Input
              id="rollNumber"
              name="rollNumber"
              type="text"
              required
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              placeholder="e.g., B12345"
              className="w-full"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Checking..." : "Continue"}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Not registered? Please contact the administrator for assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentEntry;
