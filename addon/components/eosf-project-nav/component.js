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
    // TODO: can't access type field; consider alternatives
    isProject: Ember.computed.equal('node.type', 'nodes'),

    // This is common enough that we may want a helper somewhere else
    projectLabel: Ember.computed('node.category', function() {
        let category = this.get('node.category');
        return category === 'project'? 'Project' : 'Component';
    })
});
