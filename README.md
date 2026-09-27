# InterviewAI

> A full-stack mock interview platform for practicing technical and behavioral interviews with performance tracking.

## Overview

InterviewAI is a web-based interview preparation platform that allows candidates to simulate mock interviews, answer role-specific questions, receive response-completeness scores, and track their interview performance over time.

The project was developed as a full-stack application using React and Flask with SQLite for data persistence.

## Features

- 🔐 User Registration & Login
- 🔑 JWT-based Authentication
- 🎯 Custom Interview Configuration
- 💼 Multiple Job Roles
- 🧠 Technical, HR/Behavioral and Mixed Interview Types
- 📊 Easy, Medium and Hard Difficulty Levels
- ❓ Role-specific Interview Questions
- ⏱️ 120-second Question Timer
- 📝 Real-time Answer Submission
- 💾 Persistent Interview & Answer Storage
- 📈 Automatic Response Completeness Scoring
- 📊 Performance Dashboard
- 🏆 Average and Best Score Tracking
- 📋 Interview History
- 📱 Responsive User Interface

## Supported Roles

- Software Engineer
- Frontend Developer
- Backend Developer
- Full Stack Developer
- Data Analyst
- Machine Learning Engineer
- QA Engineer

## Technology Stack

### Frontend

- React
- Vite
- React Router
- Axios
- JavaScript
- CSS

### Backend

- Python
- Flask
- Flask-SQLAlchemy
- Flask-CORS
- PyJWT
- Werkzeug

### Database

- SQLite
- SQLAlchemy ORM

## System Architecture

```text
                    ┌─────────────────────┐
                    │      React UI       │
                    │      (Vite)         │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │      Flask API      │
                    │   Authentication    │
                    │ Interview Management│
                    └──────────┬──────────┘
                               │
                               │ SQLAlchemy
                               ▼
                    ┌─────────────────────┐
                    │       SQLite        │
                    │                     │
                    │ Users               │
                    │ Interviews          │
                    │ Answers             │
                    └─────────────────────┘


Project Structure
InterviewAi/
│
├── backend/
│   ├── app.py
│   ├── models.py
│   ├── requirements.txt
│   └── interviewai.db
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── InterviewSetup.jsx
│   │   │   ├── Interview.jsx
│   │   │   └── Results.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── .gitignore
How It Works
1. Authentication

Users create an account and log in using their email and password.

Passwords are securely hashed before being stored in the database.

JWT tokens are generated after successful login and used to authenticate protected API requests.

2. Interview Configuration

Candidates can select:

Job role
Interview type
Difficulty
Number of questions
3. Interview

The system selects questions from a role-specific question bank.

Each question has a 120-second timer.

Candidates submit their answers through the web interface.

4. Evaluation

The current MVP uses a response-completeness rubric based on answer length.

This provides a deterministic baseline score that can later be replaced or enhanced with an LLM-based evaluation engine.

5. Performance Tracking

Interview attempts and answers are stored in SQLite.

The dashboard calculates:

Total interviews
Average score
Best score
Recent interview history
API Endpoints
Authentication
POST /api/auth/register
POST /api/auth/login
Interview
POST /api/interviews
GET  /api/interviews
GET  /api/interviews/<id>
POST /api/interviews/<id>/answers
Health Check
GET /api/health
Installation
Backend

Navigate to the backend:

cd backend

Create a virtual environment:

python -m venv venv

Activate it on Windows:

.\venv\Scripts\Activate.ps1

Install dependencies:

pip install -r requirements.txt

Start the Flask server:

python app.py

Backend:

http://127.0.0.1:5000
Frontend

Open another terminal:

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev

Frontend:

http://localhost:5173
Security

The application includes:

Password hashing using Werkzeug
JWT authentication
Protected interview endpoints
User-specific interview access
CORS configuration
Future Improvements
LLM-powered answer evaluation
Voice-based interviews
Resume-based personalized questions
Job-description analysis
Adaptive interview difficulty
AI-generated follow-up questions
Interview analytics and charts
PostgreSQL deployment
Cloud deployment
Interview report generation
Current MVP

The current version focuses on delivering a complete working interview workflow:

Register
   ↓
Login
   ↓
Dashboard
   ↓
Interview Configuration
   ↓
Mock Interview
   ↓
Answer Submission
   ↓
Backend Evaluation
   ↓
Results
   ↓
Performance History
Author

Vivek Kumar Gupta

B.Tech Computer Science & Engineering
AI/ML Specialization
IILM University, Greater Noida
```text
