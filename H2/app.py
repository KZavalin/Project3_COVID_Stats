from flask import Flask, render_template, jsonify
from flask_pymongo import PyMongo

# Define and connect
app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost:27017/local.tourism'
mongo = PyMongo(app)

# Fetch data from MongoDB
def fetch_data():
    data = mongo.db.tour.find()
    json_data = []
    for entry in data:
        entry['country_name'] = str(entry['country_name']) 
        json_data.append(entry)
    return json_data

@app.route('/')
def index():
    return render_template('index.html')

# Route for API endpoint to fetch data
@app.route('/api/tourism')
def api_tour():
    data = fetch_data()
    return jsonify(data)

# @app.route('/map')
# def show_map():
#     data = fetch_data()
#     return render_template('Choropleth_Continents.html', data=data)

if __name__ == '__main__':
    app.run(debug=False)