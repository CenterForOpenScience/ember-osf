import Ember from 'ember';

/**
 * @module ember-osf
 * @submodule helpers
 */

/**
 * Generate a unique HTML element ID for this element. Given "someid" for component instance 123, returns "ember123-someid"
 *
 * Useful to ensure unique IDs, eg for when component is reused in page.
 * @class elem-id
 * @param {Ember.Object} obj The instance with ID to use
 * @param {Ember.suffix} suffix The base attribute to name
 */
export function elemId([obj, suffix]) {
    Ember.assert('Must pass a valid object', obj);
    return `${Ember.guidFor(obj)}-${suffix}`;
}

export default Ember.Helper.helper(elemId);
