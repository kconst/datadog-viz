const http = require("http");

const host = 'localhost';
const port = 8000;

const reqListener = function (req, res) {
    
    res.writeHead(200);
    res.end('hello world');
};

const server = http.createServer(reqListener);

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});