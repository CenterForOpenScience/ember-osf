import Ember from 'ember';

export default Ember.Controller.extend({
    preprintNode: null,
    preprint: null,
    nodePreprintsQueried: false,
    usersQueried: false,
    matchingUsers: Ember.A(),
    actions: {
        loadNodeEmbedPreprint() {
            this.store.findAll('node', { include: 'preprints' }).then((nodes) => {
                this.toggleProperty('nodePreprintsQueried');
                for (var node of nodes.toArray()) {
                    let preprints = node.get('preprints').toArray();
                    if (preprints.length > 0 && preprints[0].get('isPublished')) {
                        this.set('preprintNode', node);
                        this.set('preprint', preprints[0]);
                        break;
                    }
                }
            });
        },
        searchUsers(userQuery) {
            this.set('usersQueried', false);
            this.store.query('user', {
                filter: { full_name: userQuery },
                embed: 'nodes'
            }).then((users) => {
                this.set('usersQueried', true);
                this.set('matchingUsers', users);
            });

        }
    }
});
