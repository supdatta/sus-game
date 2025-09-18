import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import ResourcesPage from "./pages/ResourcesPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import TeachingModulesPage from "./pages/TeachingModulesPage";
import GamePage from "./pages/GamePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/sus-game/" element={<HomePage />} />
            <Route path="/sus-game/dashboard" element={<DashboardPage />} />
            <Route path="/sus-game/resources" element={<ResourcesPage />} />
            <Route path="/sus-game/teaching" element={<TeachingModulesPage />} />
            <Route path="/sus-game/leaderboard" element={<LeaderboardPage />} />
            <Route path="/sus-game/game/:questId" element={<GamePage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="/sus-game/*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
