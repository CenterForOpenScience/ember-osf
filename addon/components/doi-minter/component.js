import Ember from 'ember';
import layout from './template';

/**
 * @module ember-osf
 * @submodule components
 */

/**
 * DOI Minter
 *
 * Sample usage:
 * ```handlebars
 * {{doi-minter
 *      model=model (preprint or node)
 *}}
 * ```
 * @class doi-minter
 */
export default Ember.Component.extend({
    layout,
    isOpen: false,
    model: null,
    resourceType: Ember.computed('model', function() {
        // Default is preprint.  For display in confirmation modal.
        let type = this.get('model._internalModel.modelName') || 'preprint';
        if (type === 'node') {
            return 'project';
        }
        return type;
    }),
    actions: {
        close() {
            this.set('isOpen', false);
        },
        toggleDOIModal() {
            this.toggleProperty('isOpen');
        },
        createDOI() {
            // TODO
        }
    }
});
