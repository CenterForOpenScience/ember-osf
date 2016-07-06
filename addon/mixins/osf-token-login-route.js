import Ember from 'ember';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

import config from 'ember-get-config';

import { getTokenFromHash } from 'ember-osf/utils/auth';

/**
 * @module ember-osf
 * @submodule mixins
 */

/**
 * Route mixin to add support for OAuth2 token based authentication
 *
 * Intended to be used in tandem with OsfTokenLoginControllerMixin
 *
 * @class OsfTokenLoginRouteMixin
 * @extends Ember.Mixin
 */
export default Ember.Mixin.create(UnauthenticatedRouteMixin, {
    session: Ember.inject.service(),
    beforeModel() {
        var accessToken;
        if (config.OSF.isLocal) {
            accessToken = config.OSF.accessToken;
        } else {
            accessToken = getTokenFromHash(window.location.hash);
            if (!accessToken) {
                return null;
            }
            window.location.hash = '';
        }

        return this.get('session').authenticate('authenticator:osf-token', accessToken)
            .then(() => this.transitionTo('index'));
    }
});
