
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudentEntry from "./pages/StudentEntry";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Services from "./pages/Services";
import Cart from "./pages/Cart";
import History from "./pages/History";
import WorkerDashboard from "./pages/WorkerDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StudentEntry />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Landing />} />
          <Route path="/services" element={<Services />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/history" element={<History />} />
          <Route path="/worker" element={<WorkerDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
