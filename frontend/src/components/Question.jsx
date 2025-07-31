import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Questions() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [excitementLevel, setExcitementLevel] = useState(5);

  const questions = [
    {
      id: 'experience',
      question: 'Have you studied Sanskrit before?',
      type: 'yesno',
      options: ['Yes', 'No']
    },
    {
      id: 'devanagari',
      question: 'Can you read the Devanagari script?',
      type: 'yesno',
      options: ['Yes', 'No']
    },
    {
      id: 'bhagavadgita',
      question: 'Did you know the Bhagavad Gita was originally written in Sanskrit?',
      type: 'yesno',
      options: ['Yes', 'No']
    },
    {
      id: 'purpose',
      question: 'Are you learning Sanskrit for school, college, or as a teacher?',
      type: 'multiple',
      options: ['School', 'College', 'As a Teacher']
    },
    {
      id: 'shlokas',
      question: 'Have you heard or recited any Sanskrit shlokas before?',
      type: 'yesno',
      options: ['Yes', 'No']
    },
    {
      id: 'excitement',
      question: 'How excited are you to begin your Sanskrit journey?',
      type: 'range',
      min: 1,
      max: 10
    }
  ];

  const styles = {
    container: {
      minHeight: '100vh',
      height: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #6F1D1B 0%, #C5975A 50%, #F4E4A6 100%)',
      padding: '0',
      margin: '0',
      fontFamily: 'Arial, sans-serif',
      overflowY: 'auto',
      position: 'fixed',
      top: '0',
      left: '0',
      scrollBehavior: 'smooth',
      WebkitOverflowScrolling: 'touch'
    },
    questionsContainer: {
      maxWidth: '100%',
      margin: '0 auto',
      padding: '80px 15px 15px 15px',
      height: '100%',
      overflowY: 'auto',
      scrollBehavior: 'smooth',
      WebkitOverflowScrolling: 'touch',
      scrollPaddingTop: '20px',
      scrollPaddingBottom: '20px'
    },
    questionCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '15px',
      padding: '20px',
      margin: '20px 0',
      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      minHeight: '100px',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: 'translateY(0)',
      animation: 'slideInFromBottom 0.6s ease-out'
    },
    questionCardLeft: {
      flexDirection: 'row',
      marginLeft: '5%',
      marginRight: '40%'
    },
    questionCardRight: {
      flexDirection: 'row-reverse',
      marginLeft: '40%',
      marginRight: '5%'
    },
    avatar: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #C5975A, #F4E4A6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '28px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
      border: '3px solid #6F1D1B',
      flexShrink: 0,
      transition: 'all 0.3s ease',
      animation: 'bounceIn 0.8s ease-out'
    },
    questionContent: {
      flex: 1,
      textAlign: 'left'
    },
    questionText: {
      fontSize: '1rem',
      color: '#6F1D1B',
      marginBottom: '15px',
      fontWeight: 'bold',
      lineHeight: '1.3',
      animation: 'fadeInUp 0.8s ease-out 0.2s both'
    },
    optionsContainer: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
      animation: 'fadeInUp 0.8s ease-out 0.4s both'
    },
    option: {
      backgroundColor: '#F4E4A6',
      border: '2px solid #C5975A',
      borderRadius: '10px',
      padding: '8px 16px',
      fontSize: '0.9rem',
      color: '#6F1D1B',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      fontWeight: 'bold',
      position: 'relative',
      overflow: 'hidden'
    },
    optionHover: {
      backgroundColor: '#C5975A',
      color: 'white',
      transform: 'translateY(-3px) scale(1.05)',
      boxShadow: '0 8px 25px rgba(197, 151, 90, 0.4)',
      borderColor: '#6F1D1B'
    },
    selectedOption: {
      backgroundColor: '#6F1D1B',
      color: 'white',
      borderColor: '#8B4513',
      transform: 'scale(1.05)',
      boxShadow: '0 6px 20px rgba(111, 29, 27, 0.4)'
    },
    rangeContainer: {
      width: '100%',
      maxWidth: '250px',
      animation: 'fadeInUp 0.8s ease-out 0.4s both'
    },
    rangeSlider: {
      width: '100%',
      height: '8px',
      borderRadius: '4px',
      background: 'linear-gradient(to right, #F4E4A6, #C5975A, #6F1D1B)',
      outline: 'none',
      cursor: 'pointer',
      margin: '15px 0',
      transition: 'all 0.3s ease',
      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
    },
    rangeValue: {
      fontSize: '1rem',
      color: '#6F1D1B',
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: '8px',
      transition: 'all 0.3s ease'
    },
    rangeLabels: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.75rem',
      color: '#8B4513',
      marginTop: '5px'
    },
    progressBar: {
      position: 'fixed',
      top: '15px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '80%',
      maxWidth: '600px',
      height: '20px',
      background: 'rgba(255,255,255,0.2)',
      borderRadius: '25px',
      zIndex: 9999,
      animation: 'slideInFromTop 0.5s ease-out',
      border: '2px solid rgba(197, 151, 90, 0.3)',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      backdropFilter: 'blur(10px)',
      pointerEvents: 'none'
    },
    progressFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #6F1D1B, #C5975A, #F4E4A6)',
      borderRadius: '25px',
      transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'visible',
      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
    },
    progressEmoji: {
      position: 'absolute',
      top: '-8px',
      left: '0px',
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #C5975A, #F4E4A6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      border: '3px solid #6F1D1B',
      transition: 'left 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 10000,
      animation: 'bounceIn 0.8s ease-out',
      pointerEvents: 'auto'
    },
    completeCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '15px',
      padding: '30px',
      margin: '20px 0',
      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
      textAlign: 'center',
      animation: 'scaleIn 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: 'scale(1)'
    },
    completeAvatar: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #C5975A, #F4E4A6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '40px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
      border: '3px solid #6F1D1B',
      margin: '0 auto 20px',
      animation: 'bounceIn 1s ease-out 0.3s both'
    },
    completeTitle: {
      fontSize: '1.5rem',
      color: '#6F1D1B',
      marginBottom: '15px',
      fontWeight: 'bold',
      animation: 'fadeInUp 0.8s ease-out 0.5s both'
    },
    completeMessage: {
      fontSize: '1rem',
      color: '#8B4513',
      marginBottom: '20px',
      lineHeight: '1.5',
      animation: 'fadeInUp 0.8s ease-out 0.7s both'
    },
    startButton: {
      backgroundColor: '#6F1D1B',
      color: 'white',
      border: 'none',
      padding: '12px 30px',
      fontSize: '1rem',
      borderRadius: '20px',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
      fontWeight: 'bold',
      position: 'relative',
      overflow: 'hidden',
      animation: 'fadeInUp 0.8s ease-out 0.9s both'
    }
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    
    // Add celebration effect to progress emoji
    const progressEmoji = document.querySelector('.progress-emoji');
    if (progressEmoji) {
      progressEmoji.classList.add('celebrating');
      setTimeout(() => {
        progressEmoji.classList.remove('celebrating');
      }, 800);
    }
    
    // Enhanced auto-scroll to next question after answering
    setTimeout(() => {
      const currentIndex = questions.findIndex(q => q.id === questionId);
      const nextIndex = currentIndex + 1;
      
      if (nextIndex < questions.length) {
        const nextQuestion = document.getElementById(`question-${nextIndex}`);
        if (nextQuestion) {
          nextQuestion.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          });
          
          // Add a subtle highlight effect to the next question
          nextQuestion.style.transition = 'all 0.3s ease';
          nextQuestion.style.transform = 'scale(1.02)';
          nextQuestion.style.boxShadow = '0 12px 40px rgba(197, 151, 90, 0.3)';
          
          setTimeout(() => {
            nextQuestion.style.transform = 'scale(1)';
            nextQuestion.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
          }, 800);
        }
      } else {
        // If all questions answered, scroll to completion card with enhanced effect
        setTimeout(() => {
          const completeCard = document.getElementById('complete-card');
          if (completeCard) {
            completeCard.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center',
              inline: 'nearest'
            });
            
            // Add celebration effect to completion card
            completeCard.style.transition = 'all 0.5s ease';
            completeCard.style.transform = 'scale(1.05)';
            completeCard.style.boxShadow = '0 20px 60px rgba(197, 151, 90, 0.4)';
            
            setTimeout(() => {
              completeCard.style.transform = 'scale(1)';
              completeCard.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
            }, 1000);
          }
        }, 600);
      }
    }, 400); // Slightly longer delay for better UX
  };

  const isQuestionAnswered = (questionId) => {
    return answers.hasOwnProperty(questionId);
  };

  const getExcitementText = (level) => {
    if (level <= 3) return 'Just getting started';
    if (level <= 6) return 'Moderately excited';
    if (level <= 8) return 'Very excited';
    return 'Extremely excited!';
  };

  const allQuestionsAnswered = questions.every(q => isQuestionAnswered(q.id));
  const progress = (Object.keys(answers).length / questions.length) * 100;

  return (
    <div style={styles.container}>
      <style>
        {`
          /* Enhanced smooth scrolling */
          html {
            scroll-behavior: smooth;
          }
          
          /* Ensure progress bar stays fixed */
          .progress-bar-container {
            position: fixed !important;
            top: 15px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            z-index: 9999 !important;
            pointer-events: none;
          }
          
          .progress-emoji {
            transform: translateX(-50%);
            pointer-events: auto;
          }
          
          /* Custom scrollbar for better UX */
          .questions-container::-webkit-scrollbar {
            width: 8px;
          }
          
          .questions-container::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
          }
          
          .questions-container::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #C5975A, #6F1D1B);
            border-radius: 4px;
            transition: all 0.3s ease;
          }
          
          .questions-container::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, #6F1D1B, #C5975A);
            transform: scale(1.1);
          }
          
          /* Scroll snap for better positioning */
          .question-card {
            scroll-margin-top: 20px;
            scroll-margin-bottom: 20px;
          }
          
          /* Enhanced focus states for accessibility */
          .option-button:focus {
            outline: 2px solid #C5975A;
            outline-offset: 2px;
            transform: translateY(-2px) scale(1.02);
          }
          
          /* Smooth transitions for all interactive elements */
          * {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          @keyframes slideInFromBottom {
            from {
              opacity: 0;
              transform: translateY(50px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slideInFromTop {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
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
          
          @keyframes bounceIn {
            0% {
              opacity: 0;
              transform: scale(0.3);
            }
            50% {
              opacity: 1;
              transform: scale(1.05);
            }
            70% {
              transform: scale(0.9);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
          
          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.8);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          .question-card:hover {
            transform: translateY(-5px) !important;
            box-shadow: 0 15px 35px rgba(0,0,0,0.15) !important;
          }
          
          .avatar:hover {
            animation: pulse 0.6s ease-in-out;
            transform: scale(1.1);
          }
          
          .option-button {
            position: relative;
            overflow: hidden;
          }
          
          .option-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            transition: left 0.5s;
          }
          
          .option-button:hover::before {
            left: 100%;
          }
          
          .progress-fill::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            animation: shimmer 2s infinite;
          }
          
          .progress-emoji {
            animation: bounceIn 0.8s ease-out;
          }
          
          .progress-emoji:hover {
            animation: pulse 0.6s ease-in-out;
            transform: scale(1.1);
          }
          
          @keyframes progressCelebration {
            0% { transform: scale(1) rotate(0deg); }
            25% { transform: scale(1.2) rotate(-5deg); }
            50% { transform: scale(1.1) rotate(5deg); }
            75% { transform: scale(1.2) rotate(-5deg); }
            100% { transform: scale(1) rotate(0deg); }
          }
          
          .progress-emoji.celebrating {
            animation: progressCelebration 0.8s ease-in-out;
          }
        `}
      </style>
      
      <div style={styles.progressBar} className="progress-bar-container">
        <div style={{...styles.progressFill, width: `${progress}%`}} className="progress-fill">
          <div 
            style={{
              ...styles.progressEmoji,
              left: `${progress}%`
            }}
            className="progress-emoji"
          >
            👵
          </div>
        </div>
      </div>
      
      <div style={styles.questionsContainer} className="questions-container">
        {questions.map((q, index) => (
          <div 
            key={q.id}
            id={`question-${index}`}
            className="question-card"
            style={{
              ...styles.questionCard,
              ...(index % 2 === 0 ? styles.questionCardLeft : styles.questionCardRight)
            }}
          >
            <div style={styles.avatar} className="avatar">
              👵
            </div>
            
            <div style={styles.questionContent}>
              <div style={styles.questionText}>
                {q.question}
              </div>
              
              {q.type === 'yesno' && (
                <div style={styles.optionsContainer}>
                  {q.options.map(option => (
                    <button
                      key={option}
                      className="option-button"
                      style={{
                        ...styles.option,
                        ...(answers[q.id] === option ? styles.selectedOption : {})
                      }}
                      onClick={() => handleAnswer(q.id, option)}
                      onMouseOver={(e) => {
                        if (answers[q.id] !== option) {
                          Object.assign(e.target.style, styles.optionHover);
                        }
                      }}
                      onMouseOut={(e) => {
                        if (answers[q.id] !== option) {
                          e.target.style.backgroundColor = '#F4E4A6';
                          e.target.style.color = '#6F1D1B';
                          e.target.style.transform = 'translateY(0) scale(1)';
                          e.target.style.boxShadow = 'none';
                          e.target.style.borderColor = '#C5975A';
                        }
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
              
              {q.type === 'multiple' && (
                <div style={styles.optionsContainer}>
                  {q.options.map(option => (
                    <button
                      key={option}
                      className="option-button"
                      style={{
                        ...styles.option,
                        ...(answers[q.id] === option ? styles.selectedOption : {})
                      }}
                      onClick={() => handleAnswer(q.id, option)}
                      onMouseOver={(e) => {
                        if (answers[q.id] !== option) {
                          Object.assign(e.target.style, styles.optionHover);
                        }
                      }}
                      onMouseOut={(e) => {
                        if (answers[q.id] !== option) {
                          e.target.style.backgroundColor = '#F4E4A6';
                          e.target.style.color = '#6F1D1B';
                          e.target.style.transform = 'translateY(0) scale(1)';
                          e.target.style.boxShadow = 'none';
                          e.target.style.borderColor = '#C5975A';
                        }
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
              
              {q.type === 'range' && (
                <div style={styles.rangeContainer}>
                  <input
                    type="range"
                    min={q.min}
                    max={q.max}
                    value={answers[q.id] || excitementLevel}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      setExcitementLevel(value);
                      handleAnswer(q.id, value);
                    }}
                    style={styles.rangeSlider}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'scale(1.02)';
                      e.target.style.boxShadow = 'inset 0 2px 8px rgba(0,0,0,0.2)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.1)';
                    }}
                  />
                  <div style={styles.rangeValue}>
                    {getExcitementText(answers[q.id] || excitementLevel)}
                  </div>
                  <div style={styles.rangeLabels}>
                    <span>Not excited</span>
                    <span>Very excited</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {allQuestionsAnswered && (
          <div id="complete-card" style={styles.completeCard}>
            <div style={styles.completeAvatar}>
              👵
            </div>
            <h2 style={styles.completeTitle}>
              Wonderful! 🎉
            </h2>
            <p style={styles.completeMessage}>
              Thank you for sharing your background with me, dear student! 
              I now understand your learning journey better. Let's begin your 
              Sanskrit adventure with lessons tailored just for you!
            </p>
          
            <Link to="/login" style={styles.startButton} className="option-button">
              Begin My Sanskrit Journey! 🕉️
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}