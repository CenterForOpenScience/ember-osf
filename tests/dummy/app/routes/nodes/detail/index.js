import Ember from 'ember';
import Analytics from 'ember-osf/mixins/analytics';

export default Ember.Route.extend(Analytics, {
    model() {
        return this.modelFor('nodes.detail');
    },

    setupController(controller) {
        controller.set('user', this.modelFor('application'));
        return this._super(...arguments);
    }
});
