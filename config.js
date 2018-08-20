
const environments = {
    staging: {
        httpPort: 3000,
        httpsPort: 3001,
        envName: 'staging'
    },
    production: {
        httpPort: 5000,
        httpsPort: 5001,
        envName: 'production'
    }
};

const currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ?
    process.env.NODE_ENV.toLowerCase() :
    '';
let environmentToExport = environments[currentEnvironment];

if (environmentToExport === undefined)
    environmentToExport = environments.staging;

module.exports = environmentToExport;
