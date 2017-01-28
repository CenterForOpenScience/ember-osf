/* jshint node: true */
'use strict';
var path = require('path');
var config = require('config');
var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');
var compileSass = require('broccoli-sass-source-maps');

// Fetch a list of known backends. The user can always choose to override any of these URLs via ENV vars
var knownBackends = require('./config/backends');

module.exports = {
    name: 'ember-osf',
    blueprintsPath: function() {
        return path.join(__dirname, 'blueprints');
    },
    config: function(environment, ENV) {
        let BACKEND = process.env.BACKEND || 'local';
        // Settings required to configure the developer application, primarily for OAuth2
        let OAUTH_SETTINGS = {};
        // Backwards compatibility: old config/*.yml files were nested, with keys like "stage", "test", etc.
        // New files are flat- you specify the values you want once. If there is no <backendname> key, assume
        // this is a flat config file and assume the settings we want are at the top level.
        OAUTH_SETTINGS = config[BACKEND] || config;

        // For i18n
        ENV.i18n = {
            defaultLocale: 'en-US'
        };

        ENV.OSF = {
            clientId: OAUTH_SETTINGS.CLIENT_ID,
            scope: OAUTH_SETTINGS.OAUTH_SCOPES,
            apiNamespace: 'v2', // URL suffix (after host)
            backend: BACKEND,
            redirectUri: OAUTH_SETTINGS.REDIRECT_URI
        };

        // Fetch configuration information for the application
        var backendConfig = knownBackends[BACKEND] || {};

        if (BACKEND === 'local') {
            backendConfig.accessToken = OAUTH_SETTINGS.PERSONAL_ACCESS_TOKEN;
            backendConfig.isLocal = true;
        } else if (BACKEND === 'prod') {
            console.warn("WARNING: you've specified production as a backend. Please do not use production for testing or development purposes");
        } else if (BACKEND === 'env') {
            // Optionally draw backend settings entirely from environment variables.
            //   This is an all-or-nothing operation; we currently do not support overriding one URL at a time.
            let newConfig = {};
            // Map the internal, old-style key names to the corresponding environment variables. All must be present.
            Object.keys(backendConfig).forEach(key => {
                const envEntryName = backendConfig[key];
                newConfig[key] = config[envEntryName];
            });
            backendConfig = newConfig;
        }

        // Warn the user if some config entries not present
        Object.keys(backendConfig).forEach(key => {
            if (!backendConfig[key]) console.error(`This backend must define a value for: ${key}`);
        });
        ENV.OSF = backendConfig;

        ENV['ember-simple-auth'] = {
            authorizer: 'authorizer:osf-token'
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
        return app;
    },
    treeForAddon: function(tree) {
        this.addonTree = tree;
        return this._super.treeForAddon.apply(this, arguments);
    },
    treeForVendor: function(tree) {
        var addonStyleTree = this._treeFor('addon-styles');
        var addonPodStyles = new Funnel(this.addonTree, {
            include: [
                'components/**/*css'
            ]
        });
        var addonCss = compileSass(
            [addonStyleTree, addonPodStyles],
            'addon.scss',
            'assets/ember-osf.css',
            {
                annotation: 'EmberOsf Sass Tree'
            });
        return mergeTrees([tree, addonCss].filter(Boolean));
    },
    treeForPublic() {
        var assetDir = path.join(path.resolve(this.root, ''), 'addon/assets');
        return new Funnel(assetDir, {
            destDir: 'assets/'
        });
    }
};
