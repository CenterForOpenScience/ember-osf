import Ember from 'ember';
import layout from './template';
import { termsFilter, getUniqueList } from '../../utils/elastic-query';
import config from 'ember-get-config';

/**
 * Copied from Ember-SHARE.  Type facet.
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
 * @class search-facet-worktype
 */

export default Ember.Component.extend({
    layout,
    category: 'filter-facets',
    types: null,

    init() {
        this.getTypes();
        this._super(...arguments);
        this.send('setState', this.get('state'));
    },
    getTypes() {
        // Ember-SHARE method
        return Ember.$.ajax({
            url: config.OSF.shareApiUrl + '/schema/creativework/hierarchy/',
            crossDomain: true,
            type: 'GET',
            contentType: 'application/vnd.api+json',
        }).then((json) => {
            if (json.data) {
                this.set('types', json.data);
            }
        });
    },
    processedTypes: Ember.computed('types', function() {
        // Ember-SHARE property
        const types = this.get('types') && this.get('types').CreativeWork ? this.get('types').CreativeWork.children : {};
        return this.transformTypes(types);
    }),
    transformTypes(obj) {
        // Ember-SHARE method
        if (typeof (obj) !== 'object') {
            return obj;
        }

        for (let key in obj) {
            let lowKey = key.replace(/([A-Z])/g, ' $1').trim().toLowerCase();
            obj[lowKey] = this.transformTypes(obj[key]);
            if (key !== lowKey) {
                delete obj[key];
            }
        }
        return obj;
    },
    selected: Ember.computed('state', function() {
        return this.get('state') || [];
    }),

    changed: Ember.observer('state', function() {
        let state = this.get('state');
        state = Ember.isBlank(state) ? [] : state;
        let previousState = this.get('previousState') || [];

        if (Ember.compare(previousState, state) !== 0) {
            let value = state || [];
            this.send('setState', value);
        }
    }),

    buildQueryObjectMatch(selected) {
        let newValue = !selected[0] ? [] : selected;
        let newFilter = termsFilter('types', getUniqueList(newValue));
        return { filter: newFilter, value: newValue };
    },

    actions: {
        setState(selected) {
            let key = this.get('key');
            let { filter: filter, value: value } = this.buildQueryObjectMatch(selected.length ? selected : []);
            this.set('previousState', this.get('state'));
            this.sendAction('onChange', key, filter, value);
        },

        toggle(type) {
            let selected = this.get('selected');
            selected = selected.includes(type) ? [] : [type];
            this.send('setState', selected);
        }
    }
});
