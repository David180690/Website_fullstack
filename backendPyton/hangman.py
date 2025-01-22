from flask import Flask, request, jsonify
from flask_cors import CORS  # Corrected import
import random
import logging

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Set up logging
logging.basicConfig(level=logging.DEBUG)

# Game storage
games = {}

# Helper functions
def initialize_game():
    word_list = ["python", "flask", "svelte", "frontend", "backend"]
    word = random.choice(word_list)
    logging.debug(f"Initializing game with word: {word}")  # Log the word
    return {
        "word": word,
        "guessed_letters": [],
        "remaining_attempts": 6,
        "status": "playing",
    }

def make_guess(game, letter):
    if game["status"] != "playing":
        logging.warning(f"Game is already over. Status: {game['status']}")
        return {"error": "Game is already over."}

    if letter in game["guessed_letters"]:
        logging.warning(f"Letter '{letter}' already guessed.")
        return {"error": "Letter already guessed."}

    game["guessed_letters"].append(letter)

    if letter not in game["word"]:
        game["remaining_attempts"] -= 1
        logging.debug(f"Incorrect guess: {letter}. Remaining attempts: {game['remaining_attempts']}")

    if game["remaining_attempts"] == 0:
        game["status"] = "lost"
        logging.info(f"Game lost. Word was: {game['word']}")
    elif all(c in game["guessed_letters"] for c in game["word"]):
        game["status"] = "won"
        logging.info(f"Game won! Word was: {game['word']}")

    # Generate partially guessed word
    guessed_word = "".join(
        [c if c in game["guessed_letters"] else "_" for c in game["word"]]
    )
    logging.debug(f"Guessed word so far: {guessed_word}")

    return {
        "word": game["word"],
        "guessed_letters": game["guessed_letters"],
        "remaining_attempts": game["remaining_attempts"],
        "status": game["status"],
        "guessed_word": guessed_word,
    }

# Routes
@app.route("/start", methods=["POST"])
def start_game():
    game_id = len(games) + 1
    games[game_id] = initialize_game()
    logging.info(f"Started new game with ID: {game_id}")
    return jsonify({"game_id": game_id, "word_length": len(games[game_id]["word"])})

@app.route("/guess", methods=["POST"])
def guess():
    data = request.json
    game_id = data.get("game_id")
    letter = data.get("letter")

    if not game_id or not letter:
        logging.error("Missing game_id or letter in request")
        return jsonify({"error": "Missing game_id or letter"}), 400

    if game_id not in games:
        logging.error(f"Game with ID {game_id} not found.")
        return jsonify({"error": "Game not found"}), 404

    result = make_guess(games[game_id], letter)
    return jsonify(result)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=4000)
