import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        // Include will be swapped with "embed". // GET /nodes/{node_id}/?embed=children
        return this.store.findRecord('node', params.node_id, { include: 'children' });
    },
    setupController(controller, model) {
        controller.set('editedTitle', model.get('title'));
        controller.set('editedCategory', model.get('category'));
        controller.set('editedDescription', model.get('description'));
        controller.set('editedIsPublic', model.get('public'));
        this._super(...arguments);
    }
});
