import Ember from 'ember';
import layout from './template';

/**
 * Copied from Ember-SHARE.
 *
 * ```handlebars
 * {{search-facet-worktype
 *      key=facet.key
 *      options=facet
 *      aggregations=aggregations
 *      state=(get facetStates facet.key)
 *      filter=(get facetFilters facet.key)
 *      onChange=(action 'facetChanged')
 * }}
 * ```
 * @class search-facet-worktype-hierarchy
 */

export default Ember.Component.extend({
    layout,
    category: 'filter-facets',

    init() {
        this._super(...arguments);
        this.set('toggleState', this.get('defaultCollapsed'));
    },

    selected: Ember.computed('state', function() {
        return this.get('state') || [];
    }),

    actions: {
        toggle(type) {
            this.sendAction('onClick', type);
        },

        toggleBody() {
            this.toggleProperty('toggleState');
        }
    }
});
