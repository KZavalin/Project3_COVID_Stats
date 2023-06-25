const url = "tourism.json"

d3.json(url).then(function(data) {
    console.log("Data: ", data);
});

function init() {
    let menu = d3.select("#selDataset");

    // We need to append the options to the dropdown menu
    d3.json(url).then((data) => {
        let names = []
        for (let i = 0; i < data.length; i++) {
            names.push(data[i].country_name)
        }
        console.log("names: ", names)

        names?.map((name) => {
            menu.append("option").text(name).property("value", name);
        });

        barPlot(names[0]);
    });
};

function barPlot(country) {
    d3.json(url).then((data) => {
        let names = []
        for (let i = 0; i < data.length; i++) {
            names.push(data[i].country_name)
        }

        // filtering so that the id matches that of the country
        let matchedCountries = data.filter((item) => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].country_name == country)
                    return item.country_name == country;
            }
            
        });

        console.log("matchedCountries:", matchedCountries);

        year_2018 = matchedCountries[0].year_2018;
        year_2019 = matchedCountries[0].year_2019;
        year_2020 = matchedCountries[0].year_2020;

        console.log("2018:", year_2018)
        console.log("2019:", year_2019)
        console.log("2020:", year_2020)

        // slicing the ten values and putting them in descending order
        let xticks = [2018, 2019, 2020]
        let yticks = [year_2018, year_2019, year_2020]

        let trace1 = {
            x:xticks,
            y:yticks,
            type:"bar",
            orientation: "v"
        };

        let layout = {
            title: "Tourism Rates"
        };

        traceData = [trace1]

        Plotly.newPlot("bar", traceData, layout);
    });
};

function optionChanged(country) {

    console.log("next value:", country);
    barPlot(country);
};

init();