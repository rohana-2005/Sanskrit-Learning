import React, { useState } from "react";
import "./login_signup.css";
import { useNavigate } from "react-router-dom";
import { authAPI, tokenManager } from "../services/api";

export const LoginSignup = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setMessage("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (message) setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isLogin) {
        const { email, password } = formData;
        if (!email || !password) {
          throw new Error("Please fill in all fields");
        }

        console.log("Attempting login with:", { email });
        const { token, user } = await authAPI.login({ email, password });
        console.log("Login response:", { token, user });
        tokenManager.setToken(token);
        localStorage.setItem("user", JSON.stringify(user));

        setMessage("Login successful! Welcome back.");
        setMessageType("success");

        setTimeout(() => {
          if (onLogin) onLogin();
          navigate("/hero");
        }, 1000);
      } else {
        const { fullName, email, password, confirmPassword } = formData;
        if (!fullName || !email || !password || !confirmPassword) {
          throw new Error("Please fill in all fields");
        }
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }

        console.log("Attempting registration with:", { fullName, email });
        const { token, user } = await authAPI.register({
          fullName,
          email,
          password,
        });
        console.log("Register response:", { token, user });
        tokenManager.setToken(token);
        localStorage.setItem("user", JSON.stringify(user));

        setMessage(
          "Registration successful! Welcome to Sanskrit Learning System."
        );
        setMessageType("success");

        setTimeout(() => {
          if (onLogin) onLogin();
          navigate("/hero");
        }, 1000);
      }
    } catch (error) {
      console.error(
        "Authentication error:",
        error.response?.data || error.message
      );
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "An error occurred. Please try again."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-wrapper">
        <div className="form-toggle">
          <button
            className={`toggle-btn ${isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`toggle-btn ${!isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <div className="header">
          <div className="text">
            {isLogin ? "Welcome Back" : "Create Account"}
          </div>
          <div className="underline"></div>
        </div>

        <div className="form">
          {message && <div className={`message ${messageType}`}>{message}</div>}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="field">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}
            <div className="field">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="field">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            {!isLogin && (
              <div className="field">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}

            {isLogin && (
              <div className="forgot-password">
                <a href="#">Forgot Password?</a>
              </div>
            )}

            <div className="field btn">
              <div className="btn-layer"></div>
              <input
                type="submit"
                value={
                  loading ? "Processing..." : isLogin ? "Login" : "Sign Up"
                }
                disabled={loading}
              />
            </div>
          </form>

          <div className="switch-form">
            {isLogin ? (
              <p>
                Don't have an account?{" "}
                <span onClick={toggleForm}>Sign up here</span>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <span onClick={toggleForm}>Login here</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
