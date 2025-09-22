// --- ERROR FIX: Corrected relative import paths from '../' to './' ---
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import ResourcesPage from "./pages/ResourcesPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import TeachingModulesPage from "./pages/TeachingModulesPage";
import ModuleDetailPage from "./pages/ModuleDetailPage";
import GamePage from "./pages/GamePage";
import RewardPageDemo from "./pages/RewardPageDemo";
import EcoScanPage from "./pages/EcoScanPage";
import WordSearchGame from "./pages/WordSearchGame";
import HangmanGame from "./pages/HangmanGame";
import QuizPage from "./pages/QuizPage";
import CrosswordGame from "./pages/CrosswordGame";
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
            <Route path="/sus-game/module/:moduleId" element={<ModuleDetailPage />} />
            <Route path="/sus-game/teaching" element={<TeachingModulesPage />} />
            <Route path="/sus-game/leaderboard" element={<LeaderboardPage />} />
            <Route path="/sus-game/game/:questId" element={<GamePage />} />
            <Route path="/sus-game/eco-scan" element={<EcoScanPage />} />
            <Route path="/sus-game/game/hangman" element={<HangmanGame />} />
            <Route path="/sus-game/game/word-search" element={<WordSearchGame/>}/>
            <Route path="/sus-game/game/crossword" element={<CrosswordGame/>}/>
            <Route path="/sus-game/game/quiz" element={<QuizPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="/sus-game/*" element={<NotFound />} />
            <Route path="/sus-game/rewards-demo" element={<RewardPageDemo />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
