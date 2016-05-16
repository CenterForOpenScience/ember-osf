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
        },
        addChildren(title, description, category) {
            var node = this.modelFor(this.routeName);
            if (node.get('currentUserPermissions').indexOf('write') !== -1) {
                var child = this.store.createRecord('children', {
                    title: title,
                    category: category || 'project',
                    description: description || null,
                    parentId: node.id
                });
                child.one('didCreate', this, function() {
                    this.transitionTo('nodes.detail.children');
                });
                child.save();
            } else {
                console.log('You do not have permissions to create this component');
            }
        },
        deleteNode() {
            var node = this.modelFor(this.routeName);
            if (node.get('currentUserPermissions').indexOf('write') !== -1) {
                node.one('didDelete', this, function () {
                    this.transitionTo('nodes.index');
                });
                node.destroyRecord();
            } else {
                console.log('You do not have permissions to delete this node');
            }
        }

    }

});
