import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Results() {
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResults = async () => {
      try {
        const interviewId = localStorage.getItem("lastInterviewId");
        const token = localStorage.getItem("token");

        if (!interviewId || !token) {
          navigate("/dashboard");
          return;
        }

        const response = await api.get(
          `/interviews/${interviewId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setInterview(response.data.interview);
      } catch (error) {
        console.error("Failed to load results:", error);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [navigate]);

  if (loading) {
    return (
      <div className="loading-screen">
        Loading your results...
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="loading-screen">
        No interview results found.
      </div>
    );
  }

  const score = interview.score || 0;

  const getPerformance = () => {
    if (score >= 85) {
      return {
        title: "Excellent Performance",
        description:
          "Your responses showed strong understanding and good answer completeness.",
      };
    }

    if (score >= 70) {
      return {
        title: "Good Performance",
        description:
          "You have a solid foundation. Add more technical depth and examples.",
      };
    }

    if (score >= 50) {
      return {
        title: "Room for Improvement",
        description:
          "Keep practicing and focus on explaining concepts with clear examples.",
      };
    }

    return {
      title: "Keep Practicing",
      description:
        "Focus on strengthening your fundamentals and providing more detailed responses.",
    };
  };

  const performance = getPerformance();

  return (
    <div className="results-page">
      <nav className="navbar">
        <div className="logo">InterviewAI</div>

        <button
          className="logout-btn"
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>
      </nav>

      <main className="results-container">

        <div className="results-header">
          <p className="eyebrow">INTERVIEW COMPLETE</p>

          <h1>Your Interview Results</h1>

          <p>
            {interview.role} · {interview.difficulty} ·{" "}
            {interview.interview_type || interview.type}
          </p>
        </div>

        <section className="score-section">

          <div className="score-circle">
            <strong>{score}</strong>
            <span>/100</span>
          </div>

          <div className="score-info">
            <h2>{performance.title}</h2>

            <p>{performance.description}</p>
          </div>

        </section>

        <section className="metrics-grid">

          <div className="metric-card">
            <span>Questions</span>
            <strong>{interview.answers.length}</strong>
          </div>

          <div className="metric-card">
            <span>Completion</span>
            <strong>100%</strong>
          </div>

          <div className="metric-card">
            <span>Overall Score</span>
            <strong>{score}/100</strong>
          </div>

        </section>

        <section className="feedback-section">

          <div className="feedback-card">
            <h2>Strengths</h2>

            <ul>
              <li>Attempted every interview question</li>
              <li>Responses were saved successfully</li>
              <li>Demonstrated understanding of the topic</li>
            </ul>
          </div>

          <div className="feedback-card">
            <h2>Areas to Improve</h2>

            <ul>
              <li>Add concrete examples to answers</li>
              <li>Explain technical concepts in more depth</li>
              <li>Practice concise and structured communication</li>
            </ul>
          </div>

        </section>

        <section className="answers-section">

          <h2>Your Answers</h2>

          {interview.answers.map((item, index) => (

            <div className="answer-review" key={item.id}>

              <div className="answer-number">
                {index + 1}
              </div>

              <div>

                <h3>{item.question}</h3>

                <p>{item.answer}</p>

                <small>
                  Response Score: {item.score}/100
                </small>

              </div>

            </div>

          ))}

        </section>

        <div className="results-actions">

          <button
            className="primary-btn"
            onClick={() => {
              localStorage.removeItem("interviewAnswers");
              localStorage.removeItem("lastInterviewId");

              navigate("/interview/setup");
            }}
          >
            Take Another Interview
          </button>

          <button
            className="secondary-btn"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>

        </div>

      </main>
    </div>
  );
}

export default Results;