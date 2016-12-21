import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

import PaginatedRouteMixin from  'ember-osf/mixins/paginated-route';

export default Ember.Route.extend(AuthenticatedRouteMixin, PaginatedRouteMixin, {
    store: Ember.inject.service(),
    session: Ember.inject.service(),
    model() {
        let user = this.modelFor('application');
        let routeParams = {page: 1, page_size: 10};
        if (user) {
            return user.query('nodes', routeParams); // Fetch from `/users/me/nodes/`
        } else {
            return this.get('store').findRecord('user', 'me').then(user => user.query('nodes', routeParams));
        }
    }
});
