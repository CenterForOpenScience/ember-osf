/*jshint node:true*/
/* global require, module */
var path = require('path');
var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
    var app = new EmberAddon(defaults, {
        sassOptions: {
            includePaths: [
                'tests/dummy/app/components',
                'addon/styles'
            ]
        },

        // FIXME
        // FIXME Will this affect downstream consumers (when they build their apps)?
        // FIXME
        // This is really for building the application. It's a hack so we can use the dummy app inside the OSF to test development.
        // It's for production builds, and we may want to comment it out when needed. Usage:
        //   ember build --output-path ../osf.io/website/static/ember/ --environment=production --watch
        //////// Uncomment the lines below to test!
        // fingerprint: {
        //     prepend: 'static/ember/'
        // },

        babel: {
            includePolyfill: true
        }
    });

    app.import(path.join(app.bowerDirectory, 'osf-style/css/base.css'));
    app.import(path.join(app.bowerDirectory, 'dropzone/dist/basic.css'));
    app.import(path.join(app.bowerDirectory, 'dropzone/dist/dropzone.css'));
    app.import(path.join(app.bowerDirectory, 'dropzone/dist/dropzone.js'));

    return app.toTree();
};
