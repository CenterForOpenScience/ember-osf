import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
    layout,
    actions: {
        // Runs toggleSearch in parent component, osf-navbar
        toggleSearch() {
            this.sendAction('action');
        }
    }
});
