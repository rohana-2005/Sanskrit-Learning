import React from 'react';
import { Link } from 'react-router-dom';

const Learn = () => {
  const grammarTopics = [
    {
      title: "Sanskrit Sentence Structure",
      subtitle: "→S-O-V differentiate",
      category: "structure",
      icon: "📝",
      link: "/learn-sentences"
    },
    {
      title: "Subject Forms",
      subtitle: "Prathama Vibhakti",
      category: "forms",
      icon: "👤",
      link: "/learn-subject"
    },
    {
      title: "Object Forms", 
      subtitle: "Dvitiya Vibhakti",
      category: "forms",
      icon: "🎯",
      link: "/learn-object"
    },
    {
      title: "Present Tense",
      subtitle: "वर्तमान काल",
      category: "tense",
      icon: "⏰",
      link: "/learn-present-tense"
    },
    {
      title: "Past Tense",
      subtitle: "भूत काल",
      category: "tense",
      icon: "⏪",
      link: "/learn-past-tense"
    },
    {
      title: "Future Tense",
      subtitle: "भविष्यत् काल",
      category: "tense",
      icon: "⏩",
      link: "/learn-future-tense"
    }
  ];

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ff8a50 0%, #ff6b35 25%, #f7931e 50%, #ffb347 75%, #daa520 100%)',
      padding: '15px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      margin: 0,
      boxSizing: 'border-box',
      overflow: 'hidden'
    },
    header: {
      textAlign: 'center',
      marginBottom: '25px'
    },
    sanskritTitle: {
      color: 'white',
      fontSize: '1.6rem',
      fontWeight: '700',
      marginBottom: '10px',
      textShadow: '3px 3px 6px rgba(0, 0, 0, 0.4)',
      letterSpacing: '1px'
    },
    pageTitle: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      marginBottom: '15px'
    },
    icon: {
      fontSize: '1.2rem',
      filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
    },
    titleText: {
      color: 'white',
      fontSize: '1.4rem',
      fontWeight: '600',
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
      margin: 0
    },
    backButton: {
      background: 'linear-gradient(45deg, #8b4513, #a0522d)',
      color: 'white',
      border: 'none',
      padding: '8px 18px',
      borderRadius: '20px',
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 15px rgba(139, 69, 19, 0.3)',
      fontWeight: '500'
    },
    grammarSection: {
      maxWidth: '1000px',
      margin: '0 auto',
      height: 'calc(100vh - 160px)'
    },
    grammarGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '18px',
      padding: '10px',
      height: '100%',
      alignItems: 'stretch'
    },
    grammarCard: {
      background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85))',
      border: '2px solid rgba(139, 69, 19, 0.3)',
      borderRadius: '16px',
      padding: '18px 15px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(20px)',
      position: 'relative',
      overflow: 'hidden',
      textAlign: 'center',
      transformStyle: 'preserve-3d',
      textDecoration: 'none'
    },
    cardIcon: {
      fontSize: '2rem',
      marginBottom: '8px',
      filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))',
      transform: 'translateZ(20px)'
    },
    cardTitle: {
      color: '#8b4513',
      fontSize: '1rem',
      fontWeight: '700',
      marginBottom: '6px',
      lineHeight: '1.2',
      position: 'relative',
      zIndex: 1,
      margin: '0 0 6px 0',
      textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
    },
    cardSubtitle: {
      color: '#a0522d',
      fontSize: '0.8rem',
      fontWeight: '500',
      lineHeight: '1.3',
      position: 'relative',
      zIndex: 1,
      margin: 0,
      opacity: 0.9
    },
    structureCard: {
      borderLeft: '4px solid #ff6347',
      background: 'linear-gradient(145deg, rgba(255, 99, 71, 0.05), rgba(255, 255, 255, 0.9))'
    },
    formsCard: {
      borderLeft: '4px solid #ff8c00',
      background: 'linear-gradient(145deg, rgba(255, 140, 0, 0.05), rgba(255, 255, 255, 0.9))'
    },
    tenseCard: {
      borderLeft: '4px solid #ffd700',
      background: 'linear-gradient(145deg, rgba(255, 215, 0, 0.05), rgba(255, 255, 255, 0.9))'
    },
    glowEffect: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '100%',
      height: '100%',
      background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)',
      transform: 'translate(-50%, -50%) scale(0)',
      transition: 'transform 0.6s ease-out',
      borderRadius: '50%',
      pointerEvents: 'none'
    }
  };

  const handleCardHover = (e) => {
    const card = e.currentTarget;
    card.style.transform = 'translateY(-10px) rotateX(5deg) scale(1.02)';
    card.style.boxShadow = '0 20px 40px rgba(139, 69, 19, 0.2)';
    card.style.borderColor = 'rgba(139, 69, 19, 0.6)';
    
    const glowElement = card.querySelector('.glow-effect');
    if (glowElement) {
      glowElement.style.transform = 'translate(-50%, -50%) scale(1)';
    }
  };

  const handleCardLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = 'translateY(0) rotateX(0deg) scale(1)';
    card.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
    card.style.borderColor = 'rgba(139, 69, 19, 0.3)';
    
    const glowElement = card.querySelector('.glow-effect');
    if (glowElement) {
      glowElement.style.transform = 'translate(-50%, -50%) scale(0)';
    }
  };

  const handleButtonHover = (e) => {
    e.target.style.background = 'linear-gradient(45deg, #a0522d, #cd853f)';
    e.target.style.transform = 'translateY(-2px) scale(1.05)';
    e.target.style.boxShadow = '0 8px 25px rgba(139, 69, 19, 0.4)';
  };

  const handleButtonLeave = (e) => {
    e.target.style.background = 'linear-gradient(45deg, #8b4513, #a0522d)';
    e.target.style.transform = 'translateY(0) scale(1)';
    e.target.style.boxShadow = '0 4px 15px rgba(139, 69, 19, 0.3)';
  };

  const getCardStyle = (category) => {
    const baseStyle = { ...styles.grammarCard };
    
    if (category === 'structure') {
      return { ...baseStyle, ...styles.structureCard };
    } else if (category === 'forms') {
      return { ...baseStyle, ...styles.formsCard };
    } else if (category === 'tense') {
      return { ...baseStyle, ...styles.tenseCard };
    }
    
    return baseStyle;
  };

  // Responsive adjustments
  const mediaQuery = window.matchMedia('(max-width: 768px)');
  const mobileQuery = window.matchMedia('(max-width: 480px)');
  
  if (mobileQuery.matches) {
    styles.grammarGrid.gridTemplateColumns = 'repeat(2, 1fr)';
    styles.grammarGrid.gap = '12px';
    styles.sanskritTitle.fontSize = '1.3rem';
    styles.titleText.fontSize = '1.1rem';
    styles.grammarCard.padding = '15px 10px';
    styles.cardTitle.fontSize = '0.9rem';
    styles.cardSubtitle.fontSize = '0.7rem';
    styles.cardIcon.fontSize = '1.5rem';
  } else if (mediaQuery.matches) {
    styles.grammarGrid.gridTemplateColumns = 'repeat(2, 1fr)';
    styles.grammarGrid.gap = '15px';
    styles.sanskritTitle.fontSize = '1.4rem';
    styles.titleText.fontSize = '1.2rem';
    styles.grammarCard.padding = '16px 12px';
    styles.cardTitle.fontSize = '0.95rem';
    styles.cardSubtitle.fontSize = '0.75rem';
    styles.cardIcon.fontSize = '1.7rem';
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.pageTitle}>
          <span style={styles.icon}>📚</span>
          <h2 style={styles.titleText}>Learning Modules</h2>
        </div>
        <button 
          style={styles.backButton}
          onMouseEnter={handleButtonHover}
          onMouseLeave={handleButtonLeave}
        >
          ← Back to Dashboard
        </button>
      </header>

      <section style={styles.grammarSection}>
        <div style={styles.grammarGrid}>
          {grammarTopics.map((topic, index) => (
            <Link 
              key={index} 
              to={topic.link}
              style={getCardStyle(topic.category)}
              onMouseEnter={handleCardHover}
              onMouseLeave={handleCardLeave}
            >
              <div className="glow-effect" style={styles.glowEffect}></div>
              <div style={styles.cardIcon}>{topic.icon}</div>
              <h3 style={styles.cardTitle}>{topic.title}</h3>
              {topic.subtitle && <p style={styles.cardSubtitle}>{topic.subtitle}</p>}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Learn;
