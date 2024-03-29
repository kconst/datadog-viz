(() => {
    const RETRIEVAL_INTERVAL = 10000;
    const MAX_LENGTH = 60;

    const lineQueue = new Queue(MAX_LENGTH);
    const chart = realTimeLineChart();
    let alertingModule;

    const durationInput = document.querySelector('.duration');
    const limitInput = document.querySelector('.limit');

    document.addEventListener("DOMContentLoaded", function() {
        seedData();
        d3.select("#chart").datum(lineQueue.items).call(chart);
        d3.select(window).on('resize', resize);
        setInterval(() => {
            retrieveData()
                .then(data => {
                    console.log({
                        time: new Date(),
                        value: data.loadAverage
                    });

                    lineQueue.enqueue({
                        time: new Date(),
                        value: data.loadAverage
                    });

                    alertingModule.incidents = lineQueue.items;

                    // update DOM with latest alerts
                    const alertLog = document.querySelector('#alertLog');
                    alertLog.innerHTML = '';
                    alertLog.appendChild(alertingModule.generateHTML(alertingModule.incidents));

                    if (alertLog.lastElementChild) {
                        alertLog.lastElementChild.scrollIntoView();
                    }

                    // update with the new data point
                    d3.select("#chart").datum(lineQueue.items).call(chart);
                })
                .catch((err) => {
                    console.warn(err);
                });
        }, RETRIEVAL_INTERVAL);

        durationInput.addEventListener('change', e => {
            alertingModule.durationLimit = e.currentTarget.value;
            console.log(`duration limit set to: ${alertingModule.durationLimit}`);
        });

        limitInput.addEventListener('change', e => {
            alertingModule.upperBound = e.currentTarget.value;
            console.log(`cpu limit set to: ${alertingModule.upperBound}`);
        });
    });

    function seedData() {
        let now = new Date();
        for (let i = 0; i < MAX_LENGTH; ++i) {
            lineQueue.enqueue({
                time: new Date(now.getTime() - ((MAX_LENGTH - i) * RETRIEVAL_INTERVAL)),
                value: 0
            });
        }

        alertingModule = new AlertingModule({
            upperBound: limitInput.value,
            durationLimit: durationInput.value,
            retrievalInterval: RETRIEVAL_INTERVAL,
            incidents: lineQueue.items
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
