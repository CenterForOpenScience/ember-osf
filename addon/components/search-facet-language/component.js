import Ember from 'ember';
import langs from 'npm:langs';
import { termsFilter, getUniqueList } from '../../utils/elastic-query';
import layout from './template';

/**
 * Copied from Ember-SHARE.  Language facet.
 *
 * ```handlebars
 * {{search-facet-language
 *      key=facet.key
 *      options=facet
 *      aggregations=aggregations
 *      state=(get facetStates facet.key)
 *      filter=(get facetFilters facet.key)
 *      onChange=(action 'facetChanged')
 * }}
 * ```
 * @class search-facet-language
 */
export default Ember.Component.extend({
    layout,
    i18n: Ember.inject.service(),

    init() {
        this._super(...arguments);
        let languageCodes = this.get('state') ? this.get('state') : [];
        let languageNames = languageCodes.map(lang =>
            langs.where('3', lang).name
        );
        this.send('changeFilter', languageNames);
    },

    placeholder: Ember.computed(function() {
        return `${this.get('i18n').t('eosf.components.searchFacetLanguage.add')} ` + this.get('options.title') + ' filter';
    }),

    languages: langs.names(),

    changed: Ember.observer('state', function() {
        let state = Ember.isBlank(this.get('state')) ? [] : this.get('state');
        let previousState = this.get('previousState') || [];

        if (Ember.compare(previousState, state) !== 0) {
            let value = this.get('state');
            this.send('changeFilter', value ? value : []);
        }
    }),

    buildQueryObject(selected) {
        let key = this.get('key');
        if (!Ember.$.isArray(selected)) {
            selected = [selected];
        }
        let languageCodes = selected.map(lang =>
            langs.where('name', lang) ? langs.where('name', lang)['3'] : langs.where('3', lang)['3']
        );

        let newFilter = termsFilter(key, getUniqueList(languageCodes));
        return { filter: newFilter, value: languageCodes };
    },

    selected: Ember.computed('state', function() {
        let languageCodes =  this.get('state') || [];
        let languageNames = languageCodes.map(lang =>
            langs.where('3', lang).name
        );
        return languageNames;
    }),

    actions: {
        changeFilter(languageNames) {
            let key = this.get('key');
            let { filter: filter, value: value } = this.buildQueryObject(languageNames || []);
            this.set('previousState', this.get('state'));
            this.sendAction('onChange', key, filter, value);
        }
    }
});
