import Ember from 'Ember';
import config from 'ember-get-config';


/**
 * Helper functions for asynchronous behavior
 *
 * @module AjaxHelpers
 *
 */

/**
 * Performs any additional authorization config required, for the configured authorization type.
 * Allows manual AJAX requests to be authorization-agnostic.
 *
 * Primarily used to set XHR flags on manual AJAX requests, for cookie based authorization.
 *
 * @public
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

