const Queue = require('./Queue');
const AlertingModule = require('./AlertingModule');

describe('queue', () => {
    const queue = new Queue(5);
    beforeEach(() => {
        queue.items = [1,2,3,4,5];
    });

    it('should have a size of five', () => {
        expect(queue.size).toBe(5);
    });

    it('should only allow a maximum number of items when specified', () => {
        queue.enqueue(6);
        expect(queue.size).toBe(5);
    });

    it('should dequeue an expected result', () => {
        expect(queue.dequeue()).toBe(1);
    });
});

describe('alerting module', () => {
    let alertingModule;

    beforeEach(() => {
        alertingModule = new AlertingModule({
            upperBound: 50,
            durationLimit: 0.5,
            retrievalInterval: 10000,
            incidents: []
        });
    });

    it('should have zero incidents on instantiation', () => {
        expect(alertingModule.incidents.length).toBe(0);
    });

    it('should call underlying logic on setter', () => {
        const spy = jest.spyOn(alertingModule, '_updateAlerts');

        alertingModule.incidents = [{
            "time": "2020-04-27T20:27:35.204Z",
            "value": 0.45587158203125
        },
            {
                "time": "2020-04-27T20:27:45.205Z",
                "value": 0.5093994140625
            },
            {
                "time": "2020-04-27T20:27:55.205Z",
                "value": 0.547119140625
            },
            {
                "time": "2020-04-27T20:28:05.206Z",
                "value": 0.63671875
            },
            {
                "time": "2020-04-27T20:28:15.204Z",
                "value": 0.68328857421875
            }];

        expect(spy).toBeCalled();
    });

    it('should generate an alert incident on high cpu load', () => {
        alertingModule.incidents = [{
                "time": "2020-04-27T20:27:35.204Z",
                "value": 0.45587158203125
            },
            {
                "time": "2020-04-27T20:27:45.205Z",
                "value": 0.5093994140625
            },
            {
                "time": "2020-04-27T20:27:55.205Z",
                "value": 0.547119140625
            },
            {
                "time": "2020-04-27T20:28:05.206Z",
                "value": 0.63671875
            },
            {
                "time": "2020-04-27T20:28:15.204Z",
                "value": 0.68328857421875
            }];

        expect(alertingModule.incidents.filter(incident => incident.type === 'alert').length).toBe(1);
    });

    it('should generate a recovery incident on cpu load recovery', () => {
        alertingModule.incidents = [{
                "time": "2020-04-27T20:27:35.204Z",
                "value": 0.45587158203125
            },
            {
                "time": "2020-04-27T20:27:45.205Z",
                "value": 0.5093994140625
            },
            {
                "time": "2020-04-27T20:27:55.205Z",
                "value": 0.547119140625
            },
            {
                "time": "2020-04-27T20:28:05.206Z",
                "value": 0.63671875
            },
            {
                "time": "2020-04-27T20:28:15.204Z",
                "value": 0.68328857421875
            },
            {
                "time": "2020-04-27T20:31:15.252Z",
                "value": 0.4443359375
            },
            {
                "time": "2020-04-27T20:31:25.200Z",
                "value": 0.43365478515625
            },
            {
                "time": "2020-04-27T20:31:35.203Z",
                "value": 0.4154052734375
            },
            {
                "time": "2020-04-27T20:31:45.201Z",
                "value": 0.38909912109375
            },
            {
                "time": "2020-04-27T20:31:55.201Z",
                "value": 0.40692138671875
            },];

        expect(alertingModule.incidents.filter(incident => incident.type === 'recovery').length).toBe(1);
    });

    it('should generate html with valid incidents', () => {
        alertingModule.incidents = [{
                "time": "2020-04-27T20:27:35.204Z",
                "value": 0.45587158203125
            },
            {
                "time": "2020-04-27T20:27:45.205Z",
                "value": 0.5093994140625
            },
            {
                "time": "2020-04-27T20:27:55.205Z",
                "value": 0.547119140625
            },
            {
                "time": "2020-04-27T20:28:05.206Z",
                "value": 0.63671875
            },
            {
                "time": "2020-04-27T20:28:15.204Z",
                "value": 0.68328857421875
            },
            {
                "time": "2020-04-27T20:31:15.252Z",
                "value": 0.4443359375
            },
            {
                "time": "2020-04-27T20:31:25.200Z",
                "value": 0.43365478515625
            },
            {
                "time": "2020-04-27T20:31:35.203Z",
                "value": 0.4154052734375
            },
            {
                "time": "2020-04-27T20:31:45.201Z",
                "value": 0.38909912109375
            },
            {
                "time": "2020-04-27T20:31:55.201Z",
                "value": 0.40692138671875
            },];

        const fragment = alertingModule.generateHTML(alertingModule.incidents);
        expect(fragment.children.length).toBe(2);
    });
});
