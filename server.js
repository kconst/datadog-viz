const os = require('os');
const http = require("http");

const host = 'localhost';
const port = 8000;


const reqListener = function (req, res) {    
    const cpus = os.cpus().length;
    const loadAverage = os.loadavg()[0] / cpus;
    
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);

    res.end(JSON.stringify({ loadAverage }));
};

const server = http.createServer(reqListener);

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});