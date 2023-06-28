let data; 
var chartData = [];
function getRandomRGBArray() {
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  };
  var red = "rgb("+getRandomInt(125,256)+",100,100)";
  var green = "rgb(100,"+getRandomInt(125,256)+",100)";
  var blue = "rgb(100,100,"+getRandomInt(125,256)+")";
  return [red,green,blue];
};
var layout_colors = ["rgb(170,30,0)","rgb(60,60,255)","rgb(50,200,0)"];
var layout = {
  title: 'Cases, Deaths, and Total Vaccinations Per Year',
  xaxis: {
    domain: [.15,1],
    width: 1000,
    title: 'Year',
    tickmode: 'array',
    tickvals: [2020, 2021, 2022, 2023]
  },
  yaxis: {
    title: 'Deaths Per Million',
    rangemode: 'tozero',
    tickformat: ',.0f',
    titlefont: {color: layout_colors[0]},
    tickfont: {color: layout_colors[0]},
    anchor: 'free',
    rangemode: 'tozero',
    tickformat: ',.0f',
    side: 'left',
    position: .15
  },
  yaxis2: {
    title: 'Total Vaccinations Per Hundred',
    titlefont: {color: layout_colors[1]},
    tickfont: {color: layout_colors[1]},
    rangemode: 'tozero',
    tickformat: ',.0f',
    anchor: 'x',
    overlaying: 'y',
    side: 'right'
  },
  yaxis3: {
    title: 'Cases Per Million',
    titlefont: {color: layout_colors[2]},
    tickfont: {color: layout_colors[2]},
    anchor: 'free',
    rangemode: 'tozero',
    tickformat: ',.0f',
    overlaying: 'y',
    side: 'left',
    position: 0
  },
  width: 800,
  height: 500,
  margin: {
    l: 200,
    r: 50,
    t: 50,
    b: 50
  },
  showlegend: true,
  legend: {
    x: 1.15,
    y: 1
  }
};

// Fetch data from the API endpoint
fetch('/api/owid_covid_data').then(response => response.json()).then(jsonData => {
  data = jsonData; 

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
    // Get DOM elements
    let startMessageElement = document.getElementById('startMessage');
    let lineChartElement = document.getElementById('lineChart');

    // Filter the data based on the search inputs and generate yearly vaccination data 
    //Added filter to make sure totalvaccinations has a value
    let filteredData = data.filter(entry => {
    let entryCountry = entry.location.toLowerCase();
    return entryCountry === searchCountry;
    });

    if (filteredData.length > 0) {
      let years = Array.from({ length: 4 }, (_, i) => 2020 + i);
      //This defines as a list the variable to be mapped
      let combined_totals = years.map(year => {
        //Matches the year
        let yearData = filteredData.filter(entry => {
          let entryYear = new Date(entry.date).getFullYear();
          return entryYear === year;
        });
        let yearlyDeathTotal = null;
        let yearlyVacTotal = null;
        let yearlyCasesTotal = null;
        let deathstosum=[];
        let casestosum=[];
        let DFiltered = yearData.filter(entry => {return entry.new_deaths_per_million > 0});
        if (DFiltered.length > 0){
          for (var i=0; i<DFiltered.length;i++) {deathstosum.push(DFiltered[i].new_deaths_per_million)};
        };
        let CFiltered = yearData.filter(entry => {return entry.new_cases_per_million > 0});
        if (CFiltered.length > 0){
          for (var i=0; i<CFiltered.length;i++) {casestosum.push(CFiltered[i].new_cases_per_million)};
        };
        yearlyCasesTotal = casestosum.reduce((partialSum,nextvalue)=>partialSum+nextvalue,0);    
        yearlyDeathTotal = deathstosum.reduce((partialSum,nextvalue)=>partialSum+nextvalue,0);
        let VFiltered = yearData.filter(entry => {return entry.total_vaccinations_per_hundred > 0});
        if (VFiltered.length > 0){
          yearlyVacTotal = VFiltered[VFiltered.length - 1].total_vaccinations_per_hundred;
        };
        console.log(yearlyVacTotal);
        return [yearlyVacTotal,yearlyDeathTotal,yearlyCasesTotal];
      });

      let totalVaccinations = [];
      let totalDeaths = [];
      let totalCases = [];
      combined_totals.forEach((year)=>{
        totalVaccinations.push(year[0]);
        totalDeaths.push(year[1]);
        totalCases.push(year[2])
      });
    // Create chart data for Plotly
    //Chart data for multiple metrics graph
      console.log(totalVaccinations);
      console.log(totalDeaths);

      var death_trace = {
        x: years,
        y: totalDeaths,
        mode: 'lines+markers',
        name: "Deaths ("+searchCountry+")",
        line: {
          color: layout_colors[0],
          width: 2
        },
        yaxis:'y',
        xaxis:'x',
        marker: {
          color: layout_colors[0],
          size: 6
        },
        visible: true
      };
      var vac_trace = {
        x: years,
        y: totalVaccinations,
        mode: 'lines+markers',
        name: "Vaccination ("+searchCountry+")",
        line: {
          color: layout_colors[1],
          width: 2
        },
        yaxis:"y2",
        xaxis:'x',
        marker: {
          color: layout_colors[1],
          size: 6
        },
        visible: true
      };
      var cases_trace = {
        x: years,
        y: totalCases,
        mode: 'lines+markers',
        name: "Cases ("+searchCountry+")",
        yaxis:"y3",
        xaxis:'x',
        line: {
          color: layout_colors[2],
          width: 2
        },
        marker: {
          color: layout_colors[2],
          size: 6
        },
        visible: true
      };

      chartData = [death_trace,vac_trace,cases_trace];
      Plotly.newPlot('lineChart', chartData, layout);
      lineChartElement.style.display = 'block';
    } else {lineChartElement.style.display = 'none';};
  };

  // Add event listener to the search button
  document.getElementById('searchButton').addEventListener('click', function() {handleSearch()});

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
    let selectedCountries = Array.from(document.getElementById('countrySelect').selectedOptions, option => option.value.toLowerCase());
    if (selectedCountries.length > 0) {
      let filteredData = data.filter(entry => {
        let entryCountry = entry.location.toLowerCase();
        return selectedCountries.includes(entryCountry);
      });
  
      if (filteredData.length > 0) {
        let years = Array.from({ length: 4 }, (_, i) => 2020 + i);
        chartData = selectedCountries.map(country => {
          //This defines as a list the variable to be mapped
          let searchCountry = '';
          let combined_totals = years.map(year => {
              let yearData = filteredData.filter(entry => {
              let entryCountry = entry.location.toLowerCase();
              searchCountry=entryCountry;
              let entryYear = new Date(entry.date).getFullYear();
              return entryCountry === country && entryYear === year;
            });
            let yearlyDeathTotal = null;
            let yearlyVacTotal = null;
            let yearlyCasesTotal = null;
            let deathstosum=[];
            let casestosum=[];
            let DFiltered = yearData.filter(entry => {return entry.new_deaths_per_million > 0});
            if (DFiltered.length > 0){
              for (var i=0; i<DFiltered.length;i++) {deathstosum.push(DFiltered[i].new_deaths_per_million)};
            };
            let CFiltered = yearData.filter(entry => {return entry.new_cases_per_million > 0});
            if (CFiltered.length > 0){
              for (var i=0; i<CFiltered.length;i++) {casestosum.push(CFiltered[i].new_cases_per_million)};
            };
            yearlyCasesTotal = casestosum.reduce((partialSum,nextvalue)=>partialSum+nextvalue,0);    
            yearlyDeathTotal = deathstosum.reduce((partialSum,nextvalue)=>partialSum+nextvalue,0);
            let VFiltered = yearData.filter(entry => {return entry.total_vaccinations_per_hundred > 0});
            if (VFiltered.length > 0){
              yearlyVacTotal = VFiltered[VFiltered.length - 1].total_vaccinations_per_hundred;
            };
            return [yearlyVacTotal,yearlyDeathTotal,yearlyCasesTotal];
          });
          let totalVaccinations = [];
          let totalDeaths = [];
          let totalCases = [];
          combined_totals.forEach((year)=>{
            totalVaccinations.push(year[0]);
            totalDeaths.push(year[1]);
            totalCases.push(year[2])
          });
          // Create chart data for Plotly
          //Chart data for multiple metrics graph
          console.log(totalVaccinations);
          console.log(totalDeaths);
          var colors = getRandomRGBArray(); 
          var death_trace = {
            x: years,
            y: totalDeaths,
            mode: 'lines+markers',
            name: "Deaths ("+searchCountry+")",
            line: {
              color: colors[0],
              width: 2
            },
            yaxis:'y',
            xaxis:'x',
            marker: {
              color: colors[0],
              size: 6
            },
            visible: true
          };
          var vac_trace = {
            x: years,
            y: totalVaccinations,
            mode: 'lines+markers',
            name: "Vaccination ("+searchCountry+")",
            line: {
              color: colors[2],
              width: 2
            },
            yaxis:"y2",
            xaxis:'x',
            marker: {
              color: colors[2],
              size: 6
            },
            visible: true
          };
          var cases_trace = {
            x: years,
            y: totalCases,
            mode: 'lines+markers',
            name: "Cases ("+searchCountry+")",
            yaxis:"y3",
            xaxis:'x',
            line: {
              color: colors[1],
              width: 2
            },
            marker: {
              color: colors[1],
              size: 6
            },
            visible: true
          };
          return [death_trace, vac_trace, cases_trace];
        });
        let combinedChartData = lineChartElement.data;
        for (var i=0; i<chartData.length;i++){combinedChartData = combinedChartData.concat(chartData[i])}; 
        // Combine the initial chart data with the new chart data
        console.log("Combined chart data is:");
        console.log(combinedChartData);
        // Update the existing line chart with the combined data
        Plotly.newPlot('lineChart', combinedChartData, layout);
        lineChartElement.style.display = 'block';
      } else {lineChartElement.style.display = 'none'};
    } else {lineChartElement.style.display = 'none'}; 
  };
});    