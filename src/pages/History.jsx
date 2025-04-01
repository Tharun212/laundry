
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Package, ShoppingBag, Calendar } from 'lucide-react';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';

// Status color mapping
const statusColors = {
  'pending': 'bg-gray-500',
  'picked-up': 'bg-orange-500',
  'in-process': 'bg-yellow-500',
  'washing-complete': 'bg-green-500',
  'delivered': 'bg-blue-500',
};

const OrderStatusBadge = ({ status }) => {
  const getStatusLabel = () => {
    switch(status) {
      case 'pending': return 'Pending';
      case 'picked-up': return 'Picked Up';
      case 'in-process': return 'In Process';
      case 'washing-complete': return 'Washing Complete';
      case 'delivered': return 'Delivered';
      default: return 'Unknown';
    }
  };
  
  return (
    <div className={`px-2 py-1 rounded-full text-xs font-medium text-white ${statusColors[status] || 'bg-gray-500'}`}>
      {getStatusLabel()}
    </div>
  );
};

const History = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const { user } = useSupabaseAuth();
  
  useEffect(() => {
    if (!user) return;
    
    // Load order history from localStorage
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    
    // For demonstration, let's add some mock data if no orders exist
    if (orderHistory.length === 0) {
      const mockOrders = [
        {
          id: 'ORD-12345',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
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
          status: 'delivered',
        },
        {
          id: 'ORD-12346',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
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
          status: 'in-process',
        },
      ];
      
      localStorage.setItem('orderHistory', JSON.stringify(mockOrders));
      setOrders(mockOrders);
    } else {
      setOrders(orderHistory);
    }
  }, [user, navigate]);

  const getFilteredOrders = () => {
    if (activeTab === 'all') {
      return orders;
    }
    return orders.filter(order => order.status === activeTab);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
          <p className="text-gray-600">Track and manage your laundry orders.</p>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="picked-up">Picked Up</TabsTrigger>
            <TabsTrigger value="in-process">In Process</TabsTrigger>
            <TabsTrigger value="washing-complete">Washing Complete</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            {getFilteredOrders().length === 0 ? (
              <div className="text-center py-16">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">No orders found</h2>
                <p className="text-gray-500 mb-6">
                  {activeTab === 'all' 
                    ? "You haven't placed any orders yet." 
                    : `You don't have any ${activeTab} orders.`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {getFilteredOrders().map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="pb-4 bg-gray-50">
                      <div className="flex flex-wrap justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-500">{formatDate(order.date)}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-sm font-medium">{order.id}</div>
                          <OrderStatusBadge status={order.status} />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-700 mb-2">Order Items</h3>
                          {order.items.map((item, idx) => (
                            <div key={idx} className="mb-3">
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
                          <h3 className="text-sm font-medium text-gray-700 mb-2">Pickup Details</h3>
                          <div className="text-sm space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-500">Location:</span>
                              <span>{order.hostel}, Floor {order.floor}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-blue-600" />
                              <span>{order.slot}</span>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            {order.status === 'delivered' ? (
                              <div className="text-sm text-green-600">
                                Your order has been delivered. Thank you!
                              </div>
                            ) : (
                              <div className="text-sm text-blue-600">
                                Your order is being processed. Current status: 
                                <span className="font-medium capitalize ml-1">
                                  {order.status.replace('-', ' ')}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default History;
