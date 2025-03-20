
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex justify-center items-center h-24 w-24 rounded-full bg-white shadow-lg mb-4 animate-bounce">
            <WashingMachine className="h-14 w-14 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-indigo-800 tracking-tight">CampusWash</h1>
          <p className="mt-2 text-lg text-indigo-600 font-medium">Your campus laundry solution</p>
        </div>
        
        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/60 backdrop-blur-sm p-1 rounded-lg shadow-md">
            <TabsTrigger value="login" className="flex items-center gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </TabsTrigger>
            <TabsTrigger value="signup" className="flex items-center gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              <UserPlus className="h-4 w-4" />
              <span>Create Account</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-md">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center text-indigo-800">Welcome Back</CardTitle>
                <CardDescription className="text-center text-indigo-600">
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="rollNumber" className="flex items-center gap-2 text-indigo-700">
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
                      className="w-full border-indigo-200 focus:border-indigo-400"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="flex items-center gap-2 text-indigo-700">
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
                      className="w-full border-indigo-200 focus:border-indigo-400"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 mt-4"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2 border-t border-indigo-100 pt-4">
                <p className="text-sm text-center text-indigo-600">
                  Forgot your password? <button className="font-medium hover:underline">Reset it here</button>
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="signup">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-md">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center text-indigo-800">Create an Account</CardTitle>
                <CardDescription className="text-center text-indigo-600">
                  Fill in your details to register
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-rollNumber" className="flex items-center gap-2 text-indigo-700">
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
                      className="w-full border-indigo-200 focus:border-indigo-400"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2 text-indigo-700">
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
                      className="w-full border-indigo-200 focus:border-indigo-400"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mobile" className="flex items-center gap-2 text-indigo-700">
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
                      className="w-full border-indigo-200 focus:border-indigo-400"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="flex items-center gap-2 text-indigo-700">
                      <KeyRound className="h-4 w-4" />
                      Password
                    </Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      required
                      value={signupData.password}
                      onChange={handleSignupChange}
                      placeholder="Create a strong password"
                      className="w-full border-indigo-200 focus:border-indigo-400"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-indigo-700">
                      <KeyRound className="h-4 w-4" />
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={signupData.confirmPassword}
                      onChange={handleSignupChange}
                      placeholder="Confirm your password"
                      className="w-full border-indigo-200 focus:border-indigo-400"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 mt-4"
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
          className="mt-6 w-full flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm shadow-md hover:bg-white"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Roll Number Entry
        </Button>
      </div>
    </div>
  );
};

export default Login;
