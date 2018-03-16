import Ember from 'ember';
import layout from './template';

import permissions from 'ember-osf/const/permissions';

export default Ember.Component.extend({
    i18n: Ember.inject.service(),
    READ: permissions.READ,
    WRITE: permissions.WRITE,
    ADMIN: permissions.ADMIN,
    layout: layout,
    permissionChanges: {},
    bibliographicChanges: {},
    actions: {
        addContributor(userId, permission, isBibliographic, sendEmail) {
            this.sendAction('addContributor', userId, permission, isBibliographic, sendEmail);
        },
        removeContributor(contrib) {
            this.sendAction('removeContributor', contrib);
        },
        permissionChange(contributor, permission) {
            this.set(`permissionChanges.${contributor.id}`, permission.toLowerCase());
        },
        bibliographicChange(contributor, isBibliographic) {
            this.set(`bibliographicChanges.${contributor.id}`, isBibliographic);
        },
        updateContributors() {
            this.sendAction(
                'editContributors',
                this.get('contributors'),
                this.get('permissionChanges'),
                this.get('bibliographicChanges')
            );
        }
    }
});
