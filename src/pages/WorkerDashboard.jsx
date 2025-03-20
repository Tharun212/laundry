
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { TabsList, Tabs, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Shirt, Package, CheckCircle, AlertCircle, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // For the worker dashboard, we'll simulate a worker login
    // In a real app, you would check for worker role
    const role = localStorage.getItem('userRole');
    
    if (role === 'worker') {
      setIsAuthenticated(true);
    } else {
      // For demo purposes, let's automatically set as worker
      localStorage.setItem('userRole', 'worker');
      localStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
    }
    
    // Load orders from localStorage
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    
    // For demonstration, let's add some mock data if no orders exist
    if (orderHistory.length === 0) {
      const mockOrders = [
        {
          id: 'ORD-12345',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          items: [
            {
              id: 1,
              serviceType: 'washing',
              items: [
                { item: 'shirts', qty: 2 },
                { item: 'trousers', qty: 1 },
              ],
              totalItems: 3,
            }
          ],
          hostel: 'GANGA',
          floor: '12',
          slot: '11:00 AM',
          status: 'pending',
          studentName: 'John Doe',
          rollNumber: 'B12345',
        },
        {
          id: 'ORD-12346',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          items: [
            {
              id: 2,
              serviceType: 'iron+washing',
              items: [
                { item: 'shirts', qty: 3 },
                { item: 'bedsheets', qty: 2 },
              ],
              totalItems: 5,
            }
          ],
          hostel: 'VEDAVATI',
          floor: '6',
          slot: '3:00 PM',
          status: 'picked-up',
          studentName: 'Jane Smith',
          rollNumber: 'B67890',
        },
        {
          id: 'ORD-12347',
          date: new Date().toISOString(),
          items: [
            {
              id: 3,
              serviceType: 'washing',
              items: [
                { item: 'tshirts', qty: 4 },
                { item: 'shorts', qty: 2 },
              ],
              totalItems: 6,
            }
          ],
          hostel: 'GANGA',
          floor: '21',
          slot: '6:30 PM',
          status: 'in-process',
          studentName: 'Alex Johnson',
          rollNumber: 'B54321',
        },
      ];
      
      localStorage.setItem('orderHistory', JSON.stringify(mockOrders));
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
    } else {
      setOrders(orderHistory);
      setFilteredOrders(orderHistory);
    }
  }, []);

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
        order.hostel.toLowerCase().includes(query)
      );
    }
    
    setFilteredOrders(filtered);
  }, [activeTab, searchQuery, orders]);

  const handleUpdateStatus = (orderId, newStatus) => {
    // Update order status
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    
    setOrders(updatedOrders);
    
    // Update in localStorage
    localStorage.setItem('orderHistory', JSON.stringify(updatedOrders));
    
    toast({
      title: "Status Updated",
      description: `Order ${orderId} status changed to ${newStatus.replace('-', ' ')}.`,
    });
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">You need to be authenticated as a worker to access this page.</p>
          <Button 
            onClick={() => navigate('/')}
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
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
            <div className="flex items-center">
              <Shirt className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Worker Dashboard</h1>
                <p className="text-sm text-gray-600">Manage student laundry orders</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => {
                localStorage.setItem('userRole', 'student');
                navigate('/');
              }}
            >
              Switch to Student View
            </Button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
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
            {filteredOrders.length === 0 ? (
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
