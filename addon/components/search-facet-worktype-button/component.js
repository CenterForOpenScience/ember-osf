import Ember from 'ember';
import layout from './template';

// Copied from Ember-SHARE.  Worktype button.
export default Ember.Component.extend({
    layout,
    tagName: 'button',
    classNames: ['btn', 'btn-default', 'btn-sm'],
    classNameBindings: ['selected:active'],

    selected: Ember.computed('selectedTypes.[]', function() {
        let selectedTypes = this.get('selectedTypes');
        return selectedTypes.contains(this.get('type'));
    }),

    click() {
        this.$().blur();
        this.sendAction('onClick', this.get('type'));
    }
});
