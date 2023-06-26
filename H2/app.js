const url = "merged_data.json"

function init() {
    let menu = d3.select("#selDataset");
    let menu2 = d3.select("#selDataset2")

    // Appending the options to the dropdown menu
    d3.json(url).then((data) => {
        // filtering out countries that lack data
        let filteredData = data.filter(entry => {
            return entry.year_2018 > 0 && entry.year_2019 > 0 && entry.year_2020 > 0;
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
        barPlots(names[0]);
        barPlots2(names[0])
    });
};

// plots the tourism and infection rates of country 1 on the left
function barPlots(country) {
    d3.json(url).then((data) => {
        // filtering out countries that lack data
        let filteredData = data.filter(entry => {
            return entry.year_2018 > 0 && entry.year_2019 >0 && entry.year_2020 > 0;
        });

        // filling an array with the names
        let names = []
        for (let i = 0; i < filteredData.length; i++) {
            names.push(filteredData[i].country_name)
        }

        // filtering so that the name matches that of the country
        let matchedCountries = filteredData.filter((item) => {
            for (let i = 0; i < filteredData.length; i++) {
                if (filteredData[i].country_name == country)
                    return item.country_name == country;
            }
            
        });

        year_2018 = matchedCountries[0].year_2018;
        year_2019 = matchedCountries[0].year_2019;
        year_2020 = matchedCountries[0].year_2020;

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

        let layout = {
            title: "Tourism and Infection Rates of Country 1"
        };

        traceData = [trace1, trace2]

        Plotly.newPlot("bar", traceData, layout);
    });
};

// changes the country when the dropdown menu changes for country 1
function optionChanged(country) {

    console.log("next value:", country);
    barPlots(country);
};

// plots the tourism and infection rates of country 2 on the right
function barPlots2(country) {
    d3.json(url).then((data) => {
        // filtering out countries that lack data
        let filteredData = data.filter(entry => {
            return entry.year_2018 > 0 && entry.year_2019 > 0 && entry.year_2020 > 0;
        });

        let names = []
        for (let i = 0; i < filteredData.length; i++) {
            names.push(filteredData[i].country_name)
        }

        // filtering so that the name matches that of the country
        let matchedCountries = filteredData.filter((item) => {
            for (let i = 0; i < filteredData.length; i++) {
                if (filteredData[i].country_name == country)
                    return item.country_name == country;
            }
            
        });

        year_2018 = matchedCountries[0].year_2018;
        year_2019 = matchedCountries[0].year_2019;
        year_2020 = matchedCountries[0].year_2020;

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

        let layout = {
            title: "Tourism and Infection Rates of Country 2"
        };

        traceData = [trace1, trace2]

        Plotly.newPlot("bar2", traceData, layout);
    });
};

// changes the country when the dropdown menu changes for country 2
function optionChanged2(country) {
    console.log("next value (2):", country);
    barPlots2(country);
};

init();