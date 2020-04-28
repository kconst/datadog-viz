(() => {
    class AlertingModule {
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

            let type = 'alert';
            let activeDuration = 0;

            // record the high load ranges
            this._incidents = records.reduce((acc, record, index) => {
                let latestRange = acc[acc.length - 1];
                const value = (record.value * 100).toFixed(2) * 1;

                if (value >= upperBound && type === 'alert') {
                    latestRange = latestRange || {
                        startTime: record.time,
                        endTime: record.time,
                        type
                    };

                    if (latestRange.endTime < record.time) {
                        latestRange.endTime = record.time;
                    }

                    activeDuration += this.retrievalInterval;
                }


                if (value < upperBound && type === 'alert') {
                    if (activeDuration >= durationLimit) {
                        // push a recovery and reset counter w/ offset
                        activeDuration = 50;
                        type = 'recovery';
                        acc.push(undefined);


                        verifyLastResult();
                        return acc;
                    }
                }


                if (value < upperBound && type === 'recovery') {
                    if (activeDuration >= durationLimit) {
                        // push a recovery and reset counter
                        activeDuration = 50;
                        type = 'alert';
                        acc.push(undefined);

                        verifyLastResult();
                        return acc;
                    }

                    latestRange = latestRange || {
                        startTime: records[index - 1] ? records[index - 1].time : record.time,
                        endTime: record.time,
                        type
                    };

                    if (latestRange.endTime < record.time) {
                        latestRange.endTime = record.time;
                    }

                    activeDuration += this.retrievalInterval;
                }

                // ensure properties get initialized
                if (!acc[0]) {
                    acc[0] = latestRange;
                }
                if (acc[acc.length - 1] === undefined) {
                    acc[acc.length - 1] = latestRange;
                }

                verifyLastResult();

                return acc;

                function verifyLastResult() {
                    if (index === records.length - 1) {
                        latestRange = acc[acc.length - 1];

                        if (latestRange === undefined || (latestRange.endTime - latestRange.startTime < durationLimit)) {
                            acc.splice(acc.length - 1, 1);
                        }
                    }
                }
            }, []);
        }

        generateHTML(incidents) {
            const alertLog = document.createDocumentFragment();

            incidents.forEach(incident => {
                const alertElement = document.createElement('option');

                alertElement.classList.add(incident.type);
                alertElement.setAttribute('value', incident.startTime);
                alertElement.textContent = incident.type === 'recovery' ? `Recovered from ${ incident.startTime.toLocaleString() } to ${ incident.endTime.toLocaleString() }` : `High Load from ${ incident.startTime.toLocaleString() } to ${ incident.endTime.toLocaleString() }`;

                // if (incident instanceof Array) {
                //     alertElement.classList.add('highUsage');
                //     alertElement.setAttribute('value', incident[0]);
                //     alertElement.textContent = `High Load from ${ incident[0].toLocaleString() } to ${ incident[1].toLocaleString() }`;
                // } else if (incident) {
                //     alertElement.classList.add('recovered');
                //     alertElement.setAttribute('value', incident);
                //     alertElement.textContent = `Recovered from incident at ${ incident.toLocaleString() }`;
                // }

                alertLog.appendChild(alertElement);
            });

            return alertLog;
        }
    }

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = AlertingModule;
    } else {
        window.AlertingModule = AlertingModule;
    }
})();
