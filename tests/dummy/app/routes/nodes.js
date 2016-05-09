import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    store: Ember.inject.service(),
    session: Ember.inject.service(),
    model() {
        let user = this.modelFor('application');
	if(user) {
            return user.get('nodes');
	}
	else {
	    return this.get('store').findRecord('user', 'me').then(user => user.get('nodes'));
	}
    }
});
