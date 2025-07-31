import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authAPI, tokenManager } from "../services/api";

const ShabdaFusion = ({ score: propScore }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const globalScore = location.state?.score ?? propScore ?? 0; // Global score from props or state
  const [sessionScore, setSessionScore] = useState(0); // Score for current game session
  const [gameData, setGameData] = useState([]);
  const [currentGame, setCurrentGame] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [matchedItems, setMatchedItems] = useState([]);
  const [shuffledSubjects, setShuffledSubjects] = useState([]);
  const [shuffledVerbs, setShuffledVerbs] = useState([]);
  const [error, setError] = useState(null);

  const numberNames = {
    sg: "singular",
    du: "dual",
    pl: "plural",
  };

  // Define updateScore locally
  const updateScore = async (gameName, scoreIncrement) => {
    try {
      const token = tokenManager.getToken();
      if (!token) {
        throw new Error("No token found, please log in again");
      }
      const response = await fetch("http://localhost:5000/api/update-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ score: scoreIncrement }),
      });
      const data = await response.json();
      if (response.ok) {
        return data.score; // Returns the updated global score from the server
      } else {
        throw new Error(data.message || "Failed to update score");
      }
    } catch (err) {
      setError(err.message || "Failed to update score");
      throw err;
    }
  };

  useEffect(() => {
    fetch("http://localhost:5005/api/get-matching-game")
      .then((res) => res.json())
      .then((data) => {
        setGameData(data);
        startNewGame(data);
      })
      .catch((err) => {
        console.error("Failed to load matching game data:", err);
        setError("Failed to load game data. Please try again.");
      });
  }, []);

  const startNewGame = (data = gameData) => {
    const random = data[Math.floor(Math.random() * data.length)];
    setCurrentGame(random);
    setSelectedItem(null);
    setMatchedPairs(0);
    setMatchedItems([]);
    setSessionScore(0); // Reset session score for new game
    setError(null);

    const subjectForms = ["sg", "du", "pl"].map((num) => ({
      text: random.subject_forms[num],
      number: num,
      type: "subject",
    }));

    const verbForms = ["sg", "du", "pl"].map((num) => ({
      text: random.verb_forms[num],
      number: num,
      type: "verb",
    }));

    setShuffledSubjects(shuffle(subjectForms));
    setShuffledVerbs(shuffle(verbForms));
  };

  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const handleItemClick = async (item) => {
    if (matchedItems.includes(item.text)) return;

    if (!selectedItem) {
      setSelectedItem(item);
      return;
    }

    if (selectedItem.text === item.text) {
      setSelectedItem(null);
      return;
    }

    if (selectedItem.type === item.type) {
      setSelectedItem(item);
      return;
    }

    const subject = selectedItem.type === "subject" ? selectedItem : item;
    const verb = selectedItem.type === "verb" ? selectedItem : item;

    const subjectElem = document.getElementById(subject.text);
    const verbElem = document.getElementById(verb.text);

    if (subject.number === verb.number) {
      subjectElem.classList.add("matched");
      verbElem.classList.add("matched");

      setMatchedItems((prev) => [...prev, subject.text, verb.text]);
      setMatchedPairs((prev) => {
        const updated = prev + 1;
        // Increment session score by 10 for a correct match
        setSessionScore((prev) => prev + 1);
        // Update global score on the server
        updateScore("shabdaFusion", 1)
          .then((newGlobalScore) => {
            // Refresh profile to ensure UI consistency
            authAPI
              .profile()
              .then((profile) => {
                // Update global score in state (optional, depending on navigation)
                if (updated === 3) {
                  document.getElementById("completionMessage").style.display =
                    "block";
                }
              })
              .catch((err) => {
                setError("Failed to refresh profile: " + err.message);
              });
          })
          .catch((err) => {
            setError(err.message || "Failed to update score");
          });
        return updated;
      });

      document.getElementById("hintDisplay").textContent = "";
      setSelectedItem(null);
    } else {
      subjectElem.classList.add("wrong");
      verbElem.classList.add("wrong");

      const number = subject.number;
      const hint = `
        The <strong>${numberNames[number]}</strong> form of <strong>${currentGame.subject_root}</strong> 
        (${currentGame.subject_forms[number]}) should match with the <strong>${numberNames[number]}</strong> 
        form of <strong>${currentGame.verb_root}</strong> (${currentGame.verb_forms[number]}).
      `;
      document.getElementById("hintDisplay").innerHTML = hint;

      setTimeout(() => {
        subjectElem.classList.remove("wrong", "selected");
        verbElem.classList.remove("wrong", "selected");
        setSelectedItem(null);
      }, 800);
    }
  };

  return currentGame ? (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700&display=swap');
  
        body {
          font-family: 'Noto Sans Devanagari', sans-serif;
          background: linear-gradient(135deg, #A0522D, #DAA520);
          background-size: 200% 200%;
          animation: gradientMove 15s ease infinite;
          color: #fff;
          margin: 0;
          padding: 0;
        }
  
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
  
        .shabda-fusion {
          padding: 2rem;
          text-align: center;
        }
  
        h1 {
          font-size: 2.2rem;
          color: #fff8dc;
          margin-bottom: 1rem;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
        }
  
        .controls {
          margin-bottom: 1rem;
        }
        
        .controls button + button {
          margin-left: 1rem;
          background-color: #d08444;
        }

        .controls button + button:hover {
          background-color: #c06c2c;
        }
  
        .info-panel {
          margin: 1rem 0;
          color: #fff8dc;
        }
  
        .root-info, .meaning, .hint, .score, .session-score {
          margin: 0.5rem 0;
          font-size: 1.1rem;
        }
  
        .error-message {
          margin-top: 1rem;
          color: #ff6b6b;
          font-size: 1rem;
          font-weight: 500;
        }
  
        .game-container {
          display: flex;
          justify-content: center;
          gap: 4rem;
          margin-top: 2rem;
        }
  
        .column {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
  
        .item {
          background: rgba(255, 255, 255, 0.1);
          padding: 1rem 1.5rem;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          font-size: 1.2rem;
          font-weight: 600;
          color: #f5deb3;
          cursor: pointer;
          transition: transform 0.2s ease, background 0.3s;
          box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        }
  
        .item.selected {
          border: 2px solid #fff8dc;
          background-color: rgba(255, 255, 255, 0.2);
        }
  
        .matched {
          background: rgba(34, 139, 34, 0.4) !important;
          color: #d4edda !important;
        }
        
        .wrong {
          background: rgba(255, 0, 0, 0.4) !important;
          color: #ffdede !important;
          transform: scale(1.03);
        }
  
        .completion-message {
          margin-top: 2rem;
          font-size: 1.3rem;
          font-weight: bold;
          color: #fff;
          display: none;
        }
  
        button {
          margin-top: 1rem;
          padding: 0.8rem 1.5rem;
          font-size: 1rem;
          font-weight: 600;
          background: #cd853f;
          color: #fff;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.25);
          transition: background 0.3s ease;
        }
  
        button:hover {
          background: #b86b2c;
        }
      `}</style>

      <div className="shabda-fusion">
        <h1>Sanskrit Matching Game</h1>

        <div className="controls">
          <button
            onClick={() =>
              navigate("/dashboard", {
                state: { score: globalScore + sessionScore },
              })
            }
          >
            Back to Dashboard
          </button>
          <button onClick={() => startNewGame()}>New Game</button>
        </div>

        <div className="info-panel">
          <div className="root-info">
            Root: {currentGame.subject_root} + {currentGame.verb_root} (
            {currentGame.tense})
          </div>
          <div className="meaning">Meaning: {currentGame.meaning}</div>
          <div className="session-score">Score: {sessionScore}</div>
          {/* <div className="score">Total Score: {globalScore + sessionScore}</div> */}
          <div className="hint" id="hintDisplay"></div>
          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="game-container">
          <div className="column">
            <h3>Subject Forms</h3>
            {shuffledSubjects.map((item) => (
              <div
                key={item.text}
                id={item.text}
                className={`item 
                  ${selectedItem?.text === item.text ? "selected" : ""}
                  ${matchedItems.includes(item.text) ? "matched" : ""}
                `}
                onClick={() => handleItemClick(item)}
              >
                {item.text}
              </div>
            ))}
          </div>
          <div className="column">
            <h3>Verb Forms</h3>
            {shuffledVerbs.map((item) => (
              <div
                key={item.text}
                id={item.text}
                className={`item 
                  ${selectedItem?.text === item.text ? "selected" : ""}
                  ${matchedItems.includes(item.text) ? "matched" : ""}
                `}
                onClick={() => handleItemClick(item)}
              >
                {item.text}
              </div>
            ))}
          </div>
        </div>

        <div className="completion-message" id="completionMessage">
          Well done! All matches correct!
        </div>
      </div>
    </>
  ) : (
    <div>Loading game...</div>
  );
};

export default ShabdaFusion;
