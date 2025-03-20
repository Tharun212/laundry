import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Plus, Minus, ShoppingCart, X } from 'lucide-react';

const ClothingItem = ({ item, onAdd, onRemove, quantity }) => {
  return (
    <div className="flex items-center justify-between p-3 border rounded-md mb-2">
      <div className="font-medium">{item}</div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => onRemove(item)}
          disabled={quantity <= 0}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center">{quantity}</span>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={() => onAdd(item)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const Services = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [serviceType, setServiceType] = useState('');
  const [showClothesDialog, setShowClothesDialog] = useState(false);
  const [selectedGender, setSelectedGender] = useState('male');
  const [clothesQuantities, setClothesQuantities] = useState({
    // Male items
    shirts: 0,
    trousers: 0,
    tshirts: 0,
    shorts: 0,
    // Female items
    kurtis: 0,
    sarees: 0,
    tops: 0,
    jeans: 0,
    // Common items
    bedsheets: 0,
  });

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    
    // Set service type from location state if available
    if (location.state?.serviceType) {
      setServiceType(location.state.serviceType);
      setShowClothesDialog(true);
    }
  }, [navigate, location.state]);

  const handleAddItem = (item) => {
    setClothesQuantities(prev => ({
      ...prev,
      [item]: prev[item] + 1
    }));
  };

  const handleRemoveItem = (item) => {
    if (clothesQuantities[item] > 0) {
      setClothesQuantities(prev => ({
        ...prev,
        [item]: prev[item] - 1
      }));
    }
  };

  const getTotalItems = () => {
    return Object.values(clothesQuantities).reduce((sum, qty) => sum + qty, 0);
  };

  const handleAddToCart = () => {
    const totalItems = getTotalItems();
    
    if (totalItems === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one item to add to cart.",
        variant: "destructive",
      });
      return;
    }
    
    // Get existing cart or initialize empty one
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Add the selected items to cart
    const cartItem = {
      id: Date.now(),
      serviceType,
      items: Object.entries(clothesQuantities)
        .filter(([_, qty]) => qty > 0)
        .map(([item, qty]) => ({ item, qty })),
      totalItems,
    };
    
    // Update cart in local storage
    localStorage.setItem('cart', JSON.stringify([...existingCart, cartItem]));
    
    toast({
      title: "Added to Cart",
      description: `${totalItems} items added to your cart.`,
    });
    
    setShowClothesDialog(false);
    
    // Reset quantities
    setClothesQuantities({
      shirts: 0, trousers: 0, tshirts: 0, shorts: 0,
      kurtis: 0, sarees: 0, tops: 0, jeans: 0, bedsheets: 0,
    });
    
    // Navigate to cart page
    navigate('/cart');
  };

  const handleCloseDialog = () => {
    setShowClothesDialog(false);
    // Reset quantities
    setClothesQuantities({
      shirts: 0, trousers: 0, tshirts: 0, shorts: 0,
      kurtis: 0, sarees: 0, tops: 0, jeans: 0, bedsheets: 0,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Laundry Services</h1>
          <p className="text-gray-600">Select the type of service you need.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card 
            className={`border-2 cursor-pointer ${
              serviceType === 'washing' ? 'border-blue-500' : 'border-gray-200'
            } hover:border-blue-300 transition-colors`}
            onClick={() => {
              setServiceType('washing');
              setShowClothesDialog(true);
            }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-blue-700">Washing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Standard washing service for all types of clothes.</p>
              <p className="mt-2 text-sm text-blue-600">Turnaround: 2-3 days</p>
            </CardContent>
          </Card>
          
          <Card 
            className={`border-2 cursor-pointer ${
              serviceType === 'iron+washing' ? 'border-blue-500' : 'border-gray-200'
            } hover:border-blue-300 transition-colors`}
            onClick={() => {
              setServiceType('iron+washing');
              setShowClothesDialog(true);
            }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-blue-700">Iron + Washing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Complete washing and ironing service for your clothes.</p>
              <p className="mt-2 text-sm text-blue-600">Turnaround: 3-4 days</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Dialog for selecting clothes */}
      {showClothesDialog && (
        <Dialog open={showClothesDialog} onOpenChange={setShowClothesDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center">
                <span>Select your clothes</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={handleCloseDialog}
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogTitle>
              <DialogDescription>
                {serviceType === 'washing' ? 'Standard washing service' : 'Washing and ironing service'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-4">
              <Tabs defaultValue="male" onValueChange={setSelectedGender}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="male">Male</TabsTrigger>
                  <TabsTrigger value="female">Female</TabsTrigger>
                </TabsList>
                
                <TabsContent value="male" className="mt-4 space-y-4">
                  <ClothingItem 
                    item="shirts" 
                    onAdd={handleAddItem} 
                    onRemove={handleRemoveItem} 
                    quantity={clothesQuantities.shirts} 
                  />
                  <ClothingItem 
                    item="trousers" 
                    onAdd={handleAddItem} 
                    onRemove={handleRemoveItem} 
                    quantity={clothesQuantities.trousers} 
                  />
                  <ClothingItem 
                    item="tshirts" 
                    onAdd={handleAddItem} 
                    onRemove={handleRemoveItem} 
                    quantity={clothesQuantities.tshirts} 
                  />
                  <ClothingItem 
                    item="shorts" 
                    onAdd={handleAddItem} 
                    onRemove={handleRemoveItem} 
                    quantity={clothesQuantities.shorts} 
                  />
                </TabsContent>
                
                <TabsContent value="female" className="mt-4 space-y-4">
                  <ClothingItem 
                    item="kurtis" 
                    onAdd={handleAddItem} 
                    onRemove={handleRemoveItem} 
                    quantity={clothesQuantities.kurtis} 
                  />
                  <ClothingItem 
                    item="sarees" 
                    onAdd={handleAddItem} 
                    onRemove={handleRemoveItem} 
                    quantity={clothesQuantities.sarees} 
                  />
                  <ClothingItem 
                    item="tops" 
                    onAdd={handleAddItem} 
                    onRemove={handleRemoveItem} 
                    quantity={clothesQuantities.tops} 
                  />
                  <ClothingItem 
                    item="jeans" 
                    onAdd={handleAddItem} 
                    onRemove={handleRemoveItem} 
                    quantity={clothesQuantities.jeans} 
                  />
                </TabsContent>
              </Tabs>
              
              <div className="mt-4 pt-4 border-t">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Common Items</h3>
                <ClothingItem 
                  item="bedsheets" 
                  onAdd={handleAddItem} 
                  onRemove={handleRemoveItem} 
                  quantity={clothesQuantities.bedsheets} 
                />
              </div>
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row justify-between items-center mt-4">
              <div className="mb-2 sm:mb-0">
                Total Items: <span className="font-bold">{getTotalItems()}</span>
              </div>
              <Button onClick={handleAddToCart} className="bg-blue-600 hover:bg-blue-700">
                <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Services;
