/* eslint-env node */
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
'use strict';
var path = require('path');
var config = require('config');
var Funnel = require('broccoli-funnel');

// Fetch a list of known backends. The user can always choose to override any of these URLs via ENV vars
var knownBackends = require('./config/backends');

// Closure to fetch a key from one of two places (environment vars or a specified object). Env vars take precedence.
function envOrSource(env, source) {
    function getKey(keyName) {
        return env[keyName] || source[keyName];
    }
    return getKey;
}

module.exports = {
    name: 'ember-osf',
    blueprintsPath: function() {
        return path.join(__dirname, 'blueprints');
    },
    config: function(environment, ENV) {
        let BACKEND = process.env.BACKEND || 'local';
        // Settings required to configure the developer application, primarily for OAuth2
        let configFileSettings = {};
        // Backwards compatibility: old config/*.yml files were nested, with keys like "stage", "test", etc.
        // New files are flat- you specify the values you want once. If there is no <backendname> key, assume
        // this is a flat config file and assume the settings we want are at the top level.
        configFileSettings = config[BACKEND] || config;

        // For i18n
        ENV.i18n = {
            defaultLocale: 'en-US'
        };

        const eitherConfig = envOrSource(process.env, configFileSettings);
        ENV.OSF = {
            clientId: eitherConfig('CLIENT_ID'),
            scope: eitherConfig('OAUTH_SCOPES'),
            apiNamespace: 'v2', // URL suffix (after host)
            backend: BACKEND,
            redirectUri: eitherConfig('REDIRECT_URI')
        };

        // Fetch configuration information for the application
        var backendUrlConfig = knownBackends[BACKEND] || {};

        if (!Object.keys(knownBackends).includes(BACKEND)) {
            console.warn('WARNING: You have specified an unknown backend environment. If you need to customize URL settings, specify BACKEND=env');
        }

        if (BACKEND === 'local') {
            backendUrlConfig.accessToken = eitherConfig('PERSONAL_ACCESS_TOKEN');
            backendUrlConfig.isLocal = true;
        } else if (BACKEND === 'prod') {
            console.warn("WARNING: you've specified production as a backend. Please do not use production for testing or development purposes");
        } else if (BACKEND === 'env') {
            // Optionally draw backend URL settings entirely from environment variables.
            //   This is all or nothing: If you want to specify a custom backend, you must provide ALL URLs.
            let newConfig = {};
            // Map internal config names to the corresponding env var names, eg {url: OSF_URL}. All keys must be present
            Object.keys(backendUrlConfig).forEach(internalName => {
                const envVarName = backendUrlConfig[internalName];
                newConfig[internalName] =  eitherConfig(envVarName);
            });
            backendUrlConfig = newConfig;
        }
        // Warn the user if some URL entries not present
        Object.keys(backendUrlConfig).forEach(key => {
            if (!backendUrlConfig[key]) console.error(`This backend must define a value for: ${key}`);
        });

        // Combine URLs + auth settings into final auth config
        Object.assign(ENV.OSF, backendUrlConfig);

        const defaultAuthorizationType = 'token';
        ENV.authorizationType = defaultAuthorizationType;

        ENV['ember-simple-auth'] = {
            authorizer: `authorizer:osf-${defaultAuthorizationType}`,
            authenticator: `authenticator:osf-${defaultAuthorizationType}`
        };
    },
    afterInstall: function(options) {
        if (options['ember-osf'].includeStyles) {
            this.addAddonToProject('ember-font-awesome');
        }
    },
    included: function(app) {
        // Documentation of the `included` hook is mostly in the comment
        // threads of `ember-cli` issues on github. For example:
        // https://github.com/ember-cli/ember-cli/issues/3531#issuecomment-81133458
        this._super.included.apply(this, arguments);

        if (app.options['ember-osf'] && app.options['ember-osf'].includeStyles) {
            app.options['ember-font-awesome'] = {
                useScss: true
            };
        }

        // Set options.ember-power-select.useScss to true in consuming app to use SCSS styles
        // from ember-power-select (must import manually with @import 'ember-power-select').
        if (!(app.options['ember-power-select'] && app.options['ember-power-select'].useScss)) {
            // ember-power-select normally skips inclusion of the precompiled css file if
            // the consuming app uses SASS, but using @import 'ember-power-select' in ember-osf
            // doesn't work properly, so we just import the compiled css.
            if (app.registry.availablePlugins['ember-cli-sass']) {
                app.import('vendor/ember-power-select.css');
            }
        }

        return app;
    },
    treeForPublic() {
        var assetDir = path.join(path.resolve(this.root, ''), 'addon/assets');
        return new Funnel(assetDir, {
            destDir: 'assets/'
        });
    }
};
