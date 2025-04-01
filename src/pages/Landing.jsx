
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WashingMachine, Shirt } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';

const Landing = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useSupabaseAuth();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        // Set student data from profile
        setStudentData({
          applicationNumber: data.reg_number,
          name: data.full_name,
          email: data.email,
          phone: data.mobile,
          hostel: data.hostel || 'Not set',
          floor: data.room_number || 'Not set',
          washesUsed: 0, // This could be fetched from orders table if available
          profileImage: null, // No image for now
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleServiceSelect = (serviceType) => {
    navigate('/services', { state: { serviceType } });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <WashingMachine className="h-16 w-16 text-indigo-600 mx-auto animate-spin" />
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
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {studentData?.name || 'User'}</h1>
          <p className="text-gray-600">Manage your laundry services easily.</p>
        </div>
        
        <div className="mb-8">
          {studentData && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Registration Number</p>
                  <p className="font-medium">{studentData.applicationNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{studentData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{studentData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{studentData.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hostel</p>
                  <p className="font-medium">{studentData.hostel}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Room/Floor</p>
                  <p className="font-medium">{studentData.floor}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border border-indigo-100 hover:border-indigo-300 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-indigo-700">Washing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center mb-4">
                  <WashingMachine className="h-20 w-20 text-indigo-600" />
                </div>
                <p className="text-gray-600">Standard washing service for all types of clothes.</p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => handleServiceSelect('washing')}
                >
                  Select Service
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="border border-indigo-100 hover:border-indigo-300 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-indigo-700">Iron + Washing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center mb-4">
                  <Shirt className="h-20 w-20 text-indigo-600" />
                </div>
                <p className="text-gray-600">Complete washing and ironing service for your clothes.</p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => handleServiceSelect('iron+washing')}
                >
                  Select Service
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
