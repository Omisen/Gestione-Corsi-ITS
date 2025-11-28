from flask import Flask
from flask_mongoengine import MongoEngine

app = Flask(__name__)

#region Connection
app.config['MONGODB_SETTINGS'] ={
    'db' : 'gestore-corsi',
    'host' : 'localhost',
    'port' : 27017
}

db = MongoEngine(app)
#endregion


@app.route('/')
def index():
    return "Server Avviato"

if __name__ == '__main__':
    app.run(debug = True)