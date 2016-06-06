import Ember from 'ember';

import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Ember.Mixin.create(UnauthenticatedRouteMixin, {
    session: Ember.inject.service(),
    beforeModel() {
        // Login flow with cookies depends on being redirected to the /login page, to work around CORS issues

        // Check whether there is a ticket appended to the URL; if so, try to authenticate with it. (hitting this route implies user is unauthenticated)
        // Otherwise show login form.
        let params = this.paramsFor(this.routeName);
        if (params.ticket) {
            console.log('Found ticket; using to authenticate', params.ticket);
            return this.get('session').authenticate('authenticator:osf-cookie', params.ticket)
                .then(()=> this.transitionTo('index')); // todo: is this transition necessary?
        }
    }
});
