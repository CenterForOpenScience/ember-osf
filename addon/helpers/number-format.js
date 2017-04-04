import Ember from 'ember';

/**
 * @module ember-osf
 * @submodule helpers
 */

/**
 * numberFormat helper.
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
