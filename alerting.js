const AlertingModule = class AlertingModule {
    constructor({ upperBound = 80, durationLimit = 2, incidents = [], retrievalInterval = 10000 }) {
        this.upperBound = parseFloat(upperBound, 10);
        this.durationLimit = parseFloat(durationLimit, 10);
        this.retrievalInterval = retrievalInterval;
        this.incidents = incidents;
    }

    set incidents(records) {
        this._updateAlerts(records);
    }

    get incidents() {
        return this._incidents;
    }

    _updateAlerts(records) {
        const upperBound = this.upperBound;
        const durationLimit = this.durationLimit * 60000;

        let activeDuration = 0;

        // record the high load ranges
        this._incidents = records.reduce((acc, record, index) => {
            const value = (record.value * 100).toFixed(2) * 1;
            let latestRange = acc[acc.length - 1];

            // greedily update data as we come across valid cases
            if (value >= upperBound) {
                latestRange = latestRange || [record.time];
                latestRange[1] = latestRange[1] || record.time;

                if (latestRange[1] < record.time) {
                    latestRange[1] = record.time;
                }

                activeDuration += this.retrievalInterval;

                // ensure properties get initialized
                if (!acc[0]) {
                    acc[0] = latestRange;
                }
                if (acc[acc.length - 1] === undefined) {
                    acc[acc.length - 1] = latestRange;
                }
            }


            if (value < upperBound) {
                if (activeDuration >= durationLimit) {
                    // push a recovery and reset counter
                    activeDuration = 0;
                    acc.push(record.time);
                    acc.push(undefined);
                }
            }

            // ensure last open loop is valid
            if (index === records.length - 1) {
                latestRange = acc[acc.length - 1];

                if (latestRange && latestRange[1] - latestRange[0] < durationLimit) {
                    acc[acc.length - 1] = undefined;
                }
            }

            return acc;
        }, []);
    }

    generateHTML(incidents) {
        const alertLog = document.createDocumentFragment();

        incidents.forEach(incident => {
            const alertElement = document.createElement('option');

            if (incident instanceof Array) {
                alertElement.classList.add('highUsage');
                alertElement.setAttribute('value', incident[0]);
                alertElement.textContent = `High Load from ${ incident[0].toLocaleString() } to ${ incident[1].toLocaleString() }`;
            } else if (incident) {
                alertElement.classList.add('recovered');
                alertElement.setAttribute('value', incident);
                alertElement.textContent = `Recovered from incident at ${ incident.toLocaleString() }`;
            }

            alertLog.appendChild(alertElement);
            alertElement.scrollIntoView();
        });

        return alertLog;
    }
};
