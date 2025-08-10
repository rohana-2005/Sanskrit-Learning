import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LoginRequiredPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const FloatingElement = ({ delay, duration, size, left, top, opacity = 0.1 }) => {
    const driftX = Math.random() * 60 - 30;
    const driftY = Math.random() * 60 - 30;
    return (
      <div
        className="floating-element"
        style={{
          '--delay': delay,
          '--duration': duration,
          '--size': size,
          '--left': left,
          '--top': top,
          '--opacity': opacity,
          '--drift-x': `${driftX}px`,
          '--drift-y': `${driftY}px`,
        }}
      />
    );
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@300;400;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Noto Sans Devanagari', sans-serif;
      overflow-x: hidden;
    }

    .error-container {
      position: relative;
      width: 100vw;
      height: 100vh;
      background: linear-gradient(135deg, #A0522D 0%, #8B4513 25%, #DAA520 50%, #CD853F 75%, #F5DEB3 100%);
      background-size: 400% 400%;
      animation: gradientShift 12s ease infinite;
      overflow: hidden;
    }

    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .back-button {
      position: absolute;
      top: 2rem;
      left: 2rem;
      z-index: 20;
      animation: fadeInDown 1s ease 0.3s both;
    }

    .back-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.6rem 1.2rem;
      background: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
      border-radius: 25px;
      font-weight: 500;
      font-size: 0.9rem;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
    }

    .back-link:hover {
      background: rgba(255, 255, 255, 0.2);
      color: #fff;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 255, 255, 0.1);
    }

    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .floating-element {
      position: absolute;
      width: var(--size);
      height: var(--size);
      left: var(--left);
      top: var(--top);
      background: linear-gradient(45deg, rgba(218, 165, 32, var(--opacity)), rgba(240, 230, 140, var(--opacity)));
      border-radius: 50%;
      animation: float-drift var(--duration) ease-in-out infinite;
      animation-delay: var(--delay);
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 32px rgba(218, 165, 32, 0.2);
    }

    @keyframes float-drift {
      0% {
        transform: translate(0px, 0px) rotate(0deg);
      }
      25% {
        transform: translate(var(--drift-x), calc(var(--drift-y) * 0.5)) rotate(90deg);
      }
      50% {
        transform: translate(calc(var(--drift-x) * 0.7), var(--drift-y)) rotate(180deg);
      }
      75% {
        transform: translate(calc(var(--drift-x) * 0.3), calc(var(--drift-y) * 0.7)) rotate(270deg);
      }
      100% {
        transform: translate(0px, 0px) rotate(360deg);
      }
    }

    .parallax-bg {
      position: absolute;
      inset: 0;
      background: 
        radial-gradient(circle at 20% 80%, rgba(160, 82, 45, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(218, 165, 32, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(245, 222, 179, 0.2) 0%, transparent 50%);
      transform: translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px);
      transition: transform 0.3s ease;
    }

    .main-content {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      z-index: 10;
      transform: ${isLoaded ? 'translateY(0)' : 'translateY(50px)'};
      opacity: ${isLoaded ? 1 : 0};
      transition: all 1.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .error-container-glass {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border-radius: 18px;
      padding: 3rem 2rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 18px 36px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.22);
      transform: perspective(1000px) rotateX(5deg);
      transition: all 0.5s ease;
      position: relative;
      overflow: hidden;
      max-width: 500px;
      width: 90%;
    }

    .error-container-glass:hover {
      transform: perspective(1000px) rotateX(0deg) scale(1.02);
      box-shadow: 0 28px 56px rgba(0, 0, 0, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.28);
    }

    .error-container-glass::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s ease;
    }

    .error-container-glass:hover::before {
      left: 100%;
    }

    .lock-icon {
      font-size: 4rem;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 1.5rem;
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 0.8; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.05); }
    }

    .error-title {
      font-size: clamp(2rem, 5vw, 3rem);
      font-weight: 700;
      color: #fff;
      margin-bottom: 1rem;
      text-shadow: 0 0 20px rgba(218, 165, 32, 0.8), 0 0 40px rgba(218, 165, 32, 0.6);
      animation: titleGlow 3s ease-in-out infinite alternate;
      letter-spacing: 0.05em;
    }

    @keyframes titleGlow {
      from { text-shadow: 0 0 20px rgba(218, 165, 32, 0.8), 0 0 40px rgba(218, 165, 32, 0.6); }
      to { text-shadow: 0 0 30px rgba(218, 165, 32, 1), 0 0 50px rgba(218, 165, 32, 0.8); }
    }

    .error-message {
      font-size: clamp(1rem, 2vw, 1.2rem);
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 2.5rem;
      line-height: 1.6;
      max-width: 400px;
      animation: fadeInUp 1s ease 0.5s both;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .login-button {
      display: inline-block;
      padding: 1rem 2rem;
      background: linear-gradient(135deg, #DAA520, #CD853F);
      color: #fff;
      text-decoration: none;
      border-radius: 40px;
      font-weight: 600;
      font-size: 1.1rem;
      letter-spacing: 0.02em;
      transition: all 0.3s ease;
      box-shadow: 0 10px 30px rgba(218, 165, 32, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
      position: relative;
      overflow: hidden;
      animation: fadeInUp 1s ease 1s both;
      margin-bottom: 1rem;
    }

    .login-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.5s ease;
    }

    .login-button:hover::before {
      left: 100%;
    }

    .login-button:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 40px rgba(218, 165, 32, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.4);
    }

    .signup-text {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.7);
      animation: fadeInUp 1s ease 1.2s both;
    }

    .signup-link {
      color: rgba(218, 165, 32, 0.9);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s ease;
    }

    .signup-link:hover {
      color: #DAA520;
      text-shadow: 0 0 10px rgba(218, 165, 32, 0.5);
    }

    .decorative-elements {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 1;
    }

    .lotus-pattern {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 800px;
      height: 800px;
      background: radial-gradient(circle, rgba(218, 165, 32, 0.1) 0%, transparent 70%);
      border-radius: 50%;
      animation: rotate 30s linear infinite;
      z-index: 0;
    }

    @keyframes rotate {
      from { transform: translate(-50%, -50%) rotate(0deg); }
      to { transform: translate(-50%, -50%) rotate(360deg); }
    }

    .particle {
      position: absolute;
      width: 4px;
      height: 4px;
      background: rgba(218, 165, 32, 0.8);
      border-radius: 50%;
      animation: particle-float 6s ease-in-out infinite;
    }

    @keyframes particle-float {
      0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0; }
      50% { transform: translateY(-100px) translateX(50px); opacity: 1; }
    }

    @media (max-width: 768px) {
      .error-container-glass { 
        padding: 2rem 1.5rem; 
        margin: 0 1rem; 
        max-width: 95vw; 
      }
      .error-title { font-size: clamp(1.5rem, 6vw, 2.2rem); }
      .error-message { font-size: clamp(0.9rem, 3vw, 1.1rem); }
      .login-button { 
        padding: 0.8rem 1.5rem; 
        font-size: 1rem; 
      }
      .back-button {
        top: 1rem;
        left: 1rem;
      }
      .lock-icon { font-size: 3rem; }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="error-container">
        <div className="parallax-bg" />
        
        {/* Back button */}
        <div className="back-button">
          <Link to="/" className="back-link">
            ← Back to Home
          </Link>
        </div>
        
        <div className="lotus-pattern" />
        
        <div className="decorative-elements">
          <FloatingElement delay="0s" duration="3s" size="80px" left="10%" top="20%" opacity={0.15} />
          <FloatingElement delay="1s" duration="4s" size="60px" left="85%" top="15%" opacity={0.12} />
          <FloatingElement delay="2s" duration="3.5s" size="100px" left="15%" top="70%" opacity={0.1} />
          <FloatingElement delay="3s" duration="5s" size="50px" left="80%" top="75%" opacity={0.18} />
          <FloatingElement delay="4s" duration="3.2s" size="70px" left="50%" top="10%" opacity={0.13} />
          <FloatingElement delay="5s" duration="4.5s" size="90px" left="75%" top="50%" opacity={0.11} />
          
          {/* Particle effects */}
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2.5 + Math.random() * 2.5}s`
              }}
            />
          ))}
        </div>

        <div className="main-content">
          <div className="error-container-glass">
            <div className="lock-icon">🔒</div>
            <h1 className="error-title">Login to Proceed</h1>
            <p className="error-message">
              Access to this sacred knowledge requires authentication. 
              Please login to continue your journey through the treasures of Sanskrit wisdom.
            </p>
            <Link to="/login" className="login-button">
              Login Now
            </Link>
            <p className="signup-text">
              Don't have an account? <Link to="/signup" className="signup-link">Sign up here</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginRequiredPage;