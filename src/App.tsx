import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import BlobCursor from "@/components/BlobCursor";
import Home from "./pages/Home";
import Pets from "./pages/Pets";
import PetDetail from "./pages/PetDetail";
import Dashboard from "./pages/Dashboard";
import Resources from "./pages/Resources";
import Store from "./pages/Store";
import Donate from "./pages/Donate";
import Volunteer from "./pages/Volunteer";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import VetPortal from "./pages/VetPortal";
import VolunteerPortal from "./pages/VolunteerPortal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BlobCursor
        blobType="circle"
        fillColor="hsl(var(--primary))"
        trailCount={3}
        sizes={[50, 80, 65]}
        innerSizes={[18, 28, 22]}
        innerColor="rgba(255,255,255,0.9)"
        opacities={[0.8, 0.7, 0.6]}
        shadowColor="rgba(0,0,0,0.6)"
        shadowBlur={8}
        shadowOffsetX={5}
        shadowOffsetY={5}
        filterStdDeviation={25}
        useFilter={true}
        fastDuration={0.1}
        slowDuration={0.5}
        zIndex={9999}
      />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pets" element={<Pets />} />
            <Route path="/pets/:id" element={<PetDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/store" element={<Store />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/volunteer" element={<Volunteer />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/vet-portal" element={<VetPortal />} />
            <Route path="/volunteer-portal" element={<VolunteerPortal />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
