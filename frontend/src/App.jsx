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
import VoiceCoach from "./pages/VoiceCoach";
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
      return <Navigate to="/login" />;
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

        {/* Public Stories */}
        <Route path="/stories" element={<Stories />} />
        <Route path="/stories/:id" element={<StoryReader />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="learn" element={<Learn />} />
          <Route path="lesson/:lessonId" element={<Lesson />} />
          <Route path="chatbot" element={<Chatbot />} />
          <Route path="voice-coach" element={<VoiceCoach />} />
          <Route path="ar-scanner" element={<ARScanner />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="voice-guru" element={<VoiceGuru />} />
          <Route path="battle" element={<BattleRoyale />} />
          <Route path="marketplace" element={<TeachingMarketplace />} />
         
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
