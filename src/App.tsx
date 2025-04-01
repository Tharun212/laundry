
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/useSupabaseAuth";
import StudentEntry from "./pages/StudentEntry";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Services from "./pages/Services";
import Cart from "./pages/Cart";
import History from "./pages/History";
import WorkerDashboard from "./pages/WorkerDashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<StudentEntry />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Landing />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/services" 
              element={
                <ProtectedRoute>
                  <Services />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/cart" 
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/history" 
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              } 
            />
            <Route path="/worker" element={<WorkerDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
