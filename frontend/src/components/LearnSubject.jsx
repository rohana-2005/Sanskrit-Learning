import React, { useState } from "react";

const LearnSubject = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [flippedCards, setFlippedCards] = useState({});

  const sections = [
    "intro",
    "example",
    "endings",
    "pronouns",
    "quiz",
    "practice",
  ];

  const quizzes = [
    {
      question: "Translate: Rama reads",
      options: ["रामम् पठति", "रामः पठति ✅", "रामे पठति"],
      correct: 1,
      explanation: "रामः is the subject (doer), so it takes Prathama Vibhakti",
    },
    {
      question: "Sita sings",
      options: ["सीताम् गायति", "सीता गायति ✅", "सीते गायति"],
      correct: 1,
      explanation: "सीता is the subject, so it stays in its Prathama form",
    },
  ];

  const endingsData = [
    {
      type: "Masculine -a",
      singular: "देवः",
      dual: "देवौ",
      plural: "देवाः",
    },
    {
      type: "Feminine -ā",
      singular: "माला",
      dual: "माले",
      plural: "मालाः",
    },
    {
      type: "Neuter -a",
      singular: "वनम्",
      dual: "वने",
      plural: "वनानि",
    },
  ];

  const pronounData = [
    { meaning: "I", form: "अहम्" },
    { meaning: "We (2)", form: "आवाम्" },
    { meaning: "We (3+)", form: "वयम्" },
    { meaning: "You (1)", form: "त्वम्" },
    { meaning: "You (2)", form: "युवाम्" },
    { meaning: "You (3+)", form: "यूयम्" },
  ];

  const styles = {
    container: {
      minHeight: "100vh",
      background:
        "linear-gradient(135deg, #ff8a50 0%, #ff6b35 25%, #f7931e 50%, #ffb347 75%, #daa520 100%)",
      padding: "20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
      textAlign: "center",
      marginBottom: "30px",
    },
    title: {
      color: "white",
      fontSize: "2rem",
      fontWeight: "700",
      marginBottom: "10px",
      textShadow: "3px 3px 6px rgba(0, 0, 0, 0.4)",
    },
    subtitle: {
      color: "rgba(255, 255, 255, 0.9)",
      fontSize: "1.2rem",
      fontWeight: "500",
      marginBottom: "20px",
    },
    progressBar: {
      width: "100%",
      maxWidth: "600px",
      height: "8px",
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      borderRadius: "4px",
      margin: "0 auto 20px",
      overflow: "hidden",
    },
    progress: {
      height: "100%",
      background: "linear-gradient(90deg, #4CAF50, #8BC34A)",
      borderRadius: "4px",
      transition: "width 0.3s ease",
      width: `${((currentSection + 1) / sections.length) * 100}%`,
    },
    navigation: {
      display: "flex",
      justifyContent: "center",
      gap: "10px",
      marginBottom: "30px",
    },
    navButton: {
      padding: "8px 16px",
      borderRadius: "20px",
      border: "none",
      cursor: "pointer",
      fontSize: "0.9rem",
      fontWeight: "500",
      transition: "all 0.3s ease",
    },
    activeNavButton: {
      background: "white",
      color: "#ff6b35",
    },
    inactiveNavButton: {
      background: "rgba(255, 255, 255, 0.3)",
      color: "white",
    },
    contentCard: {
      maxWidth: "900px",
      margin: "0 auto",
      background: "rgba(255, 255, 255, 0.95)",
      borderRadius: "20px",
      padding: "30px",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
      backdropFilter: "blur(20px)",
    },
    sectionTitle: {
      color: "#8b4513",
      fontSize: "1.8rem",
      fontWeight: "700",
      marginBottom: "20px",
      textAlign: "center",
    },
    keyRule: {
      background: "linear-gradient(45deg, #4CAF50, #8BC34A)",
      color: "white",
      padding: "15px 20px",
      borderRadius: "15px",
      textAlign: "center",
      fontSize: "1.1rem",
      fontWeight: "600",
      marginBottom: "20px",
      boxShadow: "0 8px 16px rgba(76, 175, 80, 0.3)",
    },
    exampleBox: {
      background: "linear-gradient(45deg, #ff6b35, #ff8a50)",
      color: "white",
      padding: "20px",
      borderRadius: "15px",
      textAlign: "center",
      fontSize: "1.5rem",
      fontWeight: "600",
      marginBottom: "20px",
      boxShadow: "0 8px 16px rgba(255, 107, 53, 0.3)",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px",
      borderRadius: "10px",
      overflow: "hidden",
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
    },
    tableHeader: {
      background: "linear-gradient(45deg, #8b4513, #a0522d)",
      color: "white",
      padding: "15px",
      textAlign: "center",
      fontWeight: "600",
    },
    tableCell: {
      padding: "12px 15px",
      textAlign: "center",
      borderBottom: "1px solid #f0f0f0",
      fontSize: "1.1rem",
    },
    oddRow: {
      backgroundColor: "#f9f9f9",
    },
    evenRow: {
      backgroundColor: "white",
    },
    flipCard: {
      width: "200px",
      height: "120px",
      margin: "10px",
      perspective: "1000px",
      cursor: "pointer",
    },
    flipCardInner: {
      position: "relative",
      width: "100%",
      height: "100%",
      textAlign: "center",
      transition: "transform 0.6s",
      transformStyle: "preserve-3d",
    },
    flipCardFront: {
      position: "absolute",
      width: "100%",
      height: "100%",
      backfaceVisibility: "hidden",
      background: "linear-gradient(45deg, #4CAF50, #8BC34A)",
      color: "white",
      borderRadius: "15px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.1rem",
      fontWeight: "600",
      boxShadow: "0 8px 16px rgba(76, 175, 80, 0.3)",
    },
    flipCardBack: {
      position: "absolute",
      width: "100%",
      height: "100%",
      backfaceVisibility: "hidden",
      transform: "rotateY(180deg)",
      background: "linear-gradient(45deg, #ff6b35, #ff8a50)",
      color: "white",
      borderRadius: "15px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.1rem",
      fontWeight: "600",
      boxShadow: "0 8px 16px rgba(255, 107, 53, 0.3)",
    },
    cardsContainer: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "10px",
      marginBottom: "20px",
    },
    quizContainer: {
      marginBottom: "20px",
    },
    quizQuestion: {
      fontSize: "1.3rem",
      fontWeight: "600",
      color: "#8b4513",
      marginBottom: "15px",
      textAlign: "center",
    },
    optionButton: {
      display: "block",
      width: "100%",
      padding: "12px 20px",
      margin: "8px 0",
      border: "2px solid #ddd",
      borderRadius: "10px",
      background: "white",
      cursor: "pointer",
      fontSize: "1.1rem",
      transition: "all 0.3s ease",
      textAlign: "left",
    },
    correctOption: {
      background: "linear-gradient(45deg, #4CAF50, #8BC34A)",
      color: "white",
      borderColor: "#4CAF50",
    },
    incorrectOption: {
      background: "linear-gradient(45deg, #f44336, #ff5722)",
      color: "white",
      borderColor: "#f44336",
    },
    explanation: {
      background: "rgba(76, 175, 80, 0.1)",
      padding: "15px",
      borderRadius: "10px",
      marginTop: "15px",
      borderLeft: "4px solid #4CAF50",
    },
    navigationButtons: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "30px",
    },
    navBtn: {
      padding: "12px 24px",
      border: "none",
      borderRadius: "25px",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: "600",
      transition: "all 0.3s ease",
      background: "linear-gradient(45deg, #8b4513, #a0522d)",
      color: "white",
    },
    tip: {
      background: "linear-gradient(45deg, #2196F3, #03A9F4)",
      color: "white",
      padding: "12px 16px",
      borderRadius: "10px",
      margin: "10px 0",
      fontSize: "0.95rem",
      fontWeight: "500",
    },
  };

  const handleCardFlip = (index) => {
    setFlippedCards((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleQuizAnswer = (optionIndex) => {
    setQuizAnswer(optionIndex);
    setShowAnswer(true);
  };

  const renderIntroSection = () => (
    <div>
      <h2 style={styles.sectionTitle}>🎯 What is a Subject?</h2>
      <div style={styles.keyRule}>
        📖 Rule: Subject = Doer of the action
        <br />
        ➡️ In Sanskrit, this means the subject must be in{" "}
        <strong>Prathama Vibhakti</strong>
      </div>
      <div style={styles.tip}>
        🎯 <strong>Memory Tip:</strong> "Subject → Action → Prathama!"
      </div>
    </div>
  );

  const renderExampleSection = () => (
    <div>
      <h2 style={styles.sectionTitle}>📝 Visual Example</h2>
      <div style={styles.exampleBox}>
        <span
          style={{
            color: "#ffff00",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          रामः
        </span>{" "}
        पठति।
        <br />
        <small style={{ fontSize: "1rem", opacity: 0.9 }}>
          Rama reads. (रामः is the subject → Prathama Vibhakti)
        </small>
      </div>
      <div style={styles.tip}>
        💡 Subject form often ends in ः for masculine or stays unchanged for
        feminine/neuter.
      </div>
    </div>
  );

  const renderEndingsSection = () => (
    <div>
      <h2 style={styles.sectionTitle}>📊 Subject Endings by Type</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Type</th>
            <th style={styles.tableHeader}>Singular</th>
            <th style={styles.tableHeader}>Dual</th>
            <th style={styles.tableHeader}>Plural</th>
          </tr>
        </thead>
        <tbody>
          {endingsData.map((row, index) => (
            <tr
              key={index}
              style={index % 2 === 0 ? styles.evenRow : styles.oddRow}
            >
              <td style={styles.tableCell}>
                <strong>{row.type}</strong>
              </td>
              <td style={styles.tableCell}>{row.singular}</td>
              <td style={styles.tableCell}>{row.dual}</td>
              <td style={styles.tableCell}>{row.plural}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderPronounsSection = () => (
    <div>
      <h2 style={styles.sectionTitle}>🙋‍♂️ Subject Pronouns</h2>
      <div style={styles.cardsContainer}>
        {pronounData.map((p, index) => (
          <div
            key={index}
            style={styles.flipCard}
            onClick={() => handleCardFlip(index)}
          >
            <div
              style={{
                ...styles.flipCardInner,
                transform: flippedCards[index]
                  ? "rotateY(180deg)"
                  : "rotateY(0deg)",
              }}
            >
              <div style={styles.flipCardFront}>{p.meaning}</div>
              <div style={styles.flipCardBack}>{p.form}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderQuizSection = () => (
    <div>
      <h2 style={styles.sectionTitle}>🎮 Quiz Time</h2>
      {quizzes.map((quiz, index) => (
        <div key={index} style={styles.quizContainer}>
          <div style={styles.quizQuestion}>
            Quiz {index + 1}: {quiz.question}
          </div>
          {quiz.options.map((option, i) => (
            <button
              key={i}
              style={{
                ...styles.optionButton,
                ...(showAnswer && i === quiz.correct
                  ? styles.correctOption
                  : {}),
                ...(showAnswer && quizAnswer === i && i !== quiz.correct
                  ? styles.incorrectOption
                  : {}),
              }}
              onClick={() => handleQuizAnswer(i)}
              disabled={showAnswer}
            >
              {option.replace(" ✅", "")}
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
      <h2 style={styles.sectionTitle}>🎉 Practice Time!</h2>
      <div style={styles.keyRule}>
        ✅ Try making sentences using Prathama forms: <br />
        <strong>Subject + Verb</strong>
      </div>
      <div style={styles.tip}>✍️ E.g. रामः गच्छति। माला गायति। अहम् पठामि।</div>
    </div>
  );

  const renderCurrentSection = () => {
    switch (sections[currentSection]) {
      case "intro":
        return renderIntroSection();
      case "example":
        return renderExampleSection();
      case "endings":
        return renderEndingsSection();
      case "pronouns":
        return renderPronounsSection();
      case "quiz":
        return renderQuizSection();
      case "practice":
        return renderPracticeSection();
      default:
        return renderIntroSection();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Sanskrit Subject Forms</h1>
        <p style={styles.subtitle}>Prathama Vibhakti - The Doers</p>
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progress,
              width: `${((currentSection + 1) / sections.length) * 100}%`,
            }}
          ></div>
        </div>
        <div style={styles.navigation}>
          {["Intro", "Example", "Endings", "Pronouns", "Quiz", "Practice"].map(
            (label, index) => (
              <button
                key={index}
                style={{
                  ...styles.navButton,
                  ...(currentSection === index
                    ? styles.activeNavButton
                    : styles.inactiveNavButton),
                }}
                onClick={() => {
                  setCurrentSection(index);
                  setShowAnswer(false);
                  setQuizAnswer("");
                }}
              >
                {label}
              </button>
            )
          )}
        </div>
      </div>

      <div style={styles.contentCard}>
        {renderCurrentSection()}
        <div style={styles.navigationButtons}>
          <button
            style={{
              ...styles.navBtn,
              opacity: currentSection === 0 ? 0.5 : 1,
            }}
            onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
            disabled={currentSection === 0}
          >
            ← Previous
          </button>
          <button
            style={{
              ...styles.navBtn,
              opacity: currentSection === sections.length - 1 ? 0.5 : 1,
            }}
            onClick={() =>
              setCurrentSection(
                Math.min(sections.length - 1, currentSection + 1)
              )
            }
            disabled={currentSection === sections.length - 1}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearnSubject;
