import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LearningModule = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);

  const modules = [
    {
      title: "Structure",
      emoji: "📐",
      sub: "Basic Sanskrit Sentence Structure",
      description: "Understand how Sanskrit sentences are formed and ordered.",
      content: (
        <>
          <p><strong>Sentence Order:</strong> Sanskrit uses <b>Subject–Object–Verb (SOV)</b> structure.</p>
          <p><strong>Example:</strong><br />
            रामः फलम् खादति।<br />
            <em>Rāmaḥ phalam khādati</em><br />
            (Rama eats the fruit)
          </p>
          <p><strong>Agreement:</strong> Subject and verb agree in gender, number, and person.</p>
          <p><strong>Nouns:</strong> Declined based on case (vibhakti) — like nominative, accusative, etc.</p>
        </>
      ),
      route: "/game",
    },
    {
      title: "Persons & Numbers",
      emoji: "👥",
      sub: "1st, 2nd, 3rd Person + Singular, Dual, Plural",
      description: "Learn how verbs and nouns adapt to person and number.",
      content: (
        <>
          <p><strong>Persons:</strong></p>
          <ul>
            <li>1st Person: I / We</li>
            <li>2nd Person: You</li>
            <li>3rd Person: He / She / They</li>
          </ul>
          <p><strong>Numbers:</strong></p>
          <ul>
            <li>Singular – 1</li>
            <li>Dual – 2</li>
            <li>Plural – 3 or more</li>
          </ul>
          <p><strong>Examples with पठ् (paṭh – to read):</strong></p>
          <ul>
            <li>पठामि – I read</li>
            <li>पठावः – We two read</li>
            <li>पठामः – We all read</li>
            <li>पठसि – You read</li>
            <li>पठथः – You two read</li>
            <li>पठथ – You all read</li>
            <li>पठति – He/She reads</li>
            <li>पठतः – They two read</li>
            <li>पठन्ति – They all read</li>
          </ul>
        </>
      ),
      route: "/sankhya-trivia",
    },
    {
      title: "Verb Conjugations",
      emoji: "🛠️",
      sub: "Forming verbs using roots and suffixes",
      description: "Learn how to conjugate Sanskrit verbs for person and number.",
      content: (
        <>
          <p><strong>Root (धातु):</strong> Base form of a verb. E.g., <em>गम् (gam)</em> – to go</p>
          <p><strong>Verb Stem Formation:</strong> Root + thematic vowel + endings</p>
          <p><strong>Present tense forms of गम्:</strong></p>
          <ul>
            <li>गच्छामि – I go</li>
            <li>गच्छसि – You go</li>
            <li>गच्छति – He/She goes</li>
            <li>गच्छावः – We two go</li>
            <li>गच्छतः – They two go</li>
            <li>गच्छामः – We all go</li>
          </ul>
          <p>Verb endings change based on tense, person, and number.</p>
        </>
      ),
      route: "/verb-game",
    },
    {
      title: "Tenses",
      emoji: "⏳",
      sub: "Present, Past, and Future Tense",
      description: "Explore how time is expressed through verbs in Sanskrit.",
      content: (
        <>
          <p><strong>Present (लट् लकार):</strong> Action happening now</p>
          <ul>
            <li>गच्छति – He goes</li>
            <li>पठसि – You read</li>
          </ul>
          <p><strong>Past (लङ् लकार):</strong> Completed action</p>
          <ul>
            <li>अगच्छत् – He went</li>
            <li>अपठत् – He read</li>
          </ul>
          <p><strong>Future (लृट् लकार):</strong> Action yet to happen</p>
          <ul>
            <li>गमिष्यति – He will go</li>
            <li>पठिष्यसि – You will read</li>
          </ul>
          <p>Each tense has a specific लकार form with unique suffixes.</p>
        </>
      ),
      route: "/tense-game",
    },
  ];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📘 Learning Modules</h2>
      <button style={styles.button} onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
      <div style={styles.grid}>
        {modules.map((mod, idx) => (
          <div
            key={idx}
            style={{
              ...styles.card,
              ...(hoveredCard === idx ? styles.cardHover : {}),
            }}
            onMouseEnter={() => setHoveredCard(idx)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={styles.emoji}>{mod.emoji}</div>
            <h3 style={styles.cardTitle}>{mod.title}</h3>
            <p style={styles.subtitle}>{mod.sub}</p>
            <p style={styles.description}>{mod.description}</p>
            <div style={styles.lesson}>
              <div style={styles.scrollArea}>{mod.content}</div>
            </div>
            <button
              style={{
                ...styles.button,
                ...(hoveredButton === idx ? styles.buttonHover : {}),
              }}
              onMouseEnter={() => setHoveredButton(idx)}
              onMouseLeave={() => setHoveredButton(null)}
              onClick={() => navigate(mod.route)}
            >
              Practice
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};


const styles = {
  container: {
    padding: "2rem",
    minHeight: "100vh",
    background: "linear-gradient(to bottom right, #d88a2b, #e4a14e)",
    color: "#fff",
    fontFamily: "'Segoe UI', sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    fontSize: "2.2rem",
    fontWeight: "bold",
    margin: "2rem 0 1rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "2rem",
    width: "100%",
    maxWidth: "1200px",
    padding: "1rem",
  },
  card: {
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "20px",
    padding: "1.5rem",
    boxShadow: "8px 8px 16px #b96f23, -8px -8px 16px #fcb55b",
    backdropFilter: "blur(6px)",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transform: "scale(1)",
  },
  cardHover: {
    transform: "scale(1.03)",
    boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
  },
  emoji: {
    fontSize: "2rem",
    marginBottom: "0.5rem",
  },
  cardTitle: {
    fontSize: "1.35rem",
    marginBottom: "0.3rem",
  },
  subtitle: {
    fontSize: "1rem",
    fontWeight: "500",
    color: "#ffe",
    marginBottom: "0.6rem",
  },
  description: {
    fontSize: "0.95rem",
    color: "#f8f8f8",
    marginBottom: "1rem",
  },
  lesson: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: "12px",
    padding: "1rem",
    textAlign: "left",
    fontSize: "0.95rem",
    color: "#fff",
    marginBottom: "1rem",
    maxHeight: "240px",         
    overflowY: "auto",         
    boxSizing: "border-box",    // Ensures padding doesn't cut off content
  },
  
  scrollArea: {
    overflowY: "auto",
    maxHeight: "180px",
    paddingRight: "0.5rem",
  },
  button: {
    backgroundColor: "#b96f23",
    border: "none",
    padding: "0.5rem 1.2rem",
    borderRadius: "12px",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
    transform: "scale(1)",
    fontSize: "0.95rem",
    marginBottom:"1rem",
  },
  buttonHover: {
    transform: "scale(1.05)",
    backgroundColor: "#d07a2a",
  },
};

export default LearningModule;
