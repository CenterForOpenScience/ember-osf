import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        return this.store.peekRecord('draft-registration', params.draft_registration_id);
    },
});
