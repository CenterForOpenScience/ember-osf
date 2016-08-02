import Ember from 'ember';
import layout from './template';

import permissions from 'ember-osf/const/permissions';

export default Ember.Component.extend({
    READ: permissions.READ,
    WRITE: permissions.WRITE,
    ADMIN: permissions.ADMIN,
    layout: layout,
    permissionChanges: {},
    bibliographicChanges: {},
    permissionToggle: false,
    bibliographicToggle: false,
    removalToggle: false,
    stillAdmin: true,
    actions: {
        addContributor(userId, permission, isBibliographic) {
            this.sendAction('addContributor', userId, permission, isBibliographic);
        },
        removeContributor(contrib) {
            this.sendAction('removeContributor', contrib);
            this.toggleProperty('removalToggle');
            this.removedSelfAsAdmin(contrib, contrib.get('permission'));
        },
        updatePermissions(contributor, permission) {
            this.set(`permissionChanges.${contributor.id}`, permission.toLowerCase());
            this.sendAction(
                'editContributors',
                this.get('contributors'),
                this.get('permissionChanges'),
                {}
            );
            this.set('permissionChanges', {});
            this.toggleProperty('permissionToggle');
            this.toggleProperty('removalToggle');
            this.removedSelfAsAdmin(contributor, permission);

        },
        updateBibliographic(contributor, isBibliographic) {
            this.set(`bibliographicChanges.${contributor.id}`, isBibliographic);
            this.sendAction(
                'editContributors',
                this.get('contributors'),
                {},
                this.get('bibliographicChanges')
            );
            this.set('bibliographicChanges', {});
            this.toggleProperty('bibliographicToggle');
            this.toggleProperty('removalToggle');
        }
    },
    removedSelfAsAdmin(contributor, permission) {
        if (this.get('currentUser').id === contributor.id.split('-')[1] && permission !== 'ADMIN') {
            this.set('stillAdmin', false);
        }
    }
});
