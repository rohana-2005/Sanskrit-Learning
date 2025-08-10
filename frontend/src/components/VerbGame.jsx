import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authAPI, tokenManager } from "../services/api";

const TOTAL_QUESTIONS = 5;

const VerbGame = ({ score: propScore }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const globalScore = location.state?.score ?? propScore ?? 0;
  const [sessionScore, setSessionScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [result, setResult] = useState("");
  const [hint, setHint] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [showNext, setShowNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [qCount, setQCount] = useState(0);
  const [roundFinished, setRoundFinished] = useState(false);
  const [error, setError] = useState(null);

  const isValidSanskritForm = (form) => {
    if (!form || typeof form !== "string") return false;
    return /^[\u0900-\u097F]+$/.test(form);
  };

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

  const shuffleArray = useMemo(() => {
    return (arr) => [...arr].sort(() => Math.random() - 0.5);
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const fetchedQuestions = [];
      for (let i = 0; i < TOTAL_QUESTIONS; i++) {
        const res = await fetch("http://localhost:5002/api/get-game", {
          method: "GET",
          headers: { "Content-Type": "application/json; charset=utf-8" },
        });
        if (!res.ok) {
          console.warn(
            `Failed to fetch question ${i + 1}: ${res.status} ${res.statusText}`
          );
          continue;
        }
        const data = await res.json();
        console.log(
          `Fetched question ${i + 1}:`,
          JSON.stringify(data, null, 2)
        );
        if (
          !data.sentence ||
          !data.correct ||
          !isValidSanskritForm(data.correct) ||
          !data.options ||
          !Array.isArray(data.options) ||
          data.options.length < 3 ||
          data.options.some((opt) => !isValidSanskritForm(opt))
        ) {
          console.warn(`Invalid question data for question ${i + 1}:`, data);
          continue;
        }
        const validOptions = data.options.filter(
          (opt) => opt !== data.correct && isValidSanskritForm(opt)
        );
        if (validOptions.length < 2) {
          console.warn(
            `Insufficient valid distractors for question ${i + 1}:`,
            validOptions
          );
          continue;
        }
        const allOptions = shuffleArray([
          data.correct,
          ...validOptions.slice(0, 2),
        ]);
        fetchedQuestions.push({
          sentence: data.sentence,
          correct: data.correct,
          options: allOptions,
          hint: data.hint || "No hint available",
          explanation: data.explanation || "No explanation available",
        });
      }
      if (fetchedQuestions.length === 0) {
        throw new Error("No valid questions received from server");
      }
      console.log(
        "Processed questions:",
        JSON.stringify(fetchedQuestions, null, 2)
      );
      setQuestions(fetchedQuestions);
      setError(null);
    } catch (error) {
      console.error("Fetch error:", error.message, error.stack);
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

  const currentQuestion = questions[currentQuestionIndex];

  const handleSubmit = async () => {
    if (!selected || !currentQuestion) return;
    setSubmitLoading(true);

    if (selected === currentQuestion.correct) {
      setResult(`✅ Correct!\n${currentQuestion.explanation}`);
      setHint("");
      if (attempt === 0) {
        setSessionScore((prev) => prev + 1);
        await updateScore("verbGame", 1);
      }
      setShowNext(true);
    } else {
      const nextAttempt = attempt + 1;
      setAttempt(nextAttempt);

      if (nextAttempt === 1) {
        setResult("❌ Wrong! Try again.");
      } else {
        setResult(
          `❌ Wrong again! Correct answer: ${currentQuestion.correct}\n${currentQuestion.explanation}`
        );
        setHint(`💡 ${currentQuestion.hint}`);
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
    fetchQuestions();
  };

  return (
    <div className="verb-game-wrapper">
      <div className="verb-card">
        <h2 className="game-title">Fill in the Verb</h2>

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
          <div className="sentence-box">Loading questions...</div>
        ) : roundFinished ? (
          <div>
            <p className="result" style={{ fontSize: "1.3rem" }}>
              Final Score: {sessionScore} / {TOTAL_QUESTIONS}
            </p>
            <button className="submit-btn" onClick={handlePlayAgain}>
              Play Again
            </button>
          </div>
        ) : currentQuestion ? (
          <>
            <div className="sentence-box">{currentQuestion.sentence}</div>

            <div className="options">
              {currentQuestion.options.map((opt, index) => (
                <label key={`${opt}-${index}`} className="option">
                  <input
                    type="radio"
                    name="verb"
                    value={opt}
                    checked={selected === opt}
                    onChange={() => setSelected(opt)}
                    disabled={submitLoading}
                  />
                  <span className="option-text">{opt}</span>
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
            font-family: 'Noto Sans Devanagari', Mangal, sans-serif;
            background: linear-gradient(to bottom right, #d76d2b, #f0c14b);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
          }

          .verb-game-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }

          .verb-card {
            background: linear-gradient(to bottom right, #ffedbc, #ffd194);
            padding: 24px 36px;
            border-radius: 16px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            text-align: center;
            width: 640px;
            max-width: 90%;
            color: black;
          }

          .game-title {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 20px;
            color: black;
          }

          .controls {
            margin-bottom: 1rem;
            display: flex;
            justify-content: space-between;
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
          }

          .back-btn:hover {
            background-color: #c06c2c;
            transform: scale(1.05);
          }

          .info-panel {
            margin: 1rem 0;
            color: black;
          }

          .question-count, .session-score {
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
            min-height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .options {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 20px;
            width: 100%;
          }

          .option {
            font-size: 1.2rem;
            display: flex;
            align-items: center;
            gap: 8px;
            color: black;
            width: 100%;
            padding: 8px;
            border-radius: 6px;
            transition: background-color 0.2s;
          }

          .option:hover {
            background-color: #fffbe6;
          }

          .option-text {
            font-family: 'Noto Sans Devanagari', Mangal, sans-serif;
            font-size: 1.2rem;
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

          @media (max-width: 600px) {
            .verb-card {
              padding: 16px;
              width: 90%;
            }
            .game-title {
              font-size: 24px;
            }
            .sentence-box {
              font-size: 1.1rem;
            }
            .option {
              font-size: 1rem;
            }
            .submit-btn, .next-btn {
              padding: 8px 16px;
              font-size: 0.9rem;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default VerbGame;
