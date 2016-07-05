import Ember from 'ember';
import InfinityRoute from 'ember-infinity/mixins/route';

const assign = Ember.assign || Ember.merge;

/**
 * A custom overlay on ember-infinity that supports loading infinite and paginated relationships
 * For the most part, the API and semantics are identical to ember infinity, except that the means of configuring the store find method is more flexible
 *  (supporting relationship queries that do not operate via store methods)

 @class InfinityCustomMixin
 @namespace EmberOSF
 @module ember-osf/mixins/infinity-custom
 @extends Ember.Mixin, InfinityRoute
 */
export default Ember.Mixin.create(InfinityRoute, {
    /**
     * Repurpose an ember-infinity hook to override the method used for queries
     * @type {function}
     * @default this.store.query
     */
    _storeFindMethod: null,

    /**
     Use the infinityModel method in the place of `this.store.find('model')` to
     initialize the Infinity Model for your route.

     @method infinityModel
     @param {String} modelName The name of the model.
     @param {Object} options Optional, the perPage and startingPage to load from.
     @param {Object} boundParams Optional, any route properties to be included as additional params.
     @return {Ember.RSVP.Promise}
     */
    infinityModel(modelName, options, boundParams) {
        this.set('_infinityModelName', modelName);

        options = options ? assign({}, options) : {};
        const startingPage = options.startingPage === undefined ? 0 : options.startingPage - 1;

        const perPage = options.perPage || this.get('_perPage');
        const modelPath = options.modelPath || this.get('_modelPath');

        let store = this.get('store');
        // Make storeFindMethod configurable, and default to store.query (with appropriate value of `this`)
        const _storeFindMethod = options._storeFindMethod ? options._storeFindMethod : store.get('query').bind(store);

        delete options.startingPage;
        delete options.perPage;
        delete options.modelPath;
        delete options._storeFindMethod;

        this.setProperties({
            currentPage: startingPage,
            _firstPageLoaded: false,
            _perPage: perPage,
            _modelPath: modelPath,
            _storeFindMethod: _storeFindMethod,
            _extraParams: options
        });

        if (typeof boundParams === 'object') {
            this.set('_boundParams', boundParams);
        }

        return this._loadNextPage();
    },

    /**
     request the next page from the adapter

     @private
     @method _requestNextPage
     @return {Ember.RSVP.Promise} A Promise that resolves the next page of objects
     */
    _requestNextPage() {
        const modelName = this.get('_infinityModelName');
        const nextPage = this.incrementProperty('currentPage');
        const params = this._buildParams(nextPage);

        return this._storeFindMethod(modelName, params).then(
            this._afterInfinityModel(this));
    }
});
