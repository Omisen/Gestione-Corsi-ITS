from flask import Flask, render_template
from flask_mongoengine import MongoEngine

app = Flask(__name__)

#region Connection
app.config['MONGODB_SETTINGS'] ={
    'db' : 'my-test',
    'host' : 'localhost',
    'port' : 27017
}

db = MongoEngine(app)
#endregion


@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug = True)