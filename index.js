
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const decoder = new StringDecoder('utf-8');
    let buffer = '';

    req.on('data', data => {
        buffer += decoder.write(data);
    });
    req.on('end', () => {
        buffer += decoder.end();

        let chosenHandler = router[trimmedPath];

        if (chosenHandler == undefined)
            chosenHandler = handlers.notFound;

        const request = {
            path: trimmedPath,
            query: parsedUrl.query,
            method: req.method.toUpperCase(),
            headers: req.headers,
            body: buffer
        }

        chosenHandler(request, (statusCode, payload) => {
            if (typeof(statusCode) != 'number')
                statusCode = 200;
            if (typeof(payload) != 'object')
                payload = {};
            
            const responseBody = JSON.stringify(payload);
            
            res.writeHead(statusCode);
            res.end(responseBody);

            console.log(`Returning this response: (${statusCode}) ${responseBody}`);
        });
    });
});

const port = 3000;
server.listen(port, () => {
    console.log(`The server is listening on port ${port}`)
});

const handlers = {
    sample(data, callback) {
        callback(200, data)
    },
    notFound(data, callback) {
        callback(404)
    }
}
const router = {
    sample: handlers.sample
}