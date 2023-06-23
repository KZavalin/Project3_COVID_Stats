let data; 

// Fetch data from the API endpoint
fetch('/api/tourism')
    .then(response => response.json())
  .then(jsonData => {
    let countryNames = [...new Set(data.map(entry => entry.))]
  });