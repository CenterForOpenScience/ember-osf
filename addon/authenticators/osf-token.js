import Ember from 'ember';
import BaseAuthenticator from 'ember-simple-auth/authenticators/base';

import config from 'ember-get-config';

export default BaseAuthenticator.extend({
    store: Ember.inject.service(),
    authUrl: `${config.OSF.authUrl}/`,
    _test (accessToken) {
        return Ember.$.ajax({
            method: 'GET',
            url: `${config.OSF.apiUrl}users/me/`,
            dataType: 'json',
            contentType: 'application/json',
            xhrFields: {withCredentials: true},
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
