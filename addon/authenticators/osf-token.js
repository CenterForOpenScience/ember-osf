import Ember from 'ember';
import BaseAuthenticator from 'ember-simple-auth/authenticators/base';

import config from 'ember-get-config';

export default BaseAuthenticator.extend({
    store: Ember.inject.service(), // TODO: Possibly unused?
    authUrl: `${config.OSF.authUrl}/`, // TODO: Where is this used? (not in OSF code or ember-simple-auth source that I can find)
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
        // Adds the entire API user endpoint record to the session store as given
        return this._test(accessToken);
    }
});
