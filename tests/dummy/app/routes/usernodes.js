import Ember from 'ember';

import InfinityRoute from 'ember-osf/mixins/infinity-custom';
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
     *
     * has-many-query reloads the relationship field on each call, wiping out results. An intermediate store is used for the relationship data.
     *
     * @param controller
     * @param model
     * @returns {*|Ember.RSVP.Promise}
     */
    setupFetching(controller, model) {
        controller.set('nodes', Ember.A());
        return this.infinityModel('nodes', {
            perPage: 20,
            _storeFindMethod: model.query.bind(model),
            modelPath: 'controller.nodes'  // Try pushing results to empty array instead of model itself (because hasmanyquery overwrites models internally on each query)
        });
    },

    setupController(controller, model) {
        this.setupFetching(controller, model);
        return this._super(...arguments);
    },

    /**
     * Perform custom transformations needed for hasManyQuery to work with Ember-infinity
     *
     * ember-data-has-many-query returns a DS.ManyArray, but Ember-infinity will not work unless given an ArrayProxy instance (with .content)
     *
     * @method afterInfinityModel
     * @param results
     * @returns {*}
     */
    afterInfinityModel(results) {
        return Ember.ArrayProxy.create({
            content: results.toArray(),
            meta: results.get('meta')
        });
    },

    actions: {
        getMore() {
            this.send('infinityLoad');
        }
    }
});
