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

    authenticate(code) {
        // Authentication procedure: hit an OSF endpoint with a URL parameter "ticket". If backend validates the ticket, the response should set a cookie
        return Ember.$.ajax({
            method: 'GET',
            url: '/api/authendpoint' // TODO: Try ?fail=true behavior as well //config.OSF.url + 'login/?ticket=' + code,
            // TODO: mock passing the ticket in some way
        })
            .then(()=> console.log(...arguments));
        // TODO: rv?
    }
});
