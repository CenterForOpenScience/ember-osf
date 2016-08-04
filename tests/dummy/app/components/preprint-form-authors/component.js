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
    stillAdmin: Ember.computed('isAdmin', function() {
        return this.get('isAdmin');
    }),
    addState: 'emptyView',
    query: null,
    newSearchResults: Ember.computed('searchResults.[]', 'contributors.[]', 'addState', function() {
        let searchResults = this.get('searchResults');
        let contributors = this.get('contributors');
        let userIds = contributors.map((contrib) => contrib.id.split('-')[1]);
        return searchResults.filter((result) => !Ember.A(userIds).contains(result.id));
    }),
    actions: {
        addContributor(user, permission, isBibliographic) {
            this.sendAction('addContributor', user.id, permission, isBibliographic);
        },
        addUnregisteredContributor(fullName, email) {
            this.sendAction('addUnregisteredContributor', fullName, email);
        },
        updateQuery(value) {
            this.set('query', value);
        },
        findContributors() {
            var query = this.get('query');
            var _this = this;
            _this.sendAction('findContributors', query);
            this.set('addState', 'searchView');
        },
        removeContributor(contrib) {
            this.sendAction('removeContributor', contrib);
            this.toggleProperty('removalToggle');
            this.removedSelfAsAdmin(contrib, contrib.get('permission'));
            this.get('contributors').removeObject(contrib);
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
        },
        unregisteredView() {
            this.set('addState', 'unregisteredView');
        },
        searchView() {
            this.set('addState', 'searchView');
        }
    },
    /**
    * If user removes their own admin permissions, many things on the page must become
    * disabled.  Changing the stillAdmin flag to false will remove many of the options
    * on the page.
    */
    removedSelfAsAdmin(contributor, permission) {
        if (this.get('currentUser').id === contributor.id.split('-')[1] && permission !== 'ADMIN') {
            this.set('stillAdmin', false);
        }
    }
});
