import Ember from 'ember';

/**
 * @module ember-osf
 * @submodule helpers
 */

/**
 * numberFormat helper. Replaces long provider names without messing with search filter logic
 *
 * @class filterReplace
 * @param {Integer} number
 * @return {String} Returns string with language sensitive representation of the number
 */
export function numberFormat(params/*, hash*/) {
    const [number] = params;

    return number.toLocaleString();
}

export default Ember.Helper.helper(numberFormat);
