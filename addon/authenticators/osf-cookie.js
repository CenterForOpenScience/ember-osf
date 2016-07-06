import Base from 'ember-simple-auth/authenticators/base';
import config from 'ember-get-config';

import { authenticatedAJAX } from 'ember-osf/utils/ajax-helpers';

/**
 * @module ember-osf
 * @submodule authenticators
 */

/**
 * Ember-simple-auth compatible authenticator based on session cookie.
 *
 * Intended to be used with the authorizer of the same name.
 *
 * @class OsfCookieAuthenticator
 * @extends ember-simple-auth/BaseAuthenticator
 */
export default Base.extend({
    _test() {
        return authenticatedAJAX({
            method: 'GET',
            url: `${config.OSF.apiUrl}/${config.OSF.apiNamespace}/users/me/`,
            dataType: 'json',
            contentType: 'application/json',
            xhrFields: {
                withCredentials: true
            }
        }).then(function(res) {
            return res.data;
        });
    },
    restore(/* data */) {
        return this._test().fail(this.invalidate);
    },

    /**
     * Send a request to the flask application to trigger invalidation of session remotely
     * @method invalidate
     */
    invalidate() {
        // Can't do this via AJAX request because it redirects to CAS, and AJAX + redirect = CORS issue
        window.location = `${config.OSF.url}logout/`;
    },
    /**
     * For now, simply verify that a token is present and can be used
     * @method authenticate
     * @param code
     * @return {Promise}
     */
    authenticate(code) {
        return this._test(code);
    }
});
