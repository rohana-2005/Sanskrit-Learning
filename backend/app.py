from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
import subprocess
import threading
import time
import requests
import os
import sys
from pathlib import Path
import logging
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={r"/api/*": {
    "origins": ["http://localhost:5173"],
    "methods": ["GET", "POST", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"]
}})

# === Configuration ===
SANS_SENT_PORT = 5001
VERB_GAME_PORT = 5002
TENSE_GAME_PORT = 5003
NUMBER_GAME_PORT = 5004
MTC_GAME_PORT = 5005
DATABASE_PORT = 5006
MAIN_PORT = 5000

# === Server process holders ===
sans_sent_process = None
verb_game_process = None
tense_game_process = None
number_game_process = None
mtc_game_process = None

def start_server(script_path, port, server_name):
    try:
        logger.info(f"Starting {server_name} on port {port}...")
        script_full_path = Path(__file__).parent / "servers" / script_path
        if not script_full_path.exists():
            logger.error(f"Error: {script_full_path} not found")
            return None
        env = os.environ.copy()
        env['PYTHONPATH'] = str(Path.cwd())
        env['FLASK_ENV'] = 'production'
        env['FLASK_DEBUG'] = '0'
        process = subprocess.Popen(
            [sys.executable, "-u", str(script_full_path), "--port", str(port)],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            env=env
        )
        logger.info(f"{server_name} started with PID: {process.pid}")
        def print_output():
            for line in process.stdout:
                logger.info(f"[{server_name}] {line.strip()}")
        threading.Thread(target=print_output, daemon=True).start()
        return process
    except Exception as e:
        logger.error(f"Error starting {server_name}: {str(e)}")
        return None

def check_server_health(port, server_name):
    try:
        response = requests.get(f"http://localhost:{port}/health", timeout=5)
        return response.status_code == 200
    except Exception as e:
        logger.warning(f"Health check failed for {server_name}: {str(e)}")
        return False

def start_background_servers():
    global sans_sent_process, verb_game_process, tense_game_process, number_game_process, mtc_game_process
    sans_sent_process = start_server("sans_sent_game.py", SANS_SENT_PORT, "Sentence Game Server")
    verb_game_process = start_server("verb_game.py", VERB_GAME_PORT, "Verb Game Server")
    tense_game_process = start_server("tense_game.py", TENSE_GAME_PORT, "Tense Game Server")
    number_game_process = start_server("number_game.py", NUMBER_GAME_PORT, "Number Game Server")
    mtc_game_process = start_server("mtcGame.py", MTC_GAME_PORT, "Matching Game Server")
    for port, name in [
        (SANS_SENT_PORT, "Sentence Game"),
        (VERB_GAME_PORT, "Verb Game"),
        (TENSE_GAME_PORT, "Tense Game"),
        (NUMBER_GAME_PORT, "Number Game"),
        (MTC_GAME_PORT, "Matching Game"),
        (DATABASE_PORT, "Database")
    ]:
        for _ in range(5):
            if check_server_health(port, name):
                logger.info(f"✓ {name} Server is running")
                break
            logger.warning(f"Waiting for {name} Server...")
            time.sleep(1)
        else:
            logger.error(f"✗ {name} Server failed to start")

# === Routes ===
@app.route('/')
def home():
    logger.info("Accessing root URL /")
    return '''<!DOCTYPE html><html><head><title>Sanskrit Learning System</title><style>
    body { font-family: Arial; max-width: 800px; margin: 50px auto; padding: 20px; }
    .game-card { border: 1px solid #ddd; padding: 20px; margin: 20px 0; border-radius: 8px; }
    .btn { background: #4CAF50; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; margin: 5px; display: inline-block; }
    .btn:hover { background: #45a049; }
    </style></head><body>
    <h1>🕉️ Sanskrit Learning System</h1>
    <div class="game-card"><h3>📝 Sentence Analysis Game</h3><a href="/sentence-game" class="btn">Play</a><a href="/api/sentence-status" class="btn">Status</a></div>
    <div class="game-card"><h3>🔤 Verb Conjugation Game</h3><a href="/verb-game" class="btn">Play</a><a href="/api/verb-status" class="btn">Status</a></div>
    <div class="game-card"><h3>🔢 Number Game</h3><a href="/number-game" class="btn">Play</a><a href="/api/number-status" class="btn">Status</a></div>
    <div class="game-card"><h3>🧩 Matching Game</h3><a href="/api/get-matching-game" class="btn">Play</a><a href="/api/mtc-status" class="btn">Status</a></div>
    <div class="game-card"><h3>⚙️ Controls</h3><a href="/api/restart-servers" class="btn">Restart Servers</a><a href="/api/status" class="btn">System Status</a><a href="/api/generate-sentences" class="btn">Generate Sentences</a></div>
    </body></html>'''

@app.route('/sentence-game')
def sentence_game():
    try:
        return send_from_directory('games', 'sent_game.html')
    except Exception as e:
        logger.error(f"Error loading sentence game: {str(e)}")
        return jsonify({'error': f"Error loading sentence game: {str(e)}"}), 404

@app.route('/verb-game')
def verb_game():
    try:
        return send_from_directory('games', 'verb.html')
    except Exception as e:
        logger.error(f"Error loading verb game: {str(e)}")
        return jsonify({'error': f"Error loading verb game: {str(e)}"}), 404

@app.route('/number-game')
def number_game():
    try:
        return send_from_directory('games', 'number_game.html')
    except Exception as e:
        logger.error(f"Error loading number game: {str(e)}")
        return jsonify({'error': f"Error loading number game: {str(e)}"}), 404

@app.route('/api/sentences')
def get_sentences():
    try:
        with open(os.path.join('dataset', 'sentences.json'), encoding='utf-8') as f:
            data = json.load(f)
        return jsonify(data)
    except Exception as e:
        logger.error(f"Error loading sentences: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/get-game')
def get_verb_game():
    try:
        response = requests.get(f"http://localhost:{VERB_GAME_PORT}/api/get-game", timeout=10)
        return jsonify(response.json()) if response.ok else jsonify({"error": "Failed to get game data"}), response.status_code
    except Exception as e:
        logger.error(f"Error fetching verb game data: {str(e)}")
        return jsonify({"error": str(e)}), 503

@app.route('/api/get-number-game', methods=['GET', 'OPTIONS'])
def get_number_game():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
        response.headers.add('Access-Control-Allow-Methods', 'GET, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        return response
    try:
        headers = {}
        auth_header = request.headers.get('Authorization')
        if auth_header:
            headers['Authorization'] = auth_header
        response = requests.get(f"http://localhost:{NUMBER_GAME_PORT}/api/get-number-game", headers=headers, timeout=10)
        return jsonify(response.json()) if response.ok else jsonify({"error": "Failed to get number game data"}), response.status_code
    except Exception as e:
        logger.error(f"Error fetching number game data: {str(e)}")
        return jsonify({"error": str(e)}), 503

@app.route('/api/generate-matching-game')
def generate_matching_game():
    try:
        dataset_path = Path("dataset")
        if not dataset_path.exists():
            logger.error("Dataset directory not found")
            return jsonify({"status": "error", "message": "Dataset directory not found"}), 404
        os.chdir(dataset_path)
        result = subprocess.run([sys.executable, "mtc_gen.py"], capture_output=True, text=True)
        os.chdir(Path(__file__).parent)
        if result.returncode == 0:
            return jsonify({"status": "success", "message": "Matching game data generated successfully", "output": result.stdout})
        else:
            logger.error(f"Failed to generate matching game data: {result.stderr}")
            return jsonify({"status": "error", "message": "Failed to generate matching game data", "error": result.stderr}), 500
    except Exception as e:
        logger.error(f"Error running mtc_gen.py: {str(e)}")
        return jsonify({"status": "error", "message": f"Error running mtc_gen.py: {str(e)}"}), 500

@app.route('/api/get-matching-game')
def get_matching_game():
    try:
        file_path = Path('dataset/matching_game.json')
        if not file_path.exists():
            logger.error("matching_game.json not found")
            return jsonify({'error': 'matching_game.json not found'}), 404
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return jsonify(data), 200
    except Exception as e:
        logger.error(f"Error loading matching game data: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/tense-question')
def proxy_tense_question():
    try:
        response = requests.get(f"http://localhost:{TENSE_GAME_PORT}/api/get-tense-question", timeout=10)
        return jsonify(response.json()) if response.ok else jsonify({"error": "Failed to get tense question"}), response.status_code
    except Exception as e:
        logger.error(f"Tense Game server error: {str(e)}")
        return jsonify({"error": f"Tense Game server error: {str(e)}"}), 503

@app.route('/api/status')
def system_status():
    return jsonify({
        "main_server": "online",
        "sentence_game_server": "online" if check_server_health(SANS_SENT_PORT, "Sentence Game") else "offline",
        "verb_game_server": "online" if check_server_health(VERB_GAME_PORT, "Verb Game") else "offline",
        "tense_game_server": "online" if check_server_health(TENSE_GAME_PORT, "Tense Game") else "offline",
        "number_game_server": "online" if check_server_health(NUMBER_GAME_PORT, "Number Game") else "offline",
        "matching_game_server": "online" if check_server_health(MTC_GAME_PORT, "Matching Game") else "offline",
        "database_server": "online" if check_server_health(DATABASE_PORT, "Database") else "offline",
        "ports": {
            "main": MAIN_PORT,
            "sentence_game": SANS_SENT_PORT,
            "verb_game": VERB_GAME_PORT,
            "tense_game": TENSE_GAME_PORT,
            "number_game": NUMBER_GAME_PORT,
            "matching_game": MTC_GAME_PORT,
            "database": DATABASE_PORT
        }
    })

@app.route('/api/sentence-status')
def sentence_status():
    status = check_server_health(SANS_SENT_PORT, "Sentence Game")
    return jsonify({"status": "online" if status else "offline", "port": SANS_SENT_PORT, "url": f"http://localhost:{SANS_SENT_PORT}"})

@app.route('/api/verb-status')
def verb_status():
    status = check_server_health(VERB_GAME_PORT, "Verb Game")
    return jsonify({"status": "online" if status else "offline", "port": VERB_GAME_PORT, "url": f"http://localhost:{VERB_GAME_PORT}"})

@app.route('/api/tense-status')
def tense_status():
    status = check_server_health(TENSE_GAME_PORT, "Tense Game")
    return jsonify({"status": "online" if status else "offline", "port": TENSE_GAME_PORT, "url": f"http://localhost:{TENSE_GAME_PORT}"})

@app.route('/api/number-status')
def number_status():
    status = check_server_health(NUMBER_GAME_PORT, "Number Game")
    return jsonify({"status": "online" if status else "offline", "port": NUMBER_GAME_PORT, "url": f"http://localhost:{NUMBER_GAME_PORT}"})

@app.route('/api/mtc-status')
def mtc_status():
    status = check_server_health(MTC_GAME_PORT, "Matching Game")
    return jsonify({"status": "online" if status else "offline", "port": MTC_GAME_PORT, "url": f"http://localhost:{MTC_GAME_PORT}"})

@app.route('/api/database-status')
def database_status():
    status = check_server_health(DATABASE_PORT, "Database")
    return jsonify({"status": "online" if status else "offline", "port": DATABASE_PORT, "url": f"http://localhost:{DATABASE_PORT}"})

@app.route('/api/restart-servers')
def restart_servers():
    global sans_sent_process, verb_game_process, tense_game_process, number_game_process, mtc_game_process
    for process, name in [
        (sans_sent_process, "Sentence Game Server"),
        (verb_game_process, "Verb Game Server"),
        (tense_game_process, "Tense Game Server"),
        (number_game_process, "Number Game Server"),
        (mtc_game_process, "Matching Game Server")
    ]:
        if process:
            process.terminate()
            logger.info(f"Stopped {name}")
    threading.Thread(target=start_background_servers, daemon=True).start()
    return jsonify({"message": "Servers are restarting..."})

@app.route('/api/generate-sentences')
def generate_sentences():
    try:
        dataset_path = Path("dataset")
        if not dataset_path.exists():
            logger.error("Dataset directory not found")
            return jsonify({"status": "error", "message": "Dataset directory not found"}), 404
        os.chdir(dataset_path)
        result = subprocess.run([sys.executable, "gen.py"], capture_output=True, text=True)
        os.chdir(Path(__file__).parent)
        if result.returncode == 0:
            return jsonify({"status": "success", "message": "Sentences generated", "output": result.stdout})
        else:
            logger.error(f"Failed to generate sentences: {result.stderr}")
            return jsonify({"status": "error", "message": result.stderr}), 500
    except Exception as e:
        logger.error(f"Error running gen.py: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/mtc-game')
def get_mtc_game():
    try:
        file_path = Path('dataset/matching_game.json')
        if not file_path.exists():
            logger.error("matching_game.json not found")
            return jsonify({'error': 'matching_game.json not found'}), 404
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return jsonify(data), 200
    except Exception as e:
        logger.error(f"Error loading mtc game data: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/health')
def health():
    return jsonify({"status": "healthy", "server": "main"})

@app.route('/api/register', methods=['POST', 'OPTIONS'])
def register_user():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        return response
    try:
        response = requests.post(f'http://localhost:{DATABASE_PORT}/api/register', json=request.json, timeout=10)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        logger.error(f"Error proxying register: {str(e)}")
        return jsonify({'error': 'Database server unavailable'}), 503

@app.route('/api/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        return response
    try:
        response = requests.post(f'http://localhost:{DATABASE_PORT}/api/login', json=request.json, timeout=10)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        logger.error(f"Error proxying login: {str(e)}")
        return jsonify({'error': 'Database server unavailable'}), 503

@app.route('/api/profile', methods=['GET', 'OPTIONS'])
def get_profile():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
        response.headers.add('Access-Control-Allow-Methods', 'GET, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        return response
    try:
        headers = {'Authorization': request.headers.get('Authorization')}
        response = requests.get(f'http://localhost:{DATABASE_PORT}/api/profile', headers=headers, timeout=10)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        logger.error(f"Error proxying profile: {str(e)}")
        return jsonify({'error': 'Database server unavailable'}), 503

@app.route('/api/update-score', methods=['POST', 'OPTIONS'])
def update_score():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        return response
    try:
        headers = {'Authorization': request.headers.get('Authorization')}
        response = requests.post(f'http://localhost:{DATABASE_PORT}/api/update-score', json=request.json, headers=headers, timeout=10)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        logger.error(f"Error proxying update-score: {str(e)}")
        return jsonify({'error': 'Database server unavailable'}), 503

@app.route('/api/test', methods=['GET'])
def test_endpoint():
    try:
        response = requests.get(f'http://localhost:{DATABASE_PORT}/api/test', timeout=10)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        logger.error(f"Error proxying test: {str(e)}")
        return jsonify({'error': 'Database server unavailable'}), 503

def cleanup_processes():
    global sans_sent_process, verb_game_process, tense_game_process, number_game_process, mtc_game_process
    for process, name in [
        (sans_sent_process, "Sentence Game Server"),
        (verb_game_process, "Verb Game Server"),
        (tense_game_process, "Tense Game Server"),
        (number_game_process, "Number Game Server"),
        (mtc_game_process, "Matching Game Server")
    ]:
        if process:
            process.terminate()
            logger.info(f"Stopped {name}")

if __name__ == '__main__':
    import atexit
    logger.info("🕉️ Starting Sanskrit Learning System...")
    atexit.register(cleanup_processes)
    threading.Thread(target=start_background_servers, daemon=True).start()
    app.run(debug=False, host='0.0.0.0', port=MAIN_PORT, use_reloader=False)