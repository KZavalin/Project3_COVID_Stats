// Define the getColor function
function getColor(tourismData) {
    // Implement your color mapping logic based on the tourism data
    // Here's an example to get you started:
    if (tourismData >= 1000000) {
      return 'green';
    } else if (tourismData >= 500000) {
      return 'yellow';
    } else {
      return 'red';
    }
  }
  
  // Read the country_polygons.geojson file
  fetch('static/js/country_polygons.geojson')
    .then(response => response.json())
    .then(geojsonData => {
      // Read the tourism.csv file
      fetch('static/js/tourism.csv')
        .then(response => response.text())
        .then(csvData => {
          // Parse the CSV data
          const rows = csvData.split('\n');
          const headers = rows[0].split(',');
          const year2020Index = headers.indexOf('year_2020');
  
          // Create the map
          const map = L.map('map').setView([0, 0], 2);
  
          // Add the OpenStreetMap tile layer
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
            maxZoom: 18
          }).addTo(map);
  
          // Add the country polygons to the map
          const geojsonLayer = L.geoJSON(geojsonData, {
            style: function(feature) {
              // Get the country name from the feature properties
              const countryName = feature.properties.ADMIN;
  
              // Find the corresponding row in the CSV data
              const rowData = rows.find(row => row.startsWith(countryName));
  
              // If a row is found, extract the tourism data for the year 2020
              if (rowData) {
                const values = rowData.split(',');
                const tourismData = values[year2020Index];
  
                // Determine the color based on tourism data
                const color = getColor(tourismData);
  
                // Return the style object with the determined color
                return {
                  fillColor: color,
                  weight: 2,
                  opacity: 1,
                  color: 'white',
                  dashArray: '3',
                  fillOpacity: 0.5
                };
              }
  
              // Default style for countries with no data available
              return {
                fillColor: 'gray',
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.5
              };
            },
            onEachFeature: function(feature, layer) {
              // Get the country name from the feature properties
              const countryName = feature.properties.ADMIN;
  
              // Find the corresponding row in the CSV data
              const rowData = rows.find(row => row.startsWith(countryName));
  
              // If a row is found, extract the tourism data for the year 2020
              if (rowData) {
                const values = rowData.split(',');
                const tourismData = values[year2020Index];
  
                // Add a popup to the polygon with the tourism data
                layer.bindPopup(`<b>${countryName}</b><br>Tourism in 2020: ${tourismData}`);
              } else {
                // Add a popup with no data available
                layer.bindPopup(`<b>${countryName}</b><br>No data available for 2020`);
              }
            }
          }).addTo(map);
  
          // Create a legend control
const legend = L.control({ position: 'bottomright' });

// Define the legend content
legend.onAdd = function() {
  const div = L.DomUtil.create('div', 'legend');
  const labels = ['High', 'Medium', 'Low', 'No Data']; // Legend labels
  const colors = ['red', 'yellow', 'green', 'gray']; // Corresponding colors

  // Loop through the labels and colors to create the legend items
  for (let i = 0; i < labels.length; i++) {
    div.innerHTML += `
      <div>
        <span class="legend-color" style="background-color:${colors[i]}"></span>
        <span class="legend-label">${labels[i]}</span>
      </div>
    `;
  }

  return div;
};

// Add the legend control to the map
legend.addTo(map);
        })})