import Ember from 'ember';
import Base from 'ember-simple-auth/authenticators/base';
import config from 'ember-get-config';

export default Base.extend({
    _test() {
        return Ember.$.ajax({
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
     * Present the provided ticket code to the OSF server. If backend validates the ticket, response should set a cookie.
     * @method authenticate
     * @param code
     * @returns {*|Promise}
     */
    authenticate(code) {
        return Ember.$.ajax({
            method: 'GET',
            url: `${config.OSF.url}?ticket=${code}`
        });
    }
});
