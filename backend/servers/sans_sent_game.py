from flask import Flask, jsonify, send_from_directory
import json
import random
import argparse
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load sentences data
def load_sentences():
    try:
        # Try multiple possible locations for sentences.json
        possible_paths = [
            "../dataset/sentences.json",  # From servers folder
            "dataset/sentences.json",     # From root folder
            "sentences.json"              # Current folder
        ]
        
        for path in possible_paths:
            try:
                with open(path, "r", encoding="utf-8") as f:
                    print(f"Successfully loaded sentences from: {path}")
                    return json.load(f)
            except FileNotFoundError:
                continue
                
        print("sentences.json not found in any expected location")
        return []
    except Exception as e:
        print(f"Error loading sentences: {e}")
        return []

sentences = load_sentences()

@app.route('/health')
def health():
    return jsonify({"status": "healthy", "server": "sentence_game"})

@app.route('/')
def home():
    return send_from_directory('../games', 'sent_game.html')

@app.route('/get_random_sentence')
def get_random_sentence():
    if not sentences:
        return jsonify({"error": "No sentences available"}), 404
    
    sentence_data = random.choice(sentences)
    
    # Create hint data
    hint = {
        "subject": sentence_data["subject"] if sentence_data["subject"] else None,
        "object": sentence_data["object"] if sentence_data["object"] else None,
        "verb": sentence_data["verb"]
    }
    
    return jsonify({
        "sentence": sentence_data["sentence"],
        "subject": sentence_data["subject"],
        "object": sentence_data["object"],
        "verb": sentence_data["verb"],
        "tense": sentence_data["tense"],
        "hint": hint
    })

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int, default=5001)
    args = parser.parse_args()
    
    app.run(debug=True, host='0.0.0.0', port=args.port)
