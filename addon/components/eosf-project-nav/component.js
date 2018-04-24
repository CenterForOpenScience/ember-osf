import Ember from 'ember';
import DS from 'ember-data';

import layout from './template';

import permissions from '../../const/permissions';

/**
 * @module ember-osf
 * @submodule components
 */

/**
 * Project header navigation bar, with links to various sub-pages within a project
 * Sample usage:
 * ```handlebars
 * {{eosf-project-nav
 *   node=node
 *   user=user}}
 * ```
 * @class eosf-project-nav
 */
export default Ember.Component.extend({
    layout,
    i18n: Ember.inject.service(),
    node: null,
    user: null,

    projectLabel: Ember.computed('node.category', function() {
        let category = this.get('node.category');
        return category === 'project' ? 'Project' : 'Component';
    }),

    isProjectContributor: Ember.computed('user', 'node', function() {
        // Is the user a contributor on this node? (returns false if the user is not logged in)
        let node = this.get('node');
        let userID = this.get('user.id');

        return DS.PromiseObject.create({
            promise: node.isContributor(userID)
        });
    }),

    /**
     * If this is a withdrawn registration, hide a block of buttons.
     * @property isWithdrawnRegistration
     */
    isWithdrawnRegistration: Ember.computed.and('node.isRegistration', 'node.withdrawn'),

    parentExists: Ember.computed('node', function() {
        // Determine if a parent exists (field not empty), without trying to fetch it.
        // This provides a way to use conditionals without errors that hang the page
        let node = this.get('node');
        return !!node.belongsTo('parent').link();
    }),
    showParentProjectLink: Ember.computed('node.parent', function() {
        // TODO: Rewrite this to rely on embeds, which are more efficient
        // If the parent node is not visible to the contributor, it will be identified in the API response, but not accessible.
        // Only show the parent link if the relationship resolves to a successful response.
        let parent = this.get('node.parent');
        if (parent) {
            // Report whether the parent relationship request failed.
            let response = parent.then(()=> true).catch(()=> false);
            return DS.PromiseObject.create({
                promise: response
            });
        }
        // If no parent, don't show parent link.
        return false;
    }),
    showAnalyticsTab: Ember.computed.or('node.public', 'isProjectContributor'),
    showRegistrationsTab: Ember.computed('node.isRegistration', 'node.isAnonymous', function() {
        // Do not show registrations tab for view-only links
        return !this.get('node.isRegistration') && !this.get('node.isAnonymous');
    }),
    showForksTab: Ember.computed.not('node.isAnonymous'),
    showContributorsTab: Ember.computed.alias('isProjectContributor'),
    showSettingsTab: Ember.computed('node', function() {
        let node = this.get('node');
        if (node.get('isProject')) {
            return node.get('currentUserPermissions').indexOf(permissions.WRITE) !== -1;
        } else if (node.get('isRegistration')) {
            return node.get('currentUserPermissions').indexOf(permissions.ADMIN) !== -1;
        }
        return false;  // No idea what this resource is, so don't show tab
    }),

    showCommentsButton: Ember.computed('node', function() {
        // TODO: Implement. Depends on resolution of https://openscience.atlassian.net/browse/OSF-6701
        // <!--% if user['can_comment'] or node['has_comments']:-->
        return false;
    })
});
