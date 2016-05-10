/* jshint node: true */
'use strict';
var dotenv = require('dotenv');

module.exports = {
    name: 'ember-osf',
    config: function(environment, ENV) {
	dotenv.config({
	    path:'.env-' + {
		development: 'local',
		test: 'test',
		staging: 'stage',
		staging2: 'stage2',
		production: 'prod'
	    }[environment]
	});

	ENV.OSF = {
            clientId: process.env.OSF_CLIENT_ID,
            scope: process.env.OSF_SCOPE,
            apiNamespace: 'v2'  // URL suffix (after host)
        };
	if (environment === 'development') {
            ENV.OSF.url = 'http://localhost:5000';
            ENV.OSF.apiUrl = 'http://localhost:8000';
            ENV.OSF.authUrl = 'http://localhost:8080/oauth2/profile';

            ENV.OSF.accessToken = process.env.OSF_ACCESS_TOKEN;
            ENV.DEV = true;
	}
	if (environment === 'staging') {
            ENV.OSF.url = 'https://staging.osf.io';
            ENV.OSF.apiUrl = 'https://staging-api.osf.io';
            ENV.OSF.authUrl = 'https://staging-accounts.osf.io/oauth2/authorize';
	}
	if (environment === 'staging2') {
            ENV.OSF.url = 'https://staging2.osf.io';
            ENV.OSF.apiUrl = 'https://staging2-api.osf.io';
            ENV.OSF.authUrl = 'https://staging2-accounts.osf.io/oauth2/authorize';
	}
	if (environment === 'production') {
            ENV.OSF.url = 'https://osf.io';
            ENV.OSF.apiUrl = 'https://api.osf.io';
            ENV.OSF.authUrl = 'https://accounts.osf.io/oauth2/authorize';
	}

	ENV['ember-simple-auth'] = {
	    authorizer: 'authorizer:osf-token'
        };
    }
};
