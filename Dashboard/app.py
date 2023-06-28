from flask import Flask, render_template, jsonify
from flask_pymongo import PyMongo

# Define and connect
app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost:27017/local.owid_covid_data'
mongo = PyMongo(app)

# Fetch data from MongoDB
def fetch_data_owid():
    db = mongo.db.owid_covid_data.find()
    json_data = []
    for entry in db:
        entry['_id'] = str(entry['_id']) 
        json_data.append(entry)
    return json_data

# Route for API endpoint to fetch data
@app.route('/api/owid_covid_data')
def api_owid_covid_data():
    data = fetch_data_owid()
    return jsonify(data)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/vaccinationdash')
def show_vaccinationdash():
    data = fetch_data_owid()
    return render_template('mapIndex.html', data=data)

@app.route('/alldash')
def show_alldash():
    data = fetch_data_owid()
    return render_template('mapIndex2.html', data=data)

@app.route('/map')
def show_map():
    data = fetch_data_owid()
    return render_template('Choropleth_Continents.html', data=data)

@app.route('/map_country')
def show_map_country():
    data = fetch_data_owid()
    return render_template('vac_only.html', data=data)

@app.route('/tourismbargraph')
def show_tourism():
    data = fetch_data_owid()
    return render_template('tourismbargraph.html', data=data)

if __name__ == '__main__':
    app.run(debug=False)
