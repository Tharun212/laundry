
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { WashingMachine, ArrowLeft, Mail, Smartphone, KeyRound, UserPlus, LogIn } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loginData, setLoginData] = useState({
    rollNumber: '',
    password: '',
  });
  const [signupData, setSignupData] = useState({
    rollNumber: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If roll number is passed from the previous page, use it
    if (location.state?.rollNumber) {
      setLoginData(prev => ({ ...prev, rollNumber: location.state.rollNumber }));
    }
  }, [location.state]);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData(prev => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulating API login call
    setTimeout(() => {
      setLoading(false);
      // For demo: accept any non-empty password
      if (loginData.password) {
        // In a real app, you would save auth token/user data to context/local storage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', 'student');
        localStorage.setItem('rollNumber', loginData.rollNumber);
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

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Validate passwords match
    if (signupData.password !== signupData.confirmPassword) {
      setLoading(false);
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    // Simulating API signup call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Account Created",
        description: "Your account has been created successfully. Please login.",
      });
      setActiveTab("login");
      setLoginData(prev => ({ 
        ...prev, 
        rollNumber: signupData.rollNumber 
      }));
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex justify-center items-center h-20 w-20 rounded-full bg-white shadow-md mb-4">
            <WashingMachine className="h-12 w-12 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">CampusWash</h1>
          <p className="mt-2 text-gray-600">Your campus laundry solution</p>
        </div>
        
        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </TabsTrigger>
            <TabsTrigger value="signup" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              <span>Create Account</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="rollNumber" className="flex items-center gap-2">
                      <KeyRound className="h-4 w-4" />
                      Roll Number
                    </Label>
                    <Input
                      id="rollNumber"
                      name="rollNumber"
                      type="text"
                      required
                      value={loginData.rollNumber}
                      onChange={handleLoginChange}
                      placeholder="Enter your roll number"
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center gap-2">
                      <KeyRound className="h-4 w-4" />
                      Password
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={loginData.password}
                      onChange={handleLoginChange}
                      placeholder="Enter your password"
                      className="w-full"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <p className="text-sm text-center text-gray-500">Forgot your password? <button className="text-indigo-600 hover:underline">Reset it here</button></p>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create an Account</CardTitle>
                <CardDescription>Fill in your details to register</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-rollNumber" className="flex items-center gap-2">
                      <KeyRound className="h-4 w-4" />
                      Application/Roll Number
                    </Label>
                    <Input
                      id="signup-rollNumber"
                      name="rollNumber"
                      type="text"
                      required
                      value={signupData.rollNumber}
                      onChange={handleSignupChange}
                      placeholder="e.g., B12345"
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={signupData.email}
                      onChange={handleSignupChange}
                      placeholder="your.email@example.com"
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mobile" className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      Mobile Number
                    </Label>
                    <Input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      required
                      value={signupData.mobile}
                      onChange={handleSignupChange}
                      placeholder="Enter your mobile number"
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      required
                      value={signupData.password}
                      onChange={handleSignupChange}
                      placeholder="Create a strong password"
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={signupData.confirmPassword}
                      onChange={handleSignupChange}
                      placeholder="Confirm your password"
                      className="w-full"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Button 
          variant="outline" 
          className="mt-6 w-full flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Roll Number Entry
        </Button>
      </div>
    </div>
  );
};

export default Login;
