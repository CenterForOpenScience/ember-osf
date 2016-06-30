import Ember from 'ember';

import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

/**
 * Controller configuration mixin for a login route based on OSF OAuth2 token-based authorization
 * This is the preferred login method for third-party applications
  @class OsfTokenLoginController
 */
export default Ember.Mixin.create(UnauthenticatedRouteMixin, {
    session: Ember.inject.service(),
    beforeModel() {
        // Login flow with cookies depends on being redirected to the /login page, to work around CORS issues

        // Check whether there is a ticket appended to the URL; if so, try to authenticate with it. (hitting this route implies user is unauthenticated)
        // Otherwise show button redirecting to login page.
        let params = this.paramsFor(this.routeName);
        if (params.ticket) {
            return this.get('session').authenticate('authenticator:osf-cookie', params.ticket)
                .then(()=> this.transitionTo('index'));
        }
    }
});
