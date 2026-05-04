import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/AppShell";
import { AiCopilot } from "@/components/AiCopilot";
import Dashboard from "./pages/Dashboard";
import Requests from "./pages/Requests";
import Orders from "./pages/Orders";
import CrossDocking from "./pages/CrossDocking";
import Routing from "./pages/Routing";
import Tracking from "./pages/Tracking";
import Occurrences from "./pages/Occurrences";
import Customers from "./pages/Customers";
import Analytics from "./pages/Analytics";
import Financial from "./pages/Financial";
import Compliance from "./pages/Compliance";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [aiOpen, setAiOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setAiOpen(o => !o); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppShell onAiOpen={() => setAiOpen(true)}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/cross-docking" element={<CrossDocking />} />
              <Route path="/routing" element={<Routing />} />
              <Route path="/tracking" element={<Tracking />} />
              <Route path="/occurrences" element={<Occurrences />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/financial" element={<Financial />} />
              <Route path="/compliance" element={<Compliance />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppShell>
          <AiCopilot open={aiOpen} onClose={() => setAiOpen(false)} />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
