
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { WashingMachine, ArrowLeft } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    rollNumber: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If roll number is passed from the previous page, use it
    if (location.state?.rollNumber) {
      setFormData(prev => ({ ...prev, rollNumber: location.state.rollNumber }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulating API login call
    setTimeout(() => {
      setLoading(false);
      // For demo: accept any non-empty password
      if (formData.password) {
        // In a real app, you would save auth token/user data to context/local storage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', 'student');
        localStorage.setItem('rollNumber', formData.rollNumber);
        navigate('/dashboard');
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials. Please try again.",
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
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="mt-2 text-gray-600">Log in to your laundry account</p>
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
              value={formData.rollNumber}
              onChange={handleChange}
              placeholder="Enter your roll number"
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
        
        <Button 
          variant="outline" 
          className="mt-4 w-full flex items-center justify-center gap-2"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Roll Number Entry
        </Button>
      </div>
    </div>
  );
};

export default Login;
