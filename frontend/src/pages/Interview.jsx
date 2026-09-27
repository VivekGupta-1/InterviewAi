import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const questionBank = {
  "Software Engineer": [
    "What is the difference between an array and a linked list?",
    "Explain the concept of object-oriented programming and its main principles.",
    "What is the difference between authentication and authorization?",
    "What is a REST API and how does it work?",
    "What is the difference between SQL and NoSQL databases?",
    "Explain what happens when you enter a URL in a web browser.",
    "What is Git and why is version control important?",
    "What is the difference between a process and a thread?",
    "Explain the concept of time complexity with an example.",
    "What is the purpose of HTTP status codes?"
  ],

  "Frontend Developer": [
    "What is the difference between let, const and var in JavaScript?",
    "What is the Virtual DOM in React?",
    "Explain the difference between state and props in React.",
    "What are React hooks?",
    "What is responsive web design?",
    "Explain event bubbling in JavaScript.",
    "What is the difference between == and ===?",
    "How does browser localStorage work?",
    "What is the purpose of semantic HTML?",
    "How would you improve website performance?"
  ],

  "Backend Developer": [
    "What is a REST API?",
    "What is middleware?",
    "Explain authentication using JWT.",
    "What is database indexing?",
    "What is the difference between SQL JOIN types?",
    "What is caching and why is it useful?",
    "Explain the MVC architecture.",
    "What is an ORM?",
    "How would you secure a backend API?",
    "How would you design an API for millions of users?"
  ],

  "Full Stack Developer": [
    "Explain the architecture of a typical full-stack web application.",
    "What is the difference between frontend and backend rendering?",
    "How does JWT authentication work?",
    "How would you design a REST API?",
    "How do frontend and backend applications communicate?",
    "What is database normalization?",
    "How would you handle file uploads securely?",
    "What is CORS?",
    "How would you deploy a full-stack application?",
    "How would you scale a web application?"
  ],

  "Data Analyst": [
    "What is the difference between mean, median and mode?",
    "What is data normalization?",
    "What is the difference between INNER JOIN and LEFT JOIN?",
    "What is a primary key?",
    "What is correlation?",
    "What is the difference between classification and regression?",
    "How do you handle missing data?",
    "What is an outlier?",
    "Why is data visualization important?",
    "Explain the difference between SQL WHERE and HAVING."
  ],

  "Machine Learning Engineer": [
    "What is supervised learning?",
    "Explain the bias-variance tradeoff.",
    "What is overfitting and how can you prevent it?",
    "What is the difference between classification and regression?",
    "Explain gradient descent.",
    "What is cross-validation?",
    "What is feature engineering?",
    "Explain precision, recall and F1-score.",
    "What is the purpose of a confusion matrix?",
    "How would you deploy a machine learning model?"
  ],

  "QA Engineer": [
    "What is software testing?",
    "What is the difference between verification and validation?",
    "Explain the software testing life cycle.",
    "What is regression testing?",
    "What is the difference between severity and priority?",
    "What is API testing?",
    "What is test automation?",
    "Explain boundary value analysis.",
    "What is a test case?",
    "How would you test a login page?"
  ]
};

function Interview() {
  const navigate = useNavigate();

  const [setup, setSetup] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [interviewId, setInterviewId] = useState(null);

  useEffect(() => {
    const savedSetup = localStorage.getItem("interviewSetup");

    if (!savedSetup) {
      navigate("/interview/setup");
      return;
    }

    const parsedSetup = JSON.parse(savedSetup);

    setSetup(parsedSetup);

const createInterview = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.post(
      "/interviews",
      parsedSetup,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setInterviewId(response.data.interview.id);
  } catch (error) {
    console.error("Failed to create interview:", error);
  }
};

createInterview();

const roleQuestions =
  questionBank[parsedSetup.role] ||
  questionBank["Software Engineer"];

const selectedQuestions = [...roleQuestions]
  .sort(() => Math.random() - 0.5)
  .slice(0, Number(parsedSetup.questions));

setQuestions(selectedQuestions);
  }, [navigate]);

  useEffect(() => {
    if (!questions.length) return;

    if (timeLeft <= 0) {
      submitAnswer();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, questions]);

  const submitAnswer = async () => {
  if (!answer.trim() || !interviewId) return;

  try {
    const token = localStorage.getItem("token");

    await api.post(
      `/interviews/${interviewId}/answers`,
      {
        question: questions[currentIndex],
        answer: answer.trim(),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const newAnswers = [
      ...answers,
      {
        question: questions[currentIndex],
        answer: answer.trim(),
      },
    ];

    setAnswers(newAnswers);
    setAnswer("");
    setTimeLeft(120);

    if (currentIndex === questions.length - 1) {
      localStorage.setItem(
        "interviewAnswers",
        JSON.stringify(newAnswers)
      );

      localStorage.setItem(
        "lastInterviewId",
        String(interviewId)
      );

      navigate("/results");
      return;
    }

    setCurrentIndex((prev) => prev + 1);

  } catch (error) {
    console.error("Failed to save answer:", error);

    alert(
      error.response?.data?.message ||
      "Could not save your answer. Please try again."
    );
  }
};

  if (!setup || !questions.length) {
    return (
      <div className="loading-screen">
        Loading interview...
      </div>
    );
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="interview-page">

      <header className="interview-header">

        <div className="logo">
          InterviewAI
        </div>

        <div className="interview-info">
          <span>
            {setup.role}
          </span>

          <span>
            Question {currentIndex + 1} / {questions.length}
          </span>
        </div>

      </header>

      <main className="interview-container">

        <div className="progress-container">
          <div
            className="progress-bar"
            style={{
              width: `${((currentIndex + 1) / questions.length) * 100}%`
            }}
          />
        </div>

        <div className="question-card">

          <div className="question-meta">
            <span>
              {setup.type}
            </span>

            <span className="timer">
              ⏱ {minutes}:{seconds.toString().padStart(2, "0")}
            </span>
          </div>

          <h1>
            {questions[currentIndex]}
          </h1>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here. Explain your reasoning clearly..."
            rows="9"
          />

          <div className="answer-footer">

            <span>
              {answer.length} characters
            </span>

            <button
              className="primary-btn submit-answer-btn"
              onClick={submitAnswer}
              disabled={!answer.trim()}
            >
              {currentIndex === questions.length - 1
                ? "Finish Interview"
                : "Submit Answer →"}
            </button>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Interview;