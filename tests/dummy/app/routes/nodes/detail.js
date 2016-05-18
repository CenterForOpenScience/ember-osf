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
            if (contribId) {
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
            } else {
                console.log('User ID must be specified.');
            }
        },
        updateContributors(editedPermissions, editedBibliographic) {
            var node = this.modelFor(this.routeName);
            var contribMap = this.generateContributorMap(node.get('contributors'));
            let user = this.modelFor('application');

            for (var contrib in editedPermissions) {
                contribMap[contrib].permission = editedPermissions[contrib];
            }

            for (var c in editedBibliographic) {
                contribMap[c].bibliographic = editedBibliographic[c];
            }

            if (node.get('currentUserPermissions').indexOf('admin') !== -1) {
                this.attemptContributorsUpdate(contribMap, node, editedPermissions, editedBibliographic);
            } else {
                // Non-admins can only attempt to remove themselves as contributors
                if (contrib.id === user.id) {
                    this.attemptContributorsUpdate(contribMap, node);
                } else {
                    console.log('Non-admins cannot update other contributors.');
                }
            }

        },
        deleteContributor(contrib) {
            var node = this.modelFor(this.routeName);
            contrib.setProperties({ nodeId: node.id });
            let user = this.modelFor('application');

            var contribMap = this.generateContributorMap(node.get('contributors'));

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

    generateContributorMap(contributors) {
        // Maps all node contributors to format {contribID: {permission: "read|write|admin", bibliographic: "true|false"}}
        var contribMap = contributors.content.currentState.reduce(function(newMap, contrib) {
            newMap[contrib.id] = { permission: contrib._data.permission, bibliographic: contrib._data.bibliographic };
            return newMap;
        }, {});
        return contribMap;
    },
    canModifyContributor(contribRemoving, contribMap) {
        /** Checks to see if contributor(s) can be updated/removed. Contributor can only be updated/removed
        if there is at least one other contributor with admin permissions, and at least one other bibliographic contributor **/
        var bibliographic = false;
        var admin = false;
        for (var contribId in contribMap) {
            if (contribRemoving && contribId === contribRemoving.id) {
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

    attemptContributorsUpdate(contribMap, node, editedPermissions, editedBibliographic) {
        if (this.canModifyContributor(null, contribMap)) {
            for (var contrib in editedPermissions) {
                this.store.findRecord('contributor', contrib).then(function(contributor) {
                    contributor.set('nodeId', node.id);
                    contributor.set('permission', editedPermissions[contrib]);
                    contributor.save();
                });
            }
            for (var c in editedBibliographic) {
                this.store.findRecord('contributor', c).then(function(contributor) {
                    debugger
                    contributor.set('nodeId', node.id);
                    contributor.set('bibliographic', editedBibliographic[c]);
                    contributor.save();
                });
            }
            node.save();
            console.log('Contributor(s) updated.');
        } else {
            console.log('Cannot update contributor(s)');
        }
    },

    attemptContributorRemoval(contrib, contribMap, node) {
        if (this.canModifyContributor(contrib, contribMap)) {
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
