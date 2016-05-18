/* jshint node: true */

module.exports = function(environment) {

    // Allow the dummy app to support either token or cookie auth as needed. (default to tokens)
    var AUTHORIZER = process.env.AUTHORIZER || 'token';
    var authConfig = {};
    if (AUTHORIZER === 'cookie') {
        authConfig = {
                authorizer: 'authorizer:osf-cookie',
                authenticationRoute: 'cookielogin'
        };
    }

    var ENV = {
        modulePrefix: 'dummy',
        environment: environment,

        // Settings that may be helpful when serving from within another application (non-root directory)
        //baseURL: '/static/ember-dist/',
        //rootUrl: '/emberosf/',
        locationType: 'auto',  // hash
        
        EmberENV: {
            FEATURES: {
                // Here you can enable experimental features on an ember canary build
                // e.g. 'with-controller': true
            }
        },
        APP: {
            // Here you can pass flags/options to your application instance
            // when it is created
        },

        'ember-simple-auth': authConfig, // TODO: Does this override any default behaviors?
        'ember-cli-mirage': {
            enabled: false
        }
    };

    /*if (environment === 'development') {
        //ENV.APP.LOG_RESOLVER = true;
        //ENV.APP.LOG_ACTIVE_GENERATION = true;
        //ENV.APP.LOG_TRANSITIONS = true;
        //ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
        //ENV.APP.LOG_VIEW_LOOKUPS = true;
    }*/

    if (environment === 'test') {
        // Testem prefers this...
        ENV.baseURL = '/';
        ENV.locationType = 'none';

        // keep test console output quieter
        ENV.APP.LOG_ACTIVE_GENERATION = false;
        ENV.APP.LOG_VIEW_LOOKUPS = false;

        ENV.APP.rootElement = '#ember-testing';
    }

    if (environment === 'staging') {
        ENV.APP.LOG_TRANSITIONS = true;
    }
    if (environment === 'staging2') {
        ENV.APP.LOG_TRANSITIONS = true;
    }

    //if (environment === 'production') {}

    return ENV;
};
