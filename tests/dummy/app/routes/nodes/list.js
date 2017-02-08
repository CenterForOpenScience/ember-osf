import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

import PaginatedRouteMixin from  'ember-osf/mixins/paginated-route';

export default Ember.Route.extend(AuthenticatedRouteMixin, PaginatedRouteMixin, {
    store: Ember.inject.service(),
    session: Ember.inject.service(),
    model(routeParams) {
        let user = this.modelFor('application');
        if (user) {
            routeParams['filter[contributors]'] = user.id;
            return this.queryForPage('node', routeParams);
        } else {
            return this.get('store').findRecord('user', 'me').then(user => {
                routeParams['filter[contributors]'] = user.id;
                return this.queryForPage('node', routeParams);
            });
        }
    }
});
