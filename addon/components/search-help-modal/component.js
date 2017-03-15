import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
    layout,
    isOpen: false,
    currentPath: Ember.computed(function() {
        return Ember.getOwner(this).lookup('controller:application').currentPath;
    }),
    actions: {
        close() {
            this.set('isOpen', false);
        },
        toggleHelpModal() {
            this.toggleProperty('isOpen');
        },
    }
});
