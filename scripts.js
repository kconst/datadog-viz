(() => {
    const RETRIEVAL_INTERVAL = 10000;
    const MAX_LENGTH = 60;

    const lineArr = [];
    const chart = realTimeLineChart();
    let alertingModule;

    document.addEventListener("DOMContentLoaded", function() {
        seedData();
        d3.select("#chart").datum(lineArr).call(chart);
        d3.select(window).on('resize', resize);
        setInterval(() => {
            retrieveData()
                .then(data => {
                    console.log({
                        time: new Date(),
                        value: data.loadAverage
                    });
                    lineArr.push({
                        time: new Date(),
                        value: data.loadAverage
                    });

                    if (lineArr.length > MAX_LENGTH) {
                        lineArr.shift();
                    }

                    alertingModule.incidents = lineArr;

                    // update DOM with latest alerts
                    const alertLog = document.querySelector('#alertLog');
                    alertLog.innerHTML = '';
                    alertLog.appendChild(alertingModule.generateHTML(alertingModule.incidents));

                    // update with the new data point
                    d3.select("#chart").datum(lineArr).call(chart);
                })
                .catch((err) => {
                    console.warn(err);
                });
        }, RETRIEVAL_INTERVAL);
    });

    function seedData() {
        let now = new Date();
        for (let i = 0; i < MAX_LENGTH; ++i) {
            lineArr.push({
                time: new Date(now.getTime() - ((MAX_LENGTH - i) * RETRIEVAL_INTERVAL)),
                value: 0
            });
        }

        alertingModule = new AlertingModule({
            upperBound: 50,
            durationLimit: 0.5,
            retrievalInterval: RETRIEVAL_INTERVAL,
            incidents: lineArr
        });
    }

    function resize() {
        if (d3.select("#chart svg").empty()) {
            return;
        }
        chart.width(+d3.select("#chart").style("width").replace(/(px)/g, ""));
        d3.select("#chart").call(chart);
    }

    function retrieveData() {
        return fetch('http://localhost:8000')
            .then((response) => {
                return response.json();
            });
    }
})();
