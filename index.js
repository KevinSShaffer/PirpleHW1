
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');
const _data = require('./lib/data');

_data.delete('test', 'newFile', err => {
    if (err) 
        console.log(err);
});

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
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '').toLowerCase();
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

        chosenHandler({}, (statusCode, payload) => {
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

const handlers = {
    ping(data, callback) {
        callback(200)
    },
    sample(data, callback) {
        callback(200, { someData: 'sample data' })
    },
    helloWorld(data, callback) {
        callback(200, { message: 'hello world' })
    },
    notFound(data, callback) {
        callback(404)
    }
}
const router = {
    ping: handlers.ping,
    sample: handlers.sample,
    hello: handlers.helloWorld
}