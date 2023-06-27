// Load the GeoJSON file
fetch('static/js/country_polygons.geojson')
  .then(response => response.json())
  .then(geojsonData => {
    // Load the COVID-19 data CSV file
    fetch('static/js/owid-covid-data.csv')
      .then(response => response.text())
      .then(csvData => {
        // Parse the COVID-19 data CSV
        const parsedData = Papa.parse(csvData, { header: true }).data;

        // Create a mapping between ISO codes and population
        const dataMap = {};
        parsedData.forEach(entry => {
          const isoCode = entry.iso_code;
          const population = entry.population || 0;

          dataMap[isoCode] = population;
        });

        // Merge the population data
        geojsonData.features.forEach(feature => {
          const isoCode = feature.properties.ISO_A3;
          const population = dataMap[isoCode];

          feature.properties.population = population;
        });

        // Load the vaccine data CSV file
        fetch('static/js/vaccine_data.csv')
          .then(response => response.text())
          .then(csvData => {
            // Parse the vaccine data CSV
            const vaccineData = Papa.parse(csvData, { header: true }).data;

            // Create a mapping between ISO codes and vaccination data
            const vaccinationMap = {};
            vaccineData.forEach(entry => {
              const isoCode = entry['Alpha-3 code-1'];
              const vaccinationRate = entry['Cumulative persons vaccinated with at least one dose per 100 population'] || 0;

              vaccinationMap[isoCode] = vaccinationRate;
            });

            // Merge the vaccination data
            geojsonData.features.forEach(feature => {
              const isoCode = feature.properties.ISO_A3;
              const vaccinationRate = vaccinationMap[isoCode];

              feature.properties.vaccinationRate = vaccinationRate;
            });

            // Create a map
            const map = L.map('map').setView([50, 10], 4);

// Create a title control
const titleControl = L.control({ position: 'topleft' });

// Define the content of the title
titleControl.onAdd = function () {
  const titleDiv = L.DomUtil.create('div', 'map-title');
  titleDiv.innerHTML = '<h1>COVID-19 Vaccination Rates by Country</h1>';
  return titleDiv;
};

// Add the title control to the map
titleControl.addTo(map);

            // Add GeoJSON layer
            L.geoJSON(geojsonData, {
              style: function (feature) {
                // Customize the style of each polygon based on vaccination rate
                const vaccinationRate = feature.properties.vaccinationRate;
                return {
                  fillColor: getColor(vaccinationRate),
                  weight: 1,
                  opacity: 1,
                  color: 'white',
                  fillOpacity: 0.7
                };
              },
              onEachFeature: function (feature, layer) {
                // Add popups or other interactions to each polygon
                const countryName = feature.properties.ADMIN;
                const population = feature.properties.population;
                const vaccinationRate = feature.properties.vaccinationRate;
                layer.bindPopup(`Country: ${countryName}<br>Population: ${population}<br>Vaccinations (per 100 population): ${vaccinationRate}`);
              }
            }).addTo(map);

            // Declare a variable for the legend
let legend = L.control({ position: 'bottomright' });

// Create a function to determine color based on vaccination rate value
function getColor(vaccinationRate) {
  return vaccinationRate > 90 ? '#800026' :
    vaccinationRate > 80 ? '#BD0026' :
    vaccinationRate > 70 ? '#E31A1C' :
    vaccinationRate > 60 ? '#FF0000' :
    vaccinationRate > 50 ? '#FFA500' :
    vaccinationRate > 40 ? '#FFFF00' :
    vaccinationRate > 30 ? '#008000' :
    '#808080';
}

// Create a function to generate the legend content
function createLegend() {
  const grades = [0, 30, 40, 50, 60, 70, 80, 90];
  let legendContent = '<div class="legend"><strong>Vaccination Rate</strong><br>';

  for (let i = 0; i < grades.length; i++) {
    const color = getColor(grades[i] + 1);
    const nextGrade = grades[i + 1];

    legendContent +=
      '<i style="background:' +
      color +
      '"></i> ' +
      grades[i] +
      (nextGrade ? '&ndash;' + nextGrade + '%<br>' : '+%');
  }

  legendContent += '</div>';
  return legendContent;
}

// Add the legend to the map
legend.onAdd = function (map) {
  const div = L.DomUtil.create('div', 'info legend');
  div.innerHTML = createLegend();
  return div;
};

legend.addTo(map);

// Add a scale bar to the map
L.control.scale().addTo(map);

// Add attribution to the map
map.attributionControl.addAttribution('Data &copy; <a href="https://ourworldindata.org">Our World in Data</a>');


          })
        })
      })