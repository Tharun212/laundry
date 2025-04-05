
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TabsList, Tabs, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Shirt, Package, CheckCircle, AlertCircle, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import WorkerNavbar from '@/components/WorkerNavbar';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useSupabaseAuth();

  useEffect(() => {
    // Fetch worker profile to confirm worker status
    const checkWorkerStatus = async () => {
      if (!user) {
        // Not authenticated, don't proceed with worker status check
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        if (data?.role !== 'worker') {
          // Not a worker, redirect to student dashboard
          toast({
            title: "Access Denied",
            description: "You don't have worker privileges.",
            variant: "destructive",
          });
          localStorage.setItem('userRole', 'student');
          navigate('/dashboard');
          return;
        }

        // Is a worker, proceed to fetch orders
        fetchOrders();
      } catch (error) {
        console.error("Error checking worker status:", error);
        setLoading(false);
      }
    };

    checkWorkerStatus();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Workers can see all orders
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles:user_id (
            full_name,
            reg_number,
            hostel,
            room_number
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform data to match the component expectations
      const transformedOrders = data.map(order => ({
        id: order.order_number,
        orderId: order.id, // Store the UUID for operations
        date: order.created_at,
        items: Array.isArray(order.items) ? order.items : [order.items],
        hostel: order.hostel,
        floor: order.floor,
        slot: order.slot,
        status: order.status,
        studentName: order.profiles?.full_name || 'Unknown',
        rollNumber: order.profiles?.reg_number || 'Unknown',
      }));
      
      setOrders(transformedOrders);
      setFilteredOrders(transformedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to load orders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      // Set up real-time subscription for order updates
      const channel = supabase
        .channel('public:orders')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'orders'
        }, () => {
          // Refresh orders when changes are detected
          fetchOrders();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  // Update filtered orders when tab or search query changes
  useEffect(() => {
    let filtered = orders;
    
    // Filter by status
    if (activeTab !== 'all') {
      filtered = filtered.filter(order => order.status === activeTab);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(query) ||
        order.studentName?.toLowerCase().includes(query) ||
        order.rollNumber?.toLowerCase().includes(query) ||
        order.hostel?.toLowerCase().includes(query)
      );
    }
    
    setFilteredOrders(filtered);
  }, [activeTab, searchQuery, orders]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      // Find the order with this ID to get the UUID
      const orderToUpdate = orders.find(order => order.id === orderId);
      if (!orderToUpdate) {
        toast({
          title: "Error",
          description: "Order not found",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderToUpdate.orderId);
      
      if (error) throw error;
      
      toast({
        title: "Status Updated",
        description: `Order ${orderId} status changed to ${newStatus.replace('-', ' ')}.`,
      });
      
      // Update local state immediately for better UX
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update the order status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Status options and their colors
  const statusOptions = [
    { value: 'picked-up', label: 'Picked Up', color: 'bg-orange-500' },
    { value: 'in-process', label: 'In Process', color: 'bg-yellow-500' },
    { value: 'washing-complete', label: 'Washing Complete', color: 'bg-green-500' },
    { value: 'delivered', label: 'Delivered', color: 'bg-blue-500' },
  ];

  // Order card component to reduce duplication
  const OrderCard = ({ order }) => (
    <Card key={order.id} className="mb-4">
      <CardHeader className="pb-2 flex flex-wrap justify-between items-center">
        <div>
          <CardTitle className="text-lg flex items-center">
            <Package className="h-5 w-5 mr-2 text-blue-600" />
            {order.id}
          </CardTitle>
          <p className="text-sm text-gray-500">{formatDate(order.date)}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
          order.status === 'pending' ? 'bg-gray-500' :
          order.status === 'picked-up' ? 'bg-orange-500' :
          order.status === 'in-process' ? 'bg-yellow-500' :
          order.status === 'washing-complete' ? 'bg-green-500' :
          'bg-blue-500'
        }`}>
          {order.status.replace('-', ' ')}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Student Details</h3>
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-500">Name:</span> {order.studentName || 'N/A'}</p>
              <p><span className="text-gray-500">Roll Number:</span> {order.rollNumber || 'N/A'}</p>
              <p><span className="text-gray-500">Hostel:</span> {order.hostel}, Floor {order.floor}</p>
              <p><span className="text-gray-500">Pickup Slot:</span> {order.slot}</p>
            </div>
            
            <h3 className="text-sm font-medium mt-4 mb-2">Order Items</h3>
            {order.items.map((item, idx) => (
              <div key={idx} className="mb-2">
                <div className="text-sm font-medium capitalize">{item.serviceType} Service</div>
                <div className="text-xs text-gray-500 mt-1">
                  {item.items.map(({ item: clothingItem, qty }) => (
                    <div key={clothingItem} className="capitalize">
                      {clothingItem}: {qty}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Update Status</h3>
            <div className="space-y-3">
              {statusOptions.map(option => (
                <Button
                  key={option.value}
                  onClick={() => handleUpdateStatus(order.id, option.value)}
                  disabled={order.status === option.value}
                  className={`w-full justify-start ${
                    order.status === option.value 
                      ? option.color + ' text-white'
                      : 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {order.status === option.value && (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  {option.label}
                </Button>
              ))}
            </div>
            
            {order.status === 'delivered' && (
              <div className="mt-4 p-3 bg-green-50 rounded-md text-green-700 text-sm flex items-start">
                <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>This order has been completed and delivered to the student.</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">You need to be authenticated as a worker to access this page.</p>
          <Button 
            onClick={() => navigate('/login')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <WorkerNavbar />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center">
                <Shirt className="h-6 w-6 mr-2 text-indigo-600" />
                Worker Dashboard
              </h1>
              <p className="text-sm text-gray-600">Manage and update student laundry orders</p>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  localStorage.setItem('userRole', 'student');
                  navigate('/dashboard');
                }}
              >
                View as Student
              </Button>
              <Button 
                onClick={() => fetchOrders()} 
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Refresh Orders
              </Button>
            </div>
          </div>
          
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="all">All Orders</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="picked-up">Picked Up</TabsTrigger>
                <TabsTrigger value="in-process">In Process</TabsTrigger>
                <TabsTrigger value="washing-complete">Washing Complete</TabsTrigger>
                <TabsTrigger value="delivered">Delivered</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          <div className="mt-4">
            {loading ? (
              <div className="flex justify-center py-16">
                <Shirt className="h-12 w-12 text-indigo-600 animate-spin" />
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">No orders found</h2>
                <p className="text-gray-500">
                  {searchQuery
                    ? "No orders match your search criteria."
                    : activeTab === 'all'
                    ? "There are no orders in the system."
                    : `There are no orders with '${activeTab}' status.`}
                </p>
              </div>
            ) : (
              filteredOrders.map(order => <OrderCard key={order.id} order={order} />)
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorkerDashboard;
