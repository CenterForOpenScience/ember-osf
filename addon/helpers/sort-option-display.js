import Ember from 'ember';

/**
 * sortOptionDisplay helper - Returns display text for a given sort option
 *
 * @method sortOptionDisplay
 * @param {Object} sortOptions - Array of dictionaries with sortBy text and display text
 * @param {String} sortBy sortBy item for which you want the corresponding display text
 * @return {String} Returns display text for sortBy item
 */
export function sortOptionDisplay(params/*, hash*/) {
    const [sortOptions, sortBy] = params;
    for (var option of sortOptions) {
        if (option.sortBy === sortBy) return option.display;
    }
}

export default Ember.Helper.helper(sortOptionDisplay);
