import Ember from 'ember';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

import config from 'ember-get-config';

export default Ember.Mixin.create(UnauthenticatedRouteMixin, {
    session: Ember.inject.service(),
    beforeModel() {
        var accessToken;
        if (config.OSF.isLocal) {
            accessToken = config.OSF.accessToken;
        } else {
            // Acquire an OSF access token, then exchange it for a Jam token
            var hash = window.location.hash.substring(1).split('&').map(function(str) {
                return this[str.split('=')[0]] = str.split('=')[1], this;
            }.bind({}))[0];
            if (!hash || !hash.access_token) {
                return null;
            }
            window.location.hash = '';
            accessToken = hash.access_token;
        }

        return this.get('session').authenticate('authenticator:osf-token', accessToken)
            .then(() => this.transitionTo('index'));
    }
});
