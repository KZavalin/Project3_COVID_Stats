# Import the dependencies.
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from flask import Flask, jsonify
from datetime import datetime as dt

# Define and connect
app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost:27017/tourism'
mongo = PyMongo(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/map')
def create_map():
    
if __name__ == '__main__':
    app.run(debug=False)