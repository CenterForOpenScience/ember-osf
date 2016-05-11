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
            var hash = window.location.hash.substring(1).split('&').map(function(str) {
                // TODO: Comma expression; check with Sam on intent
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
