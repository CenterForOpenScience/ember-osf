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
    totalSearchResults: Ember.computed('searchResults.[]', function() {
        let searchResults = this.get('searchResults');
        if (searchResults && searchResults.links) {
            return Math.ceil(searchResults.links.meta.total);
        } else {
            return;
        }
    }),
    newSearchResults: Ember.computed('searchResults.[]', 'contributors.[]', 'addState', function() {
        let searchResults = this.get('searchResults');
        let contributors = this.get('contributors');
        let userIds = contributors.map((contrib) => contrib.id.split('-')[1]);
        return searchResults.filter((result) => !Ember.A(userIds).contains(result.id));
    }),
    actions: {
        addContributor(user, permission, isBibliographic) {
            this.sendAction('addContributor', user.id, 'write', true);
            this.toggleProperty('permissionToggle');
            this.toggleProperty('bibliographicToggle');
            this.toggleProperty('removalToggle');
        },
        addUnregisteredContributor() {
            var fullName = $('.user-validation input')[0].value;
            var email = $('.user-validation input')[1].value;
            let res = this.attrs.addUnregisteredContributor(fullName, email, 'write', true);
            var _this = this;
            res.then(function() {
                _this.toggleProperty('bibliographicToggle');
                _this.toggleProperty('permissionToggle');
                _this.toggleProperty('removalToggle');
            });
            this.set('addState', 'searchView');
            this.set('fullName', '');
            this.set('email', '');
        },
        updateQuery(value) {
            this.set('query', value);
        },
        findContributors(page) {
            var query = this.get('query');
            var _this = this;
            if (query) {
                _this.sendAction('findContributors', query, page);
                this.set('addState', 'searchView');
            }
        },
        removeContributor(contrib) {
            this.sendAction('removeContributor', contrib);
            this.toggleProperty('removalToggle');
            this.toggleProperty('permissionToggle');
            this.toggleProperty('bibliographicToggle');
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
            this.set('fullName', '');
            this.set('email', '');
        }
    },
    didInsertElement: function() {
        $('#permissions-popover').popover({
            content: '<dl>' +
                '<dt>Read</dt>' +
                    '<dd><ul><li>View preprint</li></ul></dd>' +
                '<dt>Read + Write</dt>' +
                    '<dd><ul><li>Read privileges</li> ' +
                        '<li>Add and configure preprint</li> ' +
                        '<li>Add and edit content</li></ul></dd>' +
                '<dt>Administrator</dt><dd><ul>' +
                    '<li>Read and write privileges</li>' +
                    '<li>Manage authors</li>' +
                    '<li>Public-private settings</li></ul></dd>' +
                '</dl>'
        });
        $('#bibliographic-popover').popover({
            content: 'Only checked authors will be included in preprint citations. ' +
            'Authors not in the citation can read and modify the preprint as normal.'
        });
        $('#author-popover').popover({
            content: 'Preprints must have at least one registered administrator and one author showing in the citation at all times.  ' +
            'A registered administrator is a user who has both confirmed their account and has administrator privileges.'
        });
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
