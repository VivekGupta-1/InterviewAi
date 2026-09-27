import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInterviews = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await api.get(
          "/interviews",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setInterviews(response.data.interviews);

      } catch (error) {
        console.error(
          "Failed to load interviews:",
          error
        );

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }

      } finally {
        setLoading(false);
      }
    };

    loadInterviews();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const scores = interviews
    .map((interview) => interview.score)
    .filter((score) => score > 0);

  const averageScore =
    scores.length > 0
      ? Math.round(
          scores.reduce((a, b) => a + b, 0) /
            scores.length
        )
      : 0;

  const bestScore =
    scores.length > 0
      ? Math.max(...scores)
      : 0;

  return (
    <div className="dashboard">

      <nav className="navbar">

        <div className="logo">
          InterviewAI
        </div>

        <div className="nav-right">

          <span>
            Hi, {user.name || "Candidate"} 👋
          </span>

          <button
            onClick={logout}
            className="logout-btn"
          >
            Logout
          </button>

        </div>

      </nav>

      <main className="dashboard-content">

        <section className="hero-section">

          <div>

            <p className="eyebrow">
              AI-POWERED INTERVIEW PREP
            </p>

            <h1>
              Practice. Improve.
              <br />
              Get Interview Ready.
            </h1>

            <p>
              Simulate realistic interviews,
              practice technical questions,
              and track your performance over time.
            </p>

            <button
              className="primary-btn start-btn"
              onClick={() =>
                navigate("/interview/setup")
              }
            >
              Start New Interview →
            </button>

          </div>

        </section>

        <section className="stats-grid">

          <div className="stat-card">

            <span>
              Interviews
            </span>

            <strong>
              {loading ? "..." : interviews.length}
            </strong>

          </div>

          <div className="stat-card">

            <span>
              Average Score
            </span>

            <strong>
              {loading
                ? "..."
                : scores.length > 0
                ? `${averageScore}/100`
                : "—"}
            </strong>

          </div>

          <div className="stat-card">

            <span>
              Best Score
            </span>

            <strong>
              {loading
                ? "..."
                : scores.length > 0
                ? `${bestScore}/100`
                : "—"}
            </strong>

          </div>

        </section>

        <section className="history-section">

          <div className="section-header">

            <div>
              <p className="eyebrow">
                PERFORMANCE HISTORY
              </p>

              <h2>
                Recent Interviews
              </h2>
            </div>

          </div>

          {loading ? (

            <div className="empty-state">
              Loading interview history...
            </div>

          ) : interviews.length === 0 ? (

            <div className="empty-state">

              <h3>
                No interviews yet
              </h3>

              <p>
                Start your first mock interview
                to begin tracking your progress.
              </p>

            </div>

          ) : (

            <div className="history-list">

              {interviews.slice(0, 5).map(
                (interview) => (

                  <div
                    className="history-card"
                    key={interview.id}
                  >

                    <div className="history-info">

                      <h3>
                        {interview.role}
                      </h3>

                      <p>
                        {interview.type} ·{" "}
                        {interview.difficulty} ·{" "}
                        {interview.questions} questions
                      </p>

                    </div>

                    <div className="history-score">

                      <strong>
                        {interview.score}/100
                      </strong>

                      <span>
                        Score
                      </span>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default Dashboard;