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
            const map = L.map('map').setView([0, 0], 2);

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

            // Create the base tile layers
            const geog = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
              maxZoom: 18
            });

            const pop = L.esri.tiledMapLayer({
              url: 'https://tiles.arcgis.com/tiles/VAI453sU9tG9rSmh/arcgis/rest/services/Population_Density_base_tiles/MapServer'
            });

            const baseMaps = {
              Geographical: geog,
              PopulationDensity: pop
            };

            // Add GeoJSON layer for vaccination rate
            const vaccinationLayer = L.geoJSON(geojsonData, {
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
            });

            // Add GeoJSON layer for population density
            const populationLayer = L.geoJSON(geojsonData, {
              style: function (feature) {
                // Customize the style of each polygon based on population density
                const populationDensity = feature.properties.population / feature.properties.AREA_SQKM;
                return {
                  fillColor: getColor(populationDensity),
                  weight: 1,
                  opacity: 1,
                  color: 'white',
                  fillOpacity: 0.7
                };
              },
              onEachFeature: function (feature, layer) {
                // Add popups or other interactions to each polygon
                const countryName = feature.properties.ADMIN;
                const populationDensity = feature.properties.population / feature.properties.AREA_SQKM;
                layer.bindPopup(`Country: ${countryName}`);
              }
            });

            // Add GeoJSON layer for Total Cases, Total Recovered, and Recovery Rate
const casesLayer = L.geoJSON(geojsonData, {
  style: function (feature) {
    // Customize the style of each polygon based on recovery rate
    const recoveryRate = feature.properties.recoveryRate;
    return {
      fillColor: getColor(recoveryRate),
      weight: 1,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.7
    };
  },
  onEachFeature: function (feature, layer) {
    // Add popups or other interactions to each polygon
    const countryName = feature.properties.ADMIN;
    const totalCases = feature.properties.totalCases;
    const totalRecovered = feature.properties.totalRecovered;
    const recoveryRate = feature.properties.recoveryRate;
    layer.bindPopup(`Country: ${countryName}<br>Total Cases: ${totalCases}<br>Total Recovered: ${totalRecovered}<br>Recovery Rate: ${recoveryRate}%`);
  }
});

            // Create a layer control
            const layerControl = L.control.layers(baseMaps, {
              'Vaccination Rate': vaccinationLayer,
              'Population Density': populationLayer,
              'Total Cases, Recovered, Recovery Rate': casesLayer,
            }, {
              position: 'topright',
              collapsed: false
            });

            // Add the layer control to the map
            layerControl.addTo(map);

            // Declare a variable for the legend
            let legend;
            let legendDiv;

            // Create a function to determine color based on vaccination rate or population density value
            function getColor(value) {
              // Choose your color scheme here
              // Example: vaccination rate
              return value > 90 ? '#800026' :
                value > 80 ? '#BD0026' :
                value > 70 ? '#E31A1C' :
                value > 60 ? '#FF0000' :
                value > 50 ? '#FFA500' :
                value > 40 ? '#FFFF00' :
                value > 30 ? '#008000' :
                '#808080';
            }

            // Create a function to generate the legend content
            function createLegend(title) {
              const grades = [0, 30, 40, 50, 60, 70, 80, 90];
              let legendContent = '<div class="legend"><strong>' + title + '</strong><br>';

              // Choose your legend title here
              // Example: vaccination rate
              legendContent += 'Vaccination Rate';

              legendContent += '</strong><br>';

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

            function updateLegend(layer) {
              if (layer === vaccinationLayer) {
                legendDiv.getContainer().innerHTML = createLegend('Vaccination Rate');
                legend.addTo(map); // Add the legend control to the map
              } else if (layer === populationLayer) {
                legendDiv.getContainer().innerHTML = createLegend('Population Density');
                legend.addTo(map); // Add the legend control to the map
              }
            }

            // Create the legend control
            legendDiv = L.control({ position: 'bottomright' });

            // Add the legend to the map
            legendDiv.onAdd = function (map) {
              const div = L.DomUtil.create('div', 'info legend');
              div.innerHTML = createLegend('Vaccination Rate');
              legend = div; // Assign the legend element to the legend variable
              return div;
            };

            legend.addTo(map);

            // Event listener for layer control change
            map.on('baselayerchange', function (eventLayer) {
              updateLegend(eventLayer.layer);
            });

            // Add a scale bar to the map
            L.control.scale().addTo(map);

            // Add attribution to the map
            map.attributionControl.addAttribution('Data &copy; <a href="https://ourworldindata.org">Our World in Data</a>');

            // Set the initial zoom level based on the bounds of the GeoJSON data
            map.fitBounds(L.geoJSON(geojsonData).getBounds());
          });
        });
      });
 


