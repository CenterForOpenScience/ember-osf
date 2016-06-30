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
     * Send a request to the flask application to trigger invalidation of session remotely
     * @method invalidate
     */
    invalidate() {
        return Ember.$.ajax({
            method: 'GET',
            url: `${config.OSF.url}logout/`,
            xhrFields: {  // TODO: Possibly unnecessary?
                withCredentials: true
            }
        });
    },
    /**
     * For now, simply verify that a token is present and can be used
     * @method authenticate
     * @param code
     * @returns {*|Promise}
     */
    authenticate(code) {
        return this._test(code);
    }
});
