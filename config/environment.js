/* eslint-env node */
'use strict';

module.exports = function(/* environment, appConfig */) {
    return {
        moment: {
            includeTimezone: 'all'
        }
    };
};
