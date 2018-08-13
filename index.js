
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const query = parsedUrl.query;
    const method = req.method.toUpperCase();
    const headesr = req.headers;
    const decoder = new StringDecoder('utf-8');
    let buffer = '';

    req.on('data', data => {
        buffer += decoder.write(data);
    });
    req.on('end', () => {
        buffer += decoder.end();

        res.end('Hello World!\n');
    
        console.log(`Request received with data: ${buffer}`);
    });
});

const port = 3000;
server.listen(port, () => {
    console.log(`The server is listening on port ${port}`)
});
