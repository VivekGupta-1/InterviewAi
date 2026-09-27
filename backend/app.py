from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, User, Interview, Answer
import jwt
import datetime
import os
from functools import wraps


app = Flask(__name__)

CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///interviewai.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = os.getenv(
    "SECRET_KEY",
    "interviewai-development-secret"
)

db.init_app(app)

with app.app_context():
    db.create_all()


# =========================
# AUTHENTICATION HELPER
# =========================

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")

        if not token:
            return jsonify({"message": "Token is missing"}), 401

        try:
            if token.startswith("Bearer "):
                token = token.split(" ")[1]

            decoded = jwt.decode(
                token,
                app.config["SECRET_KEY"],
                algorithms=["HS256"]
            )

            current_user = User.query.get(decoded["user_id"])

            if not current_user:
                return jsonify({"message": "User not found"}), 401

        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired"}), 401

        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token"}), 401

        return f(current_user, *args, **kwargs)

    return decorated


# =========================
# BASIC ROUTES
# =========================

@app.route("/")
def home():
    return jsonify({
        "message": "InterviewAI Backend is running!",
        "status": "success"
    })


@app.route("/api/health")
def health():
    return jsonify({
        "status": "healthy",
        "service": "InterviewAI API"
    })


# =========================
# AUTH ROUTES
# =========================

@app.route("/api/auth/register", methods=["POST"])
def register():
    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({
            "message": "All fields are required"
        }), 400

    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({
            "message": "Email already registered"
        }), 409

    user = User(
        name=name,
        email=email
    )

    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "Registration successful",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    }), 201


@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "message": "Email and password are required"
        }), 400

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({
            "message": "Invalid email or password"
        }), 401

    token = jwt.encode(
        {
            "user_id": user.id,
            "exp": datetime.datetime.utcnow()
            + datetime.timedelta(hours=24)
        },
        app.config["SECRET_KEY"],
        algorithm="HS256"
    )

    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    })


# =========================
# INTERVIEW ROUTES
# =========================

@app.route("/api/interviews", methods=["POST"])
@token_required
def create_interview(current_user):
    data = request.get_json()

    role = data.get("role")
    interview_type = data.get("type")
    difficulty = data.get("difficulty")
    question_count = data.get("questions")

    if not all([
        role,
        interview_type,
        difficulty,
        question_count
    ]):
        return jsonify({
            "message": "Interview configuration is incomplete"
        }), 400

    interview = Interview(
        user_id=current_user.id,
        role=role,
        interview_type=interview_type,
        difficulty=difficulty,
        question_count=int(question_count)
    )

    db.session.add(interview)
    db.session.commit()

    return jsonify({
        "message": "Interview created",
        "interview": {
            "id": interview.id,
            "role": interview.role,
            "type": interview.interview_type,
            "difficulty": interview.difficulty,
            "questions": interview.question_count
        }
    }), 201


@app.route("/api/interviews/<int:interview_id>/answers", methods=["POST"])
@token_required
def save_answer(current_user, interview_id):
    interview = Interview.query.filter_by(
        id=interview_id,
        user_id=current_user.id
    ).first()

    if not interview:
        return jsonify({
            "message": "Interview not found"
        }), 404

    data = request.get_json()

    question = data.get("question")
    answer = data.get("answer")

    if not question or not answer:
        return jsonify({
            "message": "Question and answer are required"
        }), 400

    # Simple response completeness score
    length = len(answer.strip())

    if length > 250:
        score = 90
    elif length > 150:
        score = 80
    elif length > 80:
        score = 70
    elif length > 40:
        score = 60
    else:
        score = 45

    new_answer = Answer(
        interview_id=interview.id,
        question=question,
        answer=answer,
        score=score
    )

    db.session.add(new_answer)
    db.session.commit()

    # Update interview average score
    all_answers = Answer.query.filter_by(
        interview_id=interview.id
    ).all()

    if all_answers:
        interview.score = round(
            sum(a.score for a in all_answers) / len(all_answers)
        )

        db.session.commit()

    return jsonify({
        "message": "Answer saved",
        "answer": {
            "id": new_answer.id,
            "score": new_answer.score
        },
        "interview_score": interview.score
    }), 201


@app.route("/api/interviews", methods=["GET"])
@token_required
def get_interviews(current_user):
    interviews = Interview.query.filter_by(
        user_id=current_user.id
    ).order_by(
        Interview.created_at.desc()
    ).all()

    return jsonify({
        "interviews": [
            {
                "id": interview.id,
                "role": interview.role,
                "type": interview.interview_type,
                "difficulty": interview.difficulty,
                "questions": interview.question_count,
                "score": interview.score,
                "created_at": interview.created_at.isoformat()
                if interview.created_at else None
            }
            for interview in interviews
        ]
    })


@app.route("/api/interviews/<int:interview_id>", methods=["GET"])
@token_required
def get_interview(current_user, interview_id):
    interview = Interview.query.filter_by(
        id=interview_id,
        user_id=current_user.id
    ).first()

    if not interview:
        return jsonify({
            "message": "Interview not found"
        }), 404

    return jsonify({
        "interview": {
            "id": interview.id,
            "role": interview.role,
            "type": interview.interview_type,
            "difficulty": interview.difficulty,
            "questions": interview.question_count,
            "score": interview.score,
            "created_at": interview.created_at.isoformat()
            if interview.created_at else None,
            "answers": [
                {
                    "id": answer.id,
                    "question": answer.question,
                    "answer": answer.answer,
                    "score": answer.score
                }
                for answer in interview.answers
            ]
        }
    })


# =========================
# RUN SERVER
# =========================

if __name__ == "__main__":
    app.run(
        debug=True,
        port=5000
    )