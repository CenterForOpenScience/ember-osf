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
                console.log('Contributor added.');
            } else {
                console.log('You do not have permissions to add contributors');
            }
        },
        deleteContributor(contrib) {
            var node = this.modelFor(this.routeName);
            contrib.setProperties({ nodeId: node.id });
            let user = this.modelFor('application');

            var contribMap = node.get('contributors').content.currentState.reduce(function(newMap, contrib) {
                newMap[contrib.id] = { permission: contrib._data.permission, bibliographic: contrib._data.bibliographic };
                return newMap;
            }, {});

            if (node.get('currentUserPermissions').indexOf('admin') !== -1) {
                this.attemptContributorRemoval(contrib, contribMap, node);
            } else {
                // Non-admins can only attempt to remove themselves as contributors
                if (contrib.id === user.id) {
                    this.attemptContributorRemoval(contrib, contribMap, node);
                } else {
                    console.log('Non-admins cannot delete other contributors.');
                }
            }
        }
    },
    canRemoveContributor(contribRemoving, contribMap) {
        /** Contributor can only be removed if there is at least one other contributor
        with admin permissions, and at least one other bibliographic contributor **/
        var bibliographic = false;
        var admin = false;
        for (var contribId in contribMap) {
            if (contribId === contribRemoving.id) {
                continue;
            } else {
                if (contribMap[contribId].bibliographic) {
                    bibliographic = true;
                }
                if (contribMap[contribId].permission === 'admin') {
                    admin = true;
                }
            }
        }
        if (bibliographic && admin) {
            return true;
        }
        return false;
    },

    attemptContributorRemoval(contrib, contribMap, node) {
        if (this.canRemoveContributor(contrib, contribMap)) {
            node.get('contributors').removeObject(contrib);
            contrib.deleteRecord();
            node.save();
            contrib.save();
            console.log('Contributor removed.');
        } else {
            console.log('Cannot remove contributor');
        }
    }
});
