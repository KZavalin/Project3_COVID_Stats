// Fetch the JSON data
fetch('static/js/acaps.json')
  .then(response => response.json())
  .then(data => {
    const countries = [];

    // Loop through each entry in the data
    data.forEach(entry => {
      const country = entry.COUNTRY;
      if (!countries.includes(country)) {
        countries.push(country);
      }
    });

    const selectElement = document.getElementById('countrySelect');
    let chart = null; 

    // Loop through each country and create an option for the dropdown menu
    countries.forEach(country => {
      const option = document.createElement('option');
      option.value = country;
      option.textContent = country;
      selectElement.appendChild(option);
    });

    // Add a display text for the dropdown menu
    const displayTextOption = document.createElement('option');
    displayTextOption.disabled = true;
    displayTextOption.selected = true;
    displayTextOption.textContent = 'Select a country';
    selectElement.prepend(displayTextOption);

    // Add an event listener to the country select element
    selectElement.addEventListener('change', event => {
      const selectedCountry = event.target.value;
      const datesImplemented = [];

      // Filter the data for entries matching the selected country and collect implemented dates
      data.forEach(entry => {
        if (entry.COUNTRY === selectedCountry) {
          const dateImplemented = entry.DATE_IMPLEMENTED;
          if (dateImplemented) {
            datesImplemented.push(dateImplemented);
          }
        }
      });

      const chartContainer = document.getElementById('chartContainer');

      // Clear the chart container
      while (chartContainer.firstChild) {
        chartContainer.firstChild.remove();
      }

      generateBarChart(datesImplemented, chartContainer, chart);
    });
  })
  .catch(error => {
    console.error('Error loading acaps.json:', error);
  });

  // Function to generate the bar chart
  function generateBarChart(datesImplemented, chartContainer, chart) {
    const canvas = document.createElement('canvas');
    canvas.id = 'barChart';
    chartContainer.appendChild(canvas);
  
    const ctx = canvas.getContext('2d');
  
    // Count the number of measures for each month
    const measureCount = {};
    datesImplemented.forEach(date => {
      const formattedDate = formatDate(date);
      const month = formattedDate.slice(0, 7); 
      if (measureCount[month]) {
        measureCount[month]++;
      } else {
        measureCount[month] = 1;
      }
    });
  
    // Prepare data for the chart
    const chartData = {
      labels: Object.keys(measureCount),
      datasets: [
        {
          label: 'Number of Total Measures per Month',
          data: Object.values(measureCount),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
      ]
    };
  
    // Configure chart options
    const chartOptions = {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          stepSize: 1
        }
      }
    };
  
    // Destroy the previous chart instance if it exists
    if (chart) {
      chart.destroy();
    }
  
    // Create the bar chart
    chart = new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: chartOptions
    });
  }
  

  function formatDate(date) {
    if (!date) {
      return 'Invalid Date';
    }
  
    // Date format is in milliseconds since Unix epoch
    const formattedDate = new Date(parseInt(date));
    const year = formattedDate.getFullYear();
    const month = formattedDate.getMonth() + 1; 
    return year + '-' + (month < 10 ? '0' + month : month);
  }
  

