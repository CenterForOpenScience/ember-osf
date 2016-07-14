import Ember from 'ember';
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
    node: null,
    user: null,

    projectLabel: Ember.computed('node.category', function() {
        let category = this.get('node.category');
        return category === 'project' ? 'Project' : 'Component';
    }),
    /**
     * Is the user a contributor on this node? (returns false if the user is not logged in)
     * @property isProjectContributor
     */
    isProjectContributor: Ember.computed('user', 'node', function() {
        // FIXME: This depends on OSF-6702, a known bug.
        let node = this.get('node');
        let userID = this.get('user.id');
        return node.isContributor(userID);
    }),

    /**
     * If this is a withdrawn registration, hide a block of buttons.
     * @property minimalRegistrationView
     */
    minimalRegistrationView: Ember.computed.and('node.isRegistration', 'node.withdrawn'),

    showParentProjectLink: Ember.computed('node.parent', function() {
        // If the parent node is not visible to the contributor, it will be identified in the API response, but not accessible.
        // Only show the parent link if the relationship resolves to a successful response.
        let parent = this.get('node.parent');
        if (parent) {
            // TODO: Implement check that response resolves to a non-error. In future, implement an embed query.
            return true;
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
        let node = this.get('node');
        if (node.get('isProject')) {
            return node.get('currentUserPermissions').indexOf(permissions.READ) !== -1;
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
