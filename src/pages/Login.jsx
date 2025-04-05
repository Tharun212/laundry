
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { WashingMachine, ArrowLeft, Mail, Smartphone, KeyRound, UserPlus, LogIn, Briefcase } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  isWorker: z.boolean().default(false),
});

const signupSchema = z.object({
  reg_number: z.string().min(1, "Roll number is required"),
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  mobile: z.string().min(10, "Please enter a valid mobile number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
  isWorker: z.boolean().default(false),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useSupabaseAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Initialize form for login
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: location.state?.email || "",
      password: "",
      isWorker: false,
    },
  });

  // Initialize form for signup
  const signupForm = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      reg_number: location.state?.rollNumber || "",
      full_name: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
      isWorker: false,
    },
  });

  const handleLoginSubmit = async (values) => {
    setLoading(true);
    try {
      const { error } = await signIn(values.email, values.password);
      
      if (!error) {
        // Redirect based on worker flag
        if (values.isWorker) {
          localStorage.setItem('userRole', 'worker');
          navigate('/worker');
        } else {
          localStorage.setItem('userRole', 'student');
          navigate('/dashboard');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (values) => {
    setLoading(true);
    try {
      const { error } = await signUp(
        values.email, 
        values.password, 
        {
          reg_number: values.reg_number,
          full_name: values.full_name,
          mobile: values.mobile,
          is_worker: values.isWorker ? 'true' : 'false', // Add is_worker flag
        }
      );
      
      if (!error) {
        setActiveTab("login");
        loginForm.setValue("email", values.email);
        toast({
          title: "Registration Successful",
          description: "Your account has been created. Please login.",
        });
      }
    } finally {
      setLoading(false);
    }
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
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-indigo-700">
                            <Mail className="h-4 w-4" />
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="email" 
                              placeholder="Enter your email" 
                              className="w-full border-indigo-200 focus:border-indigo-400" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-indigo-700">
                            <KeyRound className="h-4 w-4" />
                            Password
                          </FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="password" 
                              placeholder="Enter your password" 
                              className="w-full border-indigo-200 focus:border-indigo-400" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="isWorker"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="flex items-center gap-2 text-indigo-700 cursor-pointer">
                              <Briefcase className="h-4 w-4" />
                              Login as Worker
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 mt-4"
                      disabled={loading}
                    >
                      {loading ? "Logging in..." : "Login"}
                    </Button>
                  </form>
                </Form>
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
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(handleSignupSubmit)} className="space-y-4">
                    <FormField
                      control={signupForm.control}
                      name="reg_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-indigo-700">
                            <KeyRound className="h-4 w-4" />
                            Roll Number
                          </FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="e.g., B12345" 
                              className="w-full border-indigo-200 focus:border-indigo-400" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-indigo-700">
                            <UserPlus className="h-4 w-4" />
                            Full Name
                          </FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Enter your full name" 
                              className="w-full border-indigo-200 focus:border-indigo-400" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-indigo-700">
                            <Mail className="h-4 w-4" />
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="email" 
                              placeholder="your.email@example.com" 
                              className="w-full border-indigo-200 focus:border-indigo-400" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
                      name="mobile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-indigo-700">
                            <Smartphone className="h-4 w-4" />
                            Mobile Number
                          </FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="tel" 
                              placeholder="Enter your mobile number" 
                              className="w-full border-indigo-200 focus:border-indigo-400" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-indigo-700">
                            <KeyRound className="h-4 w-4" />
                            Password
                          </FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="password" 
                              placeholder="Create a strong password" 
                              className="w-full border-indigo-200 focus:border-indigo-400" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-indigo-700">
                            <KeyRound className="h-4 w-4" />
                            Confirm Password
                          </FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="password" 
                              placeholder="Confirm your password" 
                              className="w-full border-indigo-200 focus:border-indigo-400" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
                      name="isWorker"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="flex items-center gap-2 text-indigo-700 cursor-pointer">
                              <Briefcase className="h-4 w-4" />
                              Register as Worker
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 mt-4"
                      disabled={loading}
                    >
                      {loading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                </Form>
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
