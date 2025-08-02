import React, { useState } from 'react';

const LearnPresentTense = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [flippedCards, setFlippedCards] = useState({});

  const sections = [
    'intro',
    'formation', 
    'endings',
    'examples',
    'quiz',
    'practice'
  ];

  const quizzes = [
    {
      question: "What is the correct present tense form: 'I eat'?",
      options: [
        "अहम् खादति",
        "अहम् खादामि ✅",
        "अहम् खादन्ति"
      ],
      correct: 1,
      explanation: "First person singular uses -आमि ending. अहम् खादामि = I eat"
    },
    {
      question: "Translate: 'They (3+) go'",
      options: [
        "ते गच्छति",
        "ते गच्छतः", 
        "ते गच्छन्ति ✅"
      ],
      correct: 2,
      explanation: "Third person plural uses -अन्ति ending. ते गच्छन्ति = They go"
    },
    {
      question: "What is 'You both read' in Sanskrit?",
      options: [
        "युवाम् पठति",
        "युवाम् पठथः ✅",
        "युवाम् पठन्ति"
      ],
      correct: 1,
      explanation: "Second person dual uses -थः ending. युवाम् पठथः = You both read"
    }
  ];

  const endingsData = [
    {
      person: "प्रथम पुरुषः (3rd Person)",
      singular: "-ति (गच्छति)",
      dual: "-तः (गच्छतः)", 
      plural: "-अन्ति (गच्छन्ति)"
    },
    {
      person: "मध्यम पुरुषः (2nd Person)",
      singular: "-सि (गच्छसि)",
      dual: "-थः (गच्छथः)",
      plural: "-थ (गच्छथ)"
    },
    {
      person: "उत्तम पुरुषः (1st Person)",
      singular: "-आमि (गच्छामि)",
      dual: "-आवः (गच्छावः)",
      plural: "-आमः (गच्छामः)"
    }
  ];

  const verbExamples = [
    { root: "गम् (to go)", forms: ["गच्छति", "गच्छसि", "गच्छामि"] },
    { root: "खाद् (to eat)", forms: ["खादति", "खादसि", "खादामि"] },
    { root: "पठ् (to read)", forms: ["पठति", "पठसि", "पठामि"] },
    { root: "लिख् (to write)", forms: ["लिखति", "लिखसि", "लिखामि"] },
    { root: "दृश् (to see)", forms: ["पश्यति", "पश्यसि", "पश्यामि"] },
    { root: "कृ (to do)", forms: ["करोति", "करोषि", "करोमि"] }
  ];

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ff8a50 0%, #ff6b35 25%, #f7931e 50%, #ffb347 75%, #daa520 100%)',
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px'
    },
    title: {
      color: 'white',
      fontSize: '2rem',
      fontWeight: '700',
      marginBottom: '10px',
      textShadow: '3px 3px 6px rgba(0, 0, 0, 0.4)'
    },
    subtitle: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: '1.2rem',
      fontWeight: '500',
      marginBottom: '20px'
    },
    progressBar: {
      width: '100%',
      maxWidth: '600px',
      height: '8px',
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      borderRadius: '4px',
      margin: '0 auto 20px',
      overflow: 'hidden'
    },
    progress: {
      height: '100%',
      background: 'linear-gradient(90deg, #4CAF50, #8BC34A)',
      borderRadius: '4px',
      transition: 'width 0.3s ease',
      width: `${((currentSection + 1) / sections.length) * 100}%`
    },
    navigation: {
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
      marginBottom: '30px'
    },
    navButton: {
      padding: '8px 16px',
      borderRadius: '20px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '500',
      transition: 'all 0.3s ease'
    },
    activeNavButton: {
      background: 'white',
      color: '#ff6b35'
    },
    inactiveNavButton: {
      background: 'rgba(255, 255, 255, 0.3)',
      color: 'white'
    },
    contentCard: {
      maxWidth: '900px',
      margin: '0 auto',
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '20px',
      padding: '30px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(20px)'
    },
    sectionTitle: {
      color: '#8b4513',
      fontSize: '1.8rem',
      fontWeight: '700',
      marginBottom: '20px',
      textAlign: 'center'
    },
    keyRule: {
      background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
      color: 'white',
      padding: '15px 20px',
      borderRadius: '15px',
      textAlign: 'center',
      fontSize: '1.1rem',
      fontWeight: '600',
      marginBottom: '20px',
      boxShadow: '0 8px 16px rgba(76, 175, 80, 0.3)'
    },
    exampleBox: {
      background: 'linear-gradient(45deg, #ff6b35, #ff8a50)',
      color: 'white',
      padding: '20px',
      borderRadius: '15px',
      textAlign: 'center',
      fontSize: '1.5rem',
      fontWeight: '600',
      marginBottom: '20px',
      boxShadow: '0 8px 16px rgba(255, 107, 53, 0.3)'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '20px',
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
    },
    tableHeader: {
      background: 'linear-gradient(45deg, #8b4513, #a0522d)',
      color: 'white',
      padding: '15px',
      textAlign: 'center',
      fontWeight: '600'
    },
    tableCell: {
      padding: '12px 15px',
      textAlign: 'center',
      borderBottom: '1px solid #f0f0f0',
      fontSize: '1.1rem'
    },
    oddRow: {
      backgroundColor: '#f9f9f9'
    },
    evenRow: {
      backgroundColor: 'white'
    },
    flipCard: {
      width: '180px',
      height: '140px',
      margin: '10px',
      perspective: '1000px',
      cursor: 'pointer'
    },
    flipCardInner: {
      position: 'relative',
      width: '100%',
      height: '100%',
      textAlign: 'center',
      transition: 'transform 0.6s',
      transformStyle: 'preserve-3d'
    },
    flipCardFront: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backfaceVisibility: 'hidden',
      background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
      color: 'white',
      borderRadius: '15px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1rem',
      fontWeight: '600',
      boxShadow: '0 8px 16px rgba(76, 175, 80, 0.3)',
      padding: '10px'
    },
    flipCardBack: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backfaceVisibility: 'hidden',
      transform: 'rotateY(180deg)',
      background: 'linear-gradient(45deg, #ff6b35, #ff8a50)',
      color: 'white',
      borderRadius: '15px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.95rem',
      fontWeight: '600',
      boxShadow: '0 8px 16px rgba(255, 107, 53, 0.3)',
      padding: '10px'
    },
    cardsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '10px',
      marginBottom: '20px'
    },
    quizContainer: {
      marginBottom: '20px'
    },
    quizQuestion: {
      fontSize: '1.3rem',
      fontWeight: '600',
      color: '#8b4513',
      marginBottom: '15px',
      textAlign: 'center'
    },
    optionButton: {
      display: 'block',
      width: '100%',
      padding: '12px 20px',
      margin: '8px 0',
      border: '2px solid #ddd',
      borderRadius: '10px',
      background: 'white',
      cursor: 'pointer',
      fontSize: '1.1rem',
      transition: 'all 0.3s ease',
      textAlign: 'left'
    },
    correctOption: {
      background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
      color: 'white',
      borderColor: '#4CAF50'
    },
    incorrectOption: {
      background: 'linear-gradient(45deg, #f44336, #ff5722)',
      color: 'white',
      borderColor: '#f44336'
    },
    explanation: {
      background: 'rgba(76, 175, 80, 0.1)',
      padding: '15px',
      borderRadius: '10px',
      marginTop: '15px',
      borderLeft: '4px solid #4CAF50'
    },
    navigationButtons: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '30px'
    },
    navBtn: {
      padding: '12px 24px',
      border: 'none',
      borderRadius: '25px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      background: 'linear-gradient(45deg, #8b4513, #a0522d)',
      color: 'white'
    },
    tip: {
      background: 'linear-gradient(45deg, #2196F3, #03A9F4)',
      color: 'white',
      padding: '12px 16px',
      borderRadius: '10px',
      margin: '10px 0',
      fontSize: '0.95rem',
      fontWeight: '500'
    },
    formulaBox: {
      background: 'linear-gradient(45deg, #9C27B0, #E91E63)',
      color: 'white',
      padding: '20px',
      borderRadius: '15px',
      textAlign: 'center',
      fontSize: '1.3rem',
      fontWeight: '600',
      marginBottom: '20px',
      boxShadow: '0 8px 16px rgba(156, 39, 176, 0.3)'
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
      fontWeight: '500',
      marginBottom: '20px'
    }
  };

  const handleCardFlip = (index) => {
    setFlippedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleQuizAnswer = (optionIndex, isCorrect) => {
    setQuizAnswer(optionIndex);
    setShowAnswer(true);
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

  const handleBackToDashboard = () => {
    window.location.href = '/dashboard';
  };

  const renderIntroSection = () => (
    <div>
      <h2 style={styles.sectionTitle}>⏰ Present Tense - वर्तमान काल</h2>
      <div style={styles.keyRule}>
        📖 Present Tense = Actions happening RIGHT NOW<br/>
        ➡️ In Sanskrit: <strong>वर्तमान काल (Vartamāna Kāla)</strong>
      </div>
      <div style={styles.tip}>
        🎯 <strong>Key Memory Aid:</strong> "Right now, at this very moment!" (Think: <strong>Present = Now</strong>)
      </div>
      <div style={styles.exampleBox}>
        अहम् पुस्तकम् पठामि।
        <br/>
        <small style={{fontSize: '1rem', opacity: 0.9}}>
          I am reading a book (right now)
        </small>
      </div>
    </div>
  );

  const renderFormationSection = () => (
    <div>
      <h2 style={styles.sectionTitle}>🔧 How to Form Present Tense</h2>
      <div style={styles.formulaBox}>
        Verb Root + Present Stem + Person Ending = Present Tense
        <br/>
        <small style={{fontSize: '1rem', opacity: 0.9}}>
          धातु + वर्तमान स्टेम + पुरुष प्रत्यय = वर्तमान काल
        </small>
      </div>
      
      <div style={styles.tip}>
        📝 <strong>Step 1:</strong> Take the verb root (धातु) - like गम् (to go)
      </div>
      <div style={styles.tip}>
        📝 <strong>Step 2:</strong> Add present stem - गम् becomes गच्छ्
      </div>
      <div style={styles.tip}>
        📝 <strong>Step 3:</strong> Add person ending - गच्छ् + आमि = गच्छामि (I go)
      </div>
      
      <div style={styles.exampleBox}>
        गम् → गच्छ् → गच्छामि
        <br/>
        <small style={{fontSize: '1rem', opacity: 0.9}}>
          Root → Present Stem → I go
        </small>
      </div>
    </div>
  );

  const renderEndingsSection = () => (
    <div>
      <h2 style={styles.sectionTitle}>📊 Present Tense Endings</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Person (पुरुष)</th>
            <th style={styles.tableHeader}>Singular (एकवचन)</th>
            <th style={styles.tableHeader}>Dual (द्विवचन)</th>
            <th style={styles.tableHeader}>Plural (बहुवचन)</th>
          </tr>
        </thead>
        <tbody>
          {endingsData.map((row, index) => (
            <tr key={index} style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
              <td style={styles.tableCell}><strong>{row.person}</strong></td>
              <td style={styles.tableCell}>{row.singular}</td>
              <td style={styles.tableCell}>{row.dual}</td>
              <td style={styles.tableCell}>{row.plural}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={styles.tip}>
        ✅ <strong>Memory Trick:</strong> 1st person has 'आ' • 2nd person has 'स्/थ' • 3rd person has 'त्'
      </div>
    </div>
  );

  const renderExamplesSection = () => (
    <div>
      <h2 style={styles.sectionTitle}>💡 Common Verb Examples</h2>
      <div style={styles.cardsContainer}>
        {verbExamples.map((verb, index) => (
          <div key={index} style={styles.flipCard} onClick={() => handleCardFlip(index)}>
            <div style={{
              ...styles.flipCardInner,
              transform: flippedCards[index] ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}>
              <div style={styles.flipCardFront}>
                <strong>{verb.root}</strong>
                <br/>
                <small>Click to see forms</small>
              </div>
              <div style={styles.flipCardBack}>
                <div style={{fontSize: '0.85rem', lineHeight: '1.4'}}>
                  <strong>3rd:</strong> {verb.forms[0]}<br/>
                  <strong>2nd:</strong> {verb.forms[1]}<br/>
                  <strong>1st:</strong> {verb.forms[2]}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={styles.tip}>
        💡 <strong>Tip:</strong> Notice the pattern! Same endings work for all verbs • Just change the stem
      </div>
    </div>
  );

  const renderQuizSection = () => (
    <div>
      <h2 style={styles.sectionTitle}>🎮 Test Your Knowledge</h2>
      {quizzes.map((quiz, quizIndex) => (
        <div key={quizIndex} style={styles.quizContainer}>
          <div style={styles.quizQuestion}>
            Quiz {quizIndex + 1}: {quiz.question}
          </div>
          {quiz.options.map((option, optionIndex) => (
            <button
              key={optionIndex}
              style={{
                ...styles.optionButton,
                ...(showAnswer && optionIndex === quiz.correct ? styles.correctOption : {}),
                ...(showAnswer && quizAnswer === optionIndex && optionIndex !== quiz.correct ? styles.incorrectOption : {})
              }}
              onClick={() => handleQuizAnswer(optionIndex, optionIndex === quiz.correct)}
              disabled={showAnswer}
            >
              {option.replace(' ✅', '')}
            </button>
          ))}
          {showAnswer && (
            <div style={styles.explanation}>
              <strong>Explanation:</strong> {quiz.explanation}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderPracticeSection = () => (
    <div>
      <h2 style={styles.sectionTitle}>🎉 Excellent Progress!</h2>
      <div style={styles.keyRule}>
        ✅ <strong>You've Learned Present Tense!</strong><br/>
        Now you can express actions happening right now in Sanskrit!
      </div>
      
      <div style={styles.exampleBox}>
        Practice Sentences:
        <br/>
        <div style={{fontSize: '1.2rem', marginTop: '10px', lineHeight: '1.6'}}>
          अहम् गृहम् गच्छामि। (I go home)<br/>
          त्वम् पुस्तकम् पठसि। (You read a book)<br/>
          सः मित्रम् पश्यति। (He sees a friend)
        </div>
      </div>
      
      <div style={styles.tip}>
        🎯 <strong>Next Steps:</strong> Practice with more verbs • Learn past tense • Try compound sentences!
      </div>
      
      <div style={styles.tip}>
        📚 <strong>Pro Tip:</strong> Regular practice makes perfect! Try to form 5 sentences daily using present tense.
      </div>
    </div>
  );

  const renderCurrentSection = () => {
    switch(sections[currentSection]) {
      case 'intro': return renderIntroSection();
      case 'formation': return renderFormationSection();
      case 'endings': return renderEndingsSection();
      case 'examples': return renderExamplesSection();
      case 'quiz': return renderQuizSection();
      case 'practice': return renderPracticeSection();
      default: return renderIntroSection();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Sanskrit Present Tense</h1>
        <p style={styles.subtitle}>वर्तमान काल - Actions Happening Now</p>
        
        <button 
          style={styles.backButton}
          onMouseEnter={handleButtonHover}
          onMouseLeave={handleButtonLeave}
          onClick={handleBackToDashboard}
        >
          ← Back to Dashboard
        </button>
        
        <div style={styles.progressBar}>
          <div style={styles.progress}></div>
        </div>

        <div style={styles.navigation}>
          {['Intro', 'Formation', 'Endings', 'Examples', 'Quiz', 'Practice'].map((label, index) => (
            <button
              key={index}
              style={{
                ...styles.navButton,
                ...(currentSection === index ? styles.activeNavButton : styles.inactiveNavButton)
              }}
              onClick={() => {
                setCurrentSection(index);
                setShowAnswer(false);
                setQuizAnswer('');
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.contentCard}>
        {renderCurrentSection()}
        
        <div style={styles.navigationButtons}>
          <button
            style={{
              ...styles.navBtn,
              opacity: currentSection === 0 ? 0.5 : 1
            }}
            onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
            disabled={currentSection === 0}
          >
            ← Previous
          </button>
          
          <button
            style={{
              ...styles.navBtn,
              opacity: currentSection === sections.length - 1 ? 0.5 : 1
            }}
            onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
            disabled={currentSection === sections.length - 1}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearnPresentTense;