Papa.parse("static/js/map.csv", {
  download: true,
  header: true,
  complete: function (results) {
    const csvData = results.data;

    const map = L.map("map").setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(map);

    csvData.forEach((row) => {
      const { "Province/State": province, "Country/Region": country, Lat: lat, Long: long, ...dates } = row;

      if (lat !== undefined && long !== undefined) {
        const latValue = parseFloat(lat);
        const longValue = parseFloat(long);
        if (!isNaN(latValue) && !isNaN(longValue)) {
          Object.entries(dates).forEach(([rawDate, cases]) => {
            if (rawDate.endsWith('20')) {
              const [month, day, year] = rawDate.split('/');
              const formattedDate = `${month}/${day}/${year}`;

              const totalCases = parseInt(cases, 10);
              if (!isNaN(totalCases)) {
                L.circleMarker([latValue, longValue], {
                  radius: Math.sqrt(totalCases) * 0.09,
                  fillColor: "red",
                  color: "#000",
                  weight: 1,
                  opacity: 1,
                  fillOpacity: 0.8,
                })
                  .addTo(map)
                  .bindPopup(`${province ? `${province}, ` : ""}${country} (${formattedDate}): ${totalCases} cases`);
              }
            }
          });
        } else {
          console.log('Invalid latitude or longitude:', lat, long);
        }
      }
    });
  },
});
