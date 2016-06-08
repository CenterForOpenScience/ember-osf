import Ember from 'ember';

import config from 'ember-get-config';

export default Ember.Mixin.create({
    session: Ember.inject.service(),
    actions: {
        login() {
            var trailingSlash = '/';
            if (!config.OSF.trailingSlash) {
                trailingSlash = '';
            }
            window.location = `${config.OSF.authUrl}?response_type=token&scope=${config.OSF.scope}&client_id=${config.OSF.clientId}&redirect_uri=${encodeURI(window.location)}${trailingSlash}`;
        }
    }
});
