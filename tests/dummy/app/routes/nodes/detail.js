import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        return this.store.findRecord('node', params.node_id);
    },

    setupController(controller, model) {
        controller.set('editedTitle', model.get('title'));
        this._super(...arguments);
    },

    actions: {
        editExisting(value) {
            // TODO: Should test PUT or PATCH
            console.log('Will edit title from', this.modelFor(this.routeName).get('title'), ' to ', value);
            var node = this.modelFor(this.routeName);
            if (node.get('currentUserPermissions').indexOf('write') !== -1) {
                node.set('title', value);
                node.save();
            } else {
                console.log('You do not have permissions to edit this node');
            }
        },
        addContributor(contribId, permission, bibliographic) {
            var node = this.modelFor(this.routeName);
            if (node.get('currentUserPermissions').indexOf('admin') !== -1) {
                var contributor = this.store.createRecord('contributor', {
                    id: contribId,
                    permission: permission,
                    bibliographic: bibliographic,
                    nodeId: node.id
                });
                contributor.save();
            } else {
                console.log('You do not have permissions to add contributors');
            }
        }
    }

});
