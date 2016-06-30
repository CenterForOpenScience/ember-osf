import Ember from 'ember';

import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

/**
 * Controller configuration mixin for a login route based on OSF OAuth2 token-based authorization
 * This is the preferred login method for third-party applications
 *
  @class OsfTokenLoginRoute
 */
export default Ember.Mixin.create(UnauthenticatedRouteMixin, {
    session: Ember.inject.service(),
    beforeModel() {
        this.get('session').authenticate('authenticator:osf-cookie')
            .then(()=> this.transitionTo('nodes'));
    }
});
