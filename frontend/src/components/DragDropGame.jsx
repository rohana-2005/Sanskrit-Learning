import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { tokenManager } from "../services/api";

const TOTAL_QUESTIONS = 5;

const DragDropGame = ({ score: propScore }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const globalScore = location.state?.score ?? propScore ?? 0;
  const [sessionScore, setSessionScore] = useState(0);
  const [qCount, setQCount] = useState(1); // Start at 1 for first sentence
  const [roundFinished, setRoundFinished] = useState(false);
  const [currentSentence, setCurrentSentence] = useState({});
  const [words, setWords] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState({});
  const [hintsShown, setHintsShown] = useState(false);
  const [currentWordAnalysis, setCurrentWordAnalysis] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [feedbackColor, setFeedbackColor] = useState("");
  const [hints, setHints] = useState({
    subject: "",
    object: "",
    verb: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [wordAnalysisTitle, setWordAnalysisTitle] = useState("Word Analysis");
  const [wordToAnalyze, setWordToAnalyze] = useState("");
  const [wordAnalysisFeedback, setWordAnalysisFeedback] = useState("");
  const [showAnswers, setShowAnswers] = useState({});
  const [droppedWords, setDroppedWords] = useState({
    subject: "",
    object: "",
    verb: "",
  });
  const [wordAnalysisOptions, setWordAnalysisOptions] = useState([]);
  const [wordAnalysisDropped, setWordAnalysisDropped] = useState({});
  const [isScored, setIsScored] = useState(false);

  const draggedElement = useRef(null);

  const styles = {
    body: {
      fontFamily: "Arial, sans-serif",
      maxWidth: "800px",
      margin: "0 auto",
      padding: "20px",
      textAlign: "center",
      minHeight: "100vh",
      background:
        "linear-gradient(135deg, #d2691e 0%, #cd853f 25%, #daa520 50%, #b8860b 75%, #a0522d 100%)",
      color: "white",
      overflowX: "hidden",
      overflowY: "auto",
    },
    sentenceDisplay: {
      fontSize: "24px",
      margin: "20px 0",
      padding: "10px",
      backgroundColor: "#f5f5f5",
      borderRadius: "5px",
      color: "#333",
    },
    dropArea: {
      display: "flex",
      justifyContent: "space-around",
      margin: "20px 0",
      flexWrap: "wrap",
    },
    dropZone: {
      width: "30%",
      minHeight: "100px",
      border: "2px dashed #ccc",
      borderRadius: "5px",
      padding: "10px",
      margin: "0 5px",
      position: "relative",
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    dropZoneHighlight: {
      borderColor: "#4CAF50",
      backgroundColor: "#e8f5e9",
    },
    wordOption: {
      display: "inline-block",
      padding: "8px 12px",
      margin: "5px",
      backgroundColor: "#2196F3",
      color: "white",
      borderRadius: "4px",
      cursor: "grab",
      userSelect: "none",
    },
    wordOptionDragging: {
      opacity: 0.5,
    },
    optionsContainer: {
      margin: "20px 0",
      minHeight: "60px",
      maxHeight: "200px",
      overflowY: "auto",
      padding: "10px",
      border: "1px solid #eee",
      borderRadius: "5px",
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    feedback: {
      margin: "20px 0",
      fontSize: "18px",
      minHeight: "24px",
      color: feedbackColor || "white",
    },
    button: {
      padding: "10px 20px",
      margin: "10px",
      backgroundColor: "#4CAF50",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
    buttonHover: {
      backgroundColor: "#45a049",
    },
    logoutButton: {
      padding: "10px 20px",
      margin: "10px",
      backgroundColor: "#f44336",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
    hint: {
      fontSize: "14px",
      color: "#666",
      marginTop: "5px",
    },
    learnMoreBtn: {
      marginTop: "10px",
      display: "block",
      width: "80%",
      marginLeft: "auto",
      marginRight: "auto",
      padding: "10px 20px",
      backgroundColor: "#4CAF50",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
    modal: {
      display: "block",
      position: "fixed",
      zIndex: 1,
      left: 0,
      top: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.4)",
    },
    modalContent: {
      backgroundColor: "#fefefe",
      margin: "5% auto",
      padding: "20px",
      border: "1px solid #888",
      width: "80%",
      maxWidth: "600px",
      borderRadius: "5px",
      maxHeight: "90vh",
      overflowY: "auto",
      position: "relative",
      color: "#333",
    },
    close: {
      color: "#aaa",
      float: "right",
      fontSize: "28px",
      fontWeight: "bold",
      cursor: "pointer",
    },
    wordAnalysisOptions: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      margin: "20px 0",
    },
    analysisDropzoneContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "10px",
      margin: "20px 0",
      maxHeight: "60vh",
      overflowY: "auto",
    },
    wordAnalysisDropzone: {
      minHeight: "60px",
      border: "2px dashed #ccc",
      borderRadius: "5px",
      padding: "10px",
      margin: "10px",
    },
    wordAnalysisDropzoneHighlight: {
      borderColor: "#4CAF50",
      backgroundColor: "#e8f5e9",
    },
    showAnswer: {
      fontSize: "12px",
      color: "#666",
      cursor: "pointer",
      marginLeft: "5px",
    },
    answer: {
      color: "#4CAF50",
      fontWeight: "bold",
      marginTop: "5px",
    },
    wordAnalysisFeedback: {
      margin: "20px 0",
      fontSize: "18px",
      minHeight: "24px",
    },
    infoPanel: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "0.5rem",
      marginBottom: "1rem",
    },
    questionCount: {
      fontSize: "1.1rem",
      fontWeight: 600,
      color: "#fff",
    },
    sessionScore: {
      fontSize: "1.1rem",
      fontWeight: 600,
      color: "#fff",
    },
  };

  useEffect(() => {
    localStorage.removeItem("dragDropGameScore");
    setSessionScore(0);
    initGame();
  }, []);

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
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
      setFeedback(`Error updating score: ${err.message}`);
      setFeedbackColor("red");
      throw err;
    }
  };

  const initGame = async () => {
    clearDropZones();
    setIsScored(false);

    try {
      let response;
      try {
        response = await fetch("http://127.0.0.1:5001/get_random_sentence");
        if (!response.ok) {
          throw new Error("Python server not responding");
        }
      } catch (error) {
        console.log("Python server not available, using mock data");
        const mockData = {
          sentence: "रामः गच्छति",
          subject: {
            form: "रामः",
            root: "राम",
            gender: "masculine",
            number: "singular",
            person: "third",
          },
          object: null,
          verb: {
            form: "गच्छति",
            root: "गम्",
            class: "1",
            meaning: "goes",
            person: "third",
            number: "singular",
          },
          hint: {
            subject: { gender: "masculine", number: "singular" },
            verb: {
              class: "1",
              meaning: "goes",
              person: "third",
              number: "singular",
            },
          },
        };

        setCurrentSentence(mockData);
        setWords(shuffleArray(mockData.sentence.split(" ")));
        setCorrectAnswers({
          subject: mockData.subject,
          object: mockData.object,
          verb: mockData.verb,
        });
        setHintsShown(false);
        clearHints();
        setFeedback("");
        setFeedbackColor("");
        return;
      }

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setCurrentSentence(data);
      setWords(shuffleArray(data.sentence.split(" ")));
      setCorrectAnswers({
        subject: data.subject,
        object: data.object,
        verb: data.verb,
      });
      setHintsShown(false);
      clearHints();
      setFeedback("");
      setFeedbackColor("");
    } catch (error) {
      console.error("Error fetching sentence:", error);
      setFeedback("Error loading sentence. Make sure the server is running.");
      setFeedbackColor("red");
    }
  };

  const handleNextSentence = () => {
    if (qCount === TOTAL_QUESTIONS) {
      setRoundFinished(true);
      return;
    }
    setQCount((prev) => prev + 1);
    initGame();
  };

  const handlePlayAgain = () => {
    setSessionScore(0);
    setQCount(1);
    setRoundFinished(false);
    localStorage.removeItem("dragDropGameScore");
    initGame();
  };

  useEffect(() => {
    if (roundFinished) {
      localStorage.setItem("dragDropGameScore", sessionScore);
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

  const clearDropZones = () => {
    setDroppedWords({
      subject: "",
      object: "",
      verb: "",
    });
  };

  const clearHints = () => {
    setHints({
      subject: "",
      object: "",
      verb: "",
    });
  };

  const handleDragStart = (e, word) => {
    e.dataTransfer.setData("text/plain", word);
    draggedElement.current = word;
    e.target.style.opacity = "0.5";
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = "1";
  };

  const handleDrop = (e, dropZone) => {
    e.preventDefault();
    const word = e.dataTransfer.getData("text/plain");

    const newDroppedWords = { ...droppedWords };
    Object.keys(newDroppedWords).forEach((key) => {
      if (newDroppedWords[key] === word) {
        newDroppedWords[key] = "";
      }
    });

    newDroppedWords[dropZone] = word;
    setDroppedWords(newDroppedWords);

    setWords((prev) => prev.filter((w) => w !== word));

    setTimeout(() => checkCompletion(newDroppedWords), 0);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const checkCompletion = async (droppedWordsState) => {
    if (droppedWordsState.subject && droppedWordsState.verb) {
      const isSubjectCorrect =
        droppedWordsState.subject ===
        (correctAnswers.subject ? correctAnswers.subject.form : null);
      const isObjectCorrect = droppedWordsState.object
        ? droppedWordsState.object ===
          (correctAnswers.object ? correctAnswers.object.form : null)
        : correctAnswers.object === null;
      const isVerbCorrect =
        droppedWordsState.verb ===
        (correctAnswers.verb ? correctAnswers.verb.form : null);

      if (isSubjectCorrect && isObjectCorrect && isVerbCorrect && !isScored) {
        showFeedback("Correct! Well done!", "green");
        setSessionScore((prev) => prev + 1);
        setIsScored(true);
        await updateScore("dragDropGame", 1);
      } else if (!isSubjectCorrect || !isObjectCorrect || !isVerbCorrect) {
        showFeedback("Not quite right. Try again or check hints.", "red");
      }
    }
  };

  const showFeedback = (message, color) => {
    setFeedback(message);
    setFeedbackColor(color);
  };

  const handleShowHints = () => {
    if (!hintsShown) {
      setHintsShown(true);

      const newHints = { ...hints };

      if (currentSentence.hint?.subject) {
        newHints.subject = `Gender: ${currentSentence.hint.subject.gender}, Number: ${currentSentence.hint.subject.number}`;
      } else {
        newHints.subject = "No subject in this sentence";
      }

      if (currentSentence.hint?.object) {
        newHints.object = `Gender: ${currentSentence.hint.object.gender}, Number: ${currentSentence.hint.object.number}`;
      } else {
        newHints.object = "No object in this sentence";
      }

      newHints.verb = `Class: ${currentSentence.hint?.verb?.class}, Meaning: "${currentSentence.hint?.verb?.meaning}", Person: ${currentSentence.hint?.verb?.person}, Number: ${currentSentence.hint?.verb?.number}`;

      setHints(newHints);
    }
  };

  const initWordAnalysis = (wordData, type) => {
    setCurrentWordAnalysis(wordData);
    setWordAnalysisTitle(`${type} Analysis`);
    setWordToAnalyze(wordData.form || wordData);
    setWordAnalysisFeedback("");
    setShowAnswers({});
    setWordAnalysisDropped({});

    const properties = [];
    if (wordData.root)
      properties.push({ type: "root", text: String(wordData.root) });
    if (wordData.form)
      properties.push({ type: "form", text: String(wordData.form) });
    if (wordData.number)
      properties.push({ type: "number", text: String(wordData.number) });
    if (wordData.gender)
      properties.push({ type: "gender", text: String(wordData.gender) });
    if (wordData.person)
      properties.push({ type: "person", text: String(wordData.person) });
    if (wordData.stem)
      properties.push({ type: "stem", text: String(wordData.stem) });
    if (wordData.class && type === "Verb")
      properties.push({ type: "class", text: String(wordData.class) });
    if (wordData.meaning && type === "Verb")
      properties.push({ type: "meaning", text: String(wordData.meaning) });

    setWordAnalysisOptions(shuffleArray(properties));
    setModalOpen(true);
  };

  const handleWordAnalysisDragStart = (e, option) => {
    e.dataTransfer.setData("application/json", JSON.stringify(option));
    e.target.style.opacity = "0.5";
  };

  const handleWordAnalysisDragEnd = (e) => {
    e.target.style.opacity = "1";
  };

  const handleWordAnalysisDrop = (e, property) => {
    e.preventDefault();
    const option = JSON.parse(e.dataTransfer.getData("application/json"));

    if (option.type === property) {
      setWordAnalysisDropped((prev) => ({
        ...prev,
        [property]: option,
      }));

      setWordAnalysisOptions((prev) =>
        prev.filter(
          (opt) => !(opt.type === option.type && opt.text === option.text)
        )
      );
    }
  };

  const checkWordAnalysisAnswers = () => {
    let allCorrect = true;
    let feedback = [];

    const properties = ["root", "form", "number", "gender", "person", "stem"];
    if (wordAnalysisTitle.includes("Verb")) {
      properties.push("class", "meaning");
    }

    properties.forEach((property) => {
      const dropped = wordAnalysisDropped[property];
      const correct = currentWordAnalysis[property];

      if (correct && dropped && String(dropped.text) !== String(correct)) {
        allCorrect = false;
        feedback.push(`${property} is incorrect`);
      }
    });

    if (allCorrect) {
      setWordAnalysisFeedback("Correct! Well done!");
    } else {
      setWordAnalysisFeedback(
        feedback.join(", ") || "Some answers are incorrect"
      );
    }
  };

  const toggleAnswer = (property) => {
    setShowAnswers((prev) => ({
      ...prev,
      [property]: !prev[property],
    }));
  };

  const getAnswerValue = (property) => {
    if (!currentWordAnalysis) return "N/A";

    let value = currentWordAnalysis[property];
    if (value === null) return "Not applicable";
    if (value === "" || value === undefined) return "N/A";
    return String(value);
  };

  return (
    <div style={styles.body}>
      <div>
        <h1 style={{ margin: 0 }}>Sanskrit Sentence Analyzer</h1>
        <button
          style={{
            backgroundColor: "#d08444",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            transition: "background-color 0.3s, transform 0.2s",
            margin: "1rem",
          }}
          onClick={() =>
            navigate("/dashboard", {
              state: { score: globalScore + sessionScore },
            })
          }
        >
          ← Back to Dashboard
        </button>
        <button
          style={{
            backgroundColor: "#d08444",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            transition: "background-color 0.3s, transform 0.2s",
            margin: "1rem",
          }}
          onClick={() =>
            navigate("/learning-module", { state: { fromGame: true } })
          }
        >
          Back to Learning
        </button>
      </div>

      {!roundFinished && (
        <div style={styles.infoPanel}>
          <div style={styles.questionCount}>
            Question {qCount} / {TOTAL_QUESTIONS}
          </div>
          <div style={styles.sessionScore}>Score: {sessionScore}</div>
        </div>
      )}

      {roundFinished ? (
        <div>
          <p style={{ fontSize: "1.3rem", margin: "20px 0" }}>
            Final Score: {sessionScore} / {TOTAL_QUESTIONS}
          </p>
          <button style={styles.button} onClick={handlePlayAgain}>
            Play Again
          </button>
        </div>
      ) : (
        <>
          <p>Drag and drop the words into the correct categories:</p>

          <div style={styles.sentenceDisplay}>
            {currentSentence.sentence || "Loading sentence..."}
          </div>

          <div style={styles.optionsContainer}>
            {words.map((word, index) => (
              <div
                key={`${word}-${index}`}
                style={styles.wordOption}
                draggable
                onDragStart={(e) => handleDragStart(e, word)}
                onDragEnd={handleDragEnd}
              >
                {word}
              </div>
            ))}
          </div>

          <div style={styles.dropArea}>
            <div
              style={styles.dropZone}
              onDrop={(e) => handleDrop(e, "subject")}
              onDragOver={handleDragOver}
            >
              <h3>Subject</h3>
              {droppedWords.subject && (
                <div style={styles.wordOption}>{droppedWords.subject}</div>
              )}
              <div style={styles.hint}>{hints.subject}</div>
              <button
                style={styles.learnMoreBtn}
                onClick={() =>
                  currentSentence.subject &&
                  initWordAnalysis(currentSentence.subject, "Subject")
                }
                disabled={!currentSentence.subject}
              >
                Learn More
              </button>
            </div>

            <div
              style={styles.dropZone}
              onDrop={(e) => handleDrop(e, "object")}
              onDragOver={handleDragOver}
            >
              <h3>Object</h3>
              {droppedWords.object && (
                <div style={styles.wordOption}>{droppedWords.object}</div>
              )}
              <div style={styles.hint}>{hints.object}</div>
              <button
                style={styles.learnMoreBtn}
                onClick={() =>
                  currentSentence.object &&
                  initWordAnalysis(currentSentence.object, "Object")
                }
                disabled={!currentSentence.object}
              >
                Learn More
              </button>
            </div>

            <div
              style={styles.dropZone}
              onDrop={(e) => handleDrop(e, "verb")}
              onDragOver={handleDragOver}
            >
              <h3>Verb</h3>
              {droppedWords.verb && (
                <div style={styles.wordOption}>{droppedWords.verb}</div>
              )}
              <div style={styles.hint}>{hints.verb}</div>
              <button
                style={styles.learnMoreBtn}
                onClick={() =>
                  currentSentence.verb &&
                  initWordAnalysis(currentSentence.verb, "Verb")
                }
                disabled={!currentSentence.verb}
              >
                Learn More
              </button>
            </div>
          </div>

          <div style={styles.feedback}>{feedback}</div>

          <button style={styles.button} onClick={handleShowHints}>
            Show Hint
          </button>
          <button style={styles.button} onClick={handleNextSentence}>
            Next Sentence
          </button>
        </>
      )}

      {modalOpen && (
        <div style={styles.modal} onClick={() => setModalOpen(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <span style={styles.close} onClick={() => setModalOpen(false)}>
              ×
            </span>
            <h2>{wordAnalysisTitle}</h2>
            <div>
              <div>
                Analyzing: <span>{wordToAnalyze}</span>
              </div>

              <div style={styles.wordAnalysisOptions}>
                {wordAnalysisOptions.map((option, index) => (
                  <div
                    key={`${option.type}-${index}`}
                    style={styles.wordOption}
                    draggable
                    onDragStart={(e) => handleWordAnalysisDragStart(e, option)}
                    onDragEnd={handleWordAnalysisDragEnd}
                  >
                    {option.text}
                  </div>
                ))}
              </div>

              <div style={styles.analysisDropzoneContainer}>
                {["root", "form", "gender", "number", "person", "stem"].map(
                  (property) => (
                    <div
                      key={property}
                      style={styles.wordAnalysisDropzone}
                      onDrop={(e) => handleWordAnalysisDrop(e, property)}
                      onDragOver={handleDragOver}
                    >
                      <h3>
                        {property.charAt(0).toUpperCase() + property.slice(1)}
                        <span
                          style={styles.showAnswer}
                          onClick={() => toggleAnswer(property)}
                        >
                          (
                          {showAnswers[property]
                            ? "Hide Answer"
                            : "Show Answer"}
                          )
                        </span>
                      </h3>
                      {wordAnalysisDropped[property] && (
                        <div style={styles.wordOption}>
                          {wordAnalysisDropped[property].text}
                        </div>
                      )}
                      {showAnswers[property] && (
                        <div style={styles.answer}>
                          {getAnswerValue(property)}
                        </div>
                      )}
                    </div>
                  )
                )}

                {wordAnalysisTitle.includes("Verb") && (
                  <>
                    <div
                      style={styles.wordAnalysisDropzone}
                      onDrop={(e) => handleWordAnalysisDrop(e, "class")}
                      onDragOver={handleDragOver}
                    >
                      <h3>
                        Class
                        <span
                          style={styles.showAnswer}
                          onClick={() => toggleAnswer("class")}
                        >
                          (
                          {showAnswers["class"] ? "Hide Answer" : "Show Answer"}
                          )
                        </span>
                      </h3>
                      {wordAnalysisDropped["class"] && (
                        <div style={styles.wordOption}>
                          {wordAnalysisDropped["class"].text}
                        </div>
                      )}
                      {showAnswers["class"] && (
                        <div style={styles.answer}>
                          {getAnswerValue("class")}
                        </div>
                      )}
                    </div>

                    <div
                      style={styles.wordAnalysisDropzone}
                      onDrop={(e) => handleWordAnalysisDrop(e, "meaning")}
                      onDragOver={handleDragOver}
                    >
                      <h3>
                        Meaning
                        <span
                          style={styles.showAnswer}
                          onClick={() => toggleAnswer("meaning")}
                        >
                          (
                          {showAnswers["meaning"]
                            ? "Hide Answer"
                            : "Show Answer"}
                          )
                        </span>
                      </h3>
                      {wordAnalysisDropped["meaning"] && (
                        <div style={styles.wordOption}>
                          {wordAnalysisDropped["meaning"].text}
                        </div>
                      )}
                      {showAnswers["meaning"] && (
                        <div style={styles.answer}>
                          {getAnswerValue("meaning")}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div style={styles.wordAnalysisFeedback}>
                {wordAnalysisFeedback}
              </div>

              <button style={styles.button} onClick={checkWordAnalysisAnswers}>
                Check Answers
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DragDropGame;
