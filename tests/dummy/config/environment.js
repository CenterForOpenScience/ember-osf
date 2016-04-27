/* jshint node: true */
var dotenv = require('dotenv');
var path = require('path');

module.exports = function(environment) {
    dotenv.config({
	path:'.env-' + {
	    development: 'local',
	    test: 'test',
	    staging: 'stage',
	    staging2: 'stage2',
	    production: 'prod'
	}[environment]
    });

    var ENV = {
        modulePrefix: 'dummy',
        environment: environment,
        baseURL: '/',
        locationType: 'auto',
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
        OSF: {
            clientId: process.env.OSF_CLIENT_ID,
            scope: process.env.OSF_SCOPE
        },
        'ember-simple-auth': {
            authenticationRoute: 'login',
            routeAfterAuthentication: 'index',
            authorizer: 'authorizer:custom'
        }
    };

    if (environment === 'development') {
        //ENV.APP.LOG_RESOLVER = true;
        //ENV.APP.LOG_ACTIVE_GENERATION = true;
        //ENV.APP.LOG_TRANSITIONS = true;
        //ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
        //ENV.APP.LOG_VIEW_LOOKUPS = true;


        ENV.OSF.url = 'http://localhost:5000/';
        ENV.OSF.apiUrl = 'http://localhost:8000/v2/';
        ENV.OSF.authUrl = 'http://localhost:8080/oauth2/profile';

        ENV.OSF.accessToken = process.env.OSF_ACCESS_TOKEN;
        ENV.DEV = true;
    }

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
        ENV.OSF.url = 'https://staging.osf.io/';
        ENV.OSF.apiUrl = 'https://staging-api.osf.io/v2/';
        ENV.OSF.authUrl = 'https://staging-accounts.osf.io/oauth2/authorize';
    }
    if (environment === 'staging2') {

        ENV.APP.LOG_TRANSITIONS = true;
        ENV.OSF.url = 'https://staging2.osf.io/';
        ENV.OSF.apiUrl = 'https://staging2-api.osf.io/v2/';
        ENV.OSF.authUrl = 'https://staging2-accounts.osf.io/oauth2/authorize';
    }

    if (environment === 'production') {

        ENV.OSF.url = 'https://osf.io/';
        ENV.OSF.apiUrl = 'https://api.osf.io/v2/';
        ENV.OSF.authUrl = 'https://accounts.osf.io/oauth2/authorize';
    }

    return ENV;
};
