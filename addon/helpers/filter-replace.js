import Ember from 'ember';

// Adapted from Ember-preprints.
var defaultFilters = {
    'Open Science Framework': 'OSF',
    'Cognitive Sciences ePrint Archive': 'Cogprints',
    OSF: 'OSF',
    'Research Papers in Economics': 'RePEc'
};

/**
 * @module ember-osf
 * @submodule helpers
 */

/**
 * filterReplace helper. Replaces long provider names without messing with search filter logic
 *
 * @class filterReplace
 * @param {String} filter Filter
 * @param {Object} filters Specific filters list for service
 * @return {String} Return shortened provider filter, if present in filters.
 * Otherwise, return original filter.
 */
export function filterReplace(params) {
    const filters = params[1] || defaultFilters;
    return filters[params[0]] ? filters[params[0]] : params[0];
}

export default Ember.Helper.helper(filterReplace);
