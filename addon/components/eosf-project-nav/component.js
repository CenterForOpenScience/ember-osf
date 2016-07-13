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

export default Ember.Component.extend({
    layout,
    node: null,
    // TODO: Verify type field is accessible to component node model
    isProject: Ember.computed.equal('node.type', 'nodes'),
    // TODO: Parent is a relationship. No idea what happens when parent is null.
    isTopLevel: Ember.computed.empty('node.parent'),

    // This is common enough that we may want a helper somewhere else
    projectLabel: Ember.computed('node.category', function() {
        let category = this.get('node.category');
        return category === 'project'? 'Project' : 'Component';
    })
});
