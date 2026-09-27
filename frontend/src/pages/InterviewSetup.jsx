import { useState } from "react";
import { useNavigate } from "react-router-dom";

function InterviewSetup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    role: "Software Engineer",
    type: "Technical",
    difficulty: "Medium",
    questions: "5",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const startInterview = (e) => {
    e.preventDefault();

    localStorage.setItem(
      "interviewSetup",
      JSON.stringify(form)
    );

    navigate("/interview");
  };

  return (
    <div className="setup-page">

      <div className="setup-card">

        <div className="logo">InterviewAI</div>

        <p className="eyebrow">
          INTERVIEW CONFIGURATION
        </p>

        <h1>Customize your interview</h1>

        <p className="setup-description">
          Choose your preferences and let InterviewAI
          simulate a realistic interview.
        </p>

        <form onSubmit={startInterview}>

          <div className="form-group">
            <label>Job Role</label>

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option>Software Engineer</option>
              <option>Frontend Developer</option>
              <option>Backend Developer</option>
              <option>Full Stack Developer</option>
              <option>Data Analyst</option>
              <option>Machine Learning Engineer</option>
              <option>QA Engineer</option>
            </select>
          </div>

          <div className="form-group">
            <label>Interview Type</label>

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
            >
              <option>Technical</option>
              <option>HR / Behavioral</option>
              <option>Mixed</option>
            </select>
          </div>

          <div className="form-group">
            <label>Difficulty</label>

            <select
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          <div className="form-group">
            <label>Number of Questions</label>

            <select
              name="questions"
              value={form.questions}
              onChange={handleChange}
            >
              <option value="3">3 Questions</option>
              <option value="5">5 Questions</option>
              <option value="10">10 Questions</option>
            </select>
          </div>

          <button
            type="submit"
            className="primary-btn"
          >
            Start Interview →
          </button>

        </form>

        <button
          className="back-btn"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

      </div>

    </div>
  );
}

export default InterviewSetup;