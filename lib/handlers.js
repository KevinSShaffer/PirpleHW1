
const handlers = {
    users(request, callback) {
        var acceptableMethods = ['post', 'get', 'put', 'delete'];
        if (acceptableMethods[request.method]) {
            handlers._users[request.method](request, callback);
        } else {
            callback(405);
        }
    },
    _users: {
        post(request, callback) {
            const firstName = length(request.body.firstName) ? request.body.firstName.trim() : false;
            const lastName = length(request.body.lastName) ? request.body.lastName.trim() : false;
            const phone = length(request.body.phone) == 10 ? request.body.phone.trim() : false;
            const password = length(request.body.password) ? request.body.password.trim() : false;
            var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' ? data.payload.tosAgreement : false;
          
        }
    },
    ping(request, callback) {
        callback(200)
    },
    sample(request, callback) {
        callback(200, { someData: 'sample data' })
    },
    helloWorld(request, callback) {
        callback(200, { message: 'hello world' })
    },
    notFound(request, callback) {
        callback(404)
    }
}

function length(object) {
    return typeof(object) == 'string' ? object.trim().length : 0;
}

module.exports = handlers;