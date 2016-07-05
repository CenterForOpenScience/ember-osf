import Ember from 'ember';
import config from 'ember-get-config';

/**
 * Helper functions for asynchronous behavior
 *
 * @module ember-osf
 * @module utils
 */

/**
 * Helper functions to support AJAX requests
 * @class ajax-helpers
 */

/**
 * Performs any additional authorization config required, for the configured authorization type.
 * Allows manual AJAX requests to be authorization-agnostic.
 *
 * Primarily used to set XHR flags on manual AJAX requests, for cookie based authorization.
 * @method ajaxAuth
 * @param {Object} options
 * @returns {Promise}
 */
function ajaxAuth(options) {
    if (config.authorizationType === 'cookie') {
        Ember.merge(options, {
            xhrFields: {
                withCredentials: true
            }
        });
    }
    return Ember.$.ajax(options);

}
export { ajaxAuth };

