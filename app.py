# from re import template
from flask import Flask, render_template, request, send_from_directory, redirect, session, url_for, jsonify
import json
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sentence_transformers import SentenceTransformer
import nltk

nltk.download('punkt')
from nltk.tokenize import word_tokenize
import numpy as np
import pandas as pd
import heapq

app = Flask(__name__)
app.secret_key = 'rkaligner'

ENV = 'dev'

if ENV == 'dev':
    app.debug = True
    #username:password@localhost/databasename
    app.config[
        'SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:123@localhost/rkaligner'
else:
    app.debug = False
    app.config[
        'SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:123@localhost/rkaligner'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


class Users(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(200), unique=True)
    is_admin = db.Column(db.Boolean, default=False)
    email = db.Column(db.String(200), unique=True)
    password = db.Column(db.String(200))

    def __init__(self, username, email, password, is_admin):
        self.username = username
        self.email = email
        self.password = password
        self.is_admin = is_admin
        super().__init__()

    def to_json(self):
        return {"email": self.email, "is_admin": self.is_admin}


class UserFiles(db.Model):
    __tablename__ = 'user_files'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(200))
    filename = db.Column(db.String(200))
    data = db.Column(db.JSON)
    date = db.Column(db.DateTime())
    validated = db.Column(db.Boolean, default=False)

    def __init__(self, filename, email, data, date, validated):
        self.filename = filename
        self.email = email
        self.data = data
        self.date = date
        self.validated = validated
        super().__init__()

    def to_json(self):
        return {
            "id": self.id,
            "filename": self.filename,
            "email": self.email,
            "data": self.data,
            "validated": self.validated,
            "date": self.date.isoformat(),
        }


class Validated(db.Model):
    __tablename__ = 'validated'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(200))
    data = db.Column(db.JSON)
    date = db.Column(db.DateTime())

    def __init__(self, filename, email, data, date):
        self.filename = filename
        self.email = email
        self.data = data
        self.date = date
        super().__init__()

    def to_json(self):
        return {
            "filename": self.filename,
            "email": self.email,
            "data": self.data,
            "date": self.date.isoformat(),
        }


# IMPORTANT:
# to create db table
# run this python script below instead of
# the 1-line code `db.create_all()`
# on python terminal v3.10
# it could be different to other python verson
# >>> from app import app, db
# >>> with app.app_context():
# ...     db.create_all()
# ...
# >>> exit()


@app.route('/registration_submit', methods=['POST'])
def registration_submit():
    if request.method == 'POST':
        content = request.json
        username = content['username']
        email = content['email']
        password = content['password']
        is_admin = False

        if username == '' or email == '' or password == '':
            return redirect(
                url_for('home_view',
                        message='Username, email and password are required.'))

        if db.session.query(Users).filter(
                Users.username == username
                and Users.email == email).count() == 0:
            data = Users(username, email, password, is_admin)
            db.session.add(data)
            db.session.commit()
        return render_template('index.html', message='Registration success!')


@app.route('/login_submit', methods=['POST'])
def login_submit():
    if request.method == 'POST':
        content = request.json
        email = content['email']
        password = content['password']
        user = Users.query.filter_by(email=email).first()

        if user is not None and user.password == password:
            session['email'] = email
            return jsonify({"user": email, "is_admin": user.is_admin})
        else:
            return jsonify({"error": email})


@app.route('/admin_fetch_allfiles', methods=['POST'])
def admin_files():
    if request.method == 'POST':
        content = request.json
        email = content['email']

        if email == None:
            return jsonify({"error": 'No email'})
        else:
            all_results = UserFiles.query.all()
            data = {
                "results":
                json.dumps([user_file.to_json() for user_file in all_results],
                           default=str)
            }
            return jsonify(data)


@app.route('/user_fetch_files', methods=['POST'])
def user_fetch_files():
    if request.method == 'POST':
        content = request.json
        email = content['email']

        if email == None:
            return jsonify({"error": 'No email'})
        else:
            all_results = UserFiles.query.filter_by(email=email).all()
            data = {
                "results":
                json.dumps([user_file.to_json() for user_file in all_results],
                           default=str)
            }
        return jsonify(data)


@app.route('/import_file', methods=['POST'])
def import_file():
    if request.method == 'POST':
        content = request.json
        source = content['source']
        target = content['target']
        filename = content['fileName']
        # parse to json to iterate
        stringified_source = json.loads(source)
        stringified_target = json.loads(target)

        score = 0

        convertedArray = []

        # define the number of rows and columns for the 2D array
        num_rows = len(stringified_source)
        num_cols = len(stringified_source)

        # iterate over the number of rows and columns to build the 2D array
        for i in range(num_rows):
            row = []
            for j in range(num_cols):
                # calculate the index of the current object
                index = i * num_cols + j
                # get the object from the list using the index
                obj = sim_align(stringified_source, stringified_target,
                                score)[index]
                # add the object to the current row
                row.append(obj)
            # add the current row to the results list
            convertedArray.append(row)

        # initialize 2D array with empty dictionaries
        top3_target = [[{}, {}, {}] for _ in range(len(convertedArray))]

        for i, d in enumerate(convertedArray):
            # iterate through each dictionary in the list
            for inner_d in d:
                source = inner_d['Source']
                target = inner_d['Target']
                score = inner_d['Score']
                # get the smallest score in the current row of the 2D array
                min_score = min(top3_target[i],
                                key=lambda x: x.get('Score', 0)).get(
                                    'Score', 0)
                # if current score is greater than the smallest score, replace it
                if score > min_score:
                    # use heapq to get the indices of the 3 largest scores in the row
                    top_indices = heapq.nlargest(
                        3,
                        range(len(top3_target[i])),
                        key=lambda x: top3_target[i][x].get('Score', 0))
                    # if target already exists in the row, update its score
                    for idx in top_indices:
                        if top3_target[i][idx].get('Target') == target:
                            top3_target[i][idx]['Score'] = score
                            break
                    else:
                        # if target does not exist in the row, add the current dictionary with target and score
                        top3_target[i][top_indices[-1]] = {
                            'Target': target,
                            'Score': score
                        }

                top3_target[i] = sorted(top3_target[i],
                                        key=lambda x: x.get('Score', 0),
                                        reverse=True)[:3]

        # print the resulting 2D array object
        print(top3_target)

        results = []
        for i in range(len(stringified_source)):
            item = {
                'source': stringified_source[i],
                'target': top3_target[i],
            }
            results.append(item)

        # if stringified_source == None or target == None or filename == '':
        #   return jsonify({ "error": 'Source, target files and filename are required fields' })

        data = {"results": results, "filename": filename}
        return jsonify(data)


@app.route('/save-results', methods=['POST', 'PUT'])
def save_results():
    if request.method == 'PUT':
        content = request.json
        email = content['email']
        response = content['source']
        filename = content['filename']
        file_id = content['id']
        is_validated = content['is_validated']
        date = datetime.now().isoformat()

        file = UserFiles.query.filter_by(id=file_id).first()

        if file and is_validated:
            file.validated = True
            db.session.commit()
            all_results = UserFiles.query.all()
            data = {
                "results":
                json.dumps([user_file.to_json() for user_file in all_results],
                           default=str)
            }
            return jsonify(data)

    elif request.method == 'POST':
        content = request.json
        email = content['email']
        response = content['source']
        filename = content['filename']
        date = datetime.now().isoformat()

        # Check if filename already exists
        suffix = 1
        while True:
            existing_record = UserFiles.query.filter_by(
                filename=filename).first()
            if existing_record is None:
                break
            suffix += 1
            # reassign filename with number suffix if existing record is not None
            filename = filename + str(suffix)


        if response == None or filename == '' or email == None:
            return jsonify({
                "error":
                'Source, answers files, email, and filename are required fields'
            })
        else:
            response_data = response
            data = UserFiles(filename, email, response_data, date, False)
            db.session.add(data)
            db.session.commit()
            all_results = UserFiles.query.filter_by(email=email).all()
            data = {
                "results":
                json.dumps([user_file.to_json() for user_file in all_results],
                           default=str)
            }
            return jsonify(data)


# routes uses index.html as template
template_routes = [
    '/', '/register', '/login', '/importer', '/score', '/aligned-files',
    '/admin_view_files', '/selected-file', '/edit-selected-file'
]


@app.route('/get_id/<int:id>', methods=['GET'])
def get_id(id):
    if request.method == 'GET':
        user_file = UserFiles.query.filter_by(id=id).first()
        if user_file is None:
            return jsonify({'error': 'File not found'})
        else:
            data = {"results": json.dumps([user_file.to_json()], default=str)}
            return jsonify(data)


def home_view():
    to = request.args.get('to')
    return render_template('index.html')


@app.route('/')
def index():
    return render_template('index.html')


for route in template_routes:
    app.add_url_rule(route, view_func=home_view)


# for images, css, js files
@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)


@app.route('/templates/<path:path>')
def send_templates(path):
    return send_from_directory('templates', path)


def cosine(u, v):
    return np.dot(u, v) / (np.linalg.norm(u) * np.linalg.norm(v))


def sim_align(source_list, target_list, cosineScore):
    sbert_model = SentenceTransformer('bert-base-nli-mean-tokens')
    aligned = []
    # compile_daw = []
    for sor in source_list:
        source_sentence = sbert_model.encode([sor])[0]
        for targ in target_list:
            cosineScore = cosine(source_sentence,
                                 sbert_model.encode([targ])[0])
            scorePerPair = {
                'Source': sor,
                'Target': targ,
                'Score': np.float32(cosineScore)
            }
            # compile_daw.append(scorePerPair)
            json_data = json.dumps(scorePerPair, default=convert)
            aligned.append(json_data)
    conv = [json.loads(s.replace("'", "\"")) for s in aligned]
    return conv


def convert(obj):
    if isinstance(obj, np.float32):
        return float(obj)
    else:
        return obj


# def formatto2DArray():

if __name__ == '__main__':
    app.debug = True
    app.run()
