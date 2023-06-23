let data; 

// Fetch data from the API endpoint
fetch('/api/tourism')
    .then(response => response.json())
    .then(jsonData => {
    let countryNames = [...new Set(data.map(entry => entry.country_name))]

    // Populate the country select options
    let countrySelectElement = document.getElementById('countrySelect');
    countryNames.forEach(country => {
      let option = document.createElement('option');
      option.value = country;
      option.textContent = country;
      countrySelectElement.appendChild(option);
    });
  });