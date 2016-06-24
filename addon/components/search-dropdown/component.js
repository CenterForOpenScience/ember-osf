import Ember from 'ember';
import layout from './template';
import config from 'ember-get-config';

export default Ember.Component.extend({
    layout,
    host: config.OSF.url,
    actions: {
        // Runs toggleSearch in parent component, osf-navbar
        toggleSearch() {
            this.sendAction('action');
        },
        search() {
            var query = Ember.$(searchPageFullBar)[0].value;
            if (query) {
                window.location.href = this.host + 'search/?q=' + query;
            }
        }
    }
});
