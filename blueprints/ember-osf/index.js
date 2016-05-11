/*jshint node:true*/
var fs = require('fs');
var path = require('path');

var CONFIG_MARKER = /#+\s+ember-osf\s+settings\s+#+.*?#+(?:.|\s|\n)*/m;

module.exports = {
    description: '',
    normalizeEntityName: function() {
	// h/t: https://github.com/samselikoff/ember-cli-mirage/blob/master/blueprints/ember-cli-mirage/index.js
        // this prevents an error when the entityName is
        // not specified (since that doesn't actually matter
        // to us
    },
    afterInstall: function() {
	var configPath = path.join(this.project.root, 'config', 'local.yml');
	var tmpConfigPath = path.join(this.project.root, 'config', '_local.yml');
	try {
	    debugger;
	    var contents = fs.readFileSync(configPath).toString();
	    if (!CONFIG_MARKER.test(contents)) {
		var tmpConfig = fs.readFileSync(tmpConfigPath).toString();
		fs.appendFileSync(configPath, tmpConfig);
	    }
	    fs.unlinkSync(tmpConfigPath);
	} catch (e) {
	    fs.renameSync(tmpConfigPath, configPath);
	}
    }
};
