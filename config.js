
const environments = {
    staging: {
        port: 3000,
        envName: 'staging'
    },
    production: {
        port: 8888,
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
