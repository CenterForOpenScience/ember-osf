import layout from './template';
import Ember from 'ember';
import config from 'ember-get-config';
import { termsFilter, getUniqueList } from '../../utils/elastic-query';

export default Ember.Component.extend({
    layout,

    filterType: Ember.computed(function() {
        return termsFilter;
    }),

    init() {
        this._super(...arguments);
        this.send('changeFilter', this.get('state'));
    },

    placeholder: Ember.computed(function() {
        return 'Add ' + this.get('options.title') + ' filter';
    }),

    selected: Ember.computed('state', function() {
        let value = this.get('state');
        return value ? value : [];
    }),

    changed: Ember.observer('state', function() {
        let state = Ember.isBlank(this.get('state')) ? [] : this.get('state');
        let previousState = this.get('previousState') || [];

        if (Ember.compare(previousState, state) !== 0) {
            let value = this.get('state');
            this.send('changeFilter', value ? value : []);
        }
    }),

    buildQueryObjectMatch(selected) {
        let key = this.get('key');
        let newValue = !selected[0] ? [] : selected;
        let newFilter = this.get('filterType')(key, getUniqueList(newValue));
        return { filter: newFilter, value: newValue };
    },

    handleTypeaheadResponse(response) {
        let textList = response.suggestions[0].options.map(function(obj) {
            return obj.payload.name;
        });
        return getUniqueList(textList);
    },

    typeaheadQueryUrl() {
        return config.SHARE.apiUrl + '/search/_suggest';
    },

    buildTypeaheadQuery(text) {
        let types = this.get('options.type') || this.get('key');
        return {
            suggestions: {
                text,
                completion: {
                    field: 'suggest',
                    size: 10,
                    fuzzy: true,
                    context: {
                        types
                    }
                }
            }
        };
    },

    _performSearch(term, resolve, reject) {
        if (Ember.isBlank(term)) { return []; }

        var data = JSON.stringify(this.buildTypeaheadQuery(term));

        return Ember.$.ajax({
            url: this.typeaheadQueryUrl(),
            crossDomain: true,
            type: 'POST',
            contentType: 'application/json',
            data: data
        }).then((json) =>
            resolve(this.handleTypeaheadResponse(json)),
            reject
        );
    },

    actions: {
        changeFilter(selected) {
            let { filter: filter, value: value } = this.buildQueryObjectMatch(selected);
            this.set('previousState', this.get('state'));
            this.sendAction('onChange', this.get('key'), filter, value);
        },

        elasticSearch(term) {
            return new Ember.RSVP.Promise((resolve, reject) => {
                Ember.run.debounce(this, this._performSearch, term, resolve, reject, 250);
            });
        }
    }
});
