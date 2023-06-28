let data; 

// Fetch data from the API endpoint
fetch('/api/owid_covid_data')
  .then(response => response.json())
  .then(jsonData => {
    data = jsonData.filter(entry => {return entry.total_vaccinations>0});
    // Extract unique country names from the data
    let countryNames = [...new Set(data.map(entry => entry.location))];
    let selectedCountries = [];

    // Populate the country select options
    let countrySelectElement = document.getElementById('countrySelect');
    countryNames.forEach(country => {
      let option = document.createElement('option');
      option.value = country;
      option.textContent = country;
      countrySelectElement.appendChild(option);
    });
  
// Function to handle search button click
    function handleSearch() {
  // Get the search inputs
  let searchCountry = document.getElementById('countrySearch').value.toLowerCase();
  let searchDay = document.getElementById('daySearch').value;

  // Get DOM elements
  let startMessageElement = document.getElementById('startMessage');
  let lineChartElement = document.getElementById('lineChart');
  let searchedDayVaccinationsElement = document.getElementById('searchedDayVaccinations');

  // Filter the data based on the search inputs and generate yearly vaccination data
  let filteredData = data.filter(entry => {
    let entryCountry = entry.location.toLowerCase();
    let entryDate = entry.date.split('T')[0];
    if (searchDay) {
      return entryCountry === searchCountry && entryDate === searchDay;
    } else {
      return entryCountry === searchCountry;
    }
  });

  if (filteredData.length > 0) {
    let years = Array.from({ length: 4 }, (_, i) => 2020 + i);
    let totalVaccinations = years.map(year => {
      let yearData = filteredData.filter(entry => {
        let entryYear = new Date(entry.date).getFullYear();
        return entryYear === year;
      });

      let yearlyTotal = 0;
      if (yearData.length > 0) {
        yearlyTotal = yearData[yearData.length - 1].total_vaccinations;
      }

      return yearlyTotal;
    });

    // Create chart data for Plotly
    let chartData = [{
      x: years,
      y: totalVaccinations,
      mode: 'lines+markers',
      name: searchCountry,
      line: {
        color: 'rgba(75, 192, 192, 1)',
        width: 2
      },
      marker: {
        color: 'rgba(75, 192, 192, 1)',
        size: 6
      }
    }];

    let layout = {
      title: 'Total Vaccinations',
      xaxis: {
        title: 'Year',
        tickmode: 'array',
        tickvals: [2020, 2021, 2022, 2023]
      },
      yaxis: {
        title: 'Yearly Total Vaccinations',
        rangemode: 'tozero',
        tickformat: ',.0f'
      },
      width: 800,
      height: 500,
      margin: {
        l: 200,
        r: 50,
        t: 50,
        b: 50
      }
    };

    // Create or update the line chart with the chart data
    Plotly.newPlot('lineChart', chartData, layout);
    lineChartElement.style.display = 'block';

    // Display the total vaccinations on the specific day
    if (searchDay && filteredData.length > 0) {
      let totalVaccinationsOnDay = filteredData[0].total_vaccinations;
      searchedDayVaccinationsElement.textContent = `Results: ${totalVaccinationsOnDay.toLocaleString()}`;
    } else {
      searchedDayVaccinationsElement.textContent = '';
    }
  } else {
    lineChartElement.style.display = 'none';
    searchedDayVaccinationsElement.textContent = 'No data available for the selected country and day.';
  }
}

    // Add event listener to the search button
    document.getElementById('searchButton').addEventListener('click', handleSearch);

    // Add event listener to the country search input for Enter key press
    document.getElementById('countrySearch').addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        handleSearch();
        event.preventDefault();
      }
    });

    // Add event listener to the compare button
    document.getElementById('compareButton').addEventListener('click', function() {
      selectedCountries = Array.from(document.getElementById('countrySelect').selectedOptions, option => option.value.toLowerCase());
      handleComparison();
    });
    
    // Add event listener to the reset button
    document.getElementById('resetButton').addEventListener('click', function() {
      selectedCountries = []; 
      handleSearch(); 
    });
    
    // Function to handle country comparison
    function handleComparison() {
      let startMessageElement = document.getElementById('startMessage');
      let lineChartElement = document.getElementById('lineChart');
      let searchedDayVaccinationsElement = document.getElementById('searchedDayVaccinations');
    
      let selectedCountries = Array.from(document.getElementById('countrySelect').selectedOptions, option => option.value.toLowerCase());
    
      if (selectedCountries.length > 0) {
        let filteredData = data.filter(entry => {
          let entryCountry = entry.location.toLowerCase();
          return selectedCountries.includes(entryCountry);
        });
    
        if (filteredData.length > 0) {
          let years = Array.from({ length: 4 }, (_, i) => 2020 + i);
          let chartData = selectedCountries.map(country => {
            let countryData = years.map(year => {
              let searchDay = document.getElementById('daySearch').value;
              let yearData = filteredData.filter(entry => {
                let entryCountry = entry.location.toLowerCase();
                let entryYear = new Date(entry.date).getFullYear();
                let entryDate = entry.date.split('T')[0];
                if (searchDay) {
                  return entryCountry === country && entryYear === year && entryDate === searchDay;
                } else {
                  return entryCountry === country && entryYear === year;
                }
              });
    
              return yearData.length > 0 ? yearData[yearData.length - 1].total_vaccinations : 0;
            });
            return {
              x: years,
              y: countryData,
              mode: 'lines+markers',
              name: country,
              line: {
                width: 2
              },
              marker: {
                size: 6
              }
            };
          });
    
          // Get the initial chart data
          let initialChartData = lineChartElement.data;
    
          // Combine the initial chart data with the new chart data
          let combinedChartData = initialChartData.concat(chartData);
    
          let layout = {
            title: 'Total Vaccinations',
            xaxis: {
              title: 'Year',
              tickmode: 'array',
              tickvals: [2020, 2021, 2022, 2023]
            },
            yaxis: {
              title: 'Total Vaccinations',
              rangemode: 'tozero',
              tickformat: ',.0f'
            },
            width: 800,
            height: 500,
            margin: {
              l: 200,
              r: 50,
              t: 50,
              b: 50
            }
          };
    
          // Update the existing line chart with the combined data
          Plotly.newPlot('lineChart', combinedChartData, layout);
          lineChartElement.style.display = 'block';
          searchedDayVaccinationsElement.textContent = '';
        } else {
          lineChartElement.style.display = 'none';
          searchedDayVaccinationsElement.textContent = 'No data available for the selected countries.';
        }
      } else {
        lineChartElement.style.display = 'none';
        searchedDayVaccinationsElement.textContent = 'No countries selected.';
      }
    }
  })    