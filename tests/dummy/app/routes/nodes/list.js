import Ember from 'ember';
import config from 'ember-get-config';
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
    },
    setupController(controller, model) {
        this._super(controller, model);
        return this.get('store').findRecord('waffleFlag', 'pagination_flag').then(paginationFlag => {
            controller.setProperties({
                paginationFlagActive: paginationFlag.get('active')
            });
        }).catch(() => {
            controller.setProperties({
                paginationFlagActive: config['FLAG_DEFAULT']
            });
        });
    },
});
