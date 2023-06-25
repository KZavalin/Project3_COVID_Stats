const url = "/H2/static/js/tourism.json"

d3.json(samples_url).then(function(data) {
    console.log("Data: ", data);
});

function init() {
    let menu = d3.select("#selDataset"); 

    // We need to append the options to the dropdown menu
    d3.json(samples_url).then((data) => {
        let names = data.country_name;

        names.map((name) => {
            menu.append("option").text(name).property("value", name);
        });

        // logging names[0] gives 940, the first id
        // In other words, we want the default menu to display the first name in the list
        demographicInfo(names[0]);
        barPlot(names[0]);
        bubblePlot(names[0]);
    });
};

function barPlot(country) {
    d3.json(url).then((data) => {

        // filtering so that the id matches that of the country
        let matchedSamples = data.filter((item) => {
            return item.country_name == name;
        });

        year_2018 = matchedSamples[0].year_2018;
        year_2019 = matchedSamples[0].year_2019;
        year_2020 = matchedSamples[0].year_2020;

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