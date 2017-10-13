import Ember from 'ember';

export default Ember.Route.extend({
    store: Ember.inject.service(),
    session: Ember.inject.service(),
    moment: Ember.inject.service(),
    beforeModal() {
        this.get('moment').setTimeZone('UTC');
    },
    model() {
        if (this.get('session.isAuthenticated')) {
            return this.get('store').findRecord('user', 'me');
        }
        return null;
    }
});
