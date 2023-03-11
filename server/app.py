import sqlite3
import os
from datetime import timedelta
import threading
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
import hashlib
import json
import uuid

# Connect to the database
db = sqlite3.connect('../greatamericanyouth.db', check_same_thread=False)

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.environ['JWT_TOKEN']
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=90)
app.config['MAX_CONTENT_LENGTH'] = 1024 * 1024 * 1024 * 1024
CORS(app)
jwt_manager = JWTManager(app)
cursor = db.cursor()

lock = threading.Lock()


def hash(password):
    return hashlib.sha256(password.encode()).hexdigest()


@app.route('/login', methods=['POST'])
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


@app.route('/register', methods=['POST'])
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


@app.route('/messages', methods=['GET'])
def get_messages():
    senders = request.args.get("senders").split(",")
    quantity = request.args.get("quantity")
    length = request.args.get("length")
    token = request.args.get("token")
    if token is None:
        return jsonify({'status': 'unauthorized'})

    messages = []
    for sender in senders:
        cursor.execute(
            'SELECT * FROM Messages WHERE sender = ? AND LENGTH(content) >= 15 ORDER BY RANDOM() LIMIT ?', (sender, quantity))
        messages.append(cursor.fetchall())

    if messages:
        return jsonify(messages)

    return jsonify({'status': 'error'})


@app.route('/leaderboards', methods=['POST'])
def post_score():
    data = request.get_json()
    username = data["username"]
    score = data["score"]
    game = data["game"]

    cursor.execute(
        "SELECT * FROM Scores WHERE username = ? AND game = ?", (username, game))

    entry = cursor.fetchone()
    # update the score if the user already has an entry
    if entry:
        if score > int(entry[1]):
            cursor.execute("UPDATE Scores SET score = ? WHERE username = ? AND game = ?",
                           (score, username, game))
    else:
        cursor.execute("INSERT INTO Scores VALUES(?,?,?)",
                       (username, score, game))
    db.commit()

    return jsonify({'status': 'success'})


@app.route('/leaderboards', methods=['GET'])
def get_leaderboard():
    games = request.args.get("games").split(",")

    scores = {}
    for game in games:
        cursor.execute(
            'SELECT * FROM Scores WHERE game = ? ORDER BY score DESC', (game,))
        scores[game] = cursor.fetchall()

    if scores:
        return jsonify(scores)
    return jsonify({'status': 'error'})


@app.route('/article', methods=['GET'])
def get_articles():
    username = request.args.get("username")
    urlName = request.args.get("urlName")

    if username and urlName:
        return jsonify({'status': 'incorrect usage of endpoint'})

    with lock:
        if username:
            cursor.execute(
                'SELECT * FROM Articles WHERE username = ? ORDER BY date DESC', (username,))
        elif urlName:
            cursor.execute(
                'SELECT * FROM Articles WHERE urlName = ?', (urlName,))
        else:
            cursor.execute(
                'SELECT * FROM Articles ORDER BY date DESC')

        articles = cursor.fetchall()

        response = []
        for article in articles:
            response.append({attr[0]: val for (attr, val)
                            in zip(cursor.description, article)})

    return jsonify(response)


@app.route('/article-meta', methods=['GET'])
def get_article_metadata():
    urlName = request.args.get('urlName')
    with lock:
        cursor.execute(
            'SELECT thumbnail, title, description FROM Articles WHERE urlName = ?', (urlName,))
        row = cursor.fetchone()
        response = {attr[0]: val for (
            attr, val) in zip(cursor.description, row)}

    return jsonify(response)


@app.route('/article', methods=['POST'])
@jwt_required()
def post_article():
    data = request.form
    urlName = data["urlName"]
    title = data["title"]
    author = data["author"]
    description = data["description"]
    date = data["date"]
    username = data["username"]
    avatarName = data["avatarName"]
    thumbnailName = data["thumbnailName"]
    avatar = request.files['avatar']
    thumbnail = request.files['thumbnail']
    tags = request.form.getlist('tags')
    sections = request.form.getlist('sections')

    cursor.execute('SELECT * FROM Articles WHERE urlName = ?', (urlName,))

    if cursor.fetchone():
        return jsonify({'status': 'duplicate'})

    media_dir = os.path.join('article-media', urlName)

    if not os.path.exists(media_dir):
        os.mkdir(media_dir)

    avatar_ext = avatarName.split('.')[1]
    avatar_path = os.path.join(media_dir, 'avatar.' + avatar_ext)
    avatar.save(avatar_path)

    thumbnail_ext = thumbnailName.split('.')[1]
    thumbnail_path = os.path.join(media_dir, 'thumbnail.' + thumbnail_ext)
    thumbnail.save(thumbnail_path)

    tags_text = ""
    if tags:
        tags_text = json.dumps(tags)

    sections_text = []

    for (i, section) in enumerate(sections):
        section_text = {'content': section, 'media': []}

        j = 0
        while True:
            field_name = "sections[" + str(i) + "][" + str(j) + "]"
            if field_name not in request.files:
                break
            media = request.files[field_name]
            name = data["names[" + str(i) + "][" + str(j) + "]"]
            text = data["texts[" + str(i) + "][" + str(j) + "]"]

            hash_ = str(uuid.uuid4())[:8]
            split_ = name.split(".")

            path = os.path.join(media_dir, split_[0] + hash_ + "." + split_[1])
            media.save(path)

            section_text['media'].append({
                'path': path,
                'text': text
            })

            j += 1

        sections_text.append(section_text)

    sections_text = json.dumps(sections_text)

    cursor.execute('INSERT INTO Articles VALUES(?,?,?,?,?,?,?,?,?,?,?)', (urlName, title, author,
                   date, description, 1, username, thumbnail_path, avatar_path, tags_text, sections_text))

    db.commit()

    return {'status': 'success'}


if __name__ == "__main__":
    app.run()
