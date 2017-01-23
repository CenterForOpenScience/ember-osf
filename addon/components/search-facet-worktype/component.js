import Ember from 'ember';
import layout from './template';
import { termsFilter, getUniqueList } from '../../utils/elastic-query';

// Copied from Ember-SHARE.  Type facet.
export default Ember.Component.extend({
    layout,
    init() {
        this._super(...arguments);
        this.send('setState', this.get('state'));
    },

    selected: Ember.computed('state', function() {
        return this.get('state') || [];
    }),

    changed: Ember.observer('state', function() {
        let state = Ember.isBlank(this.get('state')) ? [] : this.get('state');
        let previousState = this.get('previousState') || [];

        if (Ember.compare(previousState, state) !== 0) {
            let value = this.get('state') || [];
            this.send('setState', value);
        }
    }),

    buildQueryObjectMatch(selected) {
        let newValue = !selected[0] ? [] : selected;
        let newFilter = termsFilter('type', getUniqueList(newValue));
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
            selected = selected.contains(type) ? [] : [type];
            this.send('setState', selected);
        }
    }
});
