/* global c3 */
import Ember from 'ember';
import layout from './template';
import TypeaheadComponent from '../search-facet-typeahead/component';

/**
 * Copied from Ember-SHARE.  Sources facet. Uses C3 charts.
 *
 * ```handlebars
 * {{search-facet-source
 *      key=facet.key
 *      options=facet
 *      aggregations=aggregations
 *      state=(get facetStates facet.key)
 *      filter=(get facetFilters facet.key)
 *      onChange=(action 'facetChanged')
 * }}
 * ```
 * @class search-facet-source
 */
export default TypeaheadComponent.extend({
    layout,
    i18n: Ember.inject.service(),

    sourcesList: Ember.computed('aggregations', function() {
        let data = this.get('aggregations.sources.buckets');
        return data ? data.map(next => next.key) : [];
    }),

    dataChanged: Ember.observer('aggregations', function() {
        let data = this.get('aggregations.sources.buckets');
        this.updateDonut(data);
    }),

    updateDonut(data) {
        let columns = data.map(({ key, doc_count }) => [key, doc_count]); // jscs:ignore
        let title = columns.length + (columns.length === 1 ? ` ${this.get('i18n').t('eosf.components.searchFacetSource.source')}` : ` ${this.get('i18n').t('eosf.components.searchFacetSource.sources')}` );

        let donut = this.get('donut');
        if (!donut) {
            this.initDonut(title, columns);
        } else {
            donut.load({
                columns,
                unload: true
            });
            this.$('.c3-chart-arcs-title').text(title);
        }
    },

    initDonut(title, columns) {
        let element = this.$(`.donut`).get(0);
        let donut = c3.generate({
            bindto: element,
            data: {
                columns,
                type: 'donut',
                onclick: (d) => {
                    let selected = this.get('selected');
                    if (!selected.includes(d.name)) {
                        this.send('changeFilter', [d.name, ...selected]);
                    }
                }
            },
            legend: { show: false },
            donut: {
                title,
                label: {
                    show: false
                }
            },
            size: { height: 200 }
        });
        this.set('donut', donut);
    },
});
