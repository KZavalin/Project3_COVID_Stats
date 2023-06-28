// Heat map Code:
var geog = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  maxZoom: 18,
});

// For population density as of 2010
var pop = L.esri.tiledMapLayer({
  url: 'https://tiles.arcgis.com/tiles/VAI453sU9tG9rSmh/arcgis/rest/services/Population_Density_base_tiles/MapServer'
});
var baseMaps = {
  Geographical: geog,
  PopulationDensity: pop
};

var map = L.map('map', {
  center: [46.2276, 2.2137],
  zoom: 1,
  layers: [geog]
}).setView([20, 0], 2);
L.control.layers(baseMaps).addTo(map);

// Load the GeoJSON file for country polygons
fetch('static/js/country_polygons.geojson')
  .then(response => response.json())
  .then(geojsonData => {

    // Load the GROUPED_DATA CSV file for population
    fetch('static/js/grouped_data1.csv')
      .then(response => response.text())
      .then(csvData => {

        // Parse the GROUPED_DATA CSV for population
        const parsedData = Papa.parse(csvData, { header: true }).data;

        // Create a mapping between ISO codes and population data from the GROUPED_DATA CSV
        const dataMap = {};
        parsedData.forEach(entry => {
          const isoCode = entry.iso_code;
          const population = entry.population;

          dataMap[isoCode] = population;
        });

        // Merge the data from GROUPED_DATA CSV with the GeoJSON features for population
        geojsonData.features.forEach(feature => {
          const isoCode = feature.properties.ISO_A3;
          const population = dataMap[isoCode];

          feature.properties.population = population;

          // Add pop-up to each country polygon for population
          const countryName = feature.properties.ADMIN;
          const layer = L.geoJSON(feature);
          layer.bindPopup(`Country: ${countryName}<br>Population: ${population}`);
          layer.on('click', function () {
            layer.openPopup();
          });

          // Add the layer to the map for population
          layer.addTo(map);
        });
      });

    // Load the GeoJSON file for merged data
    fetch('static/js/merged.geojson')
      .then(response => response.json())
      .then(mergedData => {

        // Load the GROUPED_DATA CSV file for total cases per 100000
        fetch('static/js/grouped_data1.csv')
          .then(response => response.text())
          .then(csvData => {

            // Parse the GROUPED_DATA CSV for total cases per million
            const parsedData = Papa.parse(csvData, { header: true }).data;

            // Create a mapping between ISO codes and total cases per million from the GROUPED_DATA CSV
            const casesMap = {};
            parsedData.forEach(entry => {
              const isoCode = entry.iso_code;
              const year = entry.year;
              const cases = entry['Total Cases per 100,000'];
              casesMap[isoCode + year] = cases;
            });

            // Merge the data from GROUPED_DATA CSV with the GeoJSON features for total cases per million
            geojsonData.features.forEach(feature => {
              const isoCode = feature.properties.ISO_A3;
              const cases = casesMap[isoCode + '2020'];

              feature.properties.cases = cases;

              // Create a mapping between ISO codes and total cases for pop-up display
              const totalCasesMap = {};
              parsedData.forEach(entry => {
                const isoCode = entry.iso_code;
                const year = entry.year;
                const cases = entry['Total Cases per 100,000'];
                totalCasesMap[isoCode + year] = cases;
              });

              // Add pop-up to each country polygon for total cases per million
              const countryName = feature.properties.ADMIN;
              const layer = L.geoJSON(feature);
              layer.bindPopup(`Country: ${countryName}<br>Population: ${feature.properties.population}<br>Total Cases per 100,000: ${cases}`);
              layer.on('click', function () {
                layer.openPopup();
              });

              // Add the layer to the map for total cases per million
              layer.addTo(map);
              
              // Create circle markers for the total cases per million
              const center = L.geoJSON(feature).getBounds().getCenter();
              const centerCoordinates = [center.lat, center.lng];
              const radius = Math.sqrt(cases / 10000);
              const circleMarker = L.circleMarker(centerCoordinates, {
                radius: radius,
                color: 'green',
                fillOpacity: 1
              });
              circleMarker.bindPopup(`Country: ${countryName}<br>Population: ${feature.properties.population}<br>Total Cases per 100,000: ${cases}`);
              circleMarker.addTo(map);
            });
          });
      });
  });
