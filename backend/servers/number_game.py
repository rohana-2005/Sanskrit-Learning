from flask import Flask, jsonify
from flask_cors import CORS
import json
import random
import argparse
from pathlib import Path
import logging

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# File path setup
BASE_DIR = Path(__file__).resolve().parent
SENTENCE_PATH = BASE_DIR.parent / "dataset" / "sentences.json"

# Load sentences at startup
logger.info(f"Attempting to load sentences from: {SENTENCE_PATH}")
if not SENTENCE_PATH.exists():
    logger.error(f"Sentences file not found at: {SENTENCE_PATH}")
    all_sentences = []
else:
    try:
        with open(SENTENCE_PATH, encoding="utf-8") as f:
            all_sentences = json.load(f)
        # Filter sentences, handling missing 'requires_object'
        filtered_sentences = []
        for s in all_sentences:
            try:
                if not s.get('verb', {}).get('requires_object', False):
                    filtered_sentences.append(s)
                else:
                    logger.debug(f"Skipping sentence due to requires_object: {s}")
            except Exception as e:
                logger.warning(f"Invalid sentence format: {s}, error: {str(e)}")
        all_sentences = filtered_sentences
        logger.info(f"Loaded {len(all_sentences)} sentences without requires_object")
    except Exception as e:
        logger.error(f"Error loading sentences: {str(e)}")
        all_sentences = []

@app.route("/api/get-number-game", methods=["GET"])
def get_sentence():
    logger.info("Received request for /api/get-number-game")
    if not all_sentences:
        logger.warning("No sentences available")
        return jsonify({"error": "No sentences available"}), 404
    sentence = random.choice(all_sentences)
    logger.info(f"Returning sentence: {sentence}")
    return jsonify(sentence)

@app.route("/health")
def health():
    logger.info("Health check requested")
    return jsonify({"status": "healthy", "server": "number_game"})

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=5004)
    args = parser.parse_args()
    logger.info(f"Starting Number Game Server on port {args.port}")
    app.run(host="0.0.0.0", port=args.port, debug=False)