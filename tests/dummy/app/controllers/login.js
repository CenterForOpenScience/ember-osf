import Ember from 'ember';

import config from 'ember-get-config';

export default Ember.Controller.extend({
    session: Ember.inject.service(),
    actions: {
        login() {
            window.location = `${config.OSF.authUrl}oauth2/authorize?response_type=token&scope=${config.OSF.scope}&client_id=${config.OSF.clientId}&redirect_uri=${encodeURI(window.location)}`;
        }
    }
});
