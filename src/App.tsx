import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/AppShell";
import { BegurCopilot } from "@/components/BegurCopilot";
import Dashboard from "./pages/Dashboard";
import Solicitacoes from "./pages/Solicitacoes";
import Entregas from "./pages/Entregas";
import EntregaDetail from "./pages/EntregaDetail";
import OcorrenciasPage from "./pages/OcorrenciasPage";
import Relatorios from "./pages/Relatorios";
import EntregadorApp from "./pages/EntregadorApp";
import ClientePortal from "./pages/ClientePortal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [copilotOpen, setCopilotOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Standalone views (no shell) */}
            <Route path="/entregador" element={<EntregadorApp />} />
            <Route path="/portal" element={<ClientePortal />} />
            
            {/* Main app with shell */}
            <Route path="*" element={
              <AppShell onAiOpen={() => setCopilotOpen(true)}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/solicitacoes" element={<Solicitacoes />} />
                  <Route path="/entregas" element={<Entregas />} />
                  <Route path="/entregas/:id" element={<EntregaDetail />} />
                  <Route path="/ocorrencias" element={<OcorrenciasPage />} />
                  <Route path="/relatorios" element={<Relatorios />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AppShell>
            } />
          </Routes>
          <BegurCopilot open={copilotOpen} onClose={() => setCopilotOpen(false)} />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
