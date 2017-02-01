import Ember from 'ember';
import KeenTrackerMixin from 'ember-osf/mixins/keen-tracker';

export default Ember.Route.extend(KeenTrackerMixin, {
    model() {
        return this.modelFor('nodes.detail');
    },

    setupController(controller) {
        controller.set('user', this.modelFor('application'));
        return this._super(...arguments);
    }
});
