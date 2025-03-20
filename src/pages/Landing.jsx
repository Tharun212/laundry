
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StudentProfile from '../components/StudentProfile';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WashingMachine, Shirt } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    
    // Simulating fetching student data
    setTimeout(() => {
      // Mock student data
      setStudentData({
        applicationNumber: 'APP12345',
        name: 'John Doe',
        gender: 'Male',
        email: 'john.doe@example.com',
        tower: 'GANGA',
        floor: '12',
        phone: '9876543210',
        washesUsed: 12,
        profileImage: null, // No image for demo
      });
      setLoading(false);
    }, 1000);
  }, [navigate]);

  const handleServiceSelect = (serviceType) => {
    navigate('/services', { state: { serviceType } });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <WashingMachine className="h-16 w-16 text-blue-600 mx-auto animate-spin" />
            <p className="mt-4 text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {studentData.name}</h1>
          <p className="text-gray-600">Manage your laundry services easily.</p>
        </div>
        
        <div className="mb-8">
          <StudentProfile student={studentData} />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border border-blue-100 hover:border-blue-300 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-blue-700">Washing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center mb-4">
                  <WashingMachine className="h-20 w-20 text-blue-600" />
                </div>
                <p className="text-gray-600">Standard washing service for all types of clothes.</p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleServiceSelect('washing')}
                  disabled={studentData.washesUsed >= 40}
                >
                  Select Service
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="border border-blue-100 hover:border-blue-300 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-blue-700">Iron + Washing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center mb-4">
                  <Shirt className="h-20 w-20 text-blue-600" />
                </div>
                <p className="text-gray-600">Complete washing and ironing service for your clothes.</p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleServiceSelect('iron+washing')}
                  disabled={studentData.washesUsed >= 40}
                >
                  Select Service
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {studentData.washesUsed >= 40 && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
              <p>You have used all your allocated washes (40/40). Please contact administration for additional services.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Landing;
