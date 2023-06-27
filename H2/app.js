const url = "merged_data.json"

function init() {
    let menu = d3.select("#selDataset");
    let menu2 = d3.select("#selDataset2");

    // Appending the options to the dropdown menu
    d3.json(url).then((data) => {
        // filtering out countries that lack data
        let filteredData = data.filter(entry => {
            return entry.year_2018 > 0 && entry.year_2019 > 0 && entry.year_2020 > 0 && entry.total_cases_per_million > 0;
        });

        // filling an array with the names
        let names = []
        for (let i = 0; i < filteredData.length; i++) {
            names.push(filteredData[i].country_name)
        }

        // Appending the options to the dropdown menu
        names?.map((name) => {
            menu.append("option").text(name).property("value", name);
            menu2.append("option").text(name).property("value", name);
        });

        // building the plots with the first name in the list
        barPlots(names[0], names[0]);
    });
};

// plots the tourism and infection rates of country 1 on the left
function barPlots(country1, country2) {

    d3.json(url).then((data) => {
        // filtering out countries that lack data
        let filteredData = data.filter(entry => {
            return entry.year_2018 > 0 && entry.year_2019 > 0 && entry.year_2020 > 0 && entry.total_cases_per_million > 0;
        });

        // filling an array with the names
        let names = []
        for (let i = 0; i < filteredData.length; i++) {
            names.push(filteredData[i].country_name)
        }

        // filtering so that the name matches that of the country1
        let matchedCountries1 = filteredData.filter((item) => {
            for (let i = 0; i < filteredData.length; i++) {
                if (filteredData[i].country_name == country1)
                    return item.country_name == country1;
            }
            
        });

        year_2018 = matchedCountries1[0].year_2018;
        year_2019 = matchedCountries1[0].year_2019;
        year_2020 = matchedCountries1[0].year_2020;
        
        // filtering so that the name matches that of the country2
        let matchedCountries2 = filteredData.filter((item) => {
            for (let i = 0; i < filteredData.length; i++) {
                if (filteredData[i].country_name == country2)
                    return item.country_name == country2;
            }
            
        });

        year_2018_2 = matchedCountries2[0].year_2018;
        year_2019_2 = matchedCountries2[0].year_2019;
        year_2020_2 = matchedCountries2[0].year_2020;

        // country 1
        let trace1 = {
            x:["2018 tourism", "2019 tourism", "2020 tourism"],
            y:[year_2018, year_2019, year_2020],
            type:"bar",
            name:"Tourism - " + matchedCountries1[0].country_name,
            orientation: "v"
        }; 
        
        let trace2 = {
            x:["2020 cases"],
            y:[matchedCountries1[0].total_cases_per_million],
            name:"Infections - " + matchedCountries1[0].country_name,
            yaxis:"y2",
            type:"bar",
            orientation:"v"
        }

        // country 2
        let trace3 = {
            x:["2018 tourism", "2019 tourism", "2020 tourism"],
            y:[year_2018_2, year_2019_2, year_2020_2],
            type:"bar",
            name:"Tourism - " + matchedCountries2[0].country_name,
            orientation: "v"
        };
        
        let trace4 = {
            x:["2020 cases"],
            y:[matchedCountries2[0].total_cases_per_million],
            name:"Infections - " + matchedCountries2[0].country_name,
            yaxis: "y2",
            type:"bar",
            orientation:"v"
        }

        let layout = {
            title: "Tourism and Infection Rates",
            yaxis: {
                title: 'Tourism per Year'
            },
            yaxis2: {
                title: 'Infections per Year',
                titlefont: {color: 'rgb(148, 103, 189)'},
                tickfont: {color: 'rgb(148, 103, 189)'},
                overlaying: 'y',
                side: 'right',
            },
            legend: {
                x: 2.25,
                xanchor: 'right',
                y: 1
              }
        };

        traceData = [trace1, trace2, trace3, trace4]

        Plotly.newPlot("bar", traceData, layout);
    });
};

// changes the country when the dropdown menu changes for country 1
function optionChanged(country1, country2) {
    var country1 = d3.select("#selDataset").node().value;
    var country2 = d3.select("#selDataset2").node().value;

    barPlots(country1, country2);
};

init();