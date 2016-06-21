/**
 * The FetchAllRouteMixin supports loading *all* records from a specified model or relationship.
 * Essentially, it un-paginates an API
 *
 * This may be useful for select applications (such as frontend-powered search boxes), but is strongly discouraged
 * for most applications. Consider using available pagination functionality instead.
 */
import Ember from 'ember';
import InfinityRoute from 'ember-osf/mixins/infinity-custom';

export default Ember.Mixin.create(InfinityRoute, {
    // Ember-infinity configuration (defaults map to OSF APIv2 settings)
    perPageParam: 'page[size]',
    pageParam: 'page',
    totalPagesParam: 'meta.total',  // For OSF APIv2, this calculated field is added by serializer

    /**
     * If a string is provided, will set infinite fetch on the relationship with the specified name,
     * from the model specified in the route's model hook
     *
     * @property relationshipToFetch
     * @type String
     * @default null
     */
    relationshipToFetch: null,

    /**
     * Relationship querying reloads the relationship, so it can not be used as an in-place storage for the de-paginated list of records
     * As an ugly workaround, provide a new storage place that will not reflect mutations or updates to the list
     *
     * @property allRelated
     */
    allRelated: null,


    /**
     * Sets up fetch-all query for a relationship field
     * @param controller
     * @param model
     * @private
     */
    setupRelationshipFetch(controller, model) {
        // TODO: In the future, provide API for additional relationship query options
        let storage = this.get('allRelated') || Ember.A();
        controller.set('allRelated', storage);

        this.infinityModel(this.get('relationshipToFetch'), {
            modelPath: 'controller.allRelated',
            _storeFindMethod: model.query.bind(model)
        }).then((newObjects) => {
            // Relationships use intermediate storage, so we can't assume the first page of query records will be auto-added
            this._doUpdate(newObjects);
            return newObjects;
        });
    },

    setupController(controller, model) {
        // If a relationship is specified, implicitly and automatically set the infinityModel to the related field of the model
        if (this.get('relationshipToFetch')) {
            this.setupRelationshipFetch(controller, model);
        }
        return this._super(...arguments);
    },

    /**
     * Event listener that fetches more results automatically
     * As written, this does not handle fetch errors, and will not retry once an error is encountered
     */
    infinityModelUpdated() {
        this.send('infinityLoad');
    },

    /**
     * Model queries pass unchanged, but relationship queries require custom transformations to work with Ember-infinity
     *
     * ember-data-has-many-query returns a DS.ManyArray, but Ember-infinity will not work unless given an ArrayProxy instance (with .content)
     *
     * @method afterInfinityModel
     * @param infinityModelPromiseResult
     * @returns {*}
     */
    afterInfinityModel(infinityModelPromiseResult) {
        let rel = this.get('relationshipToFetch');
        if (rel) {
            return Ember.ArrayProxy.create({
                content: infinityModelPromiseResult.toArray(),
                meta: infinityModelPromiseResult.get('meta')
            });
        } else {
            return infinityModelPromiseResult;
        }
    },

    // TODO: Add a "forceReload" action that flushes the stored results and refetches (for use with relationships)
    actions: {
        /**
         * Convenience method for clickable buttons, mainly for use with debugging
         */
        getMore() {
            this.send('infinityLoad');
        }
    }
});
