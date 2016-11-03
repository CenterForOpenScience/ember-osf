import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        let node = this.modelFor('nodes.detail');
        let registrations = node.get('registrations');
        return registrations;
    },
});
