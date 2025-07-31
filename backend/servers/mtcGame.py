from flask import Flask, jsonify
from flask_cors import CORS
import json
import os
from pathlib import Path
import argparse

app = Flask(__name__)
CORS(app)

@app.route('/api/get-matching-game')
def get_matching_game():
    try:
        file_path = Path(__file__).parent.parent / "dataset" / "matching_game.json"
        if not file_path.exists():
            return jsonify({"error": "matching_game.json not found"}), 404

        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({'error': f"Server error: {str(e)}"}), 500

@app.route('/health')
def health():
    return jsonify({"status": "healthy", "server": "matching-game"})

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int, default=5005)
    args = parser.parse_args()
    app.run(host='0.0.0.0', port=args.port, debug=False)
