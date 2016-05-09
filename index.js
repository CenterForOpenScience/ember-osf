/* jshint node: true */
'use strict';
var config = require('config');

module.exports = {
    name: 'ember-osf',
    config: function(environment, ENV) {
	let BACKEND = process.env.BACKEND || 'local';
	if (!config.has(BACKEND)) {
	    throw new Error(`WARNING: you have specified a backend: ${BACKEND} that you have not configured in your local.yml`);
	}
	let SETTINGS = config.get(BACKEND);

	ENV.OSF = {
            clientId: SETTINGS.CLIENT_ID,
            scope: SETTINGS.OAUTH_SCOPES
        };

	if (BACKEND === 'local') {
            ENV.OSF.url = 'http://localhost:5000/';
            ENV.OSF.apiUrl = 'http://localhost:8000/v2/';
            ENV.OSF.authUrl = 'http://localhost:8080/oauth2/profile';

            ENV.OSF.accessToken = SETTINGS.PERSONAL_ACCESS_TOKEN;
            ENV.OSF.local = true;
	}
	if (BACKEND === 'stage') {
            ENV.OSF.url = 'https://staging.osf.io/';
            ENV.OSF.apiUrl = 'https://staging-api.osf.io/v2/';
            ENV.OSF.authUrl = 'https://staging-accounts.osf.io/oauth2/authorize';
	}
	if (BACKEND === 'stage2') {
            ENV.OSF.url = 'https://staging2.osf.io/';
            ENV.OSF.apiUrl = 'https://staging2-api.osf.io/v2/';
            ENV.OSF.authUrl = 'https://staging2-accounts.osf.io/oauth2/authorize';
	}
	if (BACKEND === 'prod') {
            ENV.OSF.url = 'https://osf.io/';
            ENV.OSF.apiUrl = 'https://api.osf.io/v2/';
            ENV.OSF.authUrl = 'https://accounts.osf.io/oauth2/authorize';
	}

	ENV['ember-simple-auth'] = {
	    authorizer: 'authorizer:osf-token'
        };
    }
};
