const url = "/H2/static/js/tourism.json"

d3.json(samples_url).then(function(data) {
    console.log("Data: ", data);
});

function init() {
    let menu = d3.select("#selDataset"); 

    // We need to append the options to the dropdown menu
    d3.json(samples_url).then((data) => {
        // taking the "names" entry from the dictionary
        let names = data.names;

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

function barPlot(sample) {
    d3.json(samples_url).then((data) => {
        let samples = data.samples;

        // filtering so that the id matches that of the sample
        let matchedSamples = samples.filter((items) => {
            return item.country_name == name;
        });

        year_2018 = matchedSamples[0].year_2018;
        year_2019 = matchedSamples[0].year_2019;
        year_2020 = matchedSamples[0].year_2020;

        // slicing the ten values and putting them in descending order
        let xticks = [2018, 2019, 2020]
        let yticks = year_2018

        let trace1 = {
            x:xticks.reverse(),
            y:yticks.reverse(),
            text:labels.reverse(),
            type:"bar",
            orientation: "h"
        };

        let layout = {
            title: "Tourism Rates"
        };

        traceData = [trace1]

        Plotly.newPlot("bar", traceData, layout);
    });
};