import random
import json
from flask import Flask, jsonify
from flask_cors import CORS
import argparse
from pathlib import Path

app = Flask(__name__)
CORS(app)

BASE_DIR = Path(__file__).resolve().parent
SENTENCE_PATH = BASE_DIR.parent / "dataset" / "sentences.json"

with open(SENTENCE_PATH, "r", encoding="utf-8") as f:
    all_questions = json.load(f)

# 🔧 Function to generate explanation for each sentence
def generate_explanation(q):
    verb = q.get("verb", {})
    subject = q.get("subject", {})
    obj = q.get("object", {})

    explanation = []

    if verb:
        explanation.append(
            f"Verb root: '{verb.get('root', '')}', form: '{verb.get('form', '')}' "
            f"({q.get('tense')} tense), meaning: '{verb.get('meaning', '')}'."
        )
    
    if subject:
        explanation.append(
            f"Subject: '{subject.get('form', '')}', number: {subject.get('number', '')}, gender: {subject.get('gender', '')}."
        )
    
    if obj:
        explanation.append(
            f"Object: '{obj.get('form', '')}', number: {obj.get('number', '')}, gender: {obj.get('gender', '')}."
        )

    return " ".join(explanation)



# ✅ Add explanation to each question
for q in all_questions:
    q["explanation"] = generate_explanation(q)

# ✅ Route to serve random question
@app.route("/api/get-tense-question", methods=["GET"])
def get_tense_question():
    question = random.choice(all_questions)
    return jsonify(question)

@app.route("/health")
def health():
    return jsonify({"status": "healthy"})
if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=5003)
    args = parser.parse_args()
    app.run(host="0.0.0.0", port=args.port)
