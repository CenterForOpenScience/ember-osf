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
        // For now, authentication consists of sending the user to OSF
        return Ember.$.get({url: config.OSF.url + 'ticket=' + code})
            .then(()=> console.log(...arguments));
        // TODO: rv?
  }
});
