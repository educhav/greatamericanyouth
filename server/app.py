import sqlite3
import os
from datetime import timedelta
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token
import hashlib

# Connect to the database
db = sqlite3.connect('greatamericanyouth.db', check_same_thread=False)

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.environ['JWT_TOKEN']
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=90)
CORS(app)
jwt = JWTManager(app)
cursor = db.cursor()


def hash(password):
    return hashlib.sha256(password.encode()).hexdigest()


@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data["username"]
    password = data["password"]
    hashed_password = hash(password)

    params = (username, hashed_password)
    cursor.execute(
        'SELECT * FROM Users WHERE username = ? AND password = ?', params)
    user = cursor.fetchone()
    print(user)

    if user:
        return jsonify({'status': 'success', 'role': user[2], 'token': create_access_token(identity={"username": username, "role": user[2]})})

    return jsonify({'status': 'error'})


@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data["username"]
    password = data["password"]
    role = "normie"
    hashed_password = hash(password)
    cursor.execute('SELECT * FROM Users WHERE username = ?', (username,))
    account = cursor.fetchone()
    # Username already exists
    if account:
        return jsonify({'status': 'error'})

    params = (username, hashed_password, role)

    cursor.execute('INSERT INTO Users (username, password, role) VALUES (?, ?, ?)',
                   params)
    db.commit()
    return jsonify({'status': 'success', 'role': "normie", 'token': create_access_token(identity={"username": username, "role": "normie"})})


@app.route('/api/messages', methods=['GET'])
def get_messages():
    senders = request.args.get("senders").split(",")
    quantity = request.args.get("quantity")

    messages = []
    for sender in senders:
        cursor.execute(
            'SELECT * FROM Messages WHERE sender = ? AND LENGTH(content) >= 15 ORDER BY RANDOM() LIMIT ?', (sender, quantity))
        messages.append(cursor.fetchall())

    if messages:
        return jsonify(messages)

    return jsonify({'status': 'error'})


@app.route('/api/leaderboards', methods=['POST'])
def post_score():
    data = request.get_json()
    username = data["username"]
    score = data["score"]
    game = data["game"]

    cursor.execute("SELECT * FROM Scores WHERE username = ? AND game = ?", (username,game))

    entry = cursor.fetchone()
    # update the score if the user already has an entry
    if entry:
        if score > int(entry[1]):
            cursor.execute("UPDATE Scores SET score = ? WHERE username = ? AND game = ?",
                           (score, username, game))
    else:
        cursor.execute("INSERT INTO Scores VALUES(?,?,?)", (username, score, game))
    db.commit()

    return jsonify({'status': 'success'})


@app.route('/api/leaderboards', methods=['GET'])
def get_leaderboard():
    games = request.args.get("games").split(",")

    scores = {}
    for game in games:
        cursor.execute('SELECT * FROM Scores WHERE game = ? ORDER BY score DESC', (game,))
        scores[game] = cursor.fetchall()

    if scores:
        return jsonify(scores)
    return jsonify({'status': 'error'})


if __name__ == "__main__":
    app.run()
