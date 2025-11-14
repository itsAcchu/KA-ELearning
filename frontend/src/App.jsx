import { Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Layout
import MainLayout from "./components/layout/MainLayout";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Learn from "./pages/Learn";
import Lesson from "./pages/Lesson";
import Dashboard from "./pages/Dashboard";
import Chatbot from "./pages/Chatbot";
import VoiceCoach from "./pages/VoiceCoachEnhanced";
import ARScanner from "./pages/ARScanner";
import Stories from "./pages/Stories";
import StoryReader from "./pages/StoryReader";
import Achievements from "./pages/Achievements";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import VoiceGuru from "./pages/VoiceGuru";
import BattleRoyale from "./pages/BattleRoyale";
import TeachingMarketplace from "./pages/TeachingMarketplace";

// Hooks
import { useAuthStore } from "./store/authStore";

function App() {
  const { isAuthenticated } = useAuthStore();

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes with Layout */}
        <Route element={<MainLayout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn"
            element={
              <ProtectedRoute>
                <Learn />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lesson/:id"
            element={
              <ProtectedRoute>
                <Lesson />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chatbot"
            element={
              <ProtectedRoute>
                <Chatbot />
              </ProtectedRoute>
            }
          />
          <Route
            path="/voice-coach"
            element={
              <ProtectedRoute>
                <VoiceCoach />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ar-scanner"
            element={
              <ProtectedRoute>
                <ARScanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stories"
            element={
              <ProtectedRoute>
                <Stories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/story/:id"
            element={
              <ProtectedRoute>
                <StoryReader />
              </ProtectedRoute>
            }
          />
          <Route
            path="/achievements"
            element={
              <ProtectedRoute>
                <Achievements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/voice-guru"
            element={
              <ProtectedRoute>
                <VoiceGuru />
              </ProtectedRoute>
            }
          />
          <Route
            path="/battle-royale"
            element={
              <ProtectedRoute>
                <BattleRoyale />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teaching-marketplace"
            element={
              <ProtectedRoute>
                <TeachingMarketplace />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
