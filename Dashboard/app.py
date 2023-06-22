from flask import Flask, render_template, jsonify
from flask_pymongo import PyMongo

# Define and connect
app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost:27017/vaccination'
mongo = PyMongo(app)

# Fetch data from MongoDB
def fetch_data():
    data = mongo.db.vac.find()
    json_data = []
    for entry in data:
        entry['_id'] = str(entry['_id']) 
        json_data.append(entry)
    return json_data

# Route for API endpoint to fetch data
@app.route('/api/vaccination')
def api_vaccination():
    data = fetch_data()
    return jsonify(data)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/dashboard')
def show_dashboard():
    data = fetch_data()
    return render_template('mapIndex.html', data=data)

@app.route('/map')
def show_map():
    data = fetch_data()
    return render_template('Choropleth_Continents.html', data=data)

if __name__ == '__main__':
    app.run(debug=False)
