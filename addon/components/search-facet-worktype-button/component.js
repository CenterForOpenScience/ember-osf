import Ember from 'ember';
import layout from './template';

/**
 * Copied from Ember-SHARE.  Worktype button (selected computed property modified)
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
    tagName: 'button',
    classNames: ['btn', 'btn-default', 'btn-sm'],
    classNameBindings: ['selected:active'],

    selected: Ember.computed('selectedTypes.[]', function() {
        let selectedTypes = this.get('selectedTypes');
        if (selectedTypes) {
            return selectedTypes.includes(this.get('type'));
        }
        return false;
    }),

    click() {
        this.$().blur();
        this.sendAction('onClick', this.get('type'));
    }
});
