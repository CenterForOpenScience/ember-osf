import Ember from 'ember';

// import AuthenticatedRouteMixin from 'ember-simple-auth/mi1xins/authenticated-route-mixin';

// import FetchAllRouteMixin from 'ember-osf/mixins/fetch-all-route';

export default Ember.Route.extend({
    model() {
        return this.infinityModel('node', {
            perPage: 20
        });
    }
});
