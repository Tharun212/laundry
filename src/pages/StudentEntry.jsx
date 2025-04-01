
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { WashingMachine } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const StudentEntry = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Check if the roll number is registered in our system
      const { data, error } = await supabase
        .from('profiles')
        .select('reg_number')
        .eq('reg_number', rollNumber)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        // Roll number is registered
        navigate('/login', { state: { rollNumber } });
      } else {
        // Roll number not found, redirect to signup
        navigate('/login', { state: { rollNumber } });
        toast({
          title: "New User",
          description: "You are not registered yet. Please create an account.",
        });
      }
    } catch (error) {
      console.error('Error checking roll number:', error);
      toast({
        title: "Error",
        description: "There was a problem checking your roll number. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
            Not registered? You'll be able to create an account after entering your roll number.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentEntry;
