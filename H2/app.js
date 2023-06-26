const url = "merged_data.json"

function init() {
    let menu = d3.select("#selDataset");

    // We need to append the options to the dropdown menu
    d3.json(url).then((data) => {
        // filtering out countries that lack data
        let filteredData = data.filter(entry => {
            return entry.year_2018 > 0 && entry.year_2019 >0 && entry.year_2020 > 0;
        });

        let names = []
        for (let i = 0; i < filteredData.length; i++) {
            names.push(filteredData[i].country_name)
        }

        names?.map((name) => {
            menu.append("option").text(name).property("value", name);
        });

        barPlots(names[0]);
    });
};

function barPlots(country) {
    d3.json(url).then((data) => {
        // filtering out countries that lack data
        let filteredData = data.filter(entry => {
            return entry.year_2018 > 0 && entry.year_2019 >0 && entry.year_2020 > 0;
        });

        let names = []
        for (let i = 0; i < filteredData.length; i++) {
            names.push(filteredData[i].country_name)
        }

        // filtering so that the id matches that of the country
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
            title: "Tourism and Infection Rates"
        };

        traceData = [trace1, trace2]

        Plotly.newPlot("bar", traceData, layout);
    });
};

function optionChanged(country) {

    console.log("next value:", country);
    barPlots(country);
};

init();