import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        return this.store.findRecord('node', params.node_id);
    },

    setupController(controller, model) {
        controller.set('editedTitle', model.get('title'));
        controller.set('editedTitle', model.get('category'));
        controller.set('editedTitle', model.get('dscription'));
        this._super(...arguments);
    },

    actions: {
        editExisting(title, description, category, isPublic) {
            // TODO: Should test PUT or PATCH
            // console.log('Will edit title from', this.modelFor(this.routeName).get('title'), ' to ', value);
            var node = this.modelFor(this.routeName);
            if (node.get('currentUserPermissions').indexOf('write') !== -1) {
                console.log(title, category, description, this.routeName);
                if (title) {node.set('title', title);}
                if (category) {node.set('category', category);}
                if (description) {node.set('description', description);}
                if (isPublic) {node.set('public', isPublic);}
                node.save();
            } else {
                console.log('You do not have permissions to edit this node');
            }
        }
    }

});
