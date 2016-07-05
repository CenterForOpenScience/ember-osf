import Ember from 'ember';

import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

/**
 * Route mixin for login based on OSF cookie authentication. Intended to be used in tandem with OsfCookieLoginController mixin.
 * This is the preferred login method for third-party applications
 *
 * @class OsfCookieLoginRoute
 * @extends Ember.Mixin
 * @uses ember-simple-auth/UnauthenticatedRouteMixin
 */
export default Ember.Mixin.create(UnauthenticatedRouteMixin, {
    session: Ember.inject.service(),
    beforeModel() {
        // Determine whether the user is logged in by making a test request. This is quite a crude way of
        // determining whether the user has a cookie and should be improved in the future.
        this.get('session').authenticate('authenticator:osf-cookie');
        return this._super(...arguments);
    }
});
