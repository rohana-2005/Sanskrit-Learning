import Dashboard from "./components/Dashboard";
import HeroSection from "./components/HeroSection";
import Landing from "./components/Landing";
import Questions from "./components/Question";
import { LoginSignup } from "./components/login_signup";
import DragDropGame from "./components/DragDropGame";
import { ParallaxProvider } from "react-scroll-parallax";
import React, { useRef, useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { tokenManager } from "./services/api";
import TenseGame from "./components/TenseGame";
import VerbGame from "./components/VerbGame";
import ShabdaFusion from "./components/ShabdaFusion";
import SankhyaTrivia from "./components/SankhyaTrivia";
import LearningModule from "./components/LearningModule";
import Learn from "./components/Learn";
import LearnObject from "./components/Learn_object";
import LearnSanskritSentence from "./components/Learn_Sentence_Structure"; 
import LearnPresentTense from "./components/Learn_present_tense";

// Fixed brand header component
function BrandHeader() {
  return (
    <div
      style={{
        position: "fixed",
        top: "15px",
        left: "20px",
        zIndex: 2000,
        fontSize: "2rem",
        fontWeight: "bold",
        color: "white",
        fontFamily: "'Noto Serif Devanagari', serif",
        backgroundColor: "rgba(203, 148, 66, 0.8)",
        padding: "4px 12px",
        borderRadius: "5px",
        // boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      संस्कृतमणिः
    </div>
  );
}

// Authentication wrapper component
function AuthWrapper() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = tokenManager.isAuthenticated();
      setIsAuthenticated(isAuth);
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    tokenManager.removeToken();
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #d2691e 0%, #cd853f 25%, #daa520 50%, #b8860b 75%, #a0522d 100%)",
          color: "white",
          fontSize: "1.2rem",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <>
    <BrandHeader />
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/questions" element={<Questions />} />
      <Route path="/login" element={<LoginSignup onLogin={handleLogin} />} />
      <Route path="/tense-game" element={<TenseGame />} />
      <Route path="/verb-game" element={<VerbGame />} />
      <Route path="/shabda-fusion" element={<ShabdaFusion />} />
      <Route path="/sankhya-trivia" element={<SankhyaTrivia />} />
      <Route path="/learning-module" element={<LearningModule />} />
      <Route path="/learn" element={<Learn />} />
      <Route path="/learn-object" element={<LearnObject />} />
      <Route path="/learn-sentences" element={<LearnSanskritSentence />} />
    
      <Route path="/learn-present-tense" element={<LearnPresentTense />} />

      {/* Protected Routes */}
      <Route
        path="/hero-dashboard"
        element={
          isAuthenticated ? (
            <HeroSectionWithButton onLogout={handleLogout} />
          ) : (
            <LoginSignup onLogin={handleLogin} />
          )
        }
      />
      <Route
        path="/hero"
        element={
          isAuthenticated ? (
            <HeroSectionWithButton onLogout={handleLogout} />
          ) : (
            <LoginSignup onLogin={handleLogin} />
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <DashboardWithNavigation onLogout={handleLogout} />
          ) : (
            <LoginSignup onLogin={handleLogin} />
          )
        }
      />

      <Route
        path="/game"
        element={
          isAuthenticated ? (
            <DragDropGame onLogout={handleLogout} />
          ) : (
            <LoginSignup onLogin={handleLogin} />
          )
        }
      />
      <Route
        path="/tensegame"
        element={
          isAuthenticated ? (
            <TenseGame />
          ) : (
            <LoginSignup onLogin={handleLogin} />
          )
        }
      />
    </Routes>
    </>
  );
}

// Dashboard with navigation buttons
function DashboardWithNavigation({ onLogout }) {
  const navigate = useNavigate();

  return (
    <div style={{ position: "relative" }}>
      <Dashboard />
      {/* Navigation buttons */}
      <div
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <button
          onClick={onLogout}
          style={{
            padding: "10px 20px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "25px",
            fontSize: "14px",
            cursor: "pointer",
            boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

// Modified HeroSection with button to navigate to game
function HeroSectionWithButton({ onLogout }) {
  const navigate = useNavigate();

  return (
    <div style={{ position: "relative" }}>
      <HeroSection />
      {/* Floating button to start game */}
      <div
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <button
          onClick={onLogout}
          style={{
            padding: "10px 20px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "25px",
            fontSize: "14px",
            cursor: "pointer",
            boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthWrapper />
    </BrowserRouter>
  );
}

export default App;
