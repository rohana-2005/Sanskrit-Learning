import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authAPI, tokenManager } from "../services/api";

const TOTAL_QUESTIONS = 5;

const TenseGame = ({ score: propScore }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const globalScore = location.state?.score ?? propScore ?? 0;
  const [sessionScore, setSessionScore] = useState(0); // Initialize session score to 0
  const [questions, setQuestions] = useState([]); // Store all questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [result, setResult] = useState("");
  const [hint, setHint] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [showNext, setShowNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false); // Loading for Submit
  const [qCount, setQCount] = useState(0);
  const [roundFinished, setRoundFinished] = useState(false);
  const [error, setError] = useState(null);

  const options = ["present", "past", "future"];

  // Clear localStorage and reset session score on mount
  useEffect(() => {
    localStorage.removeItem("tenseGameScore");
    setSessionScore(0);
  }, []);

  const shuffleArray = useMemo(() => {
    return (arr) => [...arr].sort(() => Math.random() - 0.5);
  }, []);

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
        return data.score;
      } else {
        throw new Error(data.message || "Failed to update score");
      }
    } catch (err) {
      setError(err.message || "Failed to update score");
      throw err;
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const fetchedQuestions = [];
      for (let i = 0; i < TOTAL_QUESTIONS; i++) {
        const res = await fetch("http://localhost:5003/api/get-tense-question");
        const data = await res.json();
        const allOptions = shuffleArray([...options]);
        fetchedQuestions.push({ ...data, options: allOptions });
      }
      setQuestions(fetchedQuestions);
      setError(null);
    } catch (err) {
      setQuestions([]);
      setResult("❌ Failed to load questions.");
      setError("Failed to load questions. Please try again.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!roundFinished) {
      fetchQuestions();
    }
  }, [roundFinished]);

  useEffect(() => {
    if (roundFinished) {
      localStorage.setItem("tenseGameScore", sessionScore);
      const userData = JSON.parse(localStorage.getItem("user"));
      if (userData && userData.id) {
        fetch("http://localhost:5000/api/save-score", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userData.id,
            score: sessionScore,
          }),
        });
      }
    }
  }, [roundFinished, sessionScore]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleSubmit = async () => {
    if (!selected || !currentQuestion) return;
    setSubmitLoading(true);

    if (selected === currentQuestion.tense && attempt === 0) {
      setResult(`✅ Correct!\n${currentQuestion.explanation}`);
      setHint("");
      setSessionScore((prev) => prev + 1);
      await updateScore("tenseGame", 1);
      setShowNext(true);
    } else {
      const nextAttempt = attempt + 1;
      setAttempt(nextAttempt);

      if (nextAttempt === 1) {
        setResult("❌ Wrong! Try again.");
      } else {
        setResult(
          `❌ Wrong again! Correct tense: ${currentQuestion.tense}\n${currentQuestion.explanation}`
        );
        setHint(
          "💡 Hint: Think about when the action happens — now, before, or in future."
        );
        setShowNext(true);
      }
    }
    setSubmitLoading(false);
  };

  const handleNext = () => {
    if (qCount + 1 === TOTAL_QUESTIONS) {
      setQCount(TOTAL_QUESTIONS);
      setRoundFinished(true);
    } else {
      setQCount((prev) => prev + 1);
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelected("");
      setResult("");
      setHint("");
      setAttempt(0);
      setShowNext(false);
    }
  };

  const handlePlayAgain = () => {
    setSessionScore(0);
    setQCount(0);
    setCurrentQuestionIndex(0);
    setRoundFinished(false);
    localStorage.removeItem("tenseGameScore");
    fetchQuestions();
  };

  return (
    <div className="tense-game-wrapper">
      <div className="tense-card">
        <h2 className="game-title">Guess the Tense</h2>

        <div className="controls">
          <button
            className="back-btn"
            onClick={() =>
              navigate("/dashboard", {
                state: { score: globalScore + sessionScore },
              })
            }
          >
            ← Back to Dashboard
          </button>
          <button
            className="back-btn"
            onClick={() => navigate("/learning-module")}
          >
            Back to Learning
          </button>
        </div>

        {!roundFinished && (
          <div className="info-panel">
            <div className="question-count">
              Question {qCount + 1} / {TOTAL_QUESTIONS}
            </div>
            <div className="session-score">Score: {sessionScore}</div>
            {error && <div className="error-message">{error}</div>}
          </div>
        )}

        {loading ? (
          <div className="sentence-box">Loading...</div>
        ) : roundFinished ? (
          <div>
            <p className="result" style={{ fontSize: "1.3rem" }}>
              Final Score: {sessionScore} / {TOTAL_QUESTIONS * 1}
            </p>
            <button className="submit-btn" onClick={handlePlayAgain}>
              Play Again
            </button>
          </div>
        ) : currentQuestion ? (
          <>
            <div className="sentence-box">{currentQuestion.sentence}</div>

            <div className="options">
              {currentQuestion.options.map((tense) => (
                <label key={tense} className="option">
                  <input
                    type="radio"
                    name="tense"
                    value={tense}
                    checked={selected === tense}
                    onChange={() => setSelected(tense)}
                    disabled={submitLoading}
                  />
                  {tense.charAt(0).toUpperCase() + tense.slice(1)}
                </label>
              ))}
            </div>

            {!showNext && (
              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={!selected || submitLoading}
              >
                {submitLoading
                  ? "Processing..."
                  : attempt === 1
                  ? "Try Again"
                  : "Submit"}
              </button>
            )}

            {result && <p className="result">{result}</p>}
            {hint && <p className="result hint">{hint}</p>}

            {showNext && (
              <button className="next-btn" onClick={handleNext}>
                Next
              </button>
            )}
          </>
        ) : (
          <p>⚠️ No question available.</p>
        )}

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700&display=swap');

          body {
            margin: 0;
            font-family: 'Noto Sans Devanagari', sans-serif;
            background: linear-gradient(to bottom right, #d76d2b, #f0c14b);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
          }

          .tense-game-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            position: relative;
          }

          .tense-card {
            background: linear-gradient(to bottom right, #ffedbc, #ffd194);
            padding: 24px 36px;
            border-radius: 16px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            text-align: center;
            width: 640px;
            max-width: 90%;
            color: black;
            position: relative;
            z-index: 1;
          }

          .game-title {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 20px;
            color: black;
          }

          .controls {
            margin-bottom: 1rem;
          }

          .back-btn {
            background-color: #d08444;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: background-color 0.3s, transform 0.2s;
            margin: 1rem;
          }

          .back-btn:hover {
            background-color: #c06c2c;
            transform: scale(1.05);
          }

          .info-panel {
            margin: 1rem 0;
            color: black;
          }

          .question-count, .session-score, .score {
            margin: 0.5rem 0;
            font-size: 1.1rem;
            font-weight: bold;
          }

          .error-message {
            margin-top: 1rem;
            color: #ff6b6b;
            font-size: 1rem;
            font-weight: 500;
          }

          .sentence-box {
            font-size: 1.3rem;
            padding: 12px;
            background-color: #fffbe6;
            border: 1px solid #ffe58f;
            border-radius: 10px;
            margin-bottom: 20px;
            color: black;
          }

          .options {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-bottom: 20px;
            flex-wrap: wrap;
          }

          .option {
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            gap: 6px;
            color: black;
          }

          .submit-btn,
          .next-btn {
            background-color: #d08444;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.3s, transform 0.2s;
            margin: 10px 5px;
          }

          .submit-btn:hover:not(:disabled),
          .next-btn:hover {
            background-color: #c06c2c;
            transform: scale(1.05);
          }

          .submit-btn:disabled {
            background-color: #aaa;
            cursor: not-allowed;
          }

          .result {
            margin-top: 16px;
            white-space: pre-wrap;
            font-weight: bold;
            color: black;
          }

          .hint {
            color: #e67e22;
            font-style: italic;
          }
        `}</style>
      </div>
    </div>
  );
};

export default TenseGame;
