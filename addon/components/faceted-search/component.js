import Ember from 'ember';
import layout from './template';

/**
 * Copied from Ember-SHARE. Sets up the filter optinos of the left hand pane of the Discover page.
 *
 * ```handlebars
 * {{faceted-search
 *      onChange='filtersChanged'
 *      updateParams='updateParams'
 *      filters=facetFilters
 *      facetStates=facetStates
 *      facets=facets
 *      aggregations=aggregations
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
