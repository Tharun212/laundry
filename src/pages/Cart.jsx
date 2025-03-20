
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { toast } from "@/hooks/use-toast";
import { ShoppingBag, Trash2, Clock } from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [hostel, setHostel] = useState('');
  const [floor, setFloor] = useState('');
  const [slot, setSlot] = useState('');
  const [slotCapacity, setSlotCapacity] = useState({
    '11:00 AM': { total: 20, booked: 15 },
    '3:00 PM': { total: 20, booked: 8 },
    '6:30 PM': { total: 20, booked: 20 }, // Full slot for demo
  });
  const [checkoutStep, setCheckoutStep] = useState(1);

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    
    // Load cart items from localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(savedCart);
  }, [navigate]);

  const handleRemoveItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    toast({
      title: "Item Removed",
      description: "The item has been removed from your cart.",
    });
  };

  const getFloorOptions = () => {
    if (hostel === 'VEDAVATI') {
      return [6, 12];
    } else if (hostel === 'GANGA') {
      return [6, 12, 21];
    }
    return [];
  };

  const getSlotAvailability = (slotTime) => {
    const slot = slotCapacity[slotTime];
    if (!slot) return { available: false, remaining: 0 };
    
    return {
      available: slot.booked < slot.total,
      remaining: slot.total - slot.booked,
    };
  };

  const handleProceed = () => {
    if (checkoutStep === 1) {
      if (!hostel || !floor) {
        toast({
          title: "Incomplete Selection",
          description: "Please select your hostel and floor.",
          variant: "destructive",
        });
        return;
      }
      setCheckoutStep(2);
    } else if (checkoutStep === 2) {
      if (!slot) {
        toast({
          title: "Incomplete Selection",
          description: "Please select a pickup slot.",
          variant: "destructive",
        });
        return;
      }
      
      // Process order (in a real app, this would send to backend)
      // For now, we'll simulate order creation
      const order = {
        id: `ORD-${Date.now()}`,
        items: cartItems,
        hostel,
        floor,
        slot,
        status: 'pending',
        date: new Date().toISOString(),
      };
      
      // Save to order history
      const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      localStorage.setItem('orderHistory', JSON.stringify([...orderHistory, order]));
      
      // Clear cart
      localStorage.setItem('cart', JSON.stringify([]));
      
      toast({
        title: "Order Placed Successfully",
        description: `Your order #${order.id} has been placed.`,
      });
      
      // Redirect to history page
      navigate('/history');
    }
  };

  const handleBack = () => {
    if (checkoutStep === 2) {
      setCheckoutStep(1);
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.totalItems, 0);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
          <p className="text-gray-600">Review your items and proceed to checkout.</p>
        </div>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some items to your cart to get started.</p>
            <Button 
              onClick={() => navigate('/services')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Browse Services
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {/* Cart Items */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Cart Items ({cartItems.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {cartItems.map((cartItem) => (
                    <div 
                      key={cartItem.id} 
                      className="border-b py-4 last:border-b-0 last:pb-0 first:pt-0"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900 capitalize">
                            {cartItem.serviceType} Service
                          </h3>
                          <div className="mt-2 text-sm text-gray-600">
                            {cartItem.items.map(({ item, qty }) => (
                              <div key={item} className="capitalize">
                                {item}: {qty}
                              </div>
                            ))}
                          </div>
                          <div className="mt-2 text-sm text-blue-600">
                            Total items: {cartItem.totalItems}
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRemoveItem(cartItem.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              {/* Checkout Steps */}
              {checkoutStep === 1 ? (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Pickup Location</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="hostel" className="text-sm font-medium text-gray-700 mb-1 block">
                        Select Hostel
                      </Label>
                      <select
                        id="hostel"
                        value={hostel}
                        onChange={(e) => {
                          setHostel(e.target.value);
                          setFloor(''); // Reset floor when hostel changes
                        }}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        <option value="">Select a hostel</option>
                        <option value="VEDAVATI">VEDAVATI</option>
                        <option value="GANGA">GANGA</option>
                      </select>
                    </div>
                    
                    {hostel && (
                      <div>
                        <Label htmlFor="floor" className="text-sm font-medium text-gray-700 mb-1 block">
                          Select Floor
                        </Label>
                        <select
                          id="floor"
                          value={floor}
                          onChange={(e) => setFloor(e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                          <option value="">Select a floor</option>
                          {getFloorOptions().map(floorNum => (
                            <option key={floorNum} value={floorNum}>
                              Floor {floorNum}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Select Pickup Slot</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={slot} onValueChange={setSlot} className="space-y-3">
                      {Object.entries(slotCapacity).map(([slotTime, capacity]) => {
                        const { available, remaining } = getSlotAvailability(slotTime);
                        return (
                          <div key={slotTime} className={`flex items-center space-x-2 rounded-md border p-3 ${!available ? 'opacity-50' : ''}`}>
                            <RadioGroupItem 
                              value={slotTime} 
                              id={slotTime} 
                              disabled={!available}
                            />
                            <Label htmlFor={slotTime} className="flex-grow cursor-pointer">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                  <Clock className="h-4 w-4 text-blue-600" />
                                  <span>{slotTime}</span>
                                </div>
                                <div className="text-sm text-gray-500">
                                  {available ? `${remaining} slots left` : 'Fully booked'}
                                </div>
                              </div>
                            </Label>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Order Summary */}
            <div>
              <Card className="sticky top-24">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Total Items</span>
                    <span className="font-medium">{getTotalItems()}</span>
                  </div>
                  
                  {checkoutStep > 1 && hostel && floor && (
                    <div className="border-t pt-3">
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Location</span>
                          <span className="font-medium">{hostel}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Floor</span>
                          <span className="font-medium">{floor}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {checkoutStep > 1 && slot && (
                    <div className="border-t pt-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pickup Slot</span>
                        <span className="font-medium">{slot}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="flex flex-col space-y-2">
                      {checkoutStep > 1 && (
                        <Button 
                          variant="outline" 
                          onClick={handleBack}
                        >
                          Back
                        </Button>
                      )}
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700 w-full"
                        onClick={handleProceed}
                      >
                        {checkoutStep === 1 ? 'Continue' : 'Place Order'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
