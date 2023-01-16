# from re import template
from flask import Flask, render_template, request, send_from_directory, redirect, session, url_for, jsonify
import json
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'rkaligner'

ENV = 'dev'

if ENV == 'dev':
  app.debug = True
  #username:password@localhost/databasename
  app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:sayunlng@localhost/rkaligner'
else:
  app.debug = False
  app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:sayunlng@localhost/rkaligner'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
class Users(db.Model):
  __tablename__ = 'users'
  id = db.Column(db.Integer, primary_key=True)
  username = db.Column(db.String(200), unique=True)
  email = db.Column(db.String(200), unique=True)
  password = db.Column(db.String(200))

  def __init__(self, username, email, password):
    self.username = username
    self.email = email
    self.password = password
    super().__init__()
    
class UserFiles(db.Model):
  __tablename__ = 'user_files'
  id = db.Column(db.Integer, primary_key=True)
  username = db.Column(db.String(200))
  filename = db.Column(db.String(200))
  data = db.Column(db.JSON)
  date = db.Column(db.DateTime())

  def __init__(self, filename, username, data, date):
    self.filename = filename
    self.username = username
    self.data = data
    self.date = date
    super().__init__()
    
  def to_json(self):
    return {
      "filename": self.filename,
      "username": self.username,
      "data": self.data,
      "date": self.date.isoformat(),
    }
    
class Validated(db.Model):
  __tablename__ = 'validated'
  id = db.Column(db.Integer, primary_key=True)
  username = db.Column(db.String(200))
  data = db.Column(db.JSON)
  date = db.Column(db.DateTime())

  def __init__(self, filename, username, data, date):
    self.filename = filename
    self.username = username
    self.data = data
    self.date = date
    super().__init__()
    
  def to_json(self):
    return {
      "filename": self.filename,
      "username": self.username,
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
    print(username, email, password)
    
    if username == '' or email == '' or password == '':
      return redirect(url_for('home_view', message='Username, email and password are required.'))
  
    if db.session.query(Users).filter(Users.username == username and Users.email == email).count() == 0:
      data = Users(username, email, password)
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
      session['username'] = email
      return jsonify({"user": email})
    else:
      return jsonify({ "error": email })

  
@app.route('/import_file', methods=['POST'])
def import_file():
  if request.method == 'POST':
    content = request.json
    source = content['source']
    target = content['target']
    filename = content['fileName']
    # parse to json to iterate
    stringified_source = json.loads(source)
    
    answers = [[{ "answer": 'lorem ipsum1', "score": 0.25}, { "answer": 'lorem ipsum2', "score": 0.20 }, { "answer": 'lorem ipsum3', "score": 0.35}], [{ "answer": 'lorem ipsum1', "score": 0.13}, { "answer": 'lorem ipsum2', "score": 0.19 }, { "answer": 'lorem ipsum3', "score": 0.54}], [{ "answer": 'lorem ipsum1', "score": 0.24}, { "answer": 'lorem ipsum2', "score": 0.45 }, { "answer": 'lorem ipsum3', "score": 0.12}], [{ "answer": 'lorem ipsum1', "score": 0.16}, { "answer": 'lorem ipsum2', "score": 0.18 }, { "answer": 'lorem ipsum3', "score": 0.22}], [{ "answer": 'lorem ipsum1', "score": 0.31}, { "answer": 'lorem ipsum2', "score": 0.21 }, { "answer": 'lorem ipsum3', "score": 0.41}]]
    results = []
    
    for i in range(len(stringified_source)):
      item = {'text': stringified_source[i], 'answers': answers[i]}
      results.append(item)
    
    if stringified_source == None or target == None or filename == '':
      return jsonify({ "error": 'Source, target files and filename are required fields' })
    
    print('import results', json.dumps(results, indent=2))
    
    data = {
      "results": results,
      "filename": filename
    }
    return jsonify(data)
  
@app.route('/save-results', methods=['POST'])
def save_results():
  if request.method == 'POST':
    content = request.json
    username = content['username']
    source = content['source']
    filename = content['filename']
    date = datetime.now().isoformat()
    stringified_source = json.loads(source)
    
    # Check if filename already exists
    suffix = 1
    while True:
      existing_record = UserFiles.query.filter_by(filename=filename).first()
      if existing_record is None:
        break
      suffix += 1
      # reassign filename with number suffix if existing record is not None
      filename = filename + str(suffix)
      
    answers = [[{ "answer": 'lorem ipsum1', "score": 0.25}, { "answer": 'lorem ipsum2', "score": 0.20 }, { "answer": 'lorem ipsum3', "score": 0.35}], [{ "answer": 'lorem ipsum1', "score": 0.13}, { "answer": 'lorem ipsum2', "score": 0.19 }, { "answer": 'lorem ipsum3', "score": 0.54}], [{ "answer": 'lorem ipsum1', "score": 0.24}, { "answer": 'lorem ipsum2', "score": 0.45 }, { "answer": 'lorem ipsum3', "score": 0.12}], [{ "answer": 'lorem ipsum1', "score": 0.16}, { "answer": 'lorem ipsum2', "score": 0.18 }, { "answer": 'lorem ipsum3', "score": 0.22}], [{ "answer": 'lorem ipsum1', "score": 0.31}, { "answer": 'lorem ipsum2', "score": 0.21 }, { "answer": 'lorem ipsum3', "score": 0.41}]]
    result = []

    for index, val in enumerate(stringified_source):
      item = {'text': val['text'], 'answers': val['answers']}
      result.append(item)
      
    if result == None or filename == '' or username == None:
      return jsonify({ "error": 'Source, answers files, username, and filename are required fields' })
    else:
      data = UserFiles(filename, username, result, date)
      db.session.add(data)
      db.session.commit()
      all_results = UserFiles.query.filter_by(username=username).all()
      data = {
        "results": json.dumps([user_file.to_json() for user_file in all_results], default=str)
      }
      return jsonify(data)

# routes uses index.html as template
template_routes = ['/', '/register', '/login', '/importer', '/score', '/aligned-files']

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
  
if __name__ == '__main__':
  app.debug = True
  app.run()