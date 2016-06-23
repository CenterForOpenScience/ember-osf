import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        return this.store.findRecord('node', params.node_id);
    },
    setupController(controller, model) {
        controller.set('editedTitle', model.get('title'));
        controller.set('editedCategory', model.get('category'));
        controller.set('editedDescription', model.get('description'));
        controller.set('editedIsPublic', model.get('public'));
        this._super(...arguments);
    }
});
