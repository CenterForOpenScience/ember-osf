import Ember from 'ember';
import { termsFilter, getUniqueList } from '../../utils/elastic-query';
import langs from 'langs';
import layout from '/.template';

export default Ember.Component.extend({
    layout,

    metrics: Ember.inject.service(),
    category: 'filter-facets',

    init() {
        this._super(...arguments);
        let languageCodes = this.get('state') ? this.get('state') : [];
        let languageNames = languageCodes.map(lang =>
            langs.where('3', lang).name
        );
        this.send('changeFilter', languageNames);
    },

    placeholder: Ember.computed(function() {
        return 'Add ' + this.get('options.title') + ' filter';
    }),

    languages: Ember.computed(function() {
        return langs.names();
    }),

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
            const category = this.get('category');
            const action = 'filter';
            const label = languageNames;

            this.get('metrics').trackEvent({ category, action, label });

            let key = this.get('key');
            let { filter: filter, value: value } = this.buildQueryObject(languageNames || []);
            this.set('previousState', this.get('state'));
            this.sendAction('onChange', key, filter, value);
        }
    }
});
