import Ember from 'ember';
import layout from './template';

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
    node: null,
    user: null,

    projectLabel: Ember.computed('node.category', function() {
        let category = this.get('node.category');
        return category === 'project'? 'Project' : 'Component';
    }),
    /**
     * Is the user a contributor on this node? (returns false if the user is not logged in)
     * @property isProjectContributor
     */
    isProjectContributor: Ember.computed('user', 'node', function() {
        // TODO: Finish implementing
        let node = this.get('node');
        let user = this.get('user.id');
        return node.isContributor(user);
    }),
    // TODO: May also need a parent-contributor check??

    /**
     * If this is a withdrawn registration, hide a block of buttons.
     * @property minimalRegistrationView
     */
    minimalRegistrationView: Ember.computed.and('node.isRegistration', 'node.withdrawn'),

    showParentProjectLink: Ember.computed('node.parent', function() {
        // TODO: Implement
        // If the parent node is not visible to the contributor, it will be identified in the API response, but not accessible.
        let parent = this.get('node.parent');
        // (or canViewParent node.parent.public parent_node['is_contributor'])
        if (parent) {
        }
        return false;
    }),
    showAnalyticsTab: Ember.computed.or('node.public', 'isProjectContributor'),
    showRegistrationsTab: Ember.computed('node.isRegistration', 'node.isAnonymous', function() {
        // Do not show registrations tab for view-only links
        return !this.get('node.isRegistration') && !this.get('node.meta.isAnonymous');
    }),
    showForksTab: Ember.computed.not('node.isAnonymous'),
    showContributorsTab: Ember.computed.alias('isProjectContributor'),
    showSettingsTab: Ember.computed('user', 'node', function() {
        // TODO: Implement
        // if user['has_read_permissions'] and not {{isRegistration}} or (node['is_registration'] and 'admin' in user['permissions']):
        return true;
    }),

    showCommentsButton: Ember.computed('user', 'node', function() {
        // TODO: Implement. Identify source for this data.
        // <!--% if user['can_comment'] or node['has_comments']:-->
        return true;
    })
});
