import Ember from 'ember';

export default Ember.Route.extend({
    currentUser: Ember.inject.service(),
    model() {
        return this.modelFor('nodes.detail');
    },

    setupController(controller) {
        this.get('currentUser').load()
            .then((user) => controller.set('user', user))
            .catch(() => controller.set('user', null));
        controller.set('user', this.modelFor('application'));
        return this._super(...arguments);
    }
});
