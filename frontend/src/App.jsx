import Dashboard from "./components/Dashboard";
import HeroSection from "./components/HeroSection";
import Landing from "./components/Landing";
import Questions from "./components/Question";
import { LoginSignup } from "./components/login_signup";
import DragDropGame from "./components/DragDropGame";
import { ParallaxProvider } from "react-scroll-parallax";
import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
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
import LearnSubject from "./components/LearnSubject";
import LearnFutureTense from "./components/LearnFutureTense";
import LearnPastTense from "./components/LearnPastTense";
import LoginRequiredPage from "./components/LoginRequiredPage";

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
        <Route path="/learning-module" element={<LearningModule />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/learn-object" element={<LearnObject />} />
        <Route path="/learn-sentences" element={<LearnSanskritSentence />} />
        <Route path="/learn-subject" element={<LearnSubject />} />
        <Route path="/learn-present-tense" element={<LearnPresentTense />} />
        <Route path="/learn-past-tense" element={<LearnPastTense />} />
        <Route path="/learn-future-tense" element={<LearnFutureTense />} />
        <Route path="/login-required" element={<LoginRequiredPage />} />
        <Route path="/hero" element={<HeroSection />} />
        <Route path="/hero-dashboard" element={<HeroSection />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Protected Routes */}
        <Route
          path="/game"
          element={
            isAuthenticated ? (
              <DragDropGame onLogout={handleLogout} />
            ) : (
              <LoginRequiredPage />
            )
          }
        />
        <Route
          path="/tense-game"
          element={
            isAuthenticated ? (
              <TenseGame />
            ) : (
              <LoginRequiredPage />
            )
          }
        />
        <Route
          path="/verb-game"
          element={
            isAuthenticated ? (
              <VerbGame />
            ) : (
              <LoginRequiredPage />
            )
          }
        />
        <Route
          path="/shabda-fusion"
          element={
            isAuthenticated ? (
              <ShabdaFusion />
            ) : (
              <LoginRequiredPage />
            )
          }
        />
        <Route
          path="/sankhya-trivia"
          element={
            isAuthenticated ? (
              <SankhyaTrivia />
            ) : (
              <LoginRequiredPage />
            )
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ParallaxProvider>
        <AuthWrapper />
      </ParallaxProvider>
    </BrowserRouter>
  );
}

export default App;