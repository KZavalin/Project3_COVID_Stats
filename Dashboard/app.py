from flask import Flask, render_template#, jsonify
#from flask_pymongo import PyMongo
import json

# Define and connect
app = Flask(__name__)
#MongoDB and flask_pymongo were used for pulling data from a local MongoDB server
#The json file from this pull has been saved separately and is now used instead of
#the MongoDB server to allow for running the code on a remote server.
#app.config['MONGO_URI'] = 'mongodb://localhost:27017/local.owid_covid_data'
#mongo = PyMongo(app)

# Fetch data from MongoDB
#def fetch_data_owid():
    #db = mongo.db.owid_covid_data.find()
    #json_data = []
    #for entry in db:
        #entry['_id'] = str(entry['_id']) 
        #json_data.append(entry)
    #return json_data

json_url = "databases\owid_covid_data.json"
owid_json = open(json_url)

# Route for API endpoint to fetch data
@app.route('/api/owid_covid_data')
def api_owid_covid_data():
    #data = fetch_data_owid()
    #marked out code below was used to make a json file for making this code run
    #independently of local MongoDB for putting the website on a web server
    #with open("owid_covid_data.json", "w") as outfile:
        #json.dump(data, outfile, default=str)
    #return jsonify(data)
    return owid_json

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/vaccinationdash')
def show_vaccinationdash():
    return render_template('mapIndex.html')

@app.route('/alldash')
def show_alldash():
    return render_template('mapIndex2.html')

@app.route('/map')
def show_map():
    return render_template('Choropleth_Continents.html')

@app.route('/map_country')
def show_map_country():
    return render_template('vac_only.html')

@app.route('/map_cases')
def show_map_cases():
    return render_template('population_map.html')

@app.route('/tourismbargraph')
def show_tourismbargraph():
    return render_template('tourismbargraph.html')

@app.route('/lockdown')
def show_lockdown():
   return render_template('lockdown.html')

if __name__ == '__main__':
    app.run(debug=False)
