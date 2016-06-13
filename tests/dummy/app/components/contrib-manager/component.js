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
    actions: {
	addContributor(userId, permission, isBibliographic) {
	    this.sendAction('addContributor', userId, permission, isBibliographic);
	},
	permissionChange(contributor, permission) {
	    this.set(`permissionChanges.${contributor.id}`, permission);
	},
	bibliographicChange(contributor, isBibliographic) {
	    this.set(`biliographicChanges.${contributor.id}`, isBibliographic);
	},
	updateContributors() {
	    this.sendAction(
		'deleteContributor',
		this.get('contributors'),
		this.get('permissionChanges'),
		this.get('bibliographicChanges')
	    );
	},
	deleteContributor(contributor) {
	    this.sendAction('deleteContributor', contributor);
	}
    }
});
