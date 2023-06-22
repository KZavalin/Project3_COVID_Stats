// Define the path to the GeoJSON file
var myGeoJSONPath = 'static/js/mymap.geo.json';
// Array to store continent data
var continents = [];

// Function to fetch continent data from CSV
function fetchContinentsFromCSV(csvFilePath) {
  Papa.parse(csvFilePath, {
    download: true,
    header: true,
    complete: function(results) {
      // Filter and map the CSV data to continents array
      continents = results.data
        .filter(function(row) {
          return row.Name !== 'World' && row.Name.trim() !== '';
        })
        .map(function(row) {
          var totalCases = parseNumericValue(row['Total Cases']);
          var totalRecovered = parseNumericValue(row['Total Recovered']);
          return {
            continent: row.Name,
            totalCases: totalCases,
            totalRecovered: totalRecovered,
            recoveryRate: calculateRecoveryRate(totalRecovered, totalCases)
          };
        });
      console.log(continents);
      // Create Chorepleth map after fetching data
      createChoroplethMap();
    }
  });
}
// Function to parse numeric value from string
function parseNumericValue(value) {
  var parsedValue = parseInt(value.replace(/,/g, ''), 10);
  return isNaN(parsedValue) ? 0 : parsedValue;
}
// Function to calculate recovery rate percentage
function calculateRecoveryRate(totalRecovered, totalCases) {
  return totalCases !== 0 ? (totalRecovered / totalCases) * 100 : 0;
}
// Create Leaflet map and set the view
var map = L.map('map').setView([20, 0], 2);

// Add OpenStreetMap tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  maxZoom: 18,
}).addTo(map);

// Define color scale for the Chorepleth map
var colorScale = chroma.scale('YlOrRd').domain([0, 250000000]);

// Function to create the Chorepleth map
function createChoroplethMap() {
  $.getJSON(myGeoJSONPath, function(geojson) {
    L.geoJSON(geojson, {
      style: function(feature) {
        var continent = feature.properties.continent;
        var continentData = continents.find(item => item.continent === continent);
        var totalCases = continentData ? continentData.totalCases : 0;
        var fillColor = colorScale(totalCases).hex();
        return { fillColor: fillColor, weight: 1, opacity: 1, color: 'white', fillOpacity: 0.8 };
      },
      onEachFeature: function(feature, layer) {
        var continent = feature.properties.continent;
        var continentData = continents.find(item => item.continent === continent);
        var totalCases = continentData ? continentData.totalCases : 0;
        var totalRecovered = continentData ? continentData.totalRecovered : 0;
        var recoveryRate = continentData ? continentData.recoveryRate : 0;
        layer.bindPopup("<b>" + continent + "</b><br>Total Cases: " + totalCases.toLocaleString() + "<br>Total Recovered: " + totalRecovered.toLocaleString() + "<br>Recovery Rate: " + recoveryRate.toFixed(2) + "%");
      }
    }).addTo(map);
  });
}

// Fetch the continent data from the CSV file
fetchContinentsFromCSV('static/js/continent_data.csv');

//dataset results accurate as of 6/15/23 for total cases
