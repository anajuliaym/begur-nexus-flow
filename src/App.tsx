import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/AppShell";
import { AiCopilot } from "@/components/AiCopilot";
import { ModeProvider, useMode } from "@/contexts/ModeContext";
import Dashboard from "./pages/Dashboard";
import Workflow from "./pages/Workflow";
import Intake from "./pages/Intake";
import Normalizacao from "./pages/Normalizacao";
import MesaAnalista from "./pages/MesaAnalista";
import PortalCliente from "./pages/PortalCliente";
import AppMotorista from "./pages/AppMotorista";
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

function Shell() {
  const [aiOpen, setAiOpen] = useState(false);
  const { mode } = useMode();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (mode === "target") setAiOpen(o => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode]);

  return (
    <>
      <AppShell onAiOpen={() => mode === "target" && setAiOpen(true)}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/workflow" element={<Workflow />} />
          <Route path="/intake" element={<Intake />} />
          <Route path="/requests" element={<Navigate to="/intake" replace />} />
          <Route path="/normalizacao" element={<Normalizacao />} />
          <Route path="/mesa-analista" element={<MesaAnalista />} />
          <Route path="/portal-cliente" element={<PortalCliente />} />
          <Route path="/app-motorista" element={<AppMotorista />} />
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
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ModeProvider>
        <BrowserRouter>
          <Shell />
        </BrowserRouter>
      </ModeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
