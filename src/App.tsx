import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { Layout } from "./components/Layout";

// --- Page Imports ---
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import ResourcesPage from "./pages/ResourcesPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import TeachingModulesPage from "./pages/TeachingModulesPage";
import ModuleDetailPage from "./pages/ModuleDetailPage";
import GamePage from "./pages/GamePage";
import EcoScanPage from "./pages/EcoScanPage";
import HangmanGame from "./pages/HangmanGame"; // Import HangmanGame
import CrosswordGame from "./pages/CrosswordGame"; // Import CrosswordGame
import QuizPage from "./pages/QuizPage"; // Import QuizPage
import WordSearchGame from "./pages/WordSearchGame"; // Import WordSearchGame
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/sus-game/">
        <AuthProvider>
          <UserProvider>
            <Routes>
              {/* The Layout route wraps all pages that share the main header and footer */}
              <Route element={<Layout />}>
                 <Route index element={<HomePage />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="resources" element={<ResourcesPage />} />
                <Route path="leaderboard" element={<LeaderboardPage />} />
                <Route path="teaching" element={<TeachingModulesPage />} />
                <Route path="module/:moduleId" element={<ModuleDetailPage />} />
                <Route path="eco-scan" element={<EcoScanPage />} />
                <Route path="hangman" element={<HangmanGame />} />
                <Route path="crossword" element={<CrosswordGame />} />
                <Route path="quiz" element={<QuizPage />} />
                <Route path="wordsearch" element={<WordSearchGame />} /> {/* Add route for WordSearchGame */}
                <Route path="game/:questId" element={<GamePage />} /> {/* GamePage now uses the Layout */}
                <Route path="quest" element={<DashboardPage />} /> {/* Redirect /quest to DashboardPage */}
              </Route>

              {/* A catch-all for any routes that don't match */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </UserProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
