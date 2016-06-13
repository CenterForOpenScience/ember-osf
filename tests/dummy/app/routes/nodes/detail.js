import Ember from 'ember';

import NodeActionsMixin from 'ember-osf/mixins/node-actions';

export default Ember.Route.extend(NodeActionsMixin, {
    model(params) {
        return this.store.findRecord('node', params.node_id);
    },

    setupController(controller, model) {
        controller.set('editedTitle', model.get('title'));
        controller.set('editedTitle', model.get('category'));
        controller.set('editedTitle', model.get('description'));
        this._super(...arguments);
    }
});
