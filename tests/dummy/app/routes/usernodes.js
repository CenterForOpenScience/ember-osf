import Ember from 'ember';

import InfinityRoute from "ember-osf/mixins/infinity-custom";
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, InfinityRoute, {
    perPageParam: 'page[size]',
    pageParam: 'page',
    totalPagesParam: 'meta.total',

    model() {
        // users/me
        return this.modelFor('application');
    },


    /**
     * Set up fetching of data on the controller
     * @param controller
     * @param model
     * @returns {*|Ember.RSVP.Promise}
     */
    setupFetching(controller, model) {
        controller.set('nodes', Ember.A());
        return this.infinityModel('nodes', {
            perPage: 3,
            _storeFindMethod: model.query.bind(model),
            modelPath: 'controller.model.nodes'  // Try pushing results to empty array instead of model itself (because hasmanyquery overwrites models internally on each query)
        });
    },
    
    setupController(controller, model) {
        this.setupFetching(controller, model); 
        return this._super(...arguments);
    },


    actions: {
        getMore() {
            this.send('infinityLoad');
        }
    }
});
