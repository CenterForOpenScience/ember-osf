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
        }
    });

    app.import(path.join(app.bowerDirectory, 'osf-style/css/base.css'));
    return app.toTree();
};
