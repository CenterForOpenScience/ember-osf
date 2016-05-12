import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
    store: Ember.inject.service(),
    session: Ember.inject.service(),
    model() {
        let user = this.modelFor('application');
        if (user) {
            return user.get('nodes'); // Fetch from `/users/me/nodes/`
        } else {
            return this.get('store').findRecord('user', 'me').then(user => user.get('nodes'));
        }
    },
    actions: {
        createNew() {
            // TODO: Just hardcode a payload here, tests POST
            console.log('button was clicked');
            //var record = this.store.createRecord('node', {}); // TODO write
            //record.save();
        }
    }
});
