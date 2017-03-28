import Ember from 'ember';
import layout from './template';

/**
 * Copied from Ember-SHARE.  Worktype button.
 *
 * ```handlebars
 * {{search-facet-worktype-button
 *      key=facet.key
 *      options=facet
 *      aggregations=aggregations
 *      state=(get facetStates facet.key)
 *      filter=(get facetFilters facet.key)
 *      onChange=(action 'facetChanged')
 * }}
 * ```
 * @class search-facet-worktype-button
 */

export default Ember.Component.extend({
    layout,
    selected: Ember.computed('selectedTypes.[]', function() {
        let selectedTypes = this.get('selectedTypes');
        return selectedTypes && selectedTypes.includes(this.get('type'));
    }),

    label: Ember.computed('type', function() {
        if (this.get('type') === 'creative work') {
            return 'Not Categorized';
        }
        // title case work types: 'creative work' --> 'Creative Work'
        return this.get('type').replace(/\w\S*/g, function(str) {return Ember.String.capitalize(str);});
    }),

    actions: {
        click() {
            this.$().blur();
            this.sendAction('onClick', this.get('type'));
        },

        toggleBody() {
            this.sendAction('toggleCollapse');
        }
    }
});
