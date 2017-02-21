import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        return this.modelFor('nodes.detail');
    },

    setupController(controller) {
        controller.set('user', this.modelFor('application'));
        return this._super(...arguments);
    }
});
