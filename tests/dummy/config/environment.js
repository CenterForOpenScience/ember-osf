/* eslint-env node */

module.exports = function(environment) {

    // Allow the dummy app to support either token or cookie auth as needed. (default to tokens)
    var AUTHORIZER = process.env.AUTHORIZER || 'token';
    var authConfig = {};
    if (AUTHORIZER === 'cookie') {
        authConfig = {
            authorizer: 'authorizer:osf-cookie',
            authenticator: 'authenticator:osf-cookie',
            authenticationRoute: 'cookielogin'
        };
    }

    var ENV = {
        metricsAdapters: [
            {
                name: 'GoogleAnalytics',
                environments: ['all'],
                config: {
                    id: process.env.GOOGLE_ANALYTICS_ID,
                    setFields: {
                        // Ensure the IP address of the sender will be anonymized.
                        anonymizeIp: true,
                    }
                }
            },
        ],
        modulePrefix: 'dummy',
        appName: 'Dummy App',
        environment: environment,
        rootURL: '/',
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

        authorizationType: AUTHORIZER,
        'ember-simple-auth': authConfig, // TODO: Does this override any default behaviors?
        i18n: {
            defaultLocale: 'en-US'
        },

        'ember-cli-mirage': {
            enabled: false
        },

        'ember-a11y-testing': {
            componentOptions: {
                turnAuditOff: false
            }
        },

        moment: {
            includeTimezone: 'all',
            outputFormat: 'YYYY-MM-DD h:mm A z',
        },
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
        ENV.rootURL = '/';
        ENV.locationType = 'none';

        ENV.OSF = {
            url: '/nowhere',
            apiUrl: 'http://localhost:8000',
            renderUrl: '/nowhere',
            waterbutlerUrl: '/nowhere',
            helpUrl: '/nowhere',
            cookieLoginUrl: '/nowhere',
            oauthUrl: '/nowhere',
            shareBaseUrl: '/nowhere',
            shareApiUrl: '/nowhere',
            shareSearchUrl: '/nowhere'
        };

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
