import random
import json
from flask import Flask, jsonify
from flask_cors import CORS
from pathlib import Path

app = Flask(__name__)
CORS(app)

# === File loading helpers ===
def load_json_from_possible_paths(possible_paths):
    for path in possible_paths:
        try:
            with open(path, "r", encoding="utf-8") as f:
                print(f"Loaded: {path}")
                return json.load(f)
        except FileNotFoundError:
            continue
    print(f"❌ File not found in: {possible_paths}")
    return None

# === Load data ===
sentences = load_json_from_possible_paths([
    "../dataset/sentences.json", "dataset/sentences.json", "sentences.json"
]) or []

conjugations = load_json_from_possible_paths([
    "../dataset/conjugations.json", "dataset/conjugations.json", "conjugations.json"
]) or {}

raw_verbs = load_json_from_possible_paths([
    "../dataset/verbs.json", "dataset/verbs.json", "verbs.json"
]) or {}

# === Flatten verbs with class info ===
verbs = []
for vclass, content in raw_verbs.items():
    for verb in content["verbs"]:
        verb["verb_class"] = vclass
        verbs.append(verb)

# === Helper Functions ===
def label(person, number):
    person_map = {"1": "First person", "2": "Second person", "3": "Third person"}
    number_map = {"sg": "singular", "du": "dual", "pl": "plural"}
    return f"{person_map.get(person)} {number_map.get(number)}"

def replace_verb_with_blank(text, form):
    words = text.split()
    if form in words:
        words[words.index(form)] = "_____"
    else:
        words[-1] = "_____"
    return " ".join(words)

def generate_distractors(correct_form, root, vclass, tense):
    if tense not in conjugations or vclass not in conjugations[tense]:
        return []

    stem = root
    matching = next((v for v in verbs if v["root"] == root and v["verb_class"] == vclass), None)
    if tense == "past":
        stem = matching.get("past_stem", root)
    elif tense == "future":
        stem = matching.get("future_stem", root)

    distractors = []
    for key, suffix in conjugations[tense][vclass].items():
        try:
            if stem.endswith("्"):
                stem = stem[:-1]
            form = stem + suffix.replace("A", "")
            if form != correct_form:
                distractors.append(form)
        except:
            continue
    return random.sample(distractors, min(3, len(distractors)))

def generate_explanation(sentence):
    subject = sentence.get("subject", {})
    verb = sentence.get("verb", {})
    obj = sentence.get("object", {})

    parts = [
        f"Subject '{subject.get('form', '')}' is in {label(subject.get('person'), subject.get('number'))} form.",
        f"Verb root: '{verb.get('root')}', class {verb.get('class')}, meaning: '{verb.get('meaning', '')}'.",
        f"This verb {'requires' if obj else 'does not require'} an object.",
        f"The correct form is '{verb.get('form')}' to match the subject.",
        f"Full sentence: {sentence.get('sentence')}"
    ]
    return " ".join(parts)

# === API Route ===
@app.route("/api/get-game")
def get_game():
    if not sentences:
        return jsonify({"error": "No data"}), 404

    q = random.choice(sentences)
    sentence = replace_verb_with_blank(q["sentence"], q["verb"]["form"])

    options = [q["verb"]["form"]] + generate_distractors(
        q["verb"]["form"],
        q["verb"]["root"],
        q["verb"]["class"],
        q["tense"]
    )
    random.shuffle(options)

    return jsonify({
        "sentence": sentence,
        "correct": q["verb"]["form"],
        "options": options,
        "hint": f"Hint: Subject '{q['subject']['form']}' is {label(q['subject']['person'], q['subject']['number'])}.",
        "explanation": generate_explanation(q)
    })

# ✅ Add health check route
@app.route("/health")
def health():
    return jsonify({"status": "healthy", "server": "verb_game"}), 200

# === Start server ===
if __name__ == "__main__":
    print(f"Loaded {len(sentences)} sentences")
    app.run(debug=True, port=5002)
