import Ember from 'ember';
import layout from './template';

/**
 * Copied from Ember-SHARE. Passing in a few properties from preprints.
 * Loops through all the facets and displays them on the left hand pane of the Discover page.
 *
 * ```handlebars
 * {{faceted-search
 *      onChange='facetChanged'
 *      updateParams=(action 'updateParams')
 *      filters=facetFilters
 *      facetStates=queryParamsState
 *      facets=facets
 *      aggregations=aggregations
 *      updateFilters=(action 'updateFilters')
 *      filterReplace=filterReplace
 *      loading=fetchData.isRunning
 * }}
 * ```
 * @class faceted-search
 */
export default Ember.Component.extend({
    layout,
    actions: {
        facetChanged(paramName, value) {
            this.get('updateParams')(paramName, value);
        },
    }
});

