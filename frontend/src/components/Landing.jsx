import React, { useState, useEffect } from 'react';
import HeroSection from './HeroSection';
import { Link } from 'react-router-dom';

const Landing = ({ onBegin }) => {
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

  const handleBeginClick = (e) => {
    e.preventDefault();
    if (onBegin) {
      onBegin();
    } else {
      const target = document.getElementById('explore');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const FloatingElement = ({ delay, duration, size, left, top, opacity = 0.1 }) => {
    // Generate random drift for each circle
    const driftX = Math.random() * 60 - 30; // -30px to +30px
    const driftY = Math.random() * 60 - 30; // -30px to +30px
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

    .landing-container {
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

    .glass-container {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border-radius: 18px;
      padding: 2rem 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 18px 36px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.22);
      transform: perspective(1000px) rotateX(5deg);
      transition: all 0.5s ease;
      position: relative;
      overflow: hidden;
      max-width: 480px;
    }

    .glass-container:hover {
      transform: perspective(1000px) rotateX(0deg) scale(1.05);
      box-shadow: 0 28px 56px rgba(0, 0, 0, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.28);
    }

    .glass-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s ease;
    }

    .glass-container:hover::before {
      left: 100%;
    }

    .main-title {
      font-size: clamp(2.2rem, 6vw, 4.5rem);
      font-weight: 700;
      color: #fff;
      margin-bottom: 1rem;
      text-shadow: 0 0 20px rgba(218, 165, 32, 0.8), 0 0 40px rgba(218, 165, 32, 0.6), 0 0 60px rgba(218, 165, 32, 0.4);
      animation: titleGlow 3s ease-in-out infinite alternate;
      letter-spacing: 0.1em;
      position: relative;
    }

    @keyframes titleGlow {
      from { text-shadow: 0 0 20px rgba(218, 165, 32, 0.8), 0 0 40px rgba(218, 165, 32, 0.6), 0 0 60px rgba(218, 165, 32, 0.4); }
      to { text-shadow: 0 0 30px rgba(218, 165, 32, 1), 0 0 50px rgba(218, 165, 32, 0.8), 0 0 80px rgba(218, 165, 32, 0.6); }
    }

    .subtitle {
      font-size: clamp(1.1rem, 2.5vw, 1.3rem);
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 1.2rem;
      font-weight: 300;
      letter-spacing: 0.05em;
      animation: fadeInUp 1s ease 0.5s both;
    }

    .description {
      font-size: clamp(0.95rem, 1.8vw, 1.1rem);
      color: rgba(255, 255, 255, 0.8);
      max-width: 320px;
      line-height: 1.5;
      margin-bottom: 1.2rem;
      animation: fadeInUp 1s ease 1s both;
      margin-left: 45px;
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

    .cta-button {
      display: inline-block;
      padding: 0.7rem 1.5rem;
      background: linear-gradient(135deg, #DAA520, #CD853F);
      color: #fff;
      text-decoration: none;
      border-radius: 40px;
      font-weight: 600;
      font-size: 1rem;
      letter-spacing: 0.02em;
      transition: all 0.3s ease;
      box-shadow: 0 10px 30px rgba(218, 165, 32, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
      position: relative;
      overflow: hidden;
      animation: fadeInUp 1s ease 1.5s both;
    }

    .cta-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.5s ease;
    }

    .cta-button:hover::before {
      left: 100%;
    }

    .cta-button:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 40px rgba(218, 165, 32, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.4);
    }

    .decorative-elements {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 1;
    }

    .scroll-indicator {
      position: absolute;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.9rem;
      animation: bounce 2s infinite;
    }

    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
      40% { transform: translateX(-50%) translateY(-10px); }
      60% { transform: translateX(-50%) translateY(-5px); }
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
      .glass-container { padding: 1.2rem 0.7rem; margin: 0 0.5rem; max-width: 98vw; }
      .main-title { font-size: clamp(1.2rem, 4vw, 2.2rem); }
      .subtitle { font-size: clamp(0.9rem, 2vw, 1.1rem); }
      .description { font-size: clamp(0.8rem, 1.2vw, 0.95rem); }
    }
  `;

  return (
    <>
    <section style={{ height: "100vh", position: "relative", zIndex: 1 }}>
      <style>{styles}</style>
      <div className="landing-container">
        <div className="parallax-bg" />
        
        <div className="lotus-pattern" />
        
        <div className="decorative-elements">
          <FloatingElement delay="0s" duration="3s" size="80px" left="10%" top="20%" opacity={0.15} />
          <FloatingElement delay="1s" duration="4s" size="60px" left="85%" top="15%" opacity={0.12} />
          <FloatingElement delay="2s" duration="3.5s" size="100px" left="15%" top="70%" opacity={0.1} />
          <FloatingElement delay="3s" duration="5s" size="50px" left="80%" top="75%" opacity={0.18} />
          <FloatingElement delay="4s" duration="3.2s" size="70px" left="50%" top="10%" opacity={0.13} />
          <FloatingElement delay="5s" duration="4.5s" size="90px" left="75%" top="50%" opacity={0.11} />
          
          {/* Particle effects */}
          {[...Array(20)].map((_, i) => (
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
          <div className="glass-container">
            <h1 className="main-title">संस्कृतमणिः</h1>
            <p className="subtitle">The Jewel of Sanskrit</p>
            <p className="description">
              Discover the timeless beauty and profound wisdom of Sanskrit - the language of ancient knowledge, 
              spiritual enlightenment, and cultural heritage. Journey through the sacred texts and unlock 
              the treasures of this divine language.
            </p>
            <Link to="/questions" className="cta-button"> Begin</Link>
          </div>
        </div>

        
      </div>
      </section>
    </>
  );
};

export default Landing;