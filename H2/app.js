const url = "merged_data.json"

function init() {
    let menu = d3.select("#selDataset");
    let menu2 = d3.select("#selDataset2")

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
        // barPlots2(names[0])
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

        let trace1 = {
            x:[2018, 2019, 2020],
            y:[year_2018, year_2019, year_2020],
            type:"bar",
            name:"Tourism",
            orientation: "v"
        }; 
        
        let trace2 = {
            x:[2020],
            y:[matchedCountries[0].total_cases_per_million],
            name:"Infections",
            type:"bar",
            orientation:"v"
        }

        let trace3 = {
            x:[2018, 2019, 2020],
            y:[year_2018_2, year_2019_2, year_2020_2],
            type:"bar",
            name:"Tourism 2",
            orientation: "v"
        };
        
        let trace4 = {
            x:[2020],
            y:[matchedCountries2[0].total_cases_per_million],
            name:"Infections 2",
            type:"bar",
            orientation:"v"
        }

        let layout = {
            title: "Tourism and Infection Rates"
        };

        traceData = [trace1, trace2, trace3, trace4]

        Plotly.newPlot("bar", traceData, layout);
    });
};

// changes the country when the dropdown menu changes for country 1
function optionChanged(country1, country2) {

    console.log("next values:", country1, "and", country2);
    barPlot(country1, country2);
};

init();