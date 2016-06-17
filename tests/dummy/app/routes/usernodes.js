import Ember from 'ember';

import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

import FetchAllRouteMixin from 'ember-osf/mixins/fetch-all-route';

export default Ember.Route.extend(AuthenticatedRouteMixin, FetchAllRouteMixin, {

    relationshipToFetch: 'nodes',
    
    model() {
        // users/me
        return this.modelFor('application');
    }
});
