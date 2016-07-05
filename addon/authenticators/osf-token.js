import Ember from 'ember';
import BaseAuthenticator from 'ember-simple-auth/authenticators/base';

import config from 'ember-get-config';

/**
 * @module ember-osf
 * @submodule authenticators
 */

/**
 * Ember-simple-auth compatible authenticator based on OAuth2 bearer tokens.
 *
 * Intended to be used with the authenticator of the same name.
 * 
 * @class OsfTokenAuthenticator
 * @extends ember-simple-auth/BaseAuthenticator
 */
export default BaseAuthenticator.extend({
    store: Ember.inject.service(),
    authUrl: `${config.OSF.authUrl}/`,
    _test(accessToken) {
        return Ember.$.ajax({
            method: 'GET',
            url: `${config.OSF.apiUrl}/${config.OSF.apiNamespace}/users/me/`,
            dataType: 'json',
            contentType: 'application/json',
            xhrFields: {
                withCredentials: false
            },
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(function(res) {
            res.data.attributes.accessToken = accessToken;
            return res.data;
        });
    },
    restore(data) {
        let accessToken = data.attributes.accessToken;
        return this._test(accessToken).fail(this.invalidate);
    },
    authenticate(accessToken) {
        return this._test(accessToken);
    }
});
