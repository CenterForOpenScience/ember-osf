import Ember from 'ember';
import layout from './template';

/**
 * Copied from Ember-SHARE. Passing in a few properties from preprints.
 * Loops through all the facets and displays them on the left hand pane of the Discover page.
 *
 * ```handlebars
 * {{faceted-search
 *      onChange='filtersChanged'
 *      updateParams='updateParams'
 *      filters=facetFilters
 *      facetStates=facetStates
 *      facets=facets
 *      aggregations=aggregations
 *      activeFilters=activeFilters
 *      updateFilters=(action 'updateFilters')
 *      filterReplace=filterReplace
 * }}
 * ```
 * @class faceted-search
 */
export default Ember.Component.extend({
    layout,
    init() {
        this._super(...arguments);
    },

    actions: {
        facetChanged(key, facet, value) {
            let filters = this.get('filters');
            filters.set(key, facet);
            this.sendAction('updateParams', key, value);
            this.sendAction('onChange', filters);
        }
    }
});

