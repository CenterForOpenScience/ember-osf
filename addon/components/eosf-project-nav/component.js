import Ember from 'ember';
import layout from './template';

/**
 * @module ember-osf
 * @submodule components
 */

/**
 * Project header navigation bar, with links to various sub-pages within a project
 * @class eosf-project-nav
 */
// TODO: Fill in usage example
// TODO: Some of these fields should live on node, and others shouldn't even exist.
export default Ember.Component.extend({
    layout,
    node: null,

    // This is common enough that we may want a helper somewhere else
    projectLabel: Ember.computed('node.category', function() {
        let category = this.get('node.category');
        return category === 'project'? 'Project' : 'Component';
    }),
    /**
     * Is the user a contributor on this node? (returns false if the user is not logged in)
     * @property isProjectContributor
     */
    isProjectContributor: Ember.computed('user', 'node', function() {
        let node = this.get('node');
        let user = this.get('user.id');
        return node.isContributor(user);
    }),
    // TODO: May also need a parent-contributor check??



    // TODO: Implement. This tests whether most of the buttons should be hidden because this is a registration.
    minimalRegistrationView: false,
    /**
     * If the parent node is not visible to the contributor, it will be identified in the API response, but not accessible.
     * @property canViewParent
     * @type boolean
     */
    canViewParent: Ember.computed('node', function(){
        // TODO: Implement. Check for errors in parent fetch operation.
        // TODO: Consider replacing this with an embed in the future
        return true;
    }),

    showParentProjectLink: Ember.computed(function() {
        // TODO: Implement
        // (or canViewParent node.parent.public parent_node['is_contributor'])
        return true;
    }),
    showAnalyticsTab: Ember.computed('node', 'isProjectContributor', function() {
        // TODO: Implement
        // (or node.public isProjectContributor)
        return true;
    }),

    showRegistrationsTab: true,   // TODO: Implement
    // not node.isRegistration and not {{node.meta.anonymous}}:--> {{!-- TODO: Anonymized view only link --}}
    
    
    
    showForksTab: Ember.computed.not('node.meta.anonymous'),
    showContributorsTab: Ember.computed.alias('isProjectContributor'),
    showSettingsTab: Ember.computed('user', 'node', function() {
        // TODO: Implement
        // if user['has_read_permissions'] and not {{isRegistration}} or (node['is_registration'] and 'admin' in user['permissions']):
        return true;
    }),

    showCommentsButton: Ember.computed('user', 'node', function() {
        // TODO: Implement
        // <!--% if user['can_comment'] or node['has_comments']:-->
        return true;
    })
});
