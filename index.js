
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');
const handlers = require('./lib/handlers');

const httpsServerOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem')
};

http.createServer(unifiedServer)
    .listen(config.httpPort, () => {
        console.log(`The http server is listening on port ${config.httpPort} in ${config.envName} mode`)
    });

https.createServer(httpsServerOptions, unifiedServer)
    .listen(config.httpsPort, () => {
        console.log(`The https server is listening on port ${config.httpsPort} in ${config.envName} mode`)
    });

function unifiedServer(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const trimmedPath = parsedUrl.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
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

        chosenHandler({}, (statusCode, request) => {
            if (typeof(statusCode) != 'number')
                statusCode = 200;
            if (typeof(payload) != 'object')
                payload = {};
            
            const responseBody = JSON.stringify(payload);
            
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(responseBody);

            console.log(`Returning this response: (${statusCode}) ${responseBody}`);
        });
    });
}

const router = {
    ping: handlers.ping,
    sample: handlers.sample,
    hello: handlers.helloWorld
}