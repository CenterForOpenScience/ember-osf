import Ember from 'ember';
import layout from './template';

/**
 * Locked facet.  Filters that cannot be changed in client application.
 *
 * ```handlebars
 * {{search-facet-locked
 *      key=facet.key
 *      options=facet
 *      aggregations=aggregations
 *      state=(get facetStates facet.key)
 *      filter=(get facetFilters facet.key)
 *      onChange=(action 'facetChanged')
 * }}
 * ```
 * @class search-facet-locked
 */
export default Ember.Component.extend({
    layout
});
